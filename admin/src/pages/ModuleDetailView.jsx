import React from "react";
import { useParams } from "react-router-dom";
import Breadcrumb from "../components/shared/Breadcrumb";
import ErrorState from "../components/shared/ErrorState";
import LoadingState from "../components/shared/LoadingState";
import NotFoundState from "../components/shared/NotFoundState";
import QuickActionsBar from "../components/shared/QuickActionsBar";
import useModuleDetailManager from "../components/module-detail/hooks/useModuleDetailManager";
import ModuleHeroSection from "../components/module-detail/ui/ModuleHeroSection";
import ModuleStatisticsCard from "../components/module-detail/ui/ModuleStatisticsCard";
import ContentSectionsList from "../components/module-detail/ui/ContentSectionsList";
import ModuleInfoCard from "../components/module-detail/ui/ModuleInfoCard";

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
    moduleStatus,
    breadcrumbs,
    actions,
    ui
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
      {/* Hero Section with Navigation */}
      <div className="relative px-6 py-8 bg-gray-900">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Breadcrumb
            onBack={actions.goBack}
            backLabel="Modules"
            items={breadcrumbs}
          />

          <QuickActionsBar
            editPath="/modules"
            editLabel="Edit"
            showDelete={false}
          />
        </div>
      </div>

      {/* Module Hero Section */}
      <ModuleHeroSection
        module={module}
        phase={phase}
        statistics={statistics}
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
              <ModuleInfoCard
                module={module}
                phase={phase}
                moduleStatus={moduleStatus}
              />

              {/* Statistics Card */}
              <ModuleStatisticsCard
                statistics={statistics}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleDetailView;
