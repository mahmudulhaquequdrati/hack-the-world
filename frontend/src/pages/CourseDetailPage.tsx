import DataSourceIndicator from "@/components/common/DataSourceIndicator";
import {
  CourseFeatures,
  CourseHero,
  CourseInfoSidebar,
  CourseTabsContainer,
  CurriculumTab,
  EnrollmentButton,
  GamesTab,
  LabsTab,
  OverviewTab,
} from "@/components/course";
import { Button } from "@/components/ui/button";
import {
  useEnrollInModuleMutation,
  useGetCourseByIdQuery,
  useGetEnrollmentByModuleQuery,
  useGetModuleOverviewQuery,
} from "@/features/api/apiSlice";
import { useAuthRTK } from "@/hooks/useAuthRTK";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const CourseDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;
  const { courseId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const { isAuthenticated } = useAuthRTK();

  // OPTIMIZED: Could use consolidated endpoint (requires backend support)
  // TODO: Replace with single consolidated call:
  // const { data: courseDetailData, isLoading: loading, error: courseError, refetch } = 
  //   useGetCourseDetailCompleteQuery({ 
  //     courseId: courseId || "", 
  //     includeOverview: activeTab !== "overview" 
  //   }, { skip: !courseId });

  // CURRENT: Optimized pattern - separate core data from conditional data
  const {
    data: course,
    isLoading: loading,
    error: courseError,
    refetch,
  } = useGetCourseByIdQuery(courseId || "", {
    skip: !courseId,
  });

  // Check enrollment status only if user is authenticated  
  const {
    data: enrollmentData,
    isLoading: isLoadingEnrollment,
    refetch: refetchEnrollment,
  } = useGetEnrollmentByModuleQuery(courseId || "", {
    skip: !courseId || !isAuthenticated,
  });

  // Get module overview data conditionally - smart loading based on UI state
  const {
    data: moduleOverview,
    isLoading: isLoadingOverview,
    error: overviewError,
  } = useGetModuleOverviewQuery(courseId || "", {
    skip: !courseId || activeTab === "overview", // Only load when needed
  });

  const [enrollInModule] = useEnrollInModuleMutation();

  const error = courseError
    ? "Failed to load course data. Please try again later."
    : null;

  // Determine enrollment status
  const isEnrolled = enrollmentData?.success && enrollmentData?.data !== null;
  const enrollmentStatus = isEnrolled ? "enrolled" : "not-enrolled";

  const handleEnrollment = async (): Promise<void> => {
    if (!course || !courseId) {
      return;
    }

    try {
      if (isEnrolled) {
        // If already enrolled, navigate to learning page
        navigate(`/learn/${courseId}`);
      } else {
        // If not enrolled, enroll and then navigate
        const result = await enrollInModule(courseId).unwrap();
        if (result.success) {
          navigate(`/learn/${courseId}`);
          // Refetch course data and enrollment status to update UI
          refetch();
          refetchEnrollment();
        }
      }
    } catch (err) {
      console.error("Enrollment failed:", err);
      // Error handling is now done in EnrollmentButton component
      throw err; // Re-throw to let EnrollmentButton handle the error display
    }
  };

  const handleRetry = () => {
    refetch();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-green-400 relative flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p className="font-mono">LOADING_COURSE_DATA...</p>
        </div>
        <DataSourceIndicator className="fixed bottom-4 right-4" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-green-400 relative flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-red-400 text-xl font-mono">ERROR</div>
          <div className="text-green-300 max-w-md">{error}</div>
          <button
            onClick={handleRetry}
            className="bg-green-500/20 border border-green-500 text-green-400 px-6 py-2 rounded font-mono hover:bg-green-500/30 transition-colors"
          >
            RETRY
          </button>
        </div>
        <DataSourceIndicator className="fixed bottom-4 right-4" showRefresh />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-black text-green-400 relative flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold font-mono mb-4">
            COURSE_NOT_FOUND
          </h1>
          <p className="font-mono mb-6">
            The requested course could not be found.
          </p>
          <Button
            onClick={() => navigate("/overview")}
            className="bg-green-400 text-black hover:bg-green-300 font-mono"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            BACK_TO_OVERVIEW
          </Button>
        </div>
        <DataSourceIndicator className="fixed bottom-4 right-4" showRefresh />
      </div>
    );
  }

  const lessonsCount = typeof course.lessons === "number" ? course.lessons : 0;

  return (
    <div className="min-h-screen bg-black text-green-400 relative">
      <div className="pb-20 pt-5 px-6">
        <div className="w-full px-4 mx-auto">
          <div className="flex items-center gap-4">
            {from === "dashboard" ? (
              <Button
                variant="ghost"
                onClick={() => navigate("/dashboard")}
                className="mb-4 text-green-400 hover:bg-green-400/10 text-sm !px-0"
              >
                <ArrowLeft className="w-4 h-4" />
                DASHBOARD
              </Button>
            ) : (
              <Button
                variant="ghost"
                onClick={() => navigate("/overview")}
                className="mb-4 text-green-400 hover:bg-green-400/10 text-sm !px-0"
              >
                <ArrowLeft className="w-4 h-4" />
                BACK_TO_OVERVIEW
              </Button>
            )}
          </div>

          {/* Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Main Course Info */}
            <div className="lg:col-span-2">
              <CourseHero course={course} />
              <CourseFeatures
                lessons={lessonsCount}
                labs={course.labs}
                games={course.games}
              />
            </div>

            {/* Sidebar */}
            <CourseInfoSidebar course={course} />
          </div>

          {/* Enrollment Button */}
          <EnrollmentButton
            enrollmentStatus={enrollmentStatus}
            onEnrollment={handleEnrollment}
            isLoadingEnrollment={isLoadingEnrollment}
            prerequisites={course.prerequisites ? [course.prerequisites] : []}
            moduleId={courseId}
          />

          {/* Tabs Section */}
          <CourseTabsContainer activeTab={activeTab} onTabChange={setActiveTab}>
            <OverviewTab learningOutcomes={course.learningOutcomes} />
            <CurriculumTab moduleOverview={moduleOverview} />
            <LabsTab
              moduleOverview={moduleOverview}
              isLoadingOverview={isLoadingOverview}
              overviewError={overviewError}
            />
            <GamesTab
              moduleOverview={moduleOverview}
              isLoadingOverview={isLoadingOverview}
              overviewError={overviewError}
            />
          </CourseTabsContainer>

          {/* Data Source Indicator */}
          <DataSourceIndicator className="fixed bottom-4 right-4" showRefresh />
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
