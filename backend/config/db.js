const mongoose = require('mongoose');

let memoryServer = null;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/greenroute';
    
    // Attempt standard connection with a short timeout first
    try {
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 2000,
      });
      console.log(`[GreenRoute DB] Connected to MongoDB at: ${conn.connection.host}`);
      return conn;
    } catch (primaryErr) {
      if (process.env.USE_MEMORY_DB_IF_LOCAL_FAILS === 'true' || process.env.NODE_ENV === 'test') {
        console.log(`[GreenRoute DB] Local MongoDB unavailable (${primaryErr.message}).`);
        console.log(`[GreenRoute DB] Starting embedded in-memory MongoDB server...`);
        
        const { MongoMemoryServer } = require('mongodb-memory-server');
        memoryServer = await MongoMemoryServer.create();
        const memUri = memoryServer.getUri();
        
        const conn = await mongoose.connect(memUri);
        console.log(`[GreenRoute DB] Successfully connected to In-Memory MongoDB: ${memUri}`);
        return conn;
      }
      throw primaryErr;
    }
  } catch (error) {
    console.error(`[GreenRoute DB Error]: ${error.message}`);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
};

module.exports = { connectDB, disconnectDB };
