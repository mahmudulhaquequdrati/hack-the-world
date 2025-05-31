const Phase = require("../models/Phase");

const defaultPhases = [
  {
    phaseId: "beginner",
    title: "Beginner Phase",
    description:
      "Foundation courses for cybersecurity beginners. Learn the fundamentals of security concepts, basic networking, and introductory ethical hacking techniques.",
    icon: "Lightbulb",
    color: "#10B981",
    order: 1,
  },
  {
    phaseId: "intermediate",
    title: "Intermediate Phase",
    description:
      "Advanced cybersecurity topics including penetration testing, vulnerability assessment, and security architecture. Perfect for those with basic knowledge.",
    icon: "Target",
    color: "#F59E0B",
    order: 2,
  },
  {
    phaseId: "advanced",
    title: "Advanced Phase",
    description:
      "Expert-level cybersecurity training covering advanced persistent threats, malware analysis, forensics, and enterprise security management.",
    icon: "Brain",
    color: "#EF4444",
    order: 3,
  },
];

const seedPhases = async () => {
  try {
    console.log("🌱 Starting phase seeding...");

    // Check if phases already exist
    const existingPhases = await Phase.countDocuments();

    if (existingPhases > 0) {
      console.log(
        `⚠️  Found ${existingPhases} existing phases. Skipping seed.`
      );
      console.log(
        "💡 To reseed, delete existing phases first or use force option."
      );
      return;
    }

    // Create all phases
    const createdPhases = await Phase.insertMany(defaultPhases);

    console.log(`✅ Successfully seeded ${createdPhases.length} phases:`);
    createdPhases.forEach((phase) => {
      console.log(`   - ${phase.title} (${phase.phaseId})`);
    });
  } catch (error) {
    console.error("❌ Error seeding phases:", error.message);

    // Handle duplicate key errors specifically
    if (error.code === 11000) {
      console.log(
        "💡 Some phases may already exist. Check database for duplicates."
      );
    }

    throw error;
  }
};

const reseedPhases = async () => {
  try {
    console.log("🔄 Reseeding phases (clearing existing data)...");

    // Delete all existing phases
    const deleteResult = await Phase.deleteMany({});
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing phases`);

    // Create new phases
    const createdPhases = await Phase.insertMany(defaultPhases);

    console.log(`✅ Successfully reseeded ${createdPhases.length} phases:`);
    createdPhases.forEach((phase) => {
      console.log(`   - ${phase.title} (${phase.phaseId})`);
    });
  } catch (error) {
    console.error("❌ Error reseeding phases:", error.message);
    throw error;
  }
};

const getPhasesSummary = async () => {
  try {
    const phases = await Phase.find({}).sort({ order: 1 });

    if (phases.length === 0) {
      console.log("📭 No phases found in database");
      return;
    }

    console.log(`📊 Found ${phases.length} phases in database:`);
    phases.forEach((phase) => {
      console.log(
        `   ${phase.order}. ${phase.title} (${phase.phaseId}) - ${phase.color}`
      );
    });
  } catch (error) {
    console.error("❌ Error getting phases summary:", error.message);
    throw error;
  }
};

module.exports = {
  seedPhases,
  reseedPhases,
  getPhasesSummary,
  defaultPhases,
};
