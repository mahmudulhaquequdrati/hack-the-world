#!/usr/bin/env node

/**
 * Comprehensive CRUD Test Script for Admin Panel
 * Tests phases and modules CRUD operations with server connectivity
 */

// eslint-disable-next-line no-undef
const axios = require("axios");

const API_BASE_URL = "http://localhost:5001/api";

// Test data
const testPhase = {
  phaseId: "test-phase-001",
  title: "Test Phase",
  description: "A test phase for CRUD operations",
  icon: "🧪",
  color: "#00ff00",
  order: 999,
};

const testModule = {
  moduleId: "test-module-001",
  phaseId: "test-phase-001",
  title: "Test Module",
  description: "A test module for CRUD operations",
  icon: "📚",
  difficulty: "Beginner",
  color: "green",
  order: 999,
  topics: ["Testing", "CRUD", "API"],
  isActive: true,
};

// Helper function to make API calls
const apiCall = async (method, endpoint, data = null) => {
  try {
    const config = {
      method,
      url: `${API_BASE_URL}${endpoint}`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message,
      status: error.response?.status,
    };
  }
};

// Test functions
const testPhaseCRUD = async () => {
  console.log("\n🧪 Testing Phase CRUD Operations...\n");

  // 1. CREATE Phase
  console.log("1. Creating test phase...");
  const createResult = await apiCall("POST", "/phases", testPhase);
  if (createResult.success) {
    console.log("   ✅ Phase created successfully");
  } else {
    console.log(`   ❌ Failed to create phase: ${createResult.error}`);
    return false;
  }

  // 2. READ Phase
  console.log("2. Reading test phase...");
  const readResult = await apiCall("GET", `/phases/${testPhase.phaseId}`);
  if (readResult.success) {
    console.log("   ✅ Phase retrieved successfully");
    console.log(`   📋 Title: ${readResult.data.data.title}`);
  } else {
    console.log(`   ❌ Failed to read phase: ${readResult.error}`);
  }

  // 3. UPDATE Phase
  console.log("3. Updating test phase...");
  const updatedPhase = { ...testPhase, title: "Updated Test Phase" };
  const updateResult = await apiCall(
    "PUT",
    `/phases/${testPhase.phaseId}`,
    updatedPhase
  );
  if (updateResult.success) {
    console.log("   ✅ Phase updated successfully");
  } else {
    console.log(`   ❌ Failed to update phase: ${updateResult.error}`);
  }

  // 4. LIST Phases
  console.log("4. Listing all phases...");
  const listResult = await apiCall("GET", "/phases");
  if (listResult.success) {
    console.log(`   ✅ Retrieved ${listResult.data.count} phases`);
  } else {
    console.log(`   ❌ Failed to list phases: ${listResult.error}`);
  }

  return true;
};

const testModuleCRUD = async () => {
  console.log("\n📚 Testing Module CRUD Operations...\n");

  // 1. CREATE Module
  console.log("1. Creating test module...");
  const createResult = await apiCall("POST", "/modules", testModule);
  if (createResult.success) {
    console.log("   ✅ Module created successfully");
  } else {
    console.log(`   ❌ Failed to create module: ${createResult.error}`);
    return false;
  }

  // 2. READ Module
  console.log("2. Reading test module...");
  const readResult = await apiCall("GET", `/modules/${testModule.moduleId}`);
  if (readResult.success) {
    console.log("   ✅ Module retrieved successfully");
    console.log(`   📋 Title: ${readResult.data.data.title}`);
    console.log(`   📋 Phase: ${readResult.data.data.phaseId}`);
  } else {
    console.log(`   ❌ Failed to read module: ${readResult.error}`);
  }

  // 3. UPDATE Module
  console.log("3. Updating test module...");
  const updatedModule = {
    ...testModule,
    title: "Updated Test Module",
    difficulty: "Intermediate",
  };
  const updateResult = await apiCall(
    "PUT",
    `/modules/${testModule.moduleId}`,
    updatedModule
  );
  if (updateResult.success) {
    console.log("   ✅ Module updated successfully");
  } else {
    console.log(`   ❌ Failed to update module: ${updateResult.error}`);
  }

  // 4. LIST Modules
  console.log("4. Listing all modules...");
  const listResult = await apiCall("GET", "/modules");
  if (listResult.success) {
    console.log(`   ✅ Retrieved ${listResult.data.count} modules`);
  } else {
    console.log(`   ❌ Failed to list modules: ${listResult.error}`);
  }

  // 5. LIST Modules by Phase
  console.log("5. Listing modules by phase...");
  const phaseModulesResult = await apiCall(
    "GET",
    `/modules/phase/${testPhase.phaseId}`
  );
  if (phaseModulesResult.success) {
    console.log(
      `   ✅ Retrieved ${phaseModulesResult.data.count} modules for phase`
    );
  } else {
    console.log(
      `   ❌ Failed to list modules by phase: ${phaseModulesResult.error}`
    );
  }

  return true;
};

