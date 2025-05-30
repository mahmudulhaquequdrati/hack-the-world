const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

let mongoServer;

// Setup before all tests
beforeAll(async () => {
  // Close any existing connections
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  // Start in-memory MongoDB instance
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  // Connect to the in-memory database with test options
  await mongoose.connect(mongoUri, {
    maxPoolSize: 5,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });

  console.log("🧪 Test database connected");
});

// Cleanup after all tests
afterAll(async () => {
  // Disconnect from database
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  // Stop the in-memory MongoDB instance
  if (mongoServer) {
    await mongoServer.stop();
  }

  console.log("🧪 Test database disconnected");
});

// Clean up before each test
beforeEach(async () => {
  // Clear all collections
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

// Global test timeout
jest.setTimeout(30000);

// Mock environment variables for testing
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret-key-for-authentication-testing";
process.env.JWT_EXPIRES_IN = "7d";
process.env.PORT = "5002";
process.env.CLIENT_URL = "http://localhost:5173";
process.env.BCRYPT_ROUNDS = "10";
