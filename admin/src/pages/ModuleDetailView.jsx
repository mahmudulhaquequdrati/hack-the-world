import React from "react";
import { useParams } from "react-router-dom";
import useModuleDetailManager from "../components/module-detail/hooks/useModuleDetailManager";
import ContentSectionsList from "../components/module-detail/ui/ContentSectionsList";
import ModuleHeroSection from "../components/module-detail/ui/ModuleHeroSection";
import ModuleInfoCard from "../components/module-detail/ui/ModuleInfoCard";
import ModuleStatisticsCard from "../components/module-detail/ui/ModuleStatisticsCard";
import Breadcrumb from "../components/shared/Breadcrumb";
import ErrorState from "../components/shared/ErrorState";
import LoadingState from "../components/shared/LoadingState";
import NotFoundState from "../components/shared/NotFoundState";
import QuickActionsBar from "../components/shared/QuickActionsBar";

const ModuleDetailView = () => {
  const { moduleId } = useParams();

  // Use the composite hook for all module detail functionality
  const {
    isLoading,
    error,
    data,
    module,
    phase,
    statistics,
    processedSections,
    breadcrumbs,
    actions,
    ui,
  } = useModuleDetailManager(moduleId);

  // Loading state
  if (isLoading) {
    return <LoadingState message={ui.getLoadingMessage()} />;
  }

  // Error state
  if (error.hasError) {
    return (
      <ErrorState
        error={error.message}
        title={ui.getErrorTitle()}
        onBack={actions.handleBackNavigation}
        onRetry={error.canRetry ? actions.handleRetry : undefined}
      />
    );
  }

  // Not found state
  if (data.isEmpty) {
    return (
      <NotFoundState
        title="Module Details"
        message="Module not found."
        onBack={actions.goToModules}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Module Hero Section with integrated navigation */}
      <ModuleHeroSection
        module={module}
        phase={phase}
        statistics={statistics}
        onNavigateBack={actions.goBack}
        breadcrumbs={breadcrumbs}
        showEditButton={true}
      />

      {/* Main Content Area */}
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Main Content Column */}
            <div className="lg:col-span-3 space-y-8">
              {/* Content Sections */}
              <ContentSectionsList
                processedSections={processedSections}
                totalContentCount={statistics?.totalContent || 0}
                onContentClick={actions.handleContentClick}
              />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              {/* Module Info Card */}
              <ModuleInfoCard module={module} phase={phase} />

              {/* Statistics Card */}
              <ModuleStatisticsCard statistics={statistics} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleDetailView;
