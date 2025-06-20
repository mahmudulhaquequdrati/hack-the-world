import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import { TERMINAL_CHARS } from "../lib/colorUtils";

// Import extracted components
import DeleteConfirmationModal from "../components/phases/DeleteConfirmationModal";
import usePhasesManager from "../components/phases/hooks/usePhasesManager";
import PhasesFormModal from "../components/phases/PhasesFormModal";
import ActionButtons from "../components/phases/ui/ActionButtons";
import TerminalHeader from "../components/phases/ui/TerminalHeader";
import PhaseCard, {
  PhaseCardMobile,
} from "../components/phases/views/PhaseCard";
import { sortPhasesByOrder } from "../components/phases/utils/phaseUtils";

const PhasesManager = () => {
  const {
    // Data & Loading States
    phases,
    loading,
    saving,
    error,
    success,
    // View Management
    viewMode,
    setViewMode,
    hasChanges,
    // Form Management
    formData,
    handleInputChange,
    openModal,
    closeModal,
    handleSubmit,
    // Modal Management
    showModal,
    showDeleteModal,
    editingPhase,
    phaseToDelete,
    handleDelete,
    confirmDelete,
    cancelDelete,
    // Drag & Drop
    draggedPhase,
    dragOverPhase,
    isDragging,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    // Order Management
    savePhaseOrder,
    resetPhaseOrder,
  } = usePhasesManager();

  // All business logic is now handled by the usePhasesManager hook

  return (
    <div className="min-h-screen bg-black text-green-400">
      <div className="max-w-7xl mx-auto py-10 space-y-6 px-4">
        {/* Enhanced Terminal Header */}
        <TerminalHeader />

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
                {sortPhasesByOrder(phases)
                  .map((phase) => (
                    <PhaseCard
                      key={phase._id}
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
                          key={phase._id}
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
                      key={phase._id}
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
