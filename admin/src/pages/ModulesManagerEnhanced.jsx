import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { BookOpen, Layers } from "lucide-react";
import React, { useEffect, useState } from "react";
import { modulesAPI, phasesAPI } from "../services/api";

// Import extracted components
import ActionButtons from "../components/modules/ui/ActionButtons";
import BulkOperationsModal from "../components/modules/BulkOperationsModal";
import DeleteConfirmationModal from "../components/modules/DeleteConfirmationModal";
import ModuleFormModal from "../components/modules/ModuleFormModal";
import ModuleCard from "../components/modules/views/ModuleCard";
import useModuleDragAndDrop from "../components/modules/hooks/useModuleDragAndDrop";
import {
  colorOptions,
  difficultyLevels,
  phaseColorClasses,
} from "../components/modules/constants/moduleConstants";

const ModulesManagerEnhanced = () => {
  // Core data state
  const [modules, setModules] = useState([]);
  const [phases, setPhases] = useState([]);
  const [modulesWithPhases, setModulesWithPhases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState(null);

  // Filter state
  const [selectedPhase, setSelectedPhase] = useState("");

  // Bulk operations state
  const [selectedModules, setSelectedModules] = useState(new Set());
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkOperation, setBulkOperation] = useState("");
  const [bulkFormData, setBulkFormData] = useState({
    phaseId: "",
    difficulty: "",
    isActive: true,
    color: "",
  });

  // Form state
  const [formData, setFormData] = useState({
    phaseId: "",
    title: "",
    description: "",
    icon: "",
    difficulty: "",
    color: "green",
    topics: "",
    prerequisites: "",
    learningOutcomes: "",
    isActive: true,
  });

  // Drag-and-drop state
  const [hasModuleChanges, setHasModuleChanges] = useState(false);

  // Custom hook for drag and drop
  const {
    draggedModule,
    dragOverModule,
    isDraggingModule,
    handleModuleDragStart,
    handleModuleDragEnd,
    handleModuleDragOver,
    handleModuleDragEnter,
    handleModuleDragLeave,
    handleModuleDrop,
  } = useModuleDragAndDrop(
    modulesWithPhases,
    setModulesWithPhases,
    setHasModuleChanges,
    setSuccess
  );

  // Initialize data
  useEffect(() => {
    fetchData();
  }, []);

  // Data fetching functions
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

  // Form handlers

  const openModal = (module = null) => {
    setError("");
    setSuccess("");
    if (module) {
      setEditingModule(module);

      // Normalize color value from database
      let colorValue = module.color || "green";
      if (typeof colorValue === "string") {
        colorValue = colorValue.trim();
        // If invalid color name, use default
        if (!colorOptions.includes(colorValue)) {
          colorValue = "green";
        }
      }

      setFormData({
        phaseId: module.phaseId || "",
        title: module.title || "",
        description: module.description || "",
        icon: module.icon || "",
        difficulty: module.difficulty || "",
        color: colorValue,
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
        color: "green",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      // Normalize and validate color value
      let colorValue = formData.color?.trim() || "green";

      // Validate color is a valid Tailwind color name
      if (!colorOptions.includes(colorValue)) {
        console.warn("Invalid color name detected, using default:", colorValue);
        colorValue = "green";
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

      // Auto-calculate order for new modules
      if (!editingModule) {
        // For new modules, find max order in the selected phase and add 1
        const phaseModules = modules.filter(
          (m) => m.phaseId === formData.phaseId
        );
        const maxOrder =
          phaseModules.length > 0
            ? Math.max(...phaseModules.map((m) => m.order || 0))
            : 0;
        moduleData.order = maxOrder + 1;
      } else {
        // For editing, keep existing order
        moduleData.order = editingModule.order;
      }

      // Validate required fields
      if (!moduleData.phaseId || !moduleData.title || !moduleData.description) {
        throw new Error("Phase, title, and description are required");
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

  // Delete handlers
  const handleDelete = (module) => {
    setModuleToDelete(module);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!moduleToDelete) return;

    try {
      setSaving(true);
      setError("");

      console.log("Deleting module:", moduleToDelete.id);
      const response = await modulesAPI.delete(moduleToDelete.id);
      console.log("Delete response:", response);

      setSuccess("Module deleted successfully!");
      setShowDeleteModal(false);
      setModuleToDelete(null);
      await fetchData();
    } catch (error) {
      console.error("Error deleting module:", error);
      setError("Failed to delete module");
    } finally {
      setSaving(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setModuleToDelete(null);
  };

  // Module order handlers
  const saveModuleOrder = async () => {
    try {
      setSaving(true);
      setError("");

      // Prepare module orders for batch update (same pattern as phases)
      const moduleOrders = [];

      modulesWithPhases.forEach((phase) => {
        phase.modules.forEach((module) => {
          moduleOrders.push({
            id: module.id,
            order: module.order,
          });
        });
      });

      // Send batch update to backend (similar to phases API)
      const response = await modulesAPI.batchUpdateOrder({ moduleOrders });

      setSuccess("Module order saved successfully!");
      setHasModuleChanges(false);

      // Use the response data instead of fetching fresh data to avoid race condition
      if (response.data && Array.isArray(response.data)) {
        // Group the updated modules by phase
        const phaseMap = new Map();

        // Initialize phase map with current phases
        modulesWithPhases.forEach((phase) => {
          phaseMap.set(phase.id, {
            ...phase,
            modules: [],
          });
        });

        // Add modules to their respective phases
        response.data.forEach((module) => {
          const phaseId =
            module.phaseId || module.phase?._id || module.phase?.id;
          if (phaseId && phaseMap.has(phaseId)) {
            phaseMap.get(phaseId).modules.push(module);
          }
        });

        // Convert map back to array and sort modules by order
        const updatedModulesWithPhases = Array.from(phaseMap.values()).map(
          (phase) => ({
            ...phase,
            modules: phase.modules.sort((a, b) => a.order - b.order),
          })
        );

        setModulesWithPhases(updatedModulesWithPhases);

        // Also update the modules state for consistency
        setModules(response.data);
      } else {
        // Fallback to fetching fresh data with a small delay
        setTimeout(async () => {
          await fetchData();
        }, 500);
      }
    } catch (error) {
      console.error("Error saving module order:", error);
      setError("Failed to save module order");
    } finally {
      setSaving(false);
    }
  };

  const resetModuleOrder = () => {
    fetchData(); // Reload original order
    setHasModuleChanges(false);
    setSuccess("");
    setError("");
  };

  // Selection handlers
  const handleSelectAll = () => {
    if (selectedModules.size === modules.length) {
      setSelectedModules(new Set());
    } else {
      setSelectedModules(new Set(modules.map((m) => m.id)));
    }
  };

  const handleToggleSelection = (moduleId) => {
    const newSelected = new Set(selectedModules);
    if (newSelected.has(moduleId)) {
      newSelected.delete(moduleId);
    } else {
      newSelected.add(moduleId);
    }
    setSelectedModules(newSelected);
  };

  const handleClearSelection = () => {
    setSelectedModules(new Set());
  };

  // Bulk operations handlers
  const handleBulkOperation = (operation) => {
    setBulkOperation(operation);
    setShowBulkModal(true);
    setError("");
    setSuccess("");
  };

  const handleBulkSubmit = async () => {
    if (selectedModules.size === 0) {
      setError("Please select modules to update");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const moduleIds = Array.from(selectedModules);
      const updateData = {};

      // Prepare update data based on operation
      if (bulkOperation === "updatePhase" && bulkFormData.phaseId) {
        updateData.phaseId = bulkFormData.phaseId;
      }
      if (bulkOperation === "updateDifficulty" && bulkFormData.difficulty) {
        updateData.difficulty = bulkFormData.difficulty;
      }
      if (bulkOperation === "updateStatus") {
        updateData.isActive = bulkFormData.isActive;
      }
      if (bulkOperation === "updateColor" && bulkFormData.color) {
        updateData.color = bulkFormData.color;
      }

      // Execute bulk update
      const updatePromises = moduleIds.map((moduleId) =>
        modulesAPI.update(moduleId, updateData)
      );

      await Promise.all(updatePromises);

      setSuccess(`Successfully updated ${moduleIds.length} modules`);
      setShowBulkModal(false);
      setSelectedModules(new Set());
      setBulkFormData({
        phaseId: "",
        difficulty: "",
        isActive: true,
        color: "",
      });
      await fetchData();
    } catch (error) {
      console.error("Error in bulk update:", error);
      setError("Failed to update modules");
    } finally {
      setSaving(false);
    }
  };

  const closeBulkModal = () => {
    setShowBulkModal(false);
    setBulkOperation("");
    setBulkFormData({
      phaseId: "",
      difficulty: "",
      isActive: true,
      color: "",
    });
    setError("");
    setSuccess("");
  };

  // Render grouped view
  const renderGroupedView = () => (
    <div className="space-y-8">
      {modulesWithPhases.map((phase) => {
        // Get phase color for dynamic styling
        const phaseColor = phase.color || "green";
        const colors = phaseColorClasses[phaseColor] || phaseColorClasses.green;

        return (
          <div
            key={phase.id}
            className={`${colors.container} rounded-xl p-6 relative overflow-hidden group transition-all duration-300`}
          >
            {/* Phase container glow effect */}
            <div
              className={`absolute inset-0 ${colors.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
            ></div>

            <div className="relative z-10">
              <div
                className={`flex items-center justify-between mb-6 pb-4 border-b ${colors.border}`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-lg ${colors.icon} flex items-center justify-center animate-pulse`}
                  >
                    <Layers className="w-5 h-5" />
                  </div>
                  <h3
                    className={`text-xl font-bold ${colors.title} font-mono uppercase tracking-wider`}
                  >
                    ▼ {phase.title} ▼
                  </h3>
                  <div
                    className={`px-3 py-1 ${colors.badge} rounded-full text-xs font-mono font-bold`}
                  >
                    {phase.modules?.length || 0} MODULES
                  </div>
                </div>
                {phase.modules?.length > 0 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const phaseModuleIds = phase.modules.map((m) => m.id);
                        const allSelected = phaseModuleIds.every((id) =>
                          selectedModules.has(id)
                        );
                        const newSelected = new Set(selectedModules);

                        if (allSelected) {
                          phaseModuleIds.forEach((id) =>
                            newSelected.delete(id)
                          );
                        } else {
                          phaseModuleIds.forEach((id) => newSelected.add(id));
                        }
                        setSelectedModules(newSelected);
                      }}
                      className="text-xs px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-500 hover:to-purple-600 font-mono font-bold transition-all duration-300 shadow-lg hover:shadow-purple-400/20"
                    >
                      {phase.modules.every((m) => selectedModules.has(m.id))
                        ? "◄ DESELECT PHASE"
                        : "► SELECT PHASE"}
                    </button>
                  </div>
                )}
              </div>
              {phase.modules && phase.modules.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {phase.modules
                    .sort((a, b) => a.order - b.order)
                    .map((module) => (
                      <ModuleCard
                        key={module.id}
                        module={module}
                        draggedModule={draggedModule}
                        dragOverModule={dragOverModule}
                        isDraggingModule={isDraggingModule}
                        selectedModules={selectedModules}
                        onDragStart={handleModuleDragStart}
                        onDragEnd={handleModuleDragEnd}
                        onDragOver={handleModuleDragOver}
                        onDragEnter={handleModuleDragEnter}
                        onDragLeave={handleModuleDragLeave}
                        onDrop={handleModuleDrop}
                        onEdit={openModal}
                        onDelete={handleDelete}
                        onToggleSelection={handleToggleSelection}
                        saving={saving}
                      />
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-blue-400 text-2xl font-mono mb-2">◆</div>
                  <p className="text-gray-400 font-mono">
                    No modules found in this phase
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  // Main render
  return (
    <div className="min-h-screen bg-black text-green-400">
      <div className="max-w-7xl mx-auto py-10 space-y-6 px-4">
        {/* Enhanced Terminal Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400/20 to-green-600/20 border-2 border-green-400/50 flex items-center justify-center animate-pulse">
              <BookOpen className="w-6 h-6 text-green-400" />
            </div>
            <h2 className="text-4xl font-bold text-green-400 font-mono uppercase tracking-wider relative">
              <span className="relative z-10">MODULES_MANAGEMENT</span>
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
                <span className="text-blue-400">~/modules</span>
                <span className="text-green-400">
                  $ ./manage --advanced-operations --bulk-actions --enhanced
                </span>
                <span className="animate-ping text-green-400">█</span>
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <ActionButtons
          onAddModule={() => openModal()}
          loading={loading}
          selectedPhase={selectedPhase}
          setSelectedPhase={setSelectedPhase}
          phases={phases}
          selectedModules={selectedModules}
          modules={modules}
          onSelectAll={handleSelectAll}
          hasModuleChanges={hasModuleChanges}
          onSaveModuleOrder={saveModuleOrder}
          onResetModuleOrder={resetModuleOrder}
          saving={saving}
          onBulkOperation={handleBulkOperation}
          onClearSelection={handleClearSelection}
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

        {/* Enhanced Statistics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-green-900/30 to-black/80 border border-green-400/30 rounded-xl p-4 relative overflow-hidden group hover:border-green-400/50 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/10 to-green-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 text-center">
              <div className="text-3xl font-bold text-green-400 font-mono mb-1">
                {modules.length}
              </div>
              <div className="text-xs text-green-400/60 font-mono uppercase tracking-wider">
                ◆ TOTAL MODULES
              </div>
              <div className="w-full bg-green-400/20 h-1 rounded-full mt-2"></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-900/30 to-black/80 border border-blue-400/30 rounded-xl p-4 relative overflow-hidden group hover:border-blue-400/50 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/10 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 text-center">
              <div className="text-3xl font-bold text-blue-400 font-mono mb-1">
                {phases.length}
              </div>
              <div className="text-xs text-blue-400/60 font-mono uppercase tracking-wider">
                ◆ TOTAL PHASES
              </div>
              <div className="w-full bg-blue-400/20 h-1 rounded-full mt-2"></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/30 to-black/80 border border-purple-400/30 rounded-xl p-4 relative overflow-hidden group hover:border-purple-400/50 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-purple-400/10 to-purple-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 text-center">
              <div className="text-3xl font-bold text-purple-400 font-mono mb-1">
                {selectedModules.size}
              </div>
              <div className="text-xs text-purple-400/60 font-mono uppercase tracking-wider">
                ◆ SELECTED
              </div>
              <div className="w-full bg-purple-400/20 h-1 rounded-full mt-2"></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-900/30 to-black/80 border border-cyan-400/30 rounded-xl p-4 relative overflow-hidden group hover:border-cyan-400/50 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/10 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 text-center">
              <div className="text-3xl font-bold text-cyan-400 font-mono mb-1">
                {modules.filter((m) => m.isActive).length}
              </div>
              <div className="text-xs text-cyan-400/60 font-mono uppercase tracking-wider">
                ◆ ACTIVE
              </div>
              <div className="w-full bg-cyan-400/20 h-1 rounded-full mt-2"></div>
            </div>
          </div>
        </div>

        {/* Content Display */}
        {loading ? (
          <div className="text-center text-green-400 py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
            <p className="mt-2 font-mono">Loading modules...</p>
          </div>
        ) : (
          <div>{renderGroupedView()}</div>
        )}

        {/* Form Modal */}
        <ModuleFormModal
          isOpen={showModal}
          onClose={closeModal}
          editingModule={editingModule}
          formData={formData}
          setFormData={setFormData}
          phases={phases}
          onSubmit={handleSubmit}
          saving={saving}
          error={error}
          success={success}
        />

        {/* Bulk Operations Modal */}
        <BulkOperationsModal
          isOpen={showBulkModal}
          onClose={closeBulkModal}
          selectedModules={selectedModules}
          bulkOperation={bulkOperation}
          bulkFormData={bulkFormData}
          setBulkFormData={setBulkFormData}
          phases={phases}
          onSubmit={handleBulkSubmit}
          saving={saving}
          error={error}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          moduleToDelete={moduleToDelete}
          saving={saving}
        />
      </div>
    </div>
  );
};

export default ModulesManagerEnhanced;
