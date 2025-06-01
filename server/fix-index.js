require("dotenv").config();
const mongoose = require("mongoose");

async function fixIndex() {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to database");

    const db = mongoose.connection.db;

    // Drop phaseId index from phases collection
    try {
      console.log("Dropping phaseId_1 index from phases...");
      await db.collection("phases").dropIndex("phaseId_1");
      console.log("Phases index dropped successfully");
    } catch (error) {
      if (error.code === 27) {
        console.log("Phases index doesn't exist, that's fine");
      } else {
        console.error("Error dropping phases index:", error.message);
      }
    }

    // Drop moduleId index from modules collection
    try {
      console.log("Dropping moduleId_1 index from modules...");
      await db.collection("modules").dropIndex("moduleId_1");
      console.log("Modules index dropped successfully");
    } catch (error) {
      if (error.code === 27) {
        console.log("Modules index doesn't exist, that's fine");
      } else {
        console.error("Error dropping modules index:", error.message);
      }
    }

    console.log("Listing current phases indexes:");
    const phasesIndexes = await db.collection("phases").indexes();
    console.log(phasesIndexes);

    console.log("Listing current modules indexes:");
    const modulesIndexes = await db.collection("modules").indexes();
    console.log(modulesIndexes);
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from database");
    process.exit(0);
  }
}

fixIndex();
