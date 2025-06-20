import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { Layers } from "lucide-react";
import React from "react";

// Import extracted components
import ActionButtons from "../components/modules/ui/ActionButtons";
import BulkOperationsModal from "../components/modules/BulkOperationsModal";
import DeleteConfirmationModal from "../components/modules/DeleteConfirmationModal";
import ModuleFormModal from "../components/modules/ModuleFormModal";
import ModuleCard from "../components/modules/views/ModuleCard";
import TerminalHeader from "../components/modules/ui/TerminalHeader";
import StatisticsGrid from "../components/modules/ui/StatisticsGrid";
import useModulesManager from "../components/modules/hooks/useModulesManager";
import { phaseColorClasses } from "../components/modules/constants/moduleConstants";

const ModulesManagerEnhanced = () => {
  const {
    // Data & Loading States
    modules,
    phases,
    loading,
    saving,
    error,
    success,
    // Filter Management
    selectedPhase,
    setSelectedPhase,
    hasModuleChanges,
    getFilteredModulesWithPhases,
    // Form Management
    formData,
    openModal,
    closeModal,
    handleSubmit,
    setFormData,
    // Modal Management
    showModal,
    showDeleteModal,
    showBulkModal,
    editingModule,
    moduleToDelete,
    bulkOperation,
    handleDelete,
    confirmDelete,
    cancelDelete,
    // Selection Management
    selectedModules,
    handleSelectAll,
    handleToggleSelection,
    handleClearSelection,
    handlePhaseSelectionToggle,
    // Bulk Operations
    bulkFormData,
    setBulkFormData,
    handleBulkOperation,
    handleBulkSubmit,
    closeBulkModal,
    bulkOperationLoading,
    // Drag & Drop
    draggedModule,
    dragOverModule,
    isDraggingModule,
    handleModuleDragStart,
    handleModuleDragEnd,
    handleModuleDragOver,
    handleModuleDragEnter,
    handleModuleDragLeave,
    handleModuleDrop,
    // Order Management
    saveModuleOrder,
    resetModuleOrder,
  } = useModulesManager();

  // All business logic is now handled by the useModulesManager hook

  // Render grouped view
  const renderGroupedView = () => (
    <div className="space-y-8">
      {getFilteredModulesWithPhases().map((phase) => {
        // Get phase color for dynamic styling
        const phaseColor = phase.color || "green";
        const colors = phaseColorClasses[phaseColor] || phaseColorClasses.green;

        return (
          <div
            key={phase._id}
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
                      onClick={() => handlePhaseSelectionToggle(phase.modules)}
                      className="text-xs px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-500 hover:to-purple-600 font-mono font-bold transition-all duration-300 shadow-lg hover:shadow-purple-400/20"
                    >
                      {phase.modules?.length > 0 && phase.modules.every((m) => selectedModules.has(m._id))
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
                        key={module._id}
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
                        saving={saving || bulkOperationLoading}
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
        <TerminalHeader />

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
          saving={saving || bulkOperationLoading}
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
        <StatisticsGrid 
          modules={modules} 
          phases={phases} 
          selectedModules={selectedModules}
        />

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
          saving={saving || bulkOperationLoading}
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