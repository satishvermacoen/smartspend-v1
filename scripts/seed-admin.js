// eslint-disable-next-line @typescript-eslint/no-require-imports
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import mongoose from 'mongoose';
const { Schema, models, model, connect, disconnect } = mongoose;
import bcrypt from 'bcryptjs';
import dns from 'dns';

const DB_NAME = "SPENTS-SMART";

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.warn('Failed to set DNS servers:', e);
}

// Parse .env manually to load MONGODB_URI
try {
  let envPath = '';
  try {
    envPath = join(__dirname, '../.env');
  } catch (e) {
    // __dirname is not defined in ESM
    envPath = join(process.cwd(), '.env');
    if (!existsSync(envPath)) {
      envPath = join(process.cwd(), '../.env');
    }
  }
  if (existsSync(envPath)) {
    const envFile = readFileSync(envPath, 'utf8');
    envFile.split(/\r?\n/).forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        // Remove quotes if present
        if (value.length > 0 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
          value = value.substring(1, value.length - 1);
        }
        process.env[key] = value;
      }
    });
  }
} catch (err) {
  console.error('Error reading .env file:', err);
}

let MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI is not defined in your .env file');
  process.exit(1);
}

// Define minimal user schema matching the main app
const userSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, default: 'customer' },
  status: { type: String, default: 'active' },
  emailVerified: { type: Boolean, default: false },
  firstName: { type: String },
  lastName: { type: String }
});

// Match the pre-save hook from SpentSmart user model
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = models.User || model('User', userSchema);

async function connectToMongo(uri) {
  console.log(`Connecting to ${uri.startsWith('mongodb+srv') ? 'MongoDB SRV' : 'MongoDB Direct'}...`);
  await connect(uri, { dbName: DB_NAME });
}

async function seedAdmin() {
  try {
    try {
      await connectToMongo(MONGODB_URI);
    } catch (srvError) {
      console.warn('SRV Connection failed. Attempting direct connection fallback...');
      // Direct connection using resolved shard hosts
      const directUri = 'mongodb://admindiv:Q75U4zxi7JrfdX3qd@ac-sdamvyo-shard-00-00.evxlt8n.mongodb.net:27017,ac-sdamvyo-shard-00-01.evxlt8n.mongodb.net:27017,ac-sdamvyo-shard-00-02.evxlt8n.mongodb.net:27017/?ssl=true&replicaSet=atlas-m0lyb1-shard-0&authSource=admin';
      await connectToMongo(directUri);
    }
    console.log('Connected successfully.');

    const adminEmail = 'guptadivz4321@gmail.com';
    const adminPassword = 'Divz@7890';

    // Check if user already exists
    let user = await User.findOne({ email: adminEmail });

    if (user) {
      console.log(`User ${adminEmail} already exists. Updating role to admin and resetting password...`);
      user.password = adminPassword; // pre-save hook will hash this
      user.role = 'admin';
      user.emailVerified = true;
      user.status = 'active';
      await user.save();
      console.log('Admin user updated successfully.');
    } else {
      console.log(`Creating new Admin user: ${adminEmail}...`);
      user = new User({
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        status: 'active',
        emailVerified: true,
        firstName: 'Admin',
        lastName: 'User'
      });
      await user.save();
      console.log('Admin user created successfully.');
    }
  } catch (error) {
    console.error('Error seeding admin user:', error);
  } finally {
    await disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

seedAdmin();
