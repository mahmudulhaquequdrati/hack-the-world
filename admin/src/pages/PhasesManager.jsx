import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { Layers } from "lucide-react";
import React, { useEffect, useState } from "react";
import { TERMINAL_CHARS } from "../lib/colorUtils";
import { phasesAPI } from "../services/api";

// Import extracted components
import { colorOptions } from "../components/phases/constants/phaseConstants";
import DeleteConfirmationModal from "../components/phases/DeleteConfirmationModal";
import usePhaseDragAndDrop from "../components/phases/hooks/usePhaseDragAndDrop";
import PhasesFormModal from "../components/phases/PhasesFormModal";
import ActionButtons from "../components/phases/ui/ActionButtons";
import PhaseCard, {
  PhaseCardMobile,
} from "../components/phases/views/PhaseCard";

const PhasesManager = () => {
  const [phases, setPhases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingPhase, setEditingPhase] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [phaseToDelete, setPhaseToDelete] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // Default to grid view
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "",
    color: "green",
    order: "",
  });

  // Drag-and-drop state
  const [hasChanges, setHasChanges] = useState(false);

  // Custom hook for drag and drop
  const {
    draggedPhase,
    dragOverPhase,
    isDragging,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
  } = usePhaseDragAndDrop(phases, setPhases, setHasChanges, setSuccess);

  useEffect(() => {
    fetchPhases();
  }, []);

  const fetchPhases = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      setError("");
      console.log("🔄 Fetching phases...");
      const response = await phasesAPI.getAll();
      console.log("✅ Phases fetched:", response.data);

      // Ensure we have a valid array
      const phasesData = Array.isArray(response.data) ? response.data : [];

      // Force state update using functional update to ensure React detects the change
      setPhases((prevPhases) => {
        console.log(
          "🔄 Updating phases state from",
          prevPhases.length,
          "to",
          phasesData.length,
          "phases"
        );
        return [...phasesData];
      });
    } catch (error) {
      console.error("❌ Error fetching phases:", error);
      setError(error.response?.data?.message || "Failed to load phases");
      setPhases([]);
    } finally {
      if (showLoader) setLoading(false);
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

      let responseData;

      if (editingPhase) {
        console.log("🔄 Updating phase:", editingPhase.id, phaseData);

        // Optimistic update for editing
        setPhases((prevPhases) =>
          prevPhases.map((phase) =>
            phase.id === editingPhase.id ? { ...phase, ...phaseData } : phase
          )
        );

        const response = await phasesAPI.update(editingPhase.id, phaseData);
        responseData = response.data;
        console.log("✅ Phase updated:", responseData);
        setSuccess("Phase updated successfully!");

        // Update with server response data
        setPhases((prevPhases) =>
          prevPhases.map((phase) =>
            phase.id === editingPhase.id ? responseData : phase
          )
        );
      } else {
        console.log("🔄 Creating new phase:", phaseData);
        const response = await phasesAPI.create(phaseData);
        responseData = response.data;
        console.log("✅ Phase created:", responseData);
        setSuccess("Phase created successfully!");

        // Optimistic add for new phase
        setPhases((prevPhases) => [...prevPhases, responseData]);
      }

      // Auto-close modal after 1.5 seconds on success
      setTimeout(() => {
        closeModal();
      }, 1500);
    } catch (error) {
      console.error("Error saving phase:", error);
      setError(
        error.response?.data?.message || error.message || "Failed to save phase"
      );

      // Rollback optimistic updates on error by refetching
      await fetchPhases(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (phase) => {
    setPhaseToDelete(phase);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!phaseToDelete) return;

    try {
      setSaving(true);
      setError("");

      console.log("🔄 Deleting phase:", phaseToDelete.id);

      // Optimistic removal - remove from UI immediately
      const phaseToDeleteId = phaseToDelete.id;
      setPhases((prevPhases) =>
        prevPhases.filter((phase) => phase.id !== phaseToDeleteId)
      );

      // Close modal immediately for better UX
      setShowDeleteModal(false);
      setPhaseToDelete(null);

      const response = await phasesAPI.delete(phaseToDeleteId);
      console.log("✅ Phase deleted:", response);

      setSuccess("Phase deleted successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("❌ Error deleting phase:", error);
      setError(error.response?.data?.message || "Failed to delete phase");

      // Rollback optimistic deletion on error by refetching
      await fetchPhases(false);

      // Clear error message after 5 seconds
      setTimeout(() => setError(""), 5000);
    } finally {
      setSaving(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setPhaseToDelete(null);
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
      await fetchPhases(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Error saving phase order:", error);
      setError("Failed to save phase order. Please try again.");

      // Refresh to restore original order on error
      await fetchPhases(false);
      setHasChanges(false);

      // Clear error message after 5 seconds
      setTimeout(() => setError(""), 5000);
    } finally {
      setSaving(false);
    }
  };

  // Reset order changes
  const resetPhaseOrder = () => {
    fetchPhases(false); // Reload original order without loader
    setHasChanges(false);
    setSuccess("");
    setError("");
  };

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

        {/* Action Buttons */}
        <ActionButtons
          viewMode={viewMode}
          setViewMode={setViewMode}
          onAddPhase={() => openModal()}
          loading={loading}
          hasChanges={hasChanges}
          onSaveOrder={savePhaseOrder}
          onResetOrder={resetPhaseOrder}
          saving={saving}
        />

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
                    <PhaseCard
                      key={phase.id}
                      phase={phase}
                      viewMode="grid"
                      draggedPhase={draggedPhase}
                      dragOverPhase={dragOverPhase}
                      isDragging={isDragging}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                      onDragOver={handleDragOver}
                      onDragEnter={handleDragEnter}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onEdit={openModal}
                      onDelete={handleDelete}
                    />
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
                      {phases.map((phase) => (
                        <PhaseCard
                          key={phase.id}
                          phase={phase}
                          viewMode="list"
                          onEdit={openModal}
                          onDelete={handleDelete}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Enhanced Mobile Cards */}
                <div className="lg:hidden space-y-4 p-4">
                  {phases.map((phase) => (
                    <PhaseCardMobile
                      key={phase.id}
                      phase={phase}
                      onEdit={openModal}
                      onDelete={handleDelete}
                    />
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
        <PhasesFormModal
          isOpen={showModal}
          onClose={closeModal}
          editingPhase={editingPhase}
          formData={formData}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          saving={saving}
          error={error}
          success={success}
          phases={phases}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          phaseToDelete={phaseToDelete}
          saving={saving}
        />
      </div>
    </div>
  );
};

export default PhasesManager;
