#!/usr/bin/env node

/**
 * Admin CRUD Test Script
 * Tests the admin panel CRUD operations with ObjectId support
 *
 * Usage: node test-crud.js
 *
 * Requirements:
 * - Server must be running on localhost:5001
 * - Admin user must be registered in the system
 */

import axios from "axios";

const API_BASE_URL = "http://localhost:5001/api";
const TEST_CREDENTIALS = {
  email: "admin@hacktheworld.com",
  password: "admin123",
};

// Test configuration
const config = {
  testPhase: {
    title: "Test Phase - ObjectId",
    description: "A test phase to verify ObjectId CRUD operations",
    icon: "TestTube",
    color: "#FF6B35",
    order: 99,
  },
  testModule: {
    title: "Test Module - ObjectId",
    description: "A test module to verify ObjectId CRUD operations",
    icon: "TestCase",
    difficulty: "Beginner",
    color: "orange",
    order: 99,
    topics: ["testing", "objectid", "crud"],
    isActive: true,
  },
};

let authToken = null;
let testPhaseId = null;
let testModuleId = null;

// Helper function to make authenticated requests
const apiRequest = async (method, endpoint, data = null) => {
  try {
    const headers = {
      "Content-Type": "application/json",
    };

    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }

    const config = {
      method,
      url: `${API_BASE_URL}${endpoint}`,
      headers,
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    throw new Error(
      `API Error (${method} ${endpoint}): ${
        error.response?.data?.message || error.message
      }`
    );
  }
};

// Test functions
const authenticate = async () => {
  console.log("🔐 Testing authentication...");

  try {
    const response = await apiRequest("POST", "/auth/login", {
      login: TEST_CREDENTIALS.email,
      password: TEST_CREDENTIALS.password,
    });

    if (response.success && response.data.token) {
      authToken = response.data.token;
      console.log("✅ Authentication successful");
      return true;
    } else {
      throw new Error("No token received");
    }
  } catch (error) {
    console.log("❌ Authentication failed:", error.message);
    console.log("💡 Make sure to register an admin user first:");
    console.log(`   POST ${API_BASE_URL}/auth/register`);
    console.log(
      '   Body: { "username": "admin", "email": "admin@hacktheworld.com", "password": "Admin123!", "role": "admin" }'
    );
    return false;
  }
};

const testPhasesCRUD = async () => {
  console.log("\n📁 Testing Phases CRUD operations...");

  try {
    // CREATE Phase
    console.log("Creating test phase...");
    const createResponse = await apiRequest(
      "POST",
      "/phases",
      config.testPhase
    );

    if (createResponse.success && createResponse.data.id) {
      testPhaseId = createResponse.data.id;
      console.log(`✅ Phase created with ObjectId: ${testPhaseId}`);
    } else {
      throw new Error("Phase creation failed");
    }

    // READ Phase
    console.log("Reading created phase...");
    const readResponse = await apiRequest("GET", `/phases/${testPhaseId}`);

    if (readResponse.success && readResponse.data.id === testPhaseId) {
      console.log("✅ Phase read successfully");
    } else {
      throw new Error("Phase read failed");
    }

    // UPDATE Phase
    console.log("Updating phase...");
    const updateData = {
      ...config.testPhase,
      title: "Updated Test Phase - ObjectId",
    };
    const updateResponse = await apiRequest(
      "PUT",
      `/phases/${testPhaseId}`,
      updateData
    );

    if (
      updateResponse.success &&
      updateResponse.data.title === updateData.title
    ) {
      console.log("✅ Phase updated successfully");
    } else {
      throw new Error("Phase update failed");
    }

    // LIST Phases
    console.log("Listing all phases...");
    const listResponse = await apiRequest("GET", "/phases");

    if (listResponse.success && Array.isArray(listResponse.data)) {
      const testPhase = listResponse.data.find((p) => p.id === testPhaseId);
      if (testPhase) {
        console.log(
          `✅ Phase found in list (${listResponse.data.length} total phases)`
        );
      } else {
        throw new Error("Test phase not found in list");
      }
    } else {
      throw new Error("Phases list failed");
    }

    console.log("📁 Phases CRUD test completed successfully!");
    return true;
  } catch (error) {
    console.log("❌ Phases CRUD test failed:", error.message);
    return false;
  }
};

