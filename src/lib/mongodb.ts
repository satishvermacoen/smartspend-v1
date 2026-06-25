import mongoose from 'mongoose'
import dns from 'dns'
import { DB_NAME } from './contant'

// Fallback to public DNS servers to resolve MongoDB SRV records when the local DNS fails/refuses SRV queries
// Only apply this in development, as Vercel/Serverless environments may block external DNS (port 53), causing the connection to hang
if (process.env.NODE_ENV !== 'production') {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1'])
  } catch (e) {
    console.warn('⚠️ Failed to set custom DNS servers for MongoDB connection:', e)
  }
}

const MONGODB_URI = process.env.MONGODB_URI

// Extend global namespace for cached connection
declare global {
  var mongooseCache: {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
  }
}

// Initialize global cache
global.mongooseCache = global.mongooseCache || { conn: null, promise: null }

async function connectToDatabase() {
  if (!MONGODB_URI) {
    console.warn('⚠️ Please define the MONGODB_URI environment variable inside .env.local')
    return null
  }

  if (global.mongooseCache.conn) {
    return global.mongooseCache.conn
  }

  if (!global.mongooseCache.promise) {
    const opts = {
      bufferCommands: false,
      dbName: DB_NAME,
    }

    // Disable command buffering globally so queries fail fast rather than hanging when DB is down
    mongoose.set('bufferCommands', false)

    // Register connection error event listeners once to prevent Node from crashing on unhandled 'error' events
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

export default connectToDatabase;
