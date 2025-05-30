const mongoose = require("mongoose");

/**
 * Database configuration and connection management
 */
class Database {
  constructor() {
    this.isConnected = false;
  }

  /**
   * Connect to MongoDB using Mongoose
   * @param {string} uri - MongoDB connection URI
   * @returns {Promise<void>}
   */
  async connect(uri = process.env.MONGODB_URI) {
    if (this.isConnected) {
      console.log("📦 Database already connected");
      return;
    }

    try {
      const options = {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4, // Use IPv4, skip trying IPv6
      };

      await mongoose.connect(uri, options);
      this.isConnected = true;

      console.log(`✅ MongoDB connected: ${mongoose.connection.host}`);

      // Event listeners
      mongoose.connection.on("error", (err) => {
        console.error("❌ MongoDB connection error:", err);
      });

      mongoose.connection.on("disconnected", () => {
        console.log("📦 MongoDB disconnected");
        this.isConnected = false;
      });

      // Graceful shutdown
      process.on("SIGINT", async () => {
        await this.disconnect();
        process.exit(0);
      });
    } catch (error) {
      console.error("❌ MongoDB connection failed:", error.message);
      process.exit(1);
    }
  }

  /**
   * Disconnect from MongoDB
   * @returns {Promise<void>}
   */
  async disconnect() {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.connection.close();
      this.isConnected = false;
      console.log("📦 MongoDB connection closed");
    } catch (error) {
      console.error("❌ Error closing MongoDB connection:", error.message);
    }
  }

  /**
   * Get connection status
   * @returns {boolean}
   */
  getConnectionStatus() {
    return this.isConnected && mongoose.connection.readyState === 1;
  }

  /**
   * Get database name
   * @returns {string}
   */
  getDatabaseName() {
    return mongoose.connection.name;
  }
}

module.exports = new Database();