const testModulesCRUD = async () => {
  console.log("\n📚 Testing Modules CRUD operations...");

  if (!testPhaseId) {
    console.log("❌ Cannot test modules without a test phase");
    return false;
  }

  try {
    // CREATE Module
    console.log("Creating test module...");
    const moduleData = { ...config.testModule, phaseId: testPhaseId };
    const createResponse = await apiRequest("POST", "/modules", moduleData);

    if (createResponse.success && createResponse.data.id) {
      testModuleId = createResponse.data.id;
      console.log(`✅ Module created with ObjectId: ${testModuleId}`);
    } else {
      throw new Error("Module creation failed");
    }

    // READ Module
    console.log("Reading created module...");
    const readResponse = await apiRequest("GET", `/modules/${testModuleId}`);

    if (readResponse.success && readResponse.data.id === testModuleId) {
      console.log("✅ Module read successfully");
    } else {
      throw new Error("Module read failed");
    }

    // UPDATE Module
    console.log("Updating module...");
    const updateData = {
      ...moduleData,
      title: "Updated Test Module - ObjectId",
    };
    const updateResponse = await apiRequest(
      "PUT",
      `/modules/${testModuleId}`,
      updateData
    );

    if (
      updateResponse.success &&
      updateResponse.data.title === updateData.title
    ) {
      console.log("✅ Module updated successfully");
    } else {
      throw new Error("Module update failed");
    }

    // LIST Modules
    console.log("Listing all modules...");
    const listResponse = await apiRequest("GET", "/modules");

    if (listResponse.success && Array.isArray(listResponse.data)) {
      const testModule = listResponse.data.find((m) => m.id === testModuleId);
      if (testModule) {
        console.log(
          `✅ Module found in list (${listResponse.data.length} total modules)`
        );
      } else {
        throw new Error("Test module not found in list");
      }
    } else {
      throw new Error("Modules list failed");
    }

    console.log("📚 Modules CRUD test completed successfully!");
    return true;
  } catch (error) {
    console.log("❌ Modules CRUD test failed:", error.message);
    return false;
  }
};

const cleanup = async () => {
  console.log("\n🧹 Cleaning up test data...");

  try {
    // Delete test module
    if (testModuleId) {
      await apiRequest("DELETE", `/modules/${testModuleId}`);
      console.log("✅ Test module deleted");
    }

    // Delete test phase
    if (testPhaseId) {
      await apiRequest("DELETE", `/phases/${testPhaseId}`);
      console.log("✅ Test phase deleted");
    }

    console.log("🧹 Cleanup completed successfully!");
  } catch (error) {
    console.log("⚠️  Cleanup warning:", error.message);
  }
};

// Main test runner
const runTests = async () => {
  console.log("🚀 Starting Admin CRUD Tests with ObjectId Support");
  console.log("=" * 60);

  try {
    // Authenticate
    const authSuccess = await authenticate();
    if (!authSuccess) {
      console.log("\n❌ Test suite failed: Authentication required");
      process.exit(1);
    }

    // Test Phases CRUD
    const phasesSuccess = await testPhasesCRUD();

    // Test Modules CRUD
    const modulesSuccess = await testModulesCRUD();

    // Cleanup
    await cleanup();

    // Summary
    console.log("\n📊 Test Results Summary:");
    console.log("=" * 30);
    console.log(`🔐 Authentication: ✅ PASSED`);
    console.log(`📁 Phases CRUD: ${phasesSuccess ? "✅ PASSED" : "❌ FAILED"}`);
    console.log(
      `📚 Modules CRUD: ${modulesSuccess ? "✅ PASSED" : "❌ FAILED"}`
    );

    if (phasesSuccess && modulesSuccess) {
      console.log(
        "\n🎉 All tests passed! Admin CRUD operations working with ObjectIds."
      );
      process.exit(0);
    } else {
      console.log("\n❌ Some tests failed. Check the logs above for details.");
      process.exit(1);
    }
  } catch (error) {
    console.log("\n💥 Test suite crashed:", error.message);
    await cleanup();
    process.exit(1);
  }
};

// Run the tests
if (require.main === module) {
  runTests();
}

module.exports = {
  runTests,
  authenticate,
  testPhasesCRUD,
  testModulesCRUD,
  cleanup,
};