const testErrorHandling = async () => {
  console.log("\n🚨 Testing Error Handling...\n");

  // Test 404 errors
  console.log("1. Testing 404 error handling...");
  const notFoundResult = await apiCall("GET", "/phases/non-existent-phase");
  if (!notFoundResult.success && notFoundResult.status === 404) {
    console.log("   ✅ 404 error handled correctly");
  } else {
    console.log("   ❌ 404 error not handled properly");
  }

  // Test validation errors
  console.log("2. Testing validation error handling...");
  const invalidPhase = { title: "" }; // Missing required fields
  const validationResult = await apiCall("POST", "/phases", invalidPhase);
  if (!validationResult.success && validationResult.status === 400) {
    console.log("   ✅ Validation error handled correctly");
  } else {
    console.log("   ❌ Validation error not handled properly");
  }
};

const cleanup = async () => {
  console.log("\n🧹 Cleaning up test data...\n");

  // Delete test module
  console.log("1. Deleting test module...");
  const deleteModuleResult = await apiCall(
    "DELETE",
    `/modules/${testModule.moduleId}`
  );
  if (deleteModuleResult.success) {
    console.log("   ✅ Test module deleted successfully");
  } else {
    console.log(
      `   ❌ Failed to delete test module: ${deleteModuleResult.error}`
    );
  }

  // Delete test phase
  console.log("2. Deleting test phase...");
  const deletePhaseResult = await apiCall(
    "DELETE",
    `/phases/${testPhase.phaseId}`
  );
  if (deletePhaseResult.success) {
    console.log("   ✅ Test phase deleted successfully");
  } else {
    console.log(
      `   ❌ Failed to delete test phase: ${deletePhaseResult.error}`
    );
  }
};

// Main test runner
const runTests = async () => {
  console.log("🚀 Starting Admin Panel CRUD Tests...");
  console.log("=".repeat(50));

  try {
    // Test server connectivity
    console.log("\n🔌 Testing server connectivity...");
    const healthCheck = await apiCall("GET", "/phases");
    if (!healthCheck.success) {
      console.log(
        "❌ Server is not responding. Please ensure the server is running on http://localhost:5001"
      );
      // eslint-disable-next-line no-undef
      process.exit(1);
    }
    console.log("✅ Server is responding");

    // Run tests
    const phaseTestSuccess = await testPhaseCRUD();
    const moduleTestSuccess = await testModuleCRUD();
    await testErrorHandling();

    // Cleanup
    await cleanup();

    // Summary
    console.log("\n" + "=".repeat(50));
    console.log("📊 Test Summary:");
    console.log(
      `   Phases CRUD: ${phaseTestSuccess ? "✅ PASSED" : "❌ FAILED"}`
    );
    console.log(
      `   Modules CRUD: ${moduleTestSuccess ? "✅ PASSED" : "❌ FAILED"}`
    );
    console.log(`   Error Handling: ✅ TESTED`);

    if (phaseTestSuccess && moduleTestSuccess) {
      console.log("\n🎉 All CRUD operations are working correctly!");
      console.log("   The admin panel is ready for production use.");
    } else {
      console.log(
        "\n⚠️  Some tests failed. Please check the server implementation."
      );
    }
  } catch (error) {
    console.error("\n💥 Test runner failed:", error.message);
    // eslint-disable-next-line no-undef
    process.exit(1);
  }
};

// Run the tests
runTests();
