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
import { Course } from "@/lib/types";
import { ArrowLeft, Shield, Terminal } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const CourseDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;
  const { courseId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [enrollmentStatus, setEnrollmentStatus] = useState("not-enrolled");

  // Sample course data - in real app this would come from API
  const sampleCourse: Course = {
    id: courseId || "foundations",
    title: "Cybersecurity Fundamentals",
    description:
      "Essential concepts, terminology, and security principles that form the backbone of cybersecurity knowledge.",
    category: "Fundamentals",
    difficulty: "Beginner",
    duration: "2-3 weeks",
    icon: Shield,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
    borderColor: "border-blue-400/30",
    enrolled: false,
    progress: 85,
    lessons: 15,
    labs: 5,
    games: 3,
    assets: 12,
    rating: 4.9,
    students: 8420,
    price: "Free",
    skills: [
      "CIA Triad",
      "Risk Assessment",
      "Compliance",
      "Security Frameworks",
    ],
    prerequisites: "None - Perfect for beginners",
    certification: true,
    instructor: {
      name: "Dr. Sarah Chen",
      title: "Chief Security Officer",
      avatar:
        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150",
      experience: "15+ years in cybersecurity",
    },
    curriculum: [
      {
        title: "Introduction to Cybersecurity",
        lessons: 4,
        duration: "1h 30min",
        topics: [
          "What is Cybersecurity",
          "Threat Landscape",
          "Security Principles",
          "CIA Triad",
        ],
        completed: true,
      },
      {
        title: "Risk Management",
        lessons: 3,
        duration: "1h 15min",
        topics: ["Risk Assessment", "Risk Analysis", "Risk Mitigation"],
        completed: true,
      },
      {
        title: "Security Frameworks",
        lessons: 4,
        duration: "2h",
        topics: ["NIST Framework", "ISO 27001", "COBIT", "SOX Compliance"],
        completed: false,
      },
    ],
    learningOutcomes: [
      {
        title: "Understand core cybersecurity principles",
        description:
          "Master the fundamental concepts of information security including the CIA triad, defense in depth strategies, and basic security principles.",
        skills: ["CIA Triad", "Security Principles", "Defense in Depth"],
      },
      {
        title: "Implement risk assessment methodologies",
        description:
          "Learn to identify, analyze, and evaluate security risks using industry-standard frameworks and methodologies.",
        skills: ["Risk Assessment", "Risk Analysis", "Risk Mitigation"],
      },
      {
        title: "Apply security frameworks effectively",
        description:
          "Gain practical experience with major security frameworks including NIST, ISO 27001, and COBIT.",
        skills: ["NIST Framework", "ISO 27001", "COBIT"],
      },
    ],
    labsData: [
      {
        name: "Risk Assessment Simulation",
        description: "Hands-on risk assessment of a fictional company",
        difficulty: "Beginner",
        duration: "45 min",
        skills: ["Risk Analysis", "Documentation"],
      },
      {
        name: "Policy Development Workshop",
        description: "Create security policies for different scenarios",
        difficulty: "Beginner",
        duration: "60 min",
        skills: ["Policy Writing", "Compliance"],
      },
    ],
    gamesData: [
      {
        name: "Security Policy Builder",
        description: "Interactive game to build security policies",
        points: 100,
        type: "Strategy",
      },
      {
        name: "Risk Matrix Challenge",
        description: "Calculate and prioritize security risks",
        points: 150,
        type: "Puzzle",
      },
    ],
    assetsData: [
      { name: "CIA Triad Reference Guide", type: "PDF", size: "2.1 MB" },
      { name: "Risk Assessment Template", type: "Excel", size: "1.5 MB" },
      { name: "NIST Framework Checklist", type: "PDF", size: "850 KB" },
    ],
    enrollPath: "/learn/foundations",
  };

  const handleEnrollment = () => {
    if (enrollmentStatus === "not-enrolled") {
      setEnrollmentStatus("enrolled");
      navigate(`/learn/${courseId}`);
    } else {
      navigate(`/learn/${courseId}`);
    }
  };

  const lessonsCount =
    typeof sampleCourse.lessons === "number"
      ? sampleCourse.lessons
      : sampleCourse.lessons.length;

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
              <CourseHero course={sampleCourse} />
              <CourseFeatures
                lessons={lessonsCount}
                labs={sampleCourse.labs}
                games={sampleCourse.games}
              />
            </div>

            {/* Sidebar */}
            <CourseInfoSidebar course={sampleCourse} />
          </div>

          {/* Enrollment Button */}
          <EnrollmentButton
            enrollmentStatus={enrollmentStatus}
            onEnrollment={handleEnrollment}
          />

          {/* Tabs Section */}
          <CourseTabsContainer activeTab={activeTab} onTabChange={setActiveTab}>
            <OverviewTab learningOutcomes={sampleCourse.learningOutcomes} />
            <CurriculumTab curriculum={sampleCourse.curriculum} />
            <LabsTab
              labs={sampleCourse.labsData}
              enrollmentStatus={enrollmentStatus}
              onEnrollment={handleEnrollment}
            />
            <GamesTab
              games={sampleCourse.gamesData}
              enrollmentStatus={enrollmentStatus}
              onEnrollment={handleEnrollment}
            />
            <AssetsTab assets={sampleCourse.assetsData} />
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
