import { Header } from "@/components/common/Header";
import {
  AssetsTab,
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
import { getCourseById } from "@/lib/coursesData";
import { Course } from "@/lib/types";
import { ArrowLeft, Terminal } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const CourseDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;
  const { courseId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (courseId) {
      const courseData = getCourseById(courseId);
      setCourse(courseData);
      setLoading(false);
    }
  }, [courseId]);

  const handleEnrollment = () => {
    if (course?.enrolled) {
      // If already enrolled, navigate to learning page
      navigate(`/learn/${courseId}`);
    } else {
      // If not enrolled, enroll and then navigate
      // In a real app, this would make an API call to enroll
      setCourse((prev: Course | null) =>
        prev ? { ...prev, enrolled: true } : null
      );
      navigate(`/learn/${courseId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-green-400 relative flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p className="font-mono">LOADING_COURSE_DATA...</p>
        </div>
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
      </div>
    );
  }

  const lessonsCount =
    typeof course.lessons === "number" ? course.lessons : course.lessons.length;

  return (
    <div className="min-h-screen bg-black text-green-400 relative">
      <Header navigate={navigate} />

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
            enrollmentStatus={course.enrolled ? "enrolled" : "not-enrolled"}
            onEnrollment={handleEnrollment}
          />

          {/* Tabs Section */}
          <CourseTabsContainer activeTab={activeTab} onTabChange={setActiveTab}>
            <OverviewTab learningOutcomes={course.learningOutcomes} />
            <CurriculumTab curriculum={course.curriculum} />
            <LabsTab labs={course.labsData} />
            <GamesTab games={course.gamesData} />
            <AssetsTab assets={course.assetsData} />
          </CourseTabsContainer>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-green-400/20 py-8 px-6 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Terminal className="w-6 h-6 text-green-400" />
            <span className="font-bold text-green-400">CyberSec Academy</span>
          </div>
          <div className="text-green-300/60 text-sm">
            © 2024 CyberSec Academy. All rights reserved. Hack responsibly.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CourseDetailPage;
