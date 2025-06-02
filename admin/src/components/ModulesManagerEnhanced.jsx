import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  EyeIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { modulesAPI, phasesAPI } from "../services/api";

const ModulesManagerEnhanced = () => {
  const [modules, setModules] = useState([]);
  const [phases, setPhases] = useState([]);
  const [modulesWithPhases, setModulesWithPhases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [viewMode, setViewMode] = useState("list"); // list, grouped (removed stats)
  const [selectedPhase, setSelectedPhase] = useState("");
  const [formData, setFormData] = useState({
    phaseId: "",
    title: "",
    description: "",
    icon: "",
    difficulty: "",
    color: "#00ff00",
    order: "",
    topics: "",
    prerequisites: "",
    learningOutcomes: "",
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

      const [modulesRes, phasesRes, modulesWithPhasesRes] =
        await Promise.allSettled([
          modulesAPI.getAll(),
          phasesAPI.getAll(),
          modulesAPI.getWithPhases(),
        ]);

      if (modulesRes.status === "fulfilled") {
        console.log("Modules fetched successfully:", modulesRes.value);
        setModules(modulesRes.value.data || []);
      } else {
        console.error("Error fetching modules:", modulesRes.reason);
      }

      if (phasesRes.status === "fulfilled") {
        console.log("Phases fetched successfully:", phasesRes.value);
        setPhases(phasesRes.value.data || []);
      } else {
        console.error("Error fetching phases:", phasesRes.reason);
      }

      if (modulesWithPhasesRes.status === "fulfilled") {
        console.log(
          "Modules with phases fetched successfully:",
          modulesWithPhasesRes.value
        );
        setModulesWithPhases(modulesWithPhasesRes.value.data || []);
      } else {
        console.error(
          "Error fetching modules with phases:",
          modulesWithPhasesRes.reason
        );
      }

      // Set error if all failed
      if (modulesRes.status === "rejected" && phasesRes.status === "rejected") {
        setError(
          "Failed to load data. Please check your connection and authentication."
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
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

      // Normalize color value from database
      let colorValue = module.color || "#00ff00";
      if (typeof colorValue === "string") {
        colorValue = colorValue.trim();
        if (!colorValue.startsWith("#")) {
          colorValue = "#" + colorValue;
        }
        // If invalid format, use default
        if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(colorValue)) {
          colorValue = "#00ff00";
        }
      }

      setFormData({
        phaseId: module.phaseId || "",
        title: module.title || "",
        description: module.description || "",
        icon: module.icon || "",
        difficulty: module.difficulty || "",
        color: colorValue,
        order: module.order?.toString() || "",
        topics: Array.isArray(module.topics) ? module.topics.join(", ") : "",
        prerequisites: Array.isArray(module.prerequisites)
          ? module.prerequisites.join(", ")
          : "",
        learningOutcomes: Array.isArray(module.learningOutcomes)
          ? module.learningOutcomes.join(", ")
          : "",
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
        prerequisites: "",
        learningOutcomes: "",
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

  const handleReorder = async (phaseId, moduleId, direction) => {
    try {
      setSaving(true);

      // Get modules for this phase
      const phaseModules = modules.filter((m) => m.phaseId === phaseId);
      const sortedModules = phaseModules.sort((a, b) => a.order - b.order);

      // Find current module index
      const currentIndex = sortedModules.findIndex((m) => m._id === moduleId);
      if (currentIndex === -1) return;

      // Calculate new position
      const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
      if (newIndex < 0 || newIndex >= sortedModules.length) return;

      // Create new order array
      const moduleOrders = sortedModules.map((module, index) => {
        let newOrder = index + 1;

        if (index === currentIndex) {
          newOrder = newIndex + 1;
        } else if (index === newIndex) {
          newOrder = currentIndex + 1;
        }

        return {
          moduleId: module._id,
          order: newOrder,
        };
      });

      await modulesAPI.reorder(phaseId, moduleOrders);
      setSuccess("Module order updated successfully!");
      fetchData();
    } catch (error) {
      console.error("Error reordering modules:", error);
      setError(error.response?.data?.message || "Failed to reorder modules");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      // Normalize and validate color value
      let colorValue = formData.color?.trim() || "#00ff00";

      // Ensure color starts with # and has valid format
      if (!colorValue.startsWith("#")) {
        colorValue = "#" + colorValue;
      }

      // If it's not a valid hex color, use default
      if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(colorValue)) {
        console.warn(
          "Invalid color format detected, using default:",
          colorValue
        );
        colorValue = "#00ff00";
      }

      // Handle prerequisites - convert to ObjectIds or leave empty
      let prerequisitesArray = [];
      if (formData.prerequisites && formData.prerequisites.trim()) {
        const prereqStrings = formData.prerequisites
          .split(",")
          .map((prereq) => prereq.trim())
          .filter(Boolean);

        // For now, skip prerequisites validation and send empty array
        // TODO: Implement proper module selection UI for prerequisites
        console.warn(
          "Prerequisites entered but will be ignored:",
          prereqStrings
        );
        console.log(
          "Note: Prerequisites must be valid MongoDB ObjectIds of existing modules"
        );
        prerequisitesArray = [];
      }

      const moduleData = {
        phaseId: formData.phaseId,
        title: formData.title.trim(),
        description: formData.description.trim(),
        icon: formData.icon.trim() || "Shield",
        difficulty: formData.difficulty,
        color: colorValue,
        order: parseInt(formData.order),
        topics: formData.topics
          ? formData.topics
              .split(",")
              .map((topic) => topic.trim())
              .filter(Boolean)
          : [],
        prerequisites: prerequisitesArray, // Send empty array for now
        learningOutcomes: formData.learningOutcomes
          ? formData.learningOutcomes
              .split(",")
              .map((outcome) => outcome.trim())
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

      console.log("Submitting module data:", moduleData);

      if (editingModule) {
        console.log("Updating module:", editingModule.id || editingModule._id);
        const response = await modulesAPI.update(
          editingModule.id || editingModule._id,
          moduleData
        );
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

      let errorMessage = "Failed to save module";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
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
    ) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      console.log("Deleting module:", module.id);
      const response = await modulesAPI.delete(module.id);
      console.log("Delete response:", response);

      setSuccess("Module deleted successfully!");
      await fetchData();
    } catch (error) {
      console.error("Error deleting module:", error);

      let errorMessage = "Failed to delete module";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const renderModuleStats = (module) => {
    const content = module.content || {};
    const contentStats = module.contentStats || {};

    return (
      <div className="text-xs text-gray-400 mt-1">
        <div>Videos: {content.videos?.length || 0}</div>
        <div>Labs: {content.labs?.length || 0}</div>
        <div>Games: {content.games?.length || 0}</div>
        <div>Total Duration: {contentStats.totalDuration || 0} min</div>
      </div>
    );
  };

  const renderListView = () => {
    const filteredModules = selectedPhase
      ? modules.filter((m) => m.phaseId === selectedPhase)
      : modules;

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 border border-gray-600">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider">
                Phase
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider">
                Difficulty
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider">
                Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider">
                Content Stats
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-green-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-600">
            {filteredModules.map((module) => {
              return (
                <tr
                  key={module._id}
                  className="hover:bg-gray-700/20 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-green-400">
                      {module.title}
                    </div>
                    <div className="text-sm text-gray-400 truncate max-w-xs">
                      {module.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">
                    {` ${module.phase?.title}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        module.difficulty === "Beginner"
                          ? "bg-green-100 text-green-800"
                          : module.difficulty === "Intermediate"
                          ? "bg-yellow-100 text-yellow-800"
                          : module.difficulty === "Advanced"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {module.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">
                    <div className="flex items-center space-x-1">
                      <span>{module.order}</span>
                      <div className="flex flex-col">
                        <button
                          onClick={() =>
                            handleReorder(module.phaseId, module._id, "up")
                          }
                          disabled={saving}
                          className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        >
                          <ArrowUpIcon className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() =>
                            handleReorder(module.phaseId, module._id, "down")
                          }
                          disabled={saving}
                          className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        >
                          <ArrowDownIcon className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">
                    {renderModuleStats(module)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {module.isActive ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-600" />
                    ) : (
                      <ExclamationCircleIcon className="h-5 w-5 text-red-600" />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openModal(module)}
                      className="text-cyber-green hover:text-green-300 mr-4"
                    >
                      <PencilIcon className="h-4 w-4 inline" />
                    </button>
                    <button
                      onClick={() => handleDelete(module)}
                      className="text-red-400 hover:text-red-300"
                      disabled={saving}
                    >
                      <TrashIcon className="h-4 w-4 inline" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const renderGroupedView = () => (
    <div className="space-y-6">
      {modulesWithPhases.map((phase) => (
        <div
          key={phase._id}
          className="bg-gray-800 p-6 rounded-lg shadow border border-gray-600"
        >
          <h3 className="text-lg font-medium text-green-400 mb-4">
            {phase.title} ({phase.modules?.length || 0} modules)
          </h3>
          {phase.modules && phase.modules.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {phase.modules.map((module) => (
                <div
                  key={module._id}
                  className="border border-gray-600 rounded-lg p-4 bg-gray-700"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-green-400">
                      {module.title}
                    </h4>
                    <span className="text-xs text-gray-400">
                      #{module.order}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    {module.description}
                  </p>
                  <div className="mt-2">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        module.difficulty === "Beginner"
                          ? "bg-green-100 text-green-800"
                          : module.difficulty === "Intermediate"
                          ? "bg-yellow-100 text-yellow-800"
                          : module.difficulty === "Advanced"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {module.difficulty}
                    </span>
                  </div>
                  {renderModuleStats(module)}
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex space-x-1">
                      <button
                        onClick={() =>
                          handleReorder(phase._id, module._id, "up")
                        }
                        disabled={saving}
                        className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                      >
                        <ArrowUpIcon className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() =>
                          handleReorder(phase._id, module._id, "down")
                        }
                        disabled={saving}
                        className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                      >
                        <ArrowDownIcon className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => openModal(module)}
                        className="text-xs text-cyber-green hover:text-green-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(module)}
                        className="text-xs text-red-400 hover:text-red-300"
                        disabled={saving}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No modules found in this phase</p>
          )}
        </div>
      ))}
    </div>
  );

  const difficultyLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-cyber-green">
            [ENHANCED MODULES MANAGEMENT]
          </h1>
          <p className="text-green-400 mt-2">
            Advanced module management with phase integration and content
            statistics
          </p>
        </div>
        <button
          onClick={() => openModal()}
          disabled={loading}
          className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Module
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

      {/* Controls */}
      <div className="bg-gray-800 p-6 rounded-lg shadow mb-6 border border-gray-600">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Phase Filter */}
            <div>
              <label className="block text-sm font-medium text-green-400 mb-1">
                Filter by Phase
              </label>
              <select
                value={selectedPhase}
                onChange={(e) => setSelectedPhase(e.target.value)}
                className="px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyber-green bg-gray-700 text-green-400"
              >
                <option value="">All Phases</option>
                {phases.map((phase) => (
                  <option key={phase._id} value={phase._id}>
                    {phase.title}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode */}
            <div>
              <label className="block text-sm font-medium text-green-400 mb-1">
                View Mode
              </label>
              <div className="flex rounded-md shadow-sm">
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-2 text-sm rounded-l-md border ${
                    viewMode === "list"
                      ? "bg-cyber-green text-black border-cyber-green"
                      : "bg-gray-700 text-green-400 border-gray-600"
                  }`}
                >
                  <EyeIcon className="h-4 w-4 inline mr-1" />
                  List
                </button>
                <button
                  onClick={() => setViewMode("grouped")}
                  className={`px-3 py-2 text-sm rounded-r-md border-t border-r border-b ${
                    viewMode === "grouped"
                      ? "bg-cyber-green text-black border-cyber-green"
                      : "bg-gray-700 text-green-400 border-gray-600"
                  }`}
                >
                  <ChartBarIcon className="h-4 w-4 inline mr-1" />
                  Grouped
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded-lg shadow border border-gray-600">
          <div className="text-2xl font-bold text-green-400">
            {modules.length}
          </div>
          <div className="text-sm text-gray-400">Total Modules</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow border border-gray-600">
          <div className="text-2xl font-bold text-cyber-green">
            {modules.filter((m) => m.isActive).length}
          </div>
          <div className="text-sm text-gray-400">Active Modules</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow border border-gray-600">
          <div className="text-2xl font-bold text-blue-400">
            {phases.length}
          </div>
          <div className="text-sm text-gray-400">Total Phases</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow border border-gray-600">
          <div className="text-2xl font-bold text-yellow-400">
            {modules.filter((m) => m.difficulty === "Beginner").length}
          </div>
          <div className="text-sm text-gray-400">Beginner Modules</div>
        </div>
      </div>

      {/* Content Display */}
      <div className="bg-gray-800 rounded-lg shadow border border-gray-600">
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyber-green"></div>
            <p className="mt-2 text-green-400">Loading modules...</p>
          </div>
        ) : modules.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">No modules found</p>
            <button onClick={() => openModal()} className="btn-primary">
              Create First Module
            </button>
          </div>
        ) : viewMode === "list" ? (
          renderListView()
        ) : (
          renderGroupedView()
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-600">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-green-400">
                  {editingModule ? "Edit Module" : "Create Module"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-green-400"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-green-400 mb-1">
                      Phase*
                    </label>
                    <select
                      name="phaseId"
                      value={formData.phaseId}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyber-green bg-gray-700 text-green-400"
                      required
                    >
                      <option value="">Select Phase</option>
                      {phases.map((phase) => (
                        <option key={phase.id} value={phase.id}>
                          {phase.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-green-400 mb-1">
                      Order*
                    </label>
                    <input
                      type="number"
                      name="order"
                      value={formData.order}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyber-green bg-gray-700 text-green-400"
                      required
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-green-400 mb-1">
                    Title*
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyber-green bg-gray-700 text-green-400"
                    required
                    maxLength="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-green-400 mb-1">
                    Description*
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyber-green bg-gray-700 text-green-400"
                    required
                    maxLength="500"
                    rows="3"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-green-400 mb-1">
                      Icon
                    </label>
                    <input
                      type="text"
                      name="icon"
                      value={formData.icon}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyber-green bg-gray-700 text-green-400"
                      placeholder="Shield"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-green-400 mb-1">
                      Difficulty*
                    </label>
                    <select
                      name="difficulty"
                      value={formData.difficulty}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyber-green bg-gray-700 text-green-400"
                      required
                    >
                      <option value="">Select Difficulty</option>
                      {difficultyLevels.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-green-400 mb-1">
                      Color
                    </label>
                    <input
                      type="color"
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      className="w-full h-10 border border-gray-600 rounded-md bg-gray-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-green-400 mb-1">
                    Topics (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="topics"
                    value={formData.topics}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyber-green bg-gray-700 text-green-400"
                    placeholder="Security Basics, Threat Models, Risk Assessment"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-green-400 mb-1">
                    Prerequisites (currently disabled)
                    <span className="text-xs text-gray-400 ml-2">
                      Note: Prerequisites require existing module ObjectIds
                    </span>
                  </label>
                  <input
                    type="text"
                    name="prerequisites"
                    value={formData.prerequisites}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyber-green bg-gray-700 text-green-400 opacity-50"
                    placeholder="Will be ignored for now - TODO: Add module selector"
                    disabled
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Future enhancement: This will be a dropdown to select
                    existing modules
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-green-400 mb-1">
                    Learning Outcomes (comma-separated)
                  </label>
                  <textarea
                    name="learningOutcomes"
                    value={formData.learningOutcomes}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyber-green bg-gray-700 text-green-400"
                    rows="2"
                    placeholder="Understand security principles, Identify common threats"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-cyber-green focus:ring-cyber-green border-gray-600 rounded bg-gray-700"
                  />
                  <label className="ml-2 block text-sm text-green-400">
                    Active
                  </label>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-green-400 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 bg-cyber-green text-black rounded-md hover:bg-green-400 disabled:opacity-50"
                  >
                    {saving ? "Saving..." : editingModule ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModulesManagerEnhanced;
