import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  EyeIcon,
  ListBulletIcon,
  PencilIcon,
  PlusIcon,
  Squares2X2Icon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { phasesAPI } from "../services/api";

const PhasesManager = () => {
  const [phases, setPhases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingPhase, setEditingPhase] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // Default to grid view
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "",
    color: "#00ff00",
    order: "",
  });

  useEffect(() => {
    fetchPhases();
  }, []);

  const fetchPhases = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await phasesAPI.getAll();
      setPhases(response.data || []);
    } catch (error) {
      console.error("Error fetching phases:", error);
      setError(error.response?.data?.message || "Failed to load phases");
      setPhases([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const openModal = (phase = null) => {
    setError("");
    setSuccess("");
    if (phase) {
      setEditingPhase(phase);
      setFormData({
        title: phase.title || "",
        description: phase.description || "",
        icon: phase.icon || "",
        color: phase.color || "#00ff00",
        order: phase.order?.toString() || "",
      });
    } else {
      setEditingPhase(null);
      setFormData({
        title: "",
        description: "",
        icon: "",
        color: "#00ff00",
        order: "",
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPhase(null);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const phaseData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        icon: formData.icon.trim(),
        color: formData.color,
        order: formData.order.trim() ? parseInt(formData.order) : null, // Keep as null if empty
      };

      // Validate required fields
      if (
        !phaseData.title ||
        !phaseData.description ||
        !phaseData.icon ||
        phaseData.order === null ||
        isNaN(phaseData.order)
      ) {
        throw new Error("All fields are required");
      }

      // Validate order is positive
      if (phaseData.order < 1) {
        throw new Error("Order must be a positive number");
      }

      // Validate color format
      if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(phaseData.color)) {
        throw new Error("Please enter a valid hex color code");
      }

      if (editingPhase) {
        await phasesAPI.update(editingPhase.id, phaseData);
        setSuccess("Phase updated successfully!");
      } else {
        await phasesAPI.create(phaseData);
        setSuccess("Phase created successfully!");
      }

      await fetchPhases();

      // Auto-close modal after 1.5 seconds on success
      setTimeout(() => {
        closeModal();
      }, 1500);
    } catch (error) {
      console.error("Error saving phase:", error);
      setError(
        error.response?.data?.message || error.message || "Failed to save phase"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (phase) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the phase "${phase.title}"? This action cannot be undone.`
      )
    )
      return;

    try {
      setError("");
      await phasesAPI.delete(phase.id);
      setSuccess("Phase deleted successfully!");
      await fetchPhases();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Error deleting phase:", error);
      setError(error.response?.data?.message || "Failed to delete phase");

      // Clear error message after 5 seconds
      setTimeout(() => setError(""), 5000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-cyber-green">
            [PHASES MANAGEMENT]
          </h1>
          <p className="text-green-400 mt-2">
            Manage learning phases in the cybersecurity platform
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-2 rounded-md transition-colors flex items-center gap-2 ${
                viewMode === "grid"
                  ? "bg-cyan-600 text-white"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              <Squares2X2Icon className="w-4 h-4" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-2 rounded-md transition-colors flex items-center gap-2 ${
                viewMode === "list"
                  ? "bg-cyan-600 text-white"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              <ListBulletIcon className="w-4 h-4" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>
          <button
            onClick={() => openModal()}
            disabled={loading}
            className="btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            <span className="hidden sm:inline">Add New Phase</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-900/20 border border-green-500 text-green-400 px-4 py-3 rounded flex items-center">
          <CheckCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded flex items-center">
          <ExclamationCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="terminal-window">
          <div className="flex items-center justify-center py-12">
            <div className="text-cyber-green text-lg">Loading phases...</div>
          </div>
        </div>
      ) : (
        <>
          {/* Grid View */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              {phases.map((phase) => (
                <div
                  key={phase.id}
                  className="terminal-window bg-gray-800 hover:bg-gray-750 transition-colors"
                >
                  <div className="p-4 lg:p-6">
                    {/* Phase Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-black font-bold"
                        style={{ backgroundColor: phase.color }}
                      >
                        {phase.order}
                      </div>
                      <div className="flex gap-2">
                        <Link
                          to={`/phases/${phase.id}`}
                          className="p-2 text-green-400 hover:text-cyber-green transition-colors"
                          title="View Details"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => openModal(phase)}
                          className="p-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                          title="Edit Phase"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(phase)}
                          className="p-2 text-red-400 hover:text-red-300 transition-colors"
                          title="Delete Phase"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Phase Content */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-cyber-green line-clamp-2">
                        {phase.title}
                      </h3>
                      <p className="text-gray-300 text-sm line-clamp-3">
                        {phase.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Icon: {phase.icon}</span>
                        <span>Order: {phase.order}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* List View */}
          {viewMode === "list" && (
            <div className="terminal-window overflow-hidden">
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left p-4 text-cyber-green font-semibold">
                        Order
                      </th>
                      <th className="text-left p-4 text-cyber-green font-semibold">
                        Phase
                      </th>
                      <th className="text-left p-4 text-cyber-green font-semibold">
                        Description
                      </th>
                      <th className="text-left p-4 text-cyber-green font-semibold">
                        Icon
                      </th>
                      <th className="text-center p-4 text-cyber-green font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {phases.map((phase, index) => (
                      <tr
                        key={phase.id}
                        className={`border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors ${
                          index % 2 === 0 ? "bg-gray-800/50" : ""
                        }`}
                      >
                        <td className="p-4">
                          <div
                            className="w-8 h-8 rounded flex items-center justify-center text-black text-sm font-bold"
                            style={{ backgroundColor: phase.color }}
                          >
                            {phase.order}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-cyber-green">
                            {phase.title}
                          </div>
                        </td>
                        <td className="p-4 max-w-md">
                          <div className="text-gray-300 text-sm line-clamp-2">
                            {phase.description}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-green-400 text-sm">
                            {phase.icon}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex justify-center gap-2">
                            <Link
                              to={`/phases/${phase.id}`}
                              className="p-2 text-green-400 hover:text-cyber-green transition-colors"
                              title="View Details"
                            >
                              <EyeIcon className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => openModal(phase)}
                              className="p-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                              title="Edit Phase"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(phase)}
                              className="p-2 text-red-400 hover:text-red-300 transition-colors"
                              title="Delete Phase"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-4 p-4">
                {phases.map((phase) => (
                  <div
                    key={phase.id}
                    className="bg-gray-700/30 rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className="w-8 h-8 rounded flex items-center justify-center text-black text-sm font-bold"
                        style={{ backgroundColor: phase.color }}
                      >
                        {phase.order}
                      </div>
                      <div className="flex gap-2">
                        <Link
                          to={`/phases/${phase.id}`}
                          className="p-2 text-green-400 hover:text-cyber-green transition-colors"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => openModal(phase)}
                          className="p-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(phase)}
                          className="p-2 text-red-400 hover:text-red-300 transition-colors"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-cyber-green mb-1">
                        {phase.title}
                      </h3>
                      <p className="text-gray-300 text-sm mb-2">
                        {phase.description}
                      </p>
                      <div className="text-xs text-gray-500">
                        Icon: {phase.icon}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {phases.length === 0 && (
            <div className="terminal-window">
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  No phases found. Create your first phase to get started.
                </div>
                <button onClick={() => openModal()} className="btn-primary">
                  Create First Phase
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-cyber-green">
                  {editingPhase ? "Edit Phase" : "Create New Phase"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-green-400 mb-2"
                  >
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Enter phase title"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-green-400 mb-2"
                  >
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Enter phase description"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="icon"
                    className="block text-sm font-medium text-green-400 mb-2"
                  >
                    Icon *
                  </label>
                  <input
                    type="text"
                    id="icon"
                    name="icon"
                    value={formData.icon}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Enter icon name (e.g., Shield)"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="color"
                      className="block text-sm font-medium text-green-400 mb-2"
                    >
                      Color *
                    </label>
                    <input
                      type="color"
                      id="color"
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      className="w-full h-10 bg-gray-700 border border-gray-600 rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="order"
                      className="block text-sm font-medium text-green-400 mb-2"
                    >
                      Order *
                    </label>
                    <input
                      type="number"
                      id="order"
                      name="order"
                      value={formData.order}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="1"
                      required
                    />
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-900/20 border border-red-500 text-red-400 px-3 py-2 rounded text-sm">
                    {error}
                  </div>
                )}

                {/* Success Message */}
                {success && (
                  <div className="bg-green-900/20 border border-green-500 text-green-400 px-3 py-2 rounded text-sm">
                    {success}
                  </div>
                )}

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving
                      ? "Saving..."
                      : editingPhase
                      ? "Update Phase"
                      : "Create Phase"}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
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

export default PhasesManager;
