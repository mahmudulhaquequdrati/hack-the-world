import React from "react";
import { useParams } from "react-router-dom";
import useContentDetailManager from "../components/content-detail/hooks/useContentDetailManager";
import ContentHeroSection from "../components/content-detail/ui/ContentHeroSection";
import ContentInfoCard from "../components/content-detail/ui/ContentInfoCard";
import ContentResourcesList from "../components/content-detail/ui/ContentResourcesList";
import ErrorState from "../components/shared/ErrorState";
import LoadingState from "../components/shared/LoadingState";
import NotFoundState from "../components/shared/NotFoundState";

const ContentDetailView = () => {
  const { contentId } = useParams();

  // Use the composite hook for all content detail functionality
  const {
    isLoading,
    error,
    data,
    content,
    module,
    processedResources,
    metadataBreakdown,
    outcomesBreakdown,
    breadcrumbs,
    actions,
    ui,
  } = useContentDetailManager(contentId);

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
        title="Content Details"
        message="Content not found."
        onBack={actions.goToContent}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Content Hero Section with integrated navigation */}
      <ContentHeroSection
        content={content}
        module={module}
        onNavigateBack={actions.handleBackNavigation}
        onContentUrlClick={actions.handleContentUrlClick}
        breadcrumbs={breadcrumbs}
        showEditButton={true}
      />

      {/* Main Content Area */}
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Main Content Column */}
            <div className="lg:col-span-3 space-y-8">
              {/* Content Resources and Instructions */}
              <ContentResourcesList
                content={content}
                processedResources={processedResources}
                metadataBreakdown={metadataBreakdown}
                outcomesBreakdown={outcomesBreakdown}
              />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              {/* Content Info Card */}
              <ContentInfoCard content={content} module={module} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentDetailView;
