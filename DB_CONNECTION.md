# MongoDB Connection Standard

This document details the standard MongoDB database connection pattern used in our Next.js applications. It ensures stable, high-performance database interactions while preventing common serverless and local development issues.

---

## 1. The Connection Utility (`src/lib/mongodb.ts`)

In Next.js development (or serverless environments), hot-reloads recreate modules constantly. To avoid exhausting MongoDB connections, we **cache the mongoose connection globally**.

Furthermore, to prevent connection timeouts/hangs on certain local network ISPs (like Jio or strict corporate networks) when using MongoDB Atlas SRV URLs (`mongodb+srv://`), we override Node's default DNS servers to use Google/Cloudflare resolvers before initializing.

```typescript
import mongoose from 'mongoose'
import dns from 'dns'
import { DB_NAME } from './contant'

// 1. Fallback to public DNS servers to resolve MongoDB SRV records
// This prevents 'querySrv ECONNREFUSED' errors on local development networks.
try {
  dns.setServers(['8.8.8.8', '1.1.1.1'])
} catch (e) {
  console.warn('⚠️ Failed to set custom DNS servers for MongoDB connection:', e)
}

const MONGODB_URI = process.env.MONGODB_URI

// 2. Extend global namespace to cache the connection in development
declare global {
  var mongooseCache: {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
  }
}

// 3. Initialize global cache
global.mongooseCache = global.mongooseCache || { conn: null, promise: null }

async function connectToDatabase() {
  if (!MONGODB_URI) {
    console.warn('⚠️ Please define the MONGODB_URI environment variable inside .env.local')
    return null
  }

  // 4. Return cached connection if available
  if (global.mongooseCache.conn) {
    return global.mongooseCache.conn
  }

  if (!global.mongooseCache.promise) {
    const opts = {
      bufferCommands: false,
      dbName: DB_NAME,
    }

    // 5. Disable command buffering globally so queries fail fast when DB is down instead of hanging
    mongoose.set('bufferCommands', false)

    // 6. Register connection event listeners once (prevents unhandled 'error' Node crashes)
    if (mongoose.connection.listenerCount('error') === 0) {
      mongoose.connection.on('error', (err) => {
        console.error('❌ Mongoose connection error after initial connect:', err)
      })
    }
    if (mongoose.connection.listenerCount('disconnected') === 0) {
      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️ Mongoose connection disconnected')
      })
    }

    // 7. Establish the connection promise
    global.mongooseCache.promise = mongoose
      .connect(MONGODB_URI as string, opts)
      .then((mongoose) => {
        console.log('✅ MongoDB connected successfully')
        return mongoose
      })
      .catch((error) => {
        console.error('❌ MongoDB connection failed:', error)
        global.mongooseCache.promise = null
        throw error
      })
  }

  try {
    global.mongooseCache.conn = await global.mongooseCache.promise
  } catch (e) {
    global.mongooseCache.promise = null
    throw e
  }

  return global.mongooseCache.conn
}

export default connectToDatabase
```

---

## 2. Best Practices for Models

When defining Mongoose models in Next.js, schemas might change during hot reloading in local development. If a schema changes, Mongoose's cache might hold the old version. 

To ensure schema changes are picked up instantly during development, we check `process.env.NODE_ENV` and delete the model cache:

```typescript
import mongoose, { Schema, Document } from "mongoose"

export interface IUser extends Document {
  email: string
  name?: string
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String },
  },
  { timestamps: true }
)

// Force delete the model from cache in development to pick up schema updates
if (process.env.NODE_ENV === "development") {
  delete mongoose.models.User
}

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
```

---

## 3. How to Connect in APIs & Actions

Always import the default export and await it before executing any queries:

```typescript
import connectDB from '@/lib/mongodb'
import User from '@/features/shared/model/user'

export async function POST(req: Request) {
  try {
    // 1. Establish the DB connection
    await connectDB()

    // 2. Perform DB operations
    const users = await User.find({})
    return Response.json(users)
  } catch (error) {
    console.error('API Error:', error)
    return Response.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
```
