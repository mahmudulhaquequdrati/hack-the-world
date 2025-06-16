import mongoose from 'mongoose';

interface ConnectionObject {
  isConnected?: number;
}

const connection: ConnectionObject = {};

async function connectDB(): Promise<void> {
  // If already connected, return
  if (connection.isConnected) {
    console.log('Already connected to MongoDB');
    return;
  }

  try {
    // Check if MongoDB URI is provided
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }

    // Connect to MongoDB
    const db = await mongoose.connect(mongoUri, {
      // Modern connection options (Mongoose 6+)
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });

    connection.isConnected = db.connections[0].readyState;

    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    
    // In development, continue without throwing
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ Running in development mode without MongoDB connection');
      return;
    }
    
    // In production, throw the error
    throw error;
  }
}

// Helper to ensure connection before operations
export async function ensureDBConnection(): Promise<void> {
  if (mongoose.connection.readyState === 1) {
    return; // Already connected
  }
  
  if (mongoose.connection.readyState === 2) {
    // Currently connecting, wait for it
    await new Promise((resolve) => {
      mongoose.connection.once('connected', resolve);
    });
    return;
  }
  
  // Not connected, establish connection
  await connectDB();
}

// Get connection status
export function getConnectionStatus(): boolean {
  return mongoose.connection.readyState === 1;
}

// Graceful disconnect
export async function disconnectDB(): Promise<void> {
  if (connection.isConnected) {
    await mongoose.disconnect();
    connection.isConnected = 0;
    console.log('📴 MongoDB disconnected');
  }
}

export default connectDB;