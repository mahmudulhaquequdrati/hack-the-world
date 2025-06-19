import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import React from "react";
import { useParams } from "react-router-dom";

// Import our new components and hooks
import usePhaseDetailManager from "../components/phase-detail/hooks/usePhaseDetailManager";
import ModulesList from "../components/phase-detail/ui/ModulesList";
import PhaseHeroSection from "../components/phase-detail/ui/PhaseHeroSection";
import PhaseMetadataCard from "../components/phase-detail/ui/PhaseMetadataCard";
import PhaseStatisticsCard from "../components/phase-detail/ui/PhaseStatisticsCard";
import QuickActionsCard from "../components/phase-detail/ui/QuickActionsCard";

const PhaseDetailView = () => {
  const { phaseId } = useParams();

  // Use our composite hook for all functionality
  const { status, uiData, handlers, isLoading, hasError } =
    usePhaseDetailManager(phaseId);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mb-4"></div>
          <div className="text-green-400 font-mono">
            Loading phase details...
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (hasError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={handlers.onNavigateBack}
            className="text-green-400 hover:text-cyber-green transition-colors"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold text-cyber-green">Phase Details</h1>
        </div>
        <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded flex items-center justify-between">
          <span>{status.error}</span>
          <button
            onClick={handlers.onRetry}
            className="px-3 py-1 bg-red-600/20 border border-red-500/30 text-red-400 rounded text-sm hover:bg-red-600/30 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Empty state (no phase found)
  if (status.isEmpty) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={handlers.onNavigateBack}
            className="text-green-400 hover:text-cyber-green transition-colors"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold text-cyber-green">Phase Details</h1>
        </div>
        <div className="text-gray-400">Phase not found.</div>
      </div>
    );
  }

  // Main content when data is ready
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <PhaseHeroSection
        phase={uiData.phase}
        statistics={uiData.statistics}
        onNavigateBack={handlers.onNavigateBack}
        showEditButton={true}
      />

      {/* Main Content Area */}
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Statistics Card */}
          <PhaseStatisticsCard
            statistics={uiData.statistics}
            showDetailedStats={true}
          />

          {/* Modules List */}
          <ModulesList
            modules={uiData.modules}
            onModuleClick={handlers.onModuleClick}
            showEmptyState={true}
          />

          {/* Additional Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Phase Metadata */}
            <PhaseMetadataCard phase={uiData.phase} showAllFields={true} />

            {/* Quick Actions */}
            <QuickActionsCard
              phaseId={phaseId}
              onNavigateBack={handlers.onNavigateBack}
              quickActions={uiData.quickActions}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhaseDetailView;
