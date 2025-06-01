import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { phasesAPI } from "../services/api";

const PhasesManager = () => {
  const [phases, setPhases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingPhase, setEditingPhase] = useState(null);
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
        order: parseInt(formData.order),
      };

      // Validate required fields
      if (
        !phaseData.title ||
        !phaseData.description ||
        !phaseData.icon ||
        !phaseData.order
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-cyber-green">
            [PHASES MANAGEMENT]
          </h1>
          <p className="text-green-400 mt-2">
            Manage learning phases in the cybersecurity platform
          </p>
        </div>
        <button
          onClick={() => openModal()}
          disabled={loading}
          className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add New Phase
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

      {/* Phases List */}
      <div className="card">
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyber-green"></div>
            <div className="text-cyber-green mt-2">Loading phases...</div>
          </div>
        ) : phases.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-green-400 mb-4">No phases found</div>
            <button onClick={() => openModal()} className="btn-secondary">
              Create First Phase
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left py-3 px-4 text-cyber-green">
                    Order
                  </th>
                  <th className="text-left py-3 px-4 text-cyber-green">ID</th>
                  <th className="text-left py-3 px-4 text-cyber-green">
                    Title
                  </th>
                  <th className="text-left py-3 px-4 text-cyber-green">
                    Description
                  </th>
                  <th className="text-left py-3 px-4 text-cyber-green">Icon</th>
                  <th className="text-left py-3 px-4 text-cyber-green">
                    Color
                  </th>
                  <th className="text-left py-3 px-4 text-cyber-green">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {phases
                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                  .map((phase) => (
                    <tr
                      key={phase.id}
                      className="border-b border-gray-700 hover:bg-gray-700/20 transition-colors"
                    >
                      <td className="py-3 px-4 text-green-400 font-bold">
                        {phase.order}
                      </td>
                      <td className="py-3 px-4 text-gray-400 font-mono text-xs">
                        {phase.id.slice(-8)}...
                      </td>
                      <td className="py-3 px-4 text-green-400 font-semibold">
                        {phase.title}
                      </td>
                      <td className="py-3 px-4 text-gray-300 max-w-xs">
                        <div className="truncate" title={phase.description}>
                          {phase.description}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-green-400">{phase.icon}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div
                            className="w-4 h-4 rounded mr-2 border border-gray-500"
                            style={{ backgroundColor: phase.color }}
                          ></div>
                          <span className="text-green-400 font-mono text-sm">
                            {phase.color}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openModal(phase)}
                            className="text-blue-400 hover:text-blue-300 transition-colors p-1 rounded hover:bg-blue-400/10"
                            title="Edit Phase"
                          >
                            <PencilIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(phase)}
                            className="text-red-400 hover:text-red-300 transition-colors p-1 rounded hover:bg-red-400/10"
                            title="Delete Phase"
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
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-600 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-cyber-green">
                {editingPhase ? "Edit Phase" : "Add New Phase"}
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
              {editingPhase && (
                <div>
                  <label className="block text-sm font-medium text-green-400 mb-2">
                    Phase ID (Read-only)
                  </label>
                  <input
                    type="text"
                    value={editingPhase.id}
                    disabled
                    className="input-field w-full bg-gray-700 text-gray-400 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Phase ID cannot be changed after creation
                  </p>
                </div>
              )}

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
                  placeholder="e.g., Beginner Level"
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
                  placeholder="Description of the phase"
                />
              </div>

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
                  placeholder="e.g., Shield, Lock, Key"
                />
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

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {editingPhase ? "Updating..." : "Creating..."}
                    </>
                  ) : editingPhase ? (
                    "Update Phase"
                  ) : (
                    "Create Phase"
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

export default PhasesManager;
