import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { modulesAPI, phasesAPI } from "../services/api";

const ModulesManager = () => {
  const [modules, setModules] = useState([]);
  const [phases, setPhases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [formData, setFormData] = useState({
    phaseId: "",
    title: "",
    description: "",
    icon: "",
    difficulty: "",
    color: "#00ff00",
    order: "",
    topics: "",
    isActive: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("Fetching modules and phases data...");

      const [modulesRes, phasesRes] = await Promise.allSettled([
        modulesAPI.getAll(),
        phasesAPI.getAll(),
      ]);

      if (modulesRes.status === "fulfilled") {
        console.log("Modules fetched successfully:", modulesRes.value);
        setModules(modulesRes.value.data || []);
      } else {
        console.error("Error fetching modules:", modulesRes.reason);
        console.error(
          "Modules API error details:",
          modulesRes.reason.response?.data
        );
      }

      if (phasesRes.status === "fulfilled") {
        console.log("Phases fetched successfully:", phasesRes.value);
        setPhases(phasesRes.value.data || []);
      } else {
        console.error("Error fetching phases:", phasesRes.reason);
        console.error(
          "Phases API error details:",
          phasesRes.reason.response?.data
        );
      }

      // Set error if both failed
      if (modulesRes.status === "rejected" && phasesRes.status === "rejected") {
        setError(
          "Failed to load data. Please check your connection and authentication."
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      console.error("Error details:", error.response?.data);
      setError(
        "Failed to load data. Please check your connection and authentication."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const openModal = (module = null) => {
    setError("");
    setSuccess("");
    if (module) {
      setEditingModule(module);
      setFormData({
        phaseId: module.phaseId || "",
        title: module.title || "",
        description: module.description || "",
        icon: module.icon || "",
        difficulty: module.difficulty || "",
        color: module.color || "#00ff00",
        order: module.order?.toString() || "",
        topics: Array.isArray(module.topics) ? module.topics.join(", ") : "",
        isActive: module.isActive !== false,
      });
    } else {
      setEditingModule(null);
      setFormData({
        phaseId: "",
        title: "",
        description: "",
        icon: "",
        difficulty: "",
        color: "#00ff00",
        order: "",
        topics: "",
        isActive: true,
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingModule(null);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const moduleData = {
        phaseId: formData.phaseId,
        title: formData.title.trim(),
        description: formData.description.trim(),
        icon: formData.icon.trim(),
        difficulty: formData.difficulty,
        color: formData.color,
        order: parseInt(formData.order),
        topics: formData.topics
          ? formData.topics
              .split(",")
              .map((topic) => topic.trim())
              .filter(Boolean)
          : [],
        isActive: formData.isActive,
      };

      // Validate required fields
      if (!moduleData.phaseId || !moduleData.title || !moduleData.description) {
        throw new Error("Phase, title, and description are required");
      }

      // Validate order is positive
      if (moduleData.order < 1) {
        throw new Error("Order must be a positive number");
      }

      // Validate color format
      if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(moduleData.color)) {
        throw new Error("Please enter a valid hex color code");
      }

      console.log("Submitting module data:", moduleData);

      if (editingModule) {
        console.log("Updating module:", editingModule.id);
        const response = await modulesAPI.update(editingModule.id, moduleData);
        console.log("Update response:", response);
        setSuccess("Module updated successfully!");
      } else {
        console.log("Creating new module");
        const response = await modulesAPI.create(moduleData);
        console.log("Create response:", response);
        setSuccess("Module created successfully!");
      }

      await fetchData();

      // Auto-close modal after 1.5 seconds on success
      setTimeout(() => {
        closeModal();
      }, 1500);
    } catch (error) {
      console.error("Error saving module:", error);
      console.error("Error response:", error.response);
      console.error("Error data:", error.response?.data);

      let errorMessage = "Failed to save module";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (module) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the module "${module.title}"? This action cannot be undone.`
      )
    )
      return;

    try {
      setError("");
      await modulesAPI.delete(module.id);
      setSuccess("Module deleted successfully!");
      await fetchData();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Error deleting module:", error);
      setError(error.response?.data?.message || "Failed to delete module");

      // Clear error message after 5 seconds
      setTimeout(() => setError(""), 5000);
    }
  };

  const difficultyLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-cyber-green">
            [MODULES MANAGEMENT]
          </h1>
          <p className="text-green-400 mt-2">
            Manage learning modules within phases
          </p>
        </div>
        <button
          onClick={() => openModal()}
          disabled={loading}
          className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add New Module
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-900/20 border border-green-500 text-green-400 px-4 py-3 rounded flex items-center">
          <CheckCircleIcon className="w-5 h-5 mr-2" />
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded flex items-center">
          <ExclamationCircleIcon className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {/* Debug Panel - Only show in development */}
      {process.env.NODE_ENV === "development" && (
        <div className="bg-blue-900/20 border border-blue-500 text-blue-400 px-4 py-3 rounded">
          <h3 className="font-semibold mb-2">Debug Information</h3>
          <div className="text-sm space-y-1">
            <p>• Modules loaded: {modules.length}</p>
            <p>• Phases loaded: {phases.length}</p>
            <p>• Loading state: {loading ? "Loading..." : "Complete"}</p>
            <p>
              • Auth token:{" "}
              {localStorage.getItem("adminToken") ? "Present" : "Missing"}
            </p>
            {phases.length > 0 && (
              <p>• Available phases: {phases.map((p) => p.title).join(", ")}</p>
            )}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="text-2xl font-bold text-cyber-green">
            {modules.length}
          </div>
          <div className="text-sm text-green-400">Total Modules</div>
        </div>
        <div className="card p-4">
          <div className="text-2xl font-bold text-cyber-green">
            {modules.filter((m) => m.isActive).length}
          </div>
          <div className="text-sm text-green-400">Active Modules</div>
        </div>
        <div className="card p-4">
          <div className="text-2xl font-bold text-cyber-green">
            {phases.length}
          </div>
          <div className="text-sm text-green-400">Total Phases</div>
        </div>
        <div className="card p-4">
          <div className="text-2xl font-bold text-cyber-green">
            {modules.filter((m) => m.difficulty === "Beginner").length}
          </div>
          <div className="text-sm text-green-400">Beginner Modules</div>
        </div>
      </div>

      {/* Modules List */}
      <div className="card">
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyber-green"></div>
            <div className="text-cyber-green mt-2">Loading modules...</div>
          </div>
        ) : modules.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-green-400 mb-4">No modules found</div>
            <button onClick={() => openModal()} className="btn-secondary">
              Create First Module
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left py-3 px-4 text-cyber-green">
                    Phase
                  </th>
                  <th className="text-left py-3 px-4 text-cyber-green">
                    Order
                  </th>
                  <th className="text-left py-3 px-4 text-cyber-green">
                    Module
                  </th>
                  <th className="text-left py-3 px-4 text-cyber-green">
                    Difficulty
                  </th>
                  <th className="text-left py-3 px-4 text-cyber-green">
                    Topics
                  </th>
                  <th className="text-left py-3 px-4 text-cyber-green">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-cyber-green">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {modules
                  .sort((a, b) => {
                    // Sort by phase first, then by order
                    if (a.phaseId !== b.phaseId) {
                      const phaseOrder = {
                        beginner: 1,
                        intermediate: 2,
                        advanced: 3,
                      };
                      return (
                        (phaseOrder[a.phaseId] || 999) -
                        (phaseOrder[b.phaseId] || 999)
                      );
                    }
                    return (a.order || 0) - (b.order || 0);
                  })
                  .map((module) => (
                    <tr
                      key={module.id}
                      className="border-b border-gray-700 hover:bg-gray-700/20 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            module?.phase?.title?.includes("Beginner")
                              ? "bg-green-500/20 text-green-400"
                              : module?.phase?.title?.includes("Intermediate")
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {module?.phase?.title}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-green-400 font-bold">
                        {module.order}
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="text-green-400 font-semibold">
                            {module.title}
                          </div>
                          <div className="text-gray-400 text-sm font-mono">
                            {module.id}
                          </div>
                          <div className="text-gray-400 text-sm truncate max-w-xs">
                            {module.description}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            module.difficulty === "Beginner"
                              ? "bg-green-500/20 text-green-400"
                              : module.difficulty === "Intermediate"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : module.difficulty === "Advanced"
                              ? "bg-red-500/20 text-red-400"
                              : "bg-purple-500/20 text-purple-400"
                          }`}
                        >
                          {module.difficulty}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-300 text-sm">
                        {Array.isArray(module.topics) &&
                        module.topics.length > 0
                          ? module.topics.slice(0, 2).join(", ") +
                            (module.topics.length > 2 ? "..." : "")
                          : "No topics"}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            module.isActive
                              ? "bg-green-500/20 text-green-400"
                              : "bg-gray-500/20 text-gray-400"
                          }`}
                        >
                          {module.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openModal(module)}
                            className="text-blue-400 hover:text-blue-300 transition-colors p-1 rounded hover:bg-blue-400/10"
                            title="Edit Module"
                          >
                            <PencilIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(module)}
                            className="text-red-400 hover:text-red-300 transition-colors p-1 rounded hover:bg-red-400/10"
                            title="Delete Module"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl border border-gray-600 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-cyber-green">
                {editingModule ? "Edit Module" : "Add New Module"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Success Message in Modal */}
            {success && (
              <div className="bg-green-900/20 border border-green-500 text-green-400 px-3 py-2 rounded mb-4 text-sm flex items-center">
                <CheckCircleIcon className="w-4 h-4 mr-2" />
                {success}
              </div>
            )}

            {/* Error Message in Modal */}
            {error && (
              <div className="bg-red-900/20 border border-red-500 text-red-400 px-3 py-2 rounded mb-4 text-sm flex items-center">
                <ExclamationCircleIcon className="w-4 h-4 mr-2" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {editingModule && (
                <div>
                  <label className="block text-sm font-medium text-green-400 mb-2">
                    Module ID (Read-only)
                  </label>
                  <input
                    type="text"
                    value={editingModule.id}
                    disabled
                    className="input-field w-full bg-gray-700 text-gray-400 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Module ID cannot be changed after creation
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-green-400 mb-2">
                    Phase *
                  </label>
                  <select
                    name="phaseId"
                    required
                    className="input-field w-full"
                    value={formData.phaseId}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Phase</option>
                    {phases
                      .sort((a, b) => (a.order || 0) - (b.order || 0))
                      .map((phase) => (
                        <option key={phase.id} value={phase.id}>
                          {phase.title}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-green-400 mb-2">
                    Order *
                  </label>
                  <input
                    type="number"
                    name="order"
                    required
                    min="1"
                    max="100"
                    className="input-field w-full"
                    value={formData.order}
                    onChange={handleInputChange}
                    placeholder="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-green-400 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  className="input-field w-full"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Network Security Fundamentals"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-green-400 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  required
                  className="input-field w-full"
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Description of the module"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-green-400 mb-2">
                    Icon *
                  </label>
                  <input
                    type="text"
                    name="icon"
                    required
                    className="input-field w-full"
                    value={formData.icon}
                    onChange={handleInputChange}
                    placeholder="e.g., Shield, Lock, Network"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-green-400 mb-2">
                    Difficulty *
                  </label>
                  <select
                    name="difficulty"
                    required
                    className="input-field w-full"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Difficulty</option>
                    {difficultyLevels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-green-400 mb-2">
                  Color (Hex) *
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    name="color"
                    className="w-12 h-10 border border-gray-600 rounded cursor-pointer"
                    value={formData.color}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="color"
                    required
                    className="input-field flex-1"
                    value={formData.color}
                    onChange={handleInputChange}
                    placeholder="#00ff00"
                    pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                    title="Enter a valid hex color code"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-green-400 mb-2">
                  Topics (comma-separated)
                </label>
                <textarea
                  name="topics"
                  className="input-field w-full"
                  rows="2"
                  value={formData.topics}
                  onChange={handleInputChange}
                  placeholder="e.g., Network Security, Firewalls, Intrusion Detection"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  className="mr-2"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                />
                <label htmlFor="isActive" className="text-sm text-green-400">
                  Module is active
                </label>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {editingModule ? "Updating..." : "Creating..."}
                    </>
                  ) : editingModule ? (
                    "Update Module"
                  ) : (
                    "Create Module"
                  )}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="btn-secondary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModulesManager;
