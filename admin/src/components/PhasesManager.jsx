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
import { getIconFromName, getIconOptions } from "../lib/iconUtils";
import { Layers } from "lucide-react";

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
    color: "green",
    order: "",
  });

  // Available icon options from utility
  const iconOptions = getIconOptions();

  // Available Tailwind color options
  const colorOptions = [
    "green",
    "blue",
    "red",
    "yellow",
    "purple",
    "pink",
    "indigo",
    "cyan",
    "orange",
    "gray",
    "black",
    "white",
    "emerald",
    "lime",
    "teal",
    "sky",
    "violet",
    "fuchsia",
    "rose",
    "slate",
    "zinc",
    "neutral",
    "stone",
    "amber",
  ];

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
        color: phase.color || "green",
        order: phase.order?.toString() || "",
      });
    } else {
      setEditingPhase(null);
      setFormData({
        title: "",
        description: "",
        icon: "",
        color: "green",
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
      if (!colorOptions.includes(phaseData.color)) {
        throw new Error("Please enter a valid Tailwind color name");
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
    <div className="min-h-screen bg-black text-green-400">
      <div className="max-w-7xl mx-auto py-10 space-y-6 px-4">
        {/* Terminal Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Layers className="w-6 h-6 text-green-400" />
            <h2 className="text-3xl font-bold text-green-400 font-mono uppercase tracking-wider">
              PHASES_MANAGEMENT
            </h2>
          </div>
          <div className="bg-black/60 border border-green-400/30 rounded-lg p-3 max-w-2xl mx-auto">
            <p className="text-green-400 font-mono text-sm">
              ~/admin/phases$ manage --learning-phases --cybersec-platform
            </p>
          </div>
        </div>

        {/* Action Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Terminal View Mode Toggle */}
            <div className="flex bg-black/60 border border-green-400/30 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2 rounded-md transition-all duration-300 flex items-center gap-2 font-mono text-sm font-bold uppercase tracking-wider ${
                  viewMode === "grid"
                    ? "bg-green-400/20 text-green-400 border border-green-400/50"
                    : "text-green-400/60 hover:text-green-400 hover:bg-green-400/10"
                }`}
              >
                <Squares2X2Icon className="w-4 h-4" />
                <span className="hidden sm:inline">GRID</span>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-2 rounded-md transition-all duration-300 flex items-center gap-2 font-mono text-sm font-bold uppercase tracking-wider ${
                  viewMode === "list"
                    ? "bg-green-400/20 text-green-400 border border-green-400/50"
                    : "text-green-400/60 hover:text-green-400 hover:bg-green-400/10"
                }`}
              >
                <ListBulletIcon className="w-4 h-4" />
                <span className="hidden sm:inline">LIST</span>
              </button>
            </div>
            <button
              onClick={() => openModal()}
              disabled={loading}
              className="bg-green-400/10 border-2 border-green-400/30 hover:bg-green-400/20 hover:border-green-400/50 transition-all duration-300 text-green-400 font-mono font-bold uppercase tracking-wider px-6 py-2 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
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
            {/* Terminal Grid View */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-6">
                {phases.map((phase, index) => (
                  <div
                    key={phase.id}
                    className="relative overflow-hidden rounded-xl border-2 border-green-400/30 bg-gradient-to-br from-gray-900/80 to-black/80 p-6 group hover:border-green-400/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-400/20"
                  >
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/10 to-green-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Status Indicators */}
                    <div className="absolute top-2 left-2 flex space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50"></div>
                    </div>

                    {/* Phase Order Badge */}
                    <div className="absolute top-3 right-3 z-10">
                      <div className="w-8 h-8 rounded-full bg-green-400/20 border-2 border-green-400 text-green-400 shadow-lg shadow-green-400/30 flex items-center justify-center font-mono font-bold text-sm">
                        {phase.order}
                      </div>
                    </div>

                    <div className="relative z-10">
                      {/* Phase Icon */}
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-800/50 to-black/50 border-2 border-green-400/30 shadow-lg shadow-green-400/30 flex items-center justify-center group-hover:animate-pulse">
                          {(() => {
                            console.log(phase.icon);
                            const IconComponent = getIconFromName(phase.icon);
                            return (
                              <IconComponent className="w-6 h-6 text-green-400" />
                            );
                          })()}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-green-400 font-mono uppercase tracking-wider group-hover:text-green-300 transition-colors">
                            {phase.title}
                          </h3>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-300 text-sm font-mono line-clamp-3 mb-4 leading-relaxed">
                        {phase.description}
                      </p>

                      {/* Stats */}
                      <div className="grid grid-cols-1 gap-3 mb-4">
                        <div className="relative p-3 rounded-lg border bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-700/50 hover:border-green-400/50 transition-all duration-300">
                          <div className="text-center">
                            <div className="text-green-400 font-mono text-sm font-bold">
                              PHASE_{phase.order}
                            </div>
                            <div className="text-green-400/60 text-xs font-mono uppercase">
                              {phase.color}_THEME
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        <Link
                          to={`/phases/${phase.id}`}
                          className="flex-1 h-10 bg-green-400/10 border border-green-400/30 hover:bg-green-400/20 hover:border-green-400/50 transition-all duration-300 rounded-lg flex items-center justify-center font-mono text-green-400 text-sm font-bold uppercase tracking-wider"
                          title="View Details"
                        >
                          <EyeIcon className="w-4 h-4 mr-1" />
                          VIEW
                        </Link>
                        <button
                          onClick={() => openModal(phase)}
                          className="h-10 px-3 bg-cyan-400/10 border border-cyan-400/30 hover:bg-cyan-400/20 hover:border-cyan-400/50 transition-all duration-300 rounded-lg flex items-center justify-center text-cyan-400"
                          title="Edit Phase"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(phase)}
                          className="h-10 px-3 bg-red-400/10 border border-red-400/30 hover:bg-red-400/20 hover:border-red-400/50 transition-all duration-300 rounded-lg flex items-center justify-center text-red-400"
                          title="Delete Phase"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
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
                            {(() => {
                              const IconComponent = getIconFromName(phase.icon);
                              return (
                                <IconComponent className="w-5 h-5 text-green-400" />
                              );
                            })()}
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
                        <div className="flex items-center text-xs text-gray-500">
                          <span className="mr-2">Icon:</span>
                          {(() => {
                            const IconComponent = getIconFromName(phase.icon);
                            return (
                              <IconComponent className="w-4 h-4 text-green-400" />
                            );
                          })()}
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
                    <select
                      id="icon"
                      name="icon"
                      value={formData.icon}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select an icon</option>
                      {iconOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="color"
                        className="block text-sm font-medium text-green-400 mb-2"
                      >
                        Color *
                      </label>
                      <select
                        id="color"
                        name="color"
                        value={formData.color}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select a color</option>
                        {colorOptions.map((color) => (
                          <option key={color} value={color}>
                            {color.charAt(0).toUpperCase() + color.slice(1)}
                          </option>
                        ))}
                      </select>
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
    </div>
  );
};

export default PhasesManager;
