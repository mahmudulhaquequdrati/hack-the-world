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
import { Layers } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TERMINAL_CHARS } from "../lib/colorUtils";
import { getIconFromName, getIconOptions } from "../lib/iconUtils";
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
    color: "green",
    order: "",
  });

  // Drag-and-drop state
  const [draggedPhase, setDraggedPhase] = useState(null);
  const [dragOverPhase, setDragOverPhase] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Selection state
  const [selectedPhases, setSelectedPhases] = useState(new Set());
  const [isAllSelected, setIsAllSelected] = useState(false);

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
      };

      // Auto-calculate order for new phases
      if (!editingPhase) {
        // For new phases, set order to be the next available number
        const maxOrder =
          phases.length > 0 ? Math.max(...phases.map((p) => p.order || 0)) : 0;
        phaseData.order = maxOrder + 1;
      } else {
        // For editing, keep the existing order or use form data if provided
        phaseData.order = formData.order.trim()
          ? parseInt(formData.order)
          : editingPhase.order;
      }

      // Validate required fields
      if (!phaseData.title || !phaseData.description || !phaseData.icon) {
        throw new Error("Title, description, and icon are required");
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

  // Drag-and-drop handlers
  const handleDragStart = (e, phase) => {
    setDraggedPhase(phase);
    setIsDragging(true);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.outerHTML);

    // Add visual feedback to dragged element
    e.target.style.opacity = "0.5";
  };

  const handleDragEnd = (e) => {
    setDraggedPhase(null);
    setDragOverPhase(null);
    setIsDragging(false);
    e.target.style.opacity = "1";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (e, phase) => {
    e.preventDefault();
    if (draggedPhase && draggedPhase.id !== phase.id) {
      setDragOverPhase(phase);
    }
  };

  const handleDragLeave = (e) => {
    // Only clear dragOverPhase if we're really leaving the element
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverPhase(null);
    }
  };

  const handleDrop = (e, targetPhase) => {
    e.preventDefault();

    if (!draggedPhase || draggedPhase.id === targetPhase.id) {
      return;
    }

    // Get current phases sorted by order
    const sortedPhases = [...phases].sort((a, b) => a.order - b.order);

    // Find indices
    const draggedIndex = sortedPhases.findIndex(
      (p) => p.id === draggedPhase.id
    );
    const targetIndex = sortedPhases.findIndex((p) => p.id === targetPhase.id);

    if (draggedIndex === -1 || targetIndex === -1) return;

    // Reorder phases array
    const newPhases = [...sortedPhases];
    const [movedPhase] = newPhases.splice(draggedIndex, 1);
    newPhases.splice(targetIndex, 0, movedPhase);

    // Recalculate orders
    const updatedPhases = newPhases.map((phase, index) => ({
      ...phase,
      order: index + 1,
    }));

    // Update local state immediately for instant UI feedback
    setPhases(updatedPhases);
    setHasChanges(true);
    setSuccess("Phase order updated! Click 'Save Order' to persist changes.");

    // Clear drag state
    setDraggedPhase(null);
    setDragOverPhase(null);
    setIsDragging(false);
  };

  // Save reordered phases to backend
  const savePhaseOrder = async () => {
    try {
      setSaving(true);
      setError("");

      // Prepare order updates for batch API
      const phaseOrders = phases.map((phase) => ({
        id: phase.id,
        order: phase.order,
      }));

      // Send batch update to backend using new batch endpoint
      await phasesAPI.batchUpdateOrder({ phaseOrders });

      setSuccess("Phase order saved successfully!");
      setHasChanges(false);

      // Refresh data to ensure consistency
      await fetchPhases();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Error saving phase order:", error);
      setError("Failed to save phase order. Please try again.");

      // Refresh to restore original order on error
      await fetchPhases();
      setHasChanges(false);

      // Clear error message after 5 seconds
      setTimeout(() => setError(""), 5000);
    } finally {
      setSaving(false);
    }
  };

  // Reset order changes
  const resetPhaseOrder = () => {
    fetchPhases(); // Reload original order
    setHasChanges(false);
    setSuccess("");
    setError("");
  };

  // Selection handlers
  const handleSelectPhase = (phaseId) => {
    const newSelected = new Set(selectedPhases);
    if (newSelected.has(phaseId)) {
      newSelected.delete(phaseId);
    } else {
      newSelected.add(phaseId);
    }
    setSelectedPhases(newSelected);
    setIsAllSelected(newSelected.size === phases.length);
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedPhases(new Set());
      setIsAllSelected(false);
    } else {
      setSelectedPhases(new Set(phases.map(phase => phase.id)));
      setIsAllSelected(true);
    }
  };

  // Update isAllSelected when phases change
  useEffect(() => {
    setIsAllSelected(selectedPhases.size === phases.length && phases.length > 0);
  }, [selectedPhases, phases]);

  return (
    <div className="min-h-screen bg-black text-green-400">
      <div className="max-w-7xl mx-auto py-10 space-y-6 px-4">
        {/* Enhanced Terminal Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400/20 to-green-600/20 border-2 border-green-400/50 flex items-center justify-center animate-pulse">
              <Layers className="w-6 h-6 text-green-400" />
            </div>
            <h2 className="text-4xl font-bold text-green-400 font-mono uppercase tracking-wider relative">
              <span className="relative z-10">PHASES_MANAGEMENT</span>
              <div className="absolute inset-0 bg-green-400/20 blur-lg rounded"></div>
            </h2>
          </div>
          <div className="bg-gradient-to-r from-black/80 via-green-900/20 to-black/80 border border-green-400/30 rounded-xl p-4 max-w-3xl mx-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/5 to-green-400/0 animate-pulse"></div>
            <div className="relative z-10 flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <p className="text-green-400 font-mono text-sm ml-4">
                <span className="text-green-300">admin@hacktheworld:</span>
                <span className="text-blue-400">~/phases</span>
                <span className="text-green-400">
                  $ ./manage --learning-phases --cybersec-platform --enhanced
                </span>
                <span className="animate-ping text-green-400">█</span>
              </p>
            </div>
          </div>
        </div>

        {/* Action Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Enhanced Terminal View Mode Toggle */}
            <div className="flex bg-gradient-to-r from-black/80 to-gray-900/80 border border-green-400/30 rounded-xl p-1 shadow-lg shadow-green-400/10">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 font-mono text-sm font-bold uppercase tracking-wider relative overflow-hidden ${
                  viewMode === "grid"
                    ? "bg-gradient-to-r from-green-400/20 to-green-500/20 text-green-400 border border-green-400/50 shadow-lg shadow-green-400/20"
                    : "text-green-400/60 hover:text-green-400 hover:bg-green-400/10 hover:shadow-md"
                }`}
              >
                {viewMode === "grid" && (
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/20 to-green-400/0 animate-pulse"></div>
                )}
                <Squares2X2Icon className="w-4 h-4 relative z-10" />
                <span className="hidden sm:inline relative z-10">GRID</span>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 font-mono text-sm font-bold uppercase tracking-wider relative overflow-hidden ${
                  viewMode === "list"
                    ? "bg-gradient-to-r from-green-400/20 to-green-500/20 text-green-400 border border-green-400/50 shadow-lg shadow-green-400/20"
                    : "text-green-400/60 hover:text-green-400 hover:bg-green-400/10 hover:shadow-md"
                }`}
              >
                {viewMode === "list" && (
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/20 to-green-400/0 animate-pulse"></div>
                )}
                <ListBulletIcon className="w-4 h-4 relative z-10" />
                <span className="hidden sm:inline relative z-10">LIST</span>
              </button>
            </div>
            <button
              onClick={() => openModal()}
              disabled={loading}
              className="bg-gradient-to-r from-green-400/10 to-green-500/10 border-2 border-green-400/30 hover:bg-gradient-to-r hover:from-green-400/20 hover:to-green-500/20 hover:border-green-400/50 transition-all duration-300 text-green-400 font-mono font-bold uppercase tracking-wider px-6 py-3 rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-green-400/20 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/20 to-green-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <PlusIcon className="w-5 h-5 mr-2 relative z-10" />
              <span className="hidden sm:inline relative z-10">
                ▶ ADD NEW PHASE
              </span>
              <span className="sm:hidden relative z-10">+ ADD</span>
            </button>

            {/* Select All Button */}
            <button
              onClick={handleSelectAll}
              disabled={loading || phases.length === 0}
              className={`transition-all duration-300 font-mono font-bold uppercase tracking-wider px-6 py-3 rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg relative overflow-hidden group ${
                isAllSelected
                  ? "bg-gradient-to-r from-yellow-400/20 to-yellow-500/20 border-2 border-yellow-400/50 text-yellow-400 hover:from-yellow-400/30 hover:to-yellow-500/30 hover:border-yellow-400/70 hover:shadow-yellow-400/20"
                  : "bg-gradient-to-r from-blue-400/10 to-blue-500/10 border-2 border-blue-400/30 text-blue-400 hover:from-blue-400/20 hover:to-blue-500/20 hover:border-blue-400/50 hover:shadow-blue-400/20"
              }`}
            >
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                isAllSelected
                  ? "bg-gradient-to-r from-yellow-400/0 via-yellow-400/20 to-yellow-400/0"
                  : "bg-gradient-to-r from-blue-400/0 via-blue-400/20 to-blue-400/0"
              }`}></div>
              <BoxSelectIcon className="w-5 h-5 mr-2 relative z-10" />
              <span className="hidden sm:inline relative z-10">
                {isAllSelected ? "◄ UNSELECT ALL" : "▶ SELECT ALL"}
              </span>
              <span className="sm:hidden relative z-10">
                {isAllSelected ? "UNSELECT" : "SELECT"}
              </span>
              {selectedPhases.size > 0 && (
                <span className="ml-2 px-2 py-1 bg-gray-900/50 rounded-full text-xs relative z-10">
                  {selectedPhases.size}
                </span>
              )}
            </button>
          </div>

          {/* Drag-and-Drop Order Controls */}
          {hasChanges && (
            <div className="flex gap-2">
              <button
                onClick={savePhaseOrder}
                disabled={saving}
                className="bg-gradient-to-r from-cyan-400/10 to-cyan-500/10 border-2 border-cyan-400/30 hover:bg-gradient-to-r hover:from-cyan-400/20 hover:to-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300 text-cyan-400 font-mono font-bold uppercase tracking-wider px-4 py-2 rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-cyan-400/20 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/20 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center">
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                      ◊ SAVING...
                    </>
                  ) : (
                    "◆ SAVE ORDER"
                  )}
                </span>
              </button>
              <button
                onClick={resetPhaseOrder}
                disabled={saving}
                className="bg-gradient-to-r from-red-400/10 to-red-500/10 border-2 border-red-400/30 hover:bg-gradient-to-r hover:from-red-400/20 hover:to-red-500/20 hover:border-red-400/50 transition-all duration-300 text-red-400 font-mono font-bold uppercase tracking-wider px-4 py-2 rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-red-400/20 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-400/0 via-red-400/20 to-red-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10">◄ RESET</span>
              </button>
            </div>
          )}
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

        {/* Drag-and-Drop Instructions */}
        {!loading && phases.length > 1 && (
          <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-400/30 rounded-xl p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-purple-400/5 to-purple-400/0 animate-pulse"></div>
            <div className="relative z-10 flex items-center space-x-3">
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
              <p className="text-purple-400 font-mono text-sm">
                <span className="font-bold">◆ DRAG & DROP:</span> Drag phase
                cards to reorder them, then click
                <span className="text-cyan-400 font-bold"> ◆ SAVE ORDER </span>
                to persist changes
                {isDragging && (
                  <span className="text-yellow-400 font-bold animate-pulse ml-2">
                    ► CURRENTLY DRAGGING...
                  </span>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Enhanced Loading State */}
        {loading ? (
          <div className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-green-400/30 rounded-xl p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/10 to-green-400/0 animate-pulse"></div>
            <div className="flex items-center justify-center py-12 relative z-10">
              <div className="text-center">
                <div className="text-green-400 text-xl font-mono font-bold mb-4 animate-pulse">
                  {TERMINAL_CHARS.bullet} {TERMINAL_CHARS.diamond}{" "}
                  {TERMINAL_CHARS.bullet} LOADING PHASES {TERMINAL_CHARS.bullet}{" "}
                  {TERMINAL_CHARS.diamond} {TERMINAL_CHARS.bullet}
                </div>
                <div className="flex justify-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-green-400 rounded-full animate-pulse"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Terminal Grid View */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-6">
                {phases
                  .sort((a, b) => a.order - b.order)
                  .map((phase) => (
                    <div
                      key={phase.id}
                      draggable={true}
                      onDragStart={(e) => handleDragStart(e, phase)}
                      onDragEnd={handleDragEnd}
                      onDragOver={handleDragOver}
                      onDragEnter={(e) => handleDragEnter(e, phase)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, phase)}
                      className={`relative overflow-hidden rounded-xl border-2 p-6 group transition-all duration-300 cursor-move select-none ${
                        draggedPhase?.id === phase.id
                          ? "opacity-50 scale-95 rotate-2"
                          : dragOverPhase?.id === phase.id
                          ? "scale-110 shadow-2xl border-yellow-400 ring-4 ring-yellow-400/30"
                          : selectedPhases.has(phase.id)
                          ? "scale-105 shadow-2xl ring-4 ring-yellow-400/50"
                          : "hover:scale-105 hover:shadow-lg"
                      } ${
                        selectedPhases.has(phase.id)
                          ? "border-yellow-400/70 bg-gradient-to-br from-yellow-900/40 to-yellow-800/60 shadow-yellow-400/30"
                          :
                        phase.color === "green"
                          ? `border-green-400/30 bg-gradient-to-br from-green-900/60 to-black/80 hover:border-green-400/50 hover:shadow-green-400/30`
                          : phase.color === "blue"
                          ? `border-blue-400/30 bg-gradient-to-br from-blue-900/60 to-black/80 hover:border-blue-400/50 hover:shadow-blue-400/30`
                          : phase.color === "red"
                          ? `border-red-400/30 bg-gradient-to-br from-red-900/60 to-black/80 hover:border-red-400/50 hover:shadow-red-400/30`
                          : phase.color === "yellow"
                          ? `border-yellow-400/30 bg-gradient-to-br from-yellow-900/60 to-black/80 hover:border-yellow-400/50 hover:shadow-yellow-400/30`
                          : phase.color === "purple"
                          ? `border-purple-400/30 bg-gradient-to-br from-purple-900/60 to-black/80 hover:border-purple-400/50 hover:shadow-purple-400/30`
                          : phase.color === "pink"
                          ? `border-pink-400/30 bg-gradient-to-br from-pink-900/60 to-black/80 hover:border-pink-400/50 hover:shadow-pink-400/30`
                          : phase.color === "indigo"
                          ? `border-indigo-400/30 bg-gradient-to-br from-indigo-900/60 to-black/80 hover:border-indigo-400/50 hover:shadow-indigo-400/30`
                          : phase.color === "cyan"
                          ? `border-cyan-400/30 bg-gradient-to-br from-cyan-900/60 to-black/80 hover:border-cyan-400/50 hover:shadow-cyan-400/30`
                          : phase.color === "orange"
                          ? `border-orange-400/30 bg-gradient-to-br from-orange-900/60 to-black/80 hover:border-orange-400/50 hover:shadow-orange-400/30`
                          : phase.color === "gray"
                          ? `border-gray-400/30 bg-gradient-to-br from-gray-900/60 to-black/80 hover:border-gray-400/50 hover:shadow-gray-400/30`
                          : phase.color === "emerald"
                          ? `border-emerald-400/30 bg-gradient-to-br from-emerald-900/60 to-black/80 hover:border-emerald-400/50 hover:shadow-emerald-400/30`
                          : phase.color === "lime"
                          ? `border-lime-400/30 bg-gradient-to-br from-lime-900/60 to-black/80 hover:border-lime-400/50 hover:shadow-lime-400/30`
                          : phase.color === "teal"
                          ? `border-teal-400/30 bg-gradient-to-br from-teal-900/60 to-black/80 hover:border-teal-400/50 hover:shadow-teal-400/30`
                          : phase.color === "sky"
                          ? `border-sky-400/30 bg-gradient-to-br from-sky-900/60 to-black/80 hover:border-sky-400/50 hover:shadow-sky-400/30`
                          : phase.color === "violet"
                          ? `border-violet-400/30 bg-gradient-to-br from-violet-900/60 to-black/80 hover:border-violet-400/50 hover:shadow-violet-400/30`
                          : phase.color === "fuchsia"
                          ? `border-fuchsia-400/30 bg-gradient-to-br from-fuchsia-900/60 to-black/80 hover:border-fuchsia-400/50 hover:shadow-fuchsia-400/30`
                          : phase.color === "rose"
                          ? `border-rose-400/30 bg-gradient-to-br from-rose-900/60 to-black/80 hover:border-rose-400/50 hover:shadow-rose-400/30`
                          : phase.color === "slate"
                          ? `border-slate-400/30 bg-gradient-to-br from-slate-900/60 to-black/80 hover:border-slate-400/50 hover:shadow-slate-400/30`
                          : phase.color === "zinc"
                          ? `border-zinc-400/30 bg-gradient-to-br from-zinc-900/60 to-black/80 hover:border-zinc-400/50 hover:shadow-zinc-400/30`
                          : phase.color === "neutral"
                          ? `border-neutral-400/30 bg-gradient-to-br from-neutral-900/60 to-black/80 hover:border-neutral-400/50 hover:shadow-neutral-400/30`
                          : phase.color === "stone"
                          ? `border-stone-400/30 bg-gradient-to-br from-stone-900/60 to-black/80 hover:border-stone-400/50 hover:shadow-stone-400/30`
                          : phase.color === "amber"
                          ? `border-amber-400/30 bg-gradient-to-br from-amber-900/60 to-black/80 hover:border-amber-400/50 hover:shadow-amber-400/30`
                          : ""
                      }
                      `}
                    >
                      {/* Glow Effect */}
                      <div
                        className={`absolute inset-0 transition-opacity duration-300 ${
                          selectedPhases.has(phase.id)
                            ? "bg-gradient-to-r from-yellow-400/0 via-yellow-400/20 to-yellow-400/0 opacity-100"
                            : "opacity-0 group-hover:opacity-100"
                        } ${
                          selectedPhases.has(phase.id)
                            ? "bg-gradient-to-r from-yellow-400/0 via-yellow-400/20 to-yellow-400/0"
                            : phase.color === "green"
                            ? "bg-gradient-to-r from-green-400/0 via-green-400/10 to-green-400/0"
                            : phase.color === "blue"
                            ? "bg-gradient-to-r from-blue-400/0 via-blue-400/10 to-blue-400/0"
                            : phase.color === "red"
                            ? "bg-gradient-to-r from-red-400/0 via-red-400/10 to-red-400/0"
                            : phase.color === "yellow"
                            ? "bg-gradient-to-r from-yellow-400/0 via-yellow-400/10 to-yellow-400/0"
                            : phase.color === "purple"
                            ? "bg-gradient-to-r from-purple-400/0 via-purple-400/10 to-purple-400/0"
                            : phase.color === "pink"
                            ? "bg-gradient-to-r from-pink-400/0 via-pink-400/10 to-pink-400/0"
                            : phase.color === "indigo"
                            ? "bg-gradient-to-r from-indigo-400/0 via-indigo-400/10 to-indigo-400/0"
                            : phase.color === "cyan"
                            ? "bg-gradient-to-r from-cyan-400/0 via-cyan-400/10 to-cyan-400/0"
                            : phase.color === "orange"
                            ? "bg-gradient-to-r from-orange-400/0 via-orange-400/10 to-orange-400/0"
                            : phase.color === "gray"
                            ? "bg-gradient-to-r from-gray-400/0 via-gray-400/10 to-gray-400/0"
                            : phase.color === "emerald"
                            ? "bg-gradient-to-r from-emerald-400/0 via-emerald-400/10 to-emerald-400/0"
                            : phase.color === "lime"
                            ? "bg-gradient-to-r from-lime-400/0 via-lime-400/10 to-lime-400/0"
                            : phase.color === "teal"
                            ? "bg-gradient-to-r from-teal-400/0 via-teal-400/10 to-teal-400/0"
                            : phase.color === "sky"
                            ? "bg-gradient-to-r from-sky-400/0 via-sky-400/10 to-sky-400/0"
                            : phase.color === "violet"
                            ? "bg-gradient-to-r from-violet-400/0 via-violet-400/10 to-violet-400/0"
                            : phase.color === "fuchsia"
                            ? "bg-gradient-to-r from-fuchsia-400/0 via-fuchsia-400/10 to-fuchsia-400/0"
                            : phase.color === "rose"
                            ? "bg-gradient-to-r from-rose-400/0 via-rose-400/10 to-rose-400/0"
                            : phase.color === "slate"
                            ? "bg-gradient-to-r from-slate-400/0 via-slate-400/10 to-slate-400/0"
                            : phase.color === "zinc"
                            ? "bg-gradient-to-r from-zinc-400/0 via-zinc-400/10 to-zinc-400/0"
                            : phase.color === "neutral"
                            ? "bg-gradient-to-r from-neutral-400/0 via-neutral-400/10 to-neutral-400/0"
                            : phase.color === "stone"
                            ? "bg-gradient-to-r from-stone-400/0 via-stone-400/10 to-stone-400/0"
                            : phase.color === "amber"
                            ? "bg-gradient-to-r from-amber-400/0 via-amber-400/10 to-amber-400/0"
                            : ""
                        }`}
                      ></div>

                      {/* Status Indicators */}
                      <div className="absolute top-2 left-2 flex space-x-1">
                        <div
                          className={`w-2 h-2 rounded-full animate-pulse shadow-lg
                        ${
                          phase.color === "green"
                            ? "bg-green-400 shadow-green-400/50"
                            : phase.color === "blue"
                            ? "bg-blue-400 shadow-blue-400/50"
                            : phase.color === "red"
                            ? "bg-red-400 shadow-red-400/50"
                            : phase.color === "yellow"
                            ? "bg-yellow-400 shadow-yellow-400/50"
                            : phase.color === "purple"
                            ? "bg-purple-400 shadow-purple-400/50"
                            : phase.color === "pink"
                            ? "bg-pink-400 shadow-pink-400/50"
                            : phase.color === "indigo"
                            ? "bg-indigo-400 shadow-indigo-400/50"
                            : phase.color === "cyan"
                            ? "bg-cyan-400 shadow-cyan-400/50"
                            : phase.color === "orange"
                            ? "bg-orange-400 shadow-orange-400/50"
                            : phase.color === "gray"
                            ? "bg-gray-400 shadow-gray-400/50"
                            : phase.color === "emerald"
                            ? "bg-emerald-400 shadow-emerald-400/50"
                            : phase.color === "lime"
                            ? "bg-lime-400 shadow-lime-400/50"
                            : phase.color === "teal"
                            ? "bg-teal-400 shadow-teal-400/50"
                            : phase.color === "sky"
                            ? "bg-sky-400 shadow-sky-400/50"
                            : phase.color === "violet"
                            ? "bg-violet-400 shadow-violet-400/50"
                            : phase.color === "fuchsia"
                            ? "bg-fuchsia-400 shadow-fuchsia-400/50"
                            : phase.color === "rose"
                            ? "bg-rose-400 shadow-rose-400/50"
                            : phase.color === "slate"
                            ? "bg-slate-400 shadow-slate-400/50"
                            : phase.color === "zinc"
                            ? "bg-zinc-400 shadow-zinc-400/50"
                            : phase.color === "neutral"
                            ? "bg-neutral-400 shadow-neutral-400/50"
                            : phase.color === "stone"
                            ? "bg-stone-400 shadow-stone-400/50"
                            : phase.color === "amber"
                            ? "bg-amber-400 shadow-amber-400/50"
                            : ""
                        }
                        `}
                        ></div>
                        {isDragging && (
                          <div className="w-2 h-2 rounded-full animate-ping bg-yellow-400 shadow-lg shadow-yellow-400/50"></div>
                        )}
                      </div>

                      {/* Selection Checkbox */}
                      <div className="absolute top-3 left-3 z-20">
                        <input
                          type="checkbox"
                          checked={selectedPhases.has(phase.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleSelectPhase(phase.id);
                          }}
                          className="w-5 h-5 rounded border-2 border-yellow-400/50 bg-gray-900/80 text-yellow-400 focus:ring-2 focus:ring-yellow-400/50 transition-all duration-300 hover:border-yellow-400 cursor-pointer"
                        />
                      </div>

                      {/* Drag Handle Indicator */}
                      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-20">
                        <div className="flex flex-col space-y-1 opacity-60 hover:opacity-100 transition-opacity duration-300">
                          <div className="w-6 h-0.5 bg-gray-400 rounded-full"></div>
                          <div className="w-6 h-0.5 bg-gray-400 rounded-full"></div>
                          <div className="w-6 h-0.5 bg-gray-400 rounded-full"></div>
                        </div>
                      </div>

                      {/* Phase Order Badge */}
                      <div className="absolute top-3 right-3 z-10">
                        <div
                          className={`w-8 h-8 rounded-full  border-2  flex items-center justify-center font-mono font-bold text-sm
                        ${
                          phase.color === "green"
                            ? "bg-green-400/20 border-green-400 text-green-400 shadow-green-400/30"
                            : phase.color === "blue"
                            ? "bg-blue-400/20 border-blue-400 text-blue-400 shadow-blue-400/30"
                            : phase.color === "red"
                            ? "bg-red-400/20 border-red-400 text-red-400 shadow-red-400/30"
                            : phase.color === "yellow"
                            ? "bg-yellow-400/20 border-yellow-400 text-yellow-400 shadow-yellow-400/30"
                            : phase.color === "purple"
                            ? "bg-purple-400/20 border-purple-400 text-purple-400 shadow-purple-400/30"
                            : phase.color === "pink"
                            ? "bg-pink-400/20 border-pink-400 text-pink-400 shadow-pink-400/30"
                            : phase.color === "indigo"
                            ? "bg-indigo-400/20 border-indigo-400 text-indigo-400 shadow-indigo-400/30"
                            : phase.color === "cyan"
                            ? "bg-cyan-400/20 border-cyan-400 text-cyan-400 shadow-cyan-400/30"
                            : phase.color === "orange"
                            ? "bg-orange-400/20 border-orange-400 text-orange-400 shadow-orange-400/30"
                            : phase.color === "gray"
                            ? "bg-gray-400/20 border-gray-400 text-gray-400 shadow-gray-400/30"
                            : phase.color === "emerald"
                            ? "bg-emerald-400/20 border-emerald-400 text-emerald-400 shadow-emerald-400/30"
                            : phase.color === "lime"
                            ? "bg-lime-400/20 border-lime-400 text-lime-400 shadow-lime-400/30"
                            : phase.color === "teal"
                            ? "bg-teal-400/20 border-teal-400 text-teal-400 shadow-teal-400/30"
                            : phase.color === "sky"
                            ? "bg-sky-400/20 border-sky-400 text-sky-400 shadow-sky-400/30"
                            : phase.color === "violet"
                            ? "bg-violet-400/20 border-violet-400 text-violet-400 shadow-violet-400/30"
                            : phase.color === "fuchsia"
                            ? "bg-fuchsia-400/20 border-fuchsia-400 text-fuchsia-400 shadow-fuchsia-400/30"
                            : phase.color === "rose"
                            ? "bg-rose-400/20 border-rose-400 text-rose-400 shadow-rose-400/30"
                            : phase.color === "slate"
                            ? "bg-slate-400/20 border-slate-400 text-slate-400 shadow-slate-400/30"
                            : phase.color === "zinc"
                            ? "bg-zinc-400/20 border-zinc-400 text-zinc-400 shadow-zinc-400/30"
                            : phase.color === "neutral"
                            ? "bg-neutral-400/20 border-neutral-400 text-neutral-400 shadow-neutral-400/30"
                            : phase.color === "stone"
                            ? "bg-stone-400/20 border-stone-400 text-stone-400 shadow-stone-400/30"
                            : phase.color === "amber"
                            ? "bg-amber-400/20 border-amber-400 text-amber-400 shadow-amber-400/30"
                            : ""
                        }
                        `}
                        >
                          {phase.order}
                        </div>
                      </div>

                      <div className="relative z-10">
                        {/* Phase Icon */}
                        <div className="flex items-center space-x-3 mb-4">
                          <div
                            className={`w-12 h-12 rounded-xl bg-gradient-to-br from-gray-800/50 to-black/50 border-2  shadow-lg  flex items-center justify-center group-hover:animate-pulse
                          ${
                            phase.color === "green"
                              ? "border-green-400/30 shadow-green-400/30"
                              : phase.color === "blue"
                              ? "border-blue-400/30 shadow-blue-400/30"
                              : phase.color === "red"
                              ? "border-red-400/30 shadow-red-400/30"
                              : phase.color === "yellow"
                              ? "border-yellow-400/30 shadow-yellow-400/30"
                              : phase.color === "purple"
                              ? "border-purple-400/30 shadow-purple-400/30"
                              : phase.color === "pink"
                              ? "border-pink-400/30 shadow-pink-400/30"
                              : phase.color === "indigo"
                              ? "border-indigo-400/30 shadow-indigo-400/30"
                              : phase.color === "cyan"
                              ? "border-cyan-400/30 shadow-cyan-400/30"
                              : phase.color === "orange"
                              ? "border-orange-400/30 shadow-orange-400/30"
                              : phase.color === "gray"
                              ? "border-gray-400/30 shadow-gray-400/30"
                              : phase.color === "emerald"
                              ? "border-emerald-400/30 shadow-emerald-400/30"
                              : phase.color === "lime"
                              ? "border-lime-400/30 shadow-lime-400/30"
                              : phase.color === "teal"
                              ? "border-teal-400/30 shadow-teal-400/30"
                              : phase.color === "sky"
                              ? "border-sky-400/30 shadow-sky-400/30"
                              : phase.color === "violet"
                              ? "border-violet-400/30 shadow-violet-400/30"
                              : phase.color === "fuchsia"
                              ? "border-fuchsia-400/30 shadow-fuchsia-400/30"
                              : phase.color === "rose"
                              ? "border-rose-400/30 shadow-rose-400/30"
                              : phase.color === "slate"
                              ? "border-slate-400/30 shadow-slate-400/30"
                              : phase.color === "zinc"
                              ? "border-zinc-400/30 shadow-zinc-400/30"
                              : phase.color === "neutral"
                              ? "border-neutral-400/30 shadow-neutral-400/30"
                              : phase.color === "stone"
                              ? "border-stone-400/30 shadow-stone-400/30"
                              : phase.color === "amber"
                              ? "border-amber-400/30 shadow-amber-400/30"
                              : ""
                          }
                          `}
                          >
                            {(() => {
                              const IconComponent = getIconFromName(phase.icon);
                              return (
                                <IconComponent
                                  className={`w-6 h-6
                                    ${
                                      phase.color === "green"
                                        ? "text-green-400"
                                        : phase.color === "blue"
                                        ? "text-blue-400"
                                        : phase.color === "red"
                                        ? "text-red-400"
                                        : phase.color === "yellow"
                                        ? "text-yellow-400"
                                        : phase.color === "purple"
                                        ? "text-purple-400"
                                        : phase.color === "pink"
                                        ? "text-pink-400"
                                        : phase.color === "indigo"
                                        ? "text-indigo-400"
                                        : phase.color === "cyan"
                                        ? "text-cyan-400"
                                        : phase.color === "orange"
                                        ? "text-orange-400"
                                        : phase.color === "gray"
                                        ? "text-gray-400"
                                        : phase.color === "emerald"
                                        ? "text-emerald-400"
                                        : phase.color === "lime"
                                        ? "text-lime-400"
                                        : phase.color === "teal"
                                        ? "text-teal-400"
                                        : phase.color === "sky"
                                        ? "text-sky-400"
                                        : phase.color === "violet"
                                        ? "text-violet-400"
                                        : phase.color === "fuchsia"
                                        ? "text-fuchsia-400"
                                        : phase.color === "rose"
                                        ? "text-rose-400"
                                        : phase.color === "slate"
                                        ? "text-slate-400"
                                        : phase.color === "zinc"
                                        ? "text-zinc-400"
                                        : phase.color === "neutral"
                                        ? "text-neutral-400"
                                        : phase.color === "stone"
                                        ? "text-stone-400"
                                        : phase.color === "amber"
                                        ? "text-amber-400"
                                        : ""
                                    }
                                    `}
                                />
                              );
                            })()}
                          </div>
                          <div className="flex-1">
                            <h3
                              className={`text-lg font-bold  font-mono uppercase tracking-wider  transition-colors
                            ${
                              phase.color === "green"
                                ? "text-green-400 group-hover:text-green-300"
                                : phase.color === "blue"
                                ? "text-blue-400 group-hover:text-blue-300"
                                : phase.color === "red"
                                ? "text-red-400 group-hover:text-red-300"
                                : phase.color === "yellow"
                                ? "text-yellow-400 group-hover:text-yellow-300"
                                : phase.color === "purple"
                                ? "text-purple-400 group-hover:text-purple-300"
                                : phase.color === "pink"
                                ? "text-pink-400 group-hover:text-pink-300"
                                : phase.color === "indigo"
                                ? "text-indigo-400 group-hover:text-indigo-300"
                                : phase.color === "cyan"
                                ? "text-cyan-400 group-hover:text-cyan-300"
                                : phase.color === "orange"
                                ? "text-orange-400 group-hover:text-orange-300"
                                : phase.color === "gray"
                                ? "text-gray-400 group-hover:text-gray-300"
                                : phase.color === "emerald"
                                ? "text-emerald-400 group-hover:text-emerald-300"
                                : phase.color === "lime"
                                ? "text-lime-400 group-hover:text-lime-300"
                                : phase.color === "teal"
                                ? "text-teal-400 group-hover:text-teal-300"
                                : phase.color === "sky"
                                ? "text-sky-400 group-hover:text-sky-300"
                                : phase.color === "violet"
                                ? "text-violet-400 group-hover:text-violet-300"
                                : phase.color === "fuchsia"
                                ? "text-fuchsia-400 group-hover:text-fuchsia-300"
                                : phase.color === "rose"
                                ? "text-rose-400 group-hover:text-rose-300"
                                : phase.color === "slate"
                                ? "text-slate-400 group-hover:text-slate-300"
                                : phase.color === "zinc"
                                ? "text-zinc-400 group-hover:text-zinc-300"
                                : phase.color === "neutral"
                                ? "text-neutral-400 group-hover:text-neutral-300"
                                : phase.color === "stone"
                                ? "text-stone-400 group-hover:text-stone-300"
                                : phase.color === "amber"
                                ? "text-amber-400 group-hover:text-amber-300"
                                : ""
                            }
                            `}
                            >
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
                          <div
                            className={`relative p-3 rounded-lg border bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-700/50  transition-all duration-300
                            ${
                              phase.color === "green"
                                ? " hover:border-green-400/50"
                                : phase.color === "blue"
                                ? "hover:border-blue-400/50"
                                : phase.color === "red"
                                ? "hover:border-red-400/50"
                                : phase.color === "yellow"
                                ? "hover:border-yellow-400/50"
                                : phase.color === "purple"
                                ? "hover:border-purple-400/50"
                                : phase.color === "pink"
                                ? "hover:border-pink-400/50"
                                : phase.color === "indigo"
                                ? "hover:border-indigo-400/50"
                                : phase.color === "cyan"
                                ? "hover:border-cyan-400/50"
                                : phase.color === "orange"
                                ? "hover:border-orange-400/50"
                                : phase.color === "gray"
                                ? "hover:border-gray-400/50"
                                : ""
                            }

                            `}
                          >
                            <div className="text-center">
                              <div
                                className={` font-mono text-sm font-bold
                                ${
                                  phase.color === "green"
                                    ? "text-green-400"
                                    : phase.color === "blue"
                                    ? "text-blue-400"
                                    : phase.color === "red"
                                    ? "text-red-400"
                                    : phase.color === "yellow"
                                    ? "text-yellow-400"
                                    : phase.color === "purple"
                                    ? "text-purple-400"
                                    : phase.color === "pink"
                                    ? "text-pink-400"
                                    : phase.color === "indigo"
                                    ? "text-indigo-400"
                                    : phase.color === "cyan"
                                    ? "text-cyan-400"
                                    : phase.color === "orange"
                                    ? "text-orange-400"
                                    : phase.color === "gray"
                                    ? "text-gray-400"
                                    : phase.color === "emerald"
                                    ? "text-emerald-400"
                                    : phase.color === "lime"
                                    ? "text-lime-400"
                                    : phase.color === "teal"
                                    ? "text-teal-400"
                                    : phase.color === "sky"
                                    ? "text-sky-400"
                                    : phase.color === "violet"
                                    ? "text-violet-400"
                                    : phase.color === "fuchsia"
                                    ? "text-fuchsia-400"
                                    : phase.color === "rose"
                                    ? "text-rose-400"
                                    : phase.color === "slate"
                                    ? "text-slate-400"
                                    : phase.color === "zinc"
                                    ? "text-zinc-400"
                                    : phase.color === "neutral"
                                    ? "text-neutral-400"
                                    : phase.color === "stone"
                                    ? "text-stone-400"
                                    : phase.color === "amber"
                                    ? "text-amber-400"
                                    : ""
                                }
                                `}
                              >
                                PHASE_{phase.order}
                              </div>
                              <div
                                className={` text-xs font-mono uppercase  ${
                                  phase.color === "green"
                                    ? "text-green-400"
                                    : phase.color === "blue"
                                    ? "text-blue-400"
                                    : phase.color === "red"
                                    ? "text-red-400"
                                    : phase.color === "yellow"
                                    ? "text-yellow-400"
                                    : phase.color === "purple"
                                    ? "text-purple-400"
                                    : phase.color === "pink"
                                    ? "text-pink-400"
                                    : phase.color === "indigo"
                                    ? "text-indigo-400"
                                    : phase.color === "cyan"
                                    ? "text-cyan-400"
                                    : phase.color === "orange"
                                    ? "text-orange-400"
                                    : phase.color === "gray"
                                    ? "text-gray-400"
                                    : phase.color === "emerald"
                                    ? "text-emerald-400"
                                    : phase.color === "lime"
                                    ? "text-lime-400"
                                    : phase.color === "teal"
                                    ? "text-teal-400"
                                    : phase.color === "sky"
                                    ? "text-sky-400"
                                    : phase.color === "violet"
                                    ? "text-violet-400"
                                    : phase.color === "fuchsia"
                                    ? "text-fuchsia-400"
                                    : phase.color === "rose"
                                    ? "text-rose-400"
                                    : phase.color === "slate"
                                    ? "text-slate-400"
                                    : phase.color === "zinc"
                                    ? "text-zinc-400"
                                    : phase.color === "neutral"
                                    ? "text-neutral-400"
                                    : phase.color === "stone"
                                    ? "text-stone-400"
                                    : phase.color === "amber"
                                    ? "text-amber-400"
                                    : ""
                                }`}
                              >
                                {phase.color}_THEME
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-2">
                          <Link
                            to={`/phases/${phase.id}`}
                            className={`flex-1 h-10  border   transition-all duration-300 rounded-lg flex items-center justify-center font-mono  text-sm font-bold uppercase tracking-wider
                          ${
                            phase.color === "green"
                              ? "bg-green-400/10 border-green-400/30 hover:bg-green-400/20 hover:border-green-400/50 text-green-400"
                              : phase.color === "blue"
                              ? "bg-blue-400/10 border-blue-400/30 hover:bg-blue-400/20 hover:border-blue-400/50 text-blue-400"
                              : phase.color === "red"
                              ? "bg-red-400/10 border-red-400/30 hover:bg-red-400/20 hover:border-red-400/50 text-red-400"
                              : phase.color === "yellow"
                              ? "bg-yellow-400/10 border-yellow-400/30 hover:bg-yellow-400/20 hover:border-yellow-400/50 text-yellow-400"
                              : phase.color === "purple"
                              ? "bg-purple-400/10 border-purple-400/30 hover:bg-purple-400/20 hover:border-purple-400/50 text-purple-400"
                              : phase.color === "pink"
                              ? "bg-pink-400/10 border-pink-400/30 hover:bg-pink-400/20 hover:border-pink-400/50 text-pink-400"
                              : phase.color === "indigo"
                              ? "bg-indigo-400/10 border-indigo-400/30 hover:bg-indigo-400/20 hover:border-indigo-400/50 text-indigo-400"
                              : phase.color === "cyan"
                              ? "bg-cyan-400/10 border-cyan-400/30 hover:bg-cyan-400/20 hover:border-cyan-400/50 text-cyan-400"
                              : phase.color === "orange"
                              ? "bg-orange-400/10 border-orange-400/30 hover:bg-orange-400/20 hover:border-orange-400/50 text-orange-400"
                              : phase.color === "gray"
                              ? "bg-gray-400/10 border-gray-400/30 hover:bg-gray-400/20 hover:border-gray-400/50 text-gray-400"
                              : phase.color === "emerald"
                              ? "bg-emerald-400/10 border-emerald-400/30 hover:bg-emerald-400/20 hover:border-emerald-400/50 text-emerald-400"
                              : phase.color === "lime"
                              ? "bg-lime-400/10 border-lime-400/30 hover:bg-lime-400/20 hover:border-lime-400/50 text-lime-400"
                              : phase.color === "teal"
                              ? "bg-teal-400/10 border-teal-400/30 hover:bg-teal-400/20 hover:border-teal-400/50 text-teal-400"
                              : phase.color === "sky"
                              ? "bg-sky-400/10 border-sky-400/30 hover:bg-sky-400/20 hover:border-sky-400/50 text-sky-400"
                              : phase.color === "violet"
                              ? "bg-violet-400/10 border-violet-400/30 hover:bg-violet-400/20 hover:border-violet-400/50 text-violet-400"
                              : phase.color === "fuchsia"
                              ? "bg-fuchsia-400/10 border-fuchsia-400/30 hover:bg-fuchsia-400/20 hover:border-fuchsia-400/50 text-fuchsia-400"
                              : phase.color === "rose"
                              ? "bg-rose-400/10 border-rose-400/30 hover:bg-rose-400/20 hover:border-rose-400/50 text-rose-400"
                              : phase.color === "slate"
                              ? "bg-slate-400/10 border-slate-400/30 hover:bg-slate-400/20 hover:border-slate-400/50 text-slate-400"
                              : phase.color === "zinc"
                              ? "bg-zinc-400/10 border-zinc-400/30 hover:bg-zinc-400/20 hover:border-zinc-400/50 text-zinc-400"
                              : phase.color === "neutral"
                              ? "bg-neutral-400/10 border-neutral-400/30 hover:bg-neutral-400/20 hover:border-neutral-400/50 text-neutral-400"
                              : phase.color === "stone"
                              ? "bg-stone-400/10 border-stone-400/30 hover:bg-stone-400/20 hover:border-stone-400/50 text-stone-400"
                              : phase.color === "amber"
                              ? "bg-amber-400/10 border-amber-400/30 hover:bg-amber-400/20 hover:border-amber-400/50 text-amber-400"
                              : ""
                          }
                          `}
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

            {/* Enhanced List View */}
            {viewMode === "list" && (
              <div className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-green-400/30 rounded-xl overflow-hidden shadow-2xl shadow-green-400/10">
                {/* Enhanced Desktop Table */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-green-900/30 to-green-800/30 border-b border-green-400/30">
                      <tr>
                        <th className="text-left p-4 text-green-400 font-mono font-bold uppercase tracking-wider">
                          ◆ ORDER
                        </th>
                        <th className="text-left p-4 text-green-400 font-mono font-bold uppercase tracking-wider">
                          ◆ PHASE
                        </th>
                        <th className="text-left p-4 text-green-400 font-mono font-bold uppercase tracking-wider">
                          ◆ DESCRIPTION
                        </th>
                        <th className="text-left p-4 text-green-400 font-mono font-bold uppercase tracking-wider">
                          ◆ ICON
                        </th>
                        <th className="text-center p-4 text-green-400 font-mono font-bold uppercase tracking-wider">
                          ◆ ACTIONS
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {phases.map((phase, index) => (
                        <tr
                          key={phase.id}
                          className={`border-b border-green-400/20 hover:bg-gradient-to-r hover:from-green-900/20 hover:to-green-800/20 transition-all duration-300 group ${
                            index % 2 === 0
                              ? "bg-gradient-to-r from-gray-900/30 to-gray-800/30"
                              : "bg-gradient-to-r from-gray-800/30 to-gray-900/30"
                          }`}
                        >
                          <td className="p-4">
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold font-mono border-2 shadow-lg transition-all duration-300 group-hover:scale-110
                                ${
                                  phase.color === "green"
                                    ? "bg-green-400/20 border-green-400 text-green-400 shadow-green-400/30"
                                    : phase.color === "blue"
                                    ? "bg-blue-400/20 border-blue-400 text-blue-400 shadow-blue-400/30"
                                    : phase.color === "red"
                                    ? "bg-red-400/20 border-red-400 text-red-400 shadow-red-400/30"
                                    : phase.color === "yellow"
                                    ? "bg-yellow-400/20 border-yellow-400 text-yellow-400 shadow-yellow-400/30"
                                    : phase.color === "purple"
                                    ? "bg-purple-400/20 border-purple-400 text-purple-400 shadow-purple-400/30"
                                    : phase.color === "pink"
                                    ? "bg-pink-400/20 border-pink-400 text-pink-400 shadow-pink-400/30"
                                    : phase.color === "indigo"
                                    ? "bg-indigo-400/20 border-indigo-400 text-indigo-400 shadow-indigo-400/30"
                                    : phase.color === "cyan"
                                    ? "bg-cyan-400/20 border-cyan-400 text-cyan-400 shadow-cyan-400/30"
                                    : phase.color === "orange"
                                    ? "bg-orange-400/20 border-orange-400 text-orange-400 shadow-orange-400/30"
                                    : phase.color === "gray"
                                    ? "bg-gray-400/20 border-gray-400 text-gray-400 shadow-gray-400/30"
                                    : phase.color === "emerald"
                                    ? "bg-emerald-400/20 border-emerald-400 text-emerald-400 shadow-emerald-400/30"
                                    : phase.color === "lime"
                                    ? "bg-lime-400/20 border-lime-400 text-lime-400 shadow-lime-400/30"
                                    : phase.color === "teal"
                                    ? "bg-teal-400/20 border-teal-400 text-teal-400 shadow-teal-400/30"
                                    : phase.color === "sky"
                                    ? "bg-sky-400/20 border-sky-400 text-sky-400 shadow-sky-400/30"
                                    : phase.color === "violet"
                                    ? "bg-violet-400/20 border-violet-400 text-violet-400 shadow-violet-400/30"
                                    : phase.color === "fuchsia"
                                    ? "bg-fuchsia-400/20 border-fuchsia-400 text-fuchsia-400 shadow-fuchsia-400/30"
                                    : phase.color === "rose"
                                    ? "bg-rose-400/20 border-rose-400 text-rose-400 shadow-rose-400/30"
                                    : phase.color === "slate"
                                    ? "bg-slate-400/20 border-slate-400 text-slate-400 shadow-slate-400/30"
                                    : phase.color === "zinc"
                                    ? "bg-zinc-400/20 border-zinc-400 text-zinc-400 shadow-zinc-400/30"
                                    : phase.color === "neutral"
                                    ? "bg-neutral-400/20 border-neutral-400 text-neutral-400 shadow-neutral-400/30"
                                    : phase.color === "stone"
                                    ? "bg-stone-400/20 border-stone-400 text-stone-400 shadow-stone-400/30"
                                    : phase.color === "amber"
                                    ? "bg-amber-400/20 border-amber-400 text-amber-400 shadow-amber-400/30"
                                    : ""
                                }
                              `}
                            >
                              {phase.order}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-green-400 font-mono uppercase tracking-wider group-hover:text-green-300 transition-colors">
                              {phase.title}
                            </div>
                          </td>
                          <td className="p-4 max-w-md">
                            <div className="text-gray-300 text-sm font-mono line-clamp-2 leading-relaxed">
                              {phase.description}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-800/50 to-black/50 border-2 border-green-400/30 flex items-center justify-center group-hover:animate-pulse transition-all duration-300">
                              {(() => {
                                const IconComponent = getIconFromName(
                                  phase.icon
                                );
                                return (
                                  <IconComponent className="w-5 h-5 text-green-400" />
                                );
                              })()}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex justify-center gap-2">
                              <Link
                                to={`/phases/${phase.id}`}
                                className="p-3 bg-green-400/10 border border-green-400/30 hover:bg-green-400/20 hover:border-green-400/50 transition-all duration-300 rounded-lg text-green-400 hover:text-green-300 shadow-lg hover:shadow-green-400/20"
                                title="View Details"
                              >
                                <EyeIcon className="w-4 h-4" />
                              </Link>
                              <button
                                onClick={() => openModal(phase)}
                                className="p-3 bg-cyan-400/10 border border-cyan-400/30 hover:bg-cyan-400/20 hover:border-cyan-400/50 transition-all duration-300 rounded-lg text-cyan-400 hover:text-cyan-300 shadow-lg hover:shadow-cyan-400/20"
                                title="Edit Phase"
                              >
                                <PencilIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(phase)}
                                className="p-3 bg-red-400/10 border border-red-400/30 hover:bg-red-400/20 hover:border-red-400/50 transition-all duration-300 rounded-lg text-red-400 hover:text-red-300 shadow-lg hover:shadow-red-400/20"
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

                {/* Enhanced Mobile Cards */}
                <div className="lg:hidden space-y-4 p-4">
                  {phases.map((phase) => (
                    <div
                      key={phase.id}
                      className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-green-400/30 rounded-xl p-4 space-y-4 hover:border-green-400/50 transition-all duration-300 shadow-lg hover:shadow-green-400/20 relative overflow-hidden group"
                    >
                      {/* Mobile card glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/5 to-green-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold font-mono border-2 shadow-lg
                              ${
                                phase.color === "green"
                                  ? "bg-green-400/20 border-green-400 text-green-400 shadow-green-400/30"
                                  : phase.color === "blue"
                                  ? "bg-blue-400/20 border-blue-400 text-blue-400 shadow-blue-400/30"
                                  : phase.color === "red"
                                  ? "bg-red-400/20 border-red-400 text-red-400 shadow-red-400/30"
                                  : phase.color === "yellow"
                                  ? "bg-yellow-400/20 border-yellow-400 text-yellow-400 shadow-yellow-400/30"
                                  : phase.color === "purple"
                                  ? "bg-purple-400/20 border-purple-400 text-purple-400 shadow-purple-400/30"
                                  : phase.color === "pink"
                                  ? "bg-pink-400/20 border-pink-400 text-pink-400 shadow-pink-400/30"
                                  : phase.color === "indigo"
                                  ? "bg-indigo-400/20 border-indigo-400 text-indigo-400 shadow-indigo-400/30"
                                  : phase.color === "cyan"
                                  ? "bg-cyan-400/20 border-cyan-400 text-cyan-400 shadow-cyan-400/30"
                                  : phase.color === "orange"
                                  ? "bg-orange-400/20 border-orange-400 text-orange-400 shadow-orange-400/30"
                                  : phase.color === "gray"
                                  ? "bg-gray-400/20 border-gray-400 text-gray-400 shadow-gray-400/30"
                                  : phase.color === "emerald"
                                  ? "bg-emerald-400/20 border-emerald-400 text-emerald-400 shadow-emerald-400/30"
                                  : phase.color === "lime"
                                  ? "bg-lime-400/20 border-lime-400 text-lime-400 shadow-lime-400/30"
                                  : phase.color === "teal"
                                  ? "bg-teal-400/20 border-teal-400 text-teal-400 shadow-teal-400/30"
                                  : phase.color === "sky"
                                  ? "bg-sky-400/20 border-sky-400 text-sky-400 shadow-sky-400/30"
                                  : phase.color === "violet"
                                  ? "bg-violet-400/20 border-violet-400 text-violet-400 shadow-violet-400/30"
                                  : phase.color === "fuchsia"
                                  ? "bg-fuchsia-400/20 border-fuchsia-400 text-fuchsia-400 shadow-fuchsia-400/30"
                                  : phase.color === "rose"
                                  ? "bg-rose-400/20 border-rose-400 text-rose-400 shadow-rose-400/30"
                                  : phase.color === "slate"
                                  ? "bg-slate-400/20 border-slate-400 text-slate-400 shadow-slate-400/30"
                                  : phase.color === "zinc"
                                  ? "bg-zinc-400/20 border-zinc-400 text-zinc-400 shadow-zinc-400/30"
                                  : phase.color === "neutral"
                                  ? "bg-neutral-400/20 border-neutral-400 text-neutral-400 shadow-neutral-400/30"
                                  : phase.color === "stone"
                                  ? "bg-stone-400/20 border-stone-400 text-stone-400 shadow-stone-400/30"
                                  : phase.color === "amber"
                                  ? "bg-amber-400/20 border-amber-400 text-amber-400 shadow-amber-400/30"
                                  : ""
                              }
                            `}
                          >
                            {phase.order}
                          </div>
                          <div className="flex gap-2">
                            <Link
                              to={`/phases/${phase.id}`}
                              className="p-2 bg-green-400/10 border border-green-400/30 hover:bg-green-400/20 hover:border-green-400/50 transition-all duration-300 rounded-lg text-green-400"
                            >
                              <EyeIcon className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => openModal(phase)}
                              className="p-2 bg-cyan-400/10 border border-cyan-400/30 hover:bg-cyan-400/20 hover:border-cyan-400/50 transition-all duration-300 rounded-lg text-cyan-400"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(phase)}
                              className="p-2 bg-red-400/10 border border-red-400/30 hover:bg-red-400/20 hover:border-red-400/50 transition-all duration-300 rounded-lg text-red-400"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-bold text-green-400 font-mono uppercase tracking-wider mb-2">
                            ◆ {phase.title}
                          </h3>
                          <p className="text-gray-300 text-sm font-mono mb-3 leading-relaxed">
                            {phase.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-xs text-green-400/60 font-mono uppercase">
                              <span className="mr-2">ICON:</span>
                              <div className="w-6 h-6 rounded bg-gradient-to-br from-gray-800/50 to-black/50 border border-green-400/30 flex items-center justify-center">
                                {(() => {
                                  const IconComponent = getIconFromName(
                                    phase.icon
                                  );
                                  return (
                                    <IconComponent className="w-3 h-3 text-green-400" />
                                  );
                                })()}
                              </div>
                            </div>
                            <div className="text-xs text-green-400/60 font-mono uppercase">
                              PHASE_{phase.order}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Enhanced Empty State */}
            {phases.length === 0 && (
              <div className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-green-400/30 rounded-xl p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/5 to-green-400/0 animate-pulse"></div>
                <div className="text-center py-12 relative z-10">
                  <div className="text-green-400 text-4xl font-mono mb-4">
                    {TERMINAL_CHARS.diamond}
                  </div>
                  <div className="text-gray-400 mb-6 font-mono">
                    {TERMINAL_CHARS.upArrow} No phases found. Create your first
                    phase to get started. {TERMINAL_CHARS.upArrow}
                  </div>
                  <button
                    onClick={() => openModal()}
                    className="bg-gradient-to-r from-green-400/10 to-green-500/10 border-2 border-green-400/30 hover:bg-gradient-to-r hover:from-green-400/20 hover:to-green-500/20 hover:border-green-400/50 transition-all duration-300 text-green-400 font-mono font-bold uppercase tracking-wider px-8 py-3 rounded-xl shadow-lg hover:shadow-green-400/20"
                  >
                    {TERMINAL_CHARS.rightArrow} CREATE FIRST PHASE
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Enhanced Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-gray-900/95 to-black/95 border-2 border-green-400/30 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-green-400/20 relative overflow-hidden">
              {/* Modal glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/5 to-green-400/0 animate-pulse"></div>

              <div className="relative z-10 p-6">
                {/* Enhanced Modal Header */}
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-green-400/20">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400/20 to-green-600/20 border border-green-400/50 flex items-center justify-center">
                      <Layers className="w-5 h-5 text-green-400" />
                    </div>
                    <h2 className="text-xl font-bold text-green-400 font-mono uppercase tracking-wider">
                      {editingPhase ? "◆ EDIT PHASE" : "◆ CREATE PHASE"}
                    </h2>
                  </div>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-red-400 transition-colors duration-300 p-2 rounded-lg hover:bg-red-400/10"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                {/* Enhanced Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-green-400 mb-2 font-mono uppercase tracking-wider"
                    >
                      ▶ Phase Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-green-400/30 rounded-xl text-green-400 font-mono focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all duration-300 placeholder-green-400/50"
                      placeholder="Enter phase title..."
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-green-400 mb-2 font-mono uppercase tracking-wider"
                    >
                      ▶ Description *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-green-400/30 rounded-xl text-green-400 font-mono focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all duration-300 placeholder-green-400/50 resize-none"
                      placeholder="Enter phase description..."
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="icon"
                      className="block text-sm font-medium text-green-400 mb-2 font-mono uppercase tracking-wider"
                    >
                      ▶ Icon *
                    </label>
                    <select
                      id="icon"
                      name="icon"
                      value={formData.icon}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-green-400/30 rounded-xl text-green-400 font-mono focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all duration-300"
                      required
                    >
                      <option value="" className="bg-gray-900 text-green-400">
                        ◆ Select an icon
                      </option>
                      {iconOptions.map((option) => (
                        <option
                          key={option.value}
                          value={option.value}
                          className="bg-gray-900 text-green-400"
                        >
                          ▸ {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="color"
                        className="block text-sm font-medium text-green-400 mb-2 font-mono uppercase tracking-wider"
                      >
                        ▶ Color *
                      </label>
                      <select
                        id="color"
                        name="color"
                        value={formData.color}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-green-400/30 rounded-xl text-green-400 font-mono focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all duration-300"
                        required
                      >
                        <option value="" className="bg-gray-900 text-green-400">
                          ◆ Select color
                        </option>
                        {colorOptions.map((color) => (
                          <option
                            key={color}
                            value={color}
                            className="bg-gray-900 text-green-400"
                          >
                            ▸ {color.charAt(0).toUpperCase() + color.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Order field - only show when editing */}
                    {editingPhase && (
                      <div>
                        <label
                          htmlFor="order"
                          className="block text-sm font-medium text-green-400 mb-2 font-mono uppercase tracking-wider"
                        >
                          ▶ Order *
                        </label>
                        <input
                          type="number"
                          id="order"
                          name="order"
                          value={formData.order}
                          onChange={handleInputChange}
                          min="1"
                          className="w-full px-4 py-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-green-400/30 rounded-xl text-green-400 font-mono focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all duration-300 placeholder-green-400/50"
                          placeholder="1"
                          required
                        />
                        <p className="text-xs text-gray-400 mt-1 font-mono">
                          ◆ Editing existing phase order. Use drag & drop for
                          reordering.
                        </p>
                      </div>
                    )}

                    {/* Auto-order notice for new phases */}
                    {!editingPhase && (
                      <div className="bg-gradient-to-r from-green-900/20 to-green-800/20 border border-green-400/30 rounded-xl p-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                          <p className="text-green-400 font-mono text-sm">
                            <span className="font-bold">◆ AUTO-ORDER:</span>{" "}
                            Order will be automatically assigned as #
                            {phases.length + 1}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Enhanced Error Message */}
                  {error && (
                    <div className="bg-gradient-to-r from-red-900/30 to-red-800/30 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm font-mono relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-400/0 via-red-400/10 to-red-400/0 animate-pulse"></div>
                      <div className="relative z-10 flex items-center">
                        <ExclamationCircleIcon className="w-4 h-4 mr-2" />
                        {error}
                      </div>
                    </div>
                  )}

                  {/* Enhanced Success Message */}
                  {success && (
                    <div className="bg-gradient-to-r from-green-900/30 to-green-800/30 border border-green-500/50 text-green-400 px-4 py-3 rounded-xl text-sm font-mono relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/10 to-green-400/0 animate-pulse"></div>
                      <div className="relative z-10 flex items-center">
                        <CheckCircleIcon className="w-4 h-4 mr-2" />
                        {success}
                      </div>
                    </div>
                  )}

                  {/* Enhanced Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-green-400/20">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 bg-gradient-to-r from-green-400/20 to-green-500/20 border-2 border-green-400/50 hover:from-green-400/30 hover:to-green-500/30 hover:border-green-400/70 transition-all duration-300 text-green-400 font-mono font-bold uppercase tracking-wider px-6 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-green-400/20 relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/20 to-green-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span className="relative z-10 flex items-center justify-center">
                        {saving ? (
                          <>
                            <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                            ◊ SAVING...
                          </>
                        ) : editingPhase ? (
                          "◆ UPDATE PHASE"
                        ) : (
                          "◆ CREATE PHASE"
                        )}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 bg-gradient-to-r from-gray-700/50 to-gray-800/50 border-2 border-gray-600/50 hover:from-gray-600/50 hover:to-gray-700/50 hover:border-gray-500/50 transition-all duration-300 text-gray-400 font-mono font-bold uppercase tracking-wider px-6 py-3 rounded-xl shadow-lg hover:shadow-gray-400/10"
                    >
                      ◄ CANCEL
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
