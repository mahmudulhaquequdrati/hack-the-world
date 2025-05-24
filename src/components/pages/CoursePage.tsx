import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Code,
  FileText,
  Lock,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Terminal,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CoursePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [currentLesson, setCurrentLesson] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<boolean[]>([]);

  const courseData = {
    "linux-fundamentals": {
      title: "Linux Fundamentals",
      description: "Master command-line operations and system administration",
      difficulty: "Beginner",
      duration: "4 hours",
      lessons: [
        {
          id: 1,
          title: "Introduction to Linux",
          type: "video",
          duration: "15 min",
          content:
            "Learn about Linux history, distributions, and basic concepts.",
        },
        {
          id: 2,
          title: "File System Navigation",
          type: "interactive",
          duration: "20 min",
          content:
            "Practice navigating the Linux file system using cd, ls, and pwd commands.",
        },
        {
          id: 3,
          title: "File Operations",
          type: "hands-on",
          duration: "25 min",
          content:
            "Learn to create, copy, move, and delete files and directories.",
        },
        {
          id: 4,
          title: "Text Processing",
          type: "video",
          duration: "18 min",
          content: "Master text processing tools like grep, sed, and awk.",
        },
        {
          id: 5,
          title: "Process Management",
          type: "interactive",
          duration: "22 min",
          content: "Understand processes, jobs, and system monitoring.",
        },
      ],
    },
    "web-security": {
      title: "Web Application Security",
      description: "Learn to find and exploit web vulnerabilities",
      difficulty: "Intermediate",
      duration: "8 hours",
      lessons: [
        {
          id: 1,
          title: "Web Security Fundamentals",
          type: "video",
          duration: "30 min",
          content:
            "Introduction to web application security concepts and threat landscape.",
        },
        {
          id: 2,
          title: "SQL Injection",
          type: "hands-on",
          duration: "45 min",
          content:
            "Learn to identify and exploit SQL injection vulnerabilities.",
        },
        {
          id: 3,
          title: "Cross-Site Scripting (XSS)",
          type: "interactive",
          duration: "40 min",
          content:
            "Understand different types of XSS attacks and prevention methods.",
        },
        {
          id: 4,
          title: "Authentication Bypass",
          type: "hands-on",
          duration: "35 min",
          content: "Techniques for bypassing authentication mechanisms.",
        },
        {
          id: 5,
          title: "Security Testing Tools",
          type: "video",
          duration: "25 min",
          content:
            "Overview of popular web security testing tools and frameworks.",
        },
      ],
    },
  };

  const course = courseData[courseId as keyof typeof courseData];

  if (!course) {
    return (
      <div className="min-h-screen bg-black text-green-400 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
          <Button onClick={() => navigate("/dashboard")}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const currentLessonData = course.lessons[currentLesson];
  const progress =
    (completedLessons.filter(Boolean).length / course.lessons.length) * 100;

  const markLessonComplete = () => {
    const newCompleted = [...completedLessons];
    newCompleted[currentLesson] = true;
    setCompletedLessons(newCompleted);

    if (currentLesson < course.lessons.length - 1) {
      setCurrentLesson(currentLesson + 1);
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "video":
        return Play;
      case "interactive":
        return Terminal;
      case "hands-on":
        return Code;
      default:
        return FileText;
    }
  };

  const renderLessonContent = () => {
    switch (currentLessonData.type) {
      case "video":
        return (
          <div className="space-y-4">
            <div className="bg-black rounded-lg aspect-video flex items-center justify-center border border-green-400/30">
              <div className="text-center">
                <Play className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <p className="text-green-300">Video Player</p>
                <p className="text-green-300/60 text-sm">
                  Duration: {currentLessonData.duration}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                className="border-green-400/30"
              >
                <SkipBack className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                className="bg-green-400 text-black hover:bg-green-300"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-green-400/30"
              >
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>
          </div>
        );

      case "interactive":
        return (
          <div className="space-y-4">
            <div className="bg-black rounded-lg p-6 border border-green-400/30">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-green-400">
                  Interactive Exercise
                </h3>
                <p className="text-green-300">{currentLessonData.content}</p>

                <div className="bg-green-900/20 border border-green-400/30 rounded p-4">
                  <div className="font-mono text-sm">
                    <div className="text-green-400">$ ls -la</div>
                    <div className="text-green-300">total 24</div>
                    <div className="text-green-300">
                      drwxr-xr-x 3 user user 4096 Dec 15 10:30 .
                    </div>
                    <div className="text-green-300">
                      drwxr-xr-x 5 user user 4096 Dec 15 10:25 ..
                    </div>
                    <div className="text-green-300">
                      -rw-r--r-- 1 user user 220 Dec 15 10:25 .bash_logout
                    </div>
                    <div className="text-green-400">
                      $ <span className="terminal-cursor">|</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-green-400 text-black hover:bg-green-300">
                  Start Interactive Exercise
                </Button>
              </div>
            </div>
          </div>
        );

      case "hands-on":
        return (
          <div className="space-y-4">
            <div className="bg-black rounded-lg p-6 border border-green-400/30">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-green-400">
                  Hands-On Lab
                </h3>
                <p className="text-green-300">{currentLessonData.content}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-900/20 border border-green-400/30 rounded p-4">
                    <h4 className="font-bold text-green-400 mb-2">
                      Objectives:
                    </h4>
                    <ul className="text-green-300 text-sm space-y-1">
                      <li>• Complete the assigned tasks</li>
                      <li>• Document your findings</li>
                      <li>• Submit your results</li>
                    </ul>
                  </div>

                  <div className="bg-blue-900/20 border border-blue-400/30 rounded p-4">
                    <h4 className="font-bold text-blue-400 mb-2">Resources:</h4>
                    <ul className="text-blue-300 text-sm space-y-1">
                      <li>• Lab environment access</li>
                      <li>• Reference materials</li>
                      <li>• Help documentation</li>
                    </ul>
                  </div>
                </div>

                <Button className="w-full bg-green-400 text-black hover:bg-green-300">
                  Launch Lab Environment
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-black rounded-lg p-6 border border-green-400/30">
            <p className="text-green-300">{currentLessonData.content}</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="text-green-400 hover:bg-green-400/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold neon-glow flex items-center">
                <BookOpen className="w-6 h-6 mr-2" />
                {course.title}
              </h1>
              <p className="text-green-300/70">{course.description}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-green-300/70">Progress</div>
            <div className="text-lg font-bold text-green-400">
              {Math.round(progress)}%
            </div>
          </div>
        </div>

        {/* Course Info */}
        <div className="flex items-center space-x-4">
          <Badge
            variant="outline"
            className="border-green-400/50 text-green-400"
          >
            {course.difficulty}
          </Badge>
          <span className="text-green-300/70">{course.duration}</span>
          <Progress value={progress} className="flex-1 h-2 bg-green-900/30" />
        </div>

        {/* Main Content */}
        <ResizablePanelGroup direction="horizontal" className="min-h-[600px]">
          {/* Lesson List */}
          <ResizablePanel defaultSize={25} minSize={20}>
            <Card className="h-full bg-black/50 border-green-400/30">
              <CardHeader>
                <CardTitle className="text-green-400">Course Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {course.lessons.map((lesson, index) => {
                  const LessonIcon = getLessonIcon(lesson.type);
                  return (
                    <div
                      key={lesson.id}
                      className={`p-3 rounded border cursor-pointer transition-all ${
                        index === currentLesson
                          ? "border-green-400 bg-green-400/10"
                          : "border-green-400/30 hover:border-green-400/50"
                      }`}
                      onClick={() => setCurrentLesson(index)}
                    >
                      <div className="flex items-center space-x-3">
                        {completedLessons[index] ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : index <= currentLesson ? (
                          <LessonIcon className="w-5 h-5 text-green-400" />
                        ) : (
                          <Lock className="w-5 h-5 text-gray-500" />
                        )}
                        <div className="flex-1">
                          <div className="font-medium text-green-400 text-sm">
                            {lesson.title}
                          </div>
                          <div className="text-xs text-green-300/60">
                            {lesson.duration}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Lesson Content */}
          <ResizablePanel defaultSize={75} minSize={60}>
            <Card className="h-full bg-black/50 border-green-400/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-green-400 flex items-center">
                    {React.createElement(
                      getLessonIcon(currentLessonData.type),
                      { className: "w-5 h-5 mr-2" }
                    )}
                    {currentLessonData.title}
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className="border-green-400/50 text-green-400"
                  >
                    {currentLessonData.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {renderLessonContent()}

                <div className="flex justify-between items-center pt-4 border-t border-green-400/30">
                  <Button
                    variant="outline"
                    disabled={currentLesson === 0}
                    onClick={() => setCurrentLesson(currentLesson - 1)}
                    className="border-green-400/30 text-green-400 hover:bg-green-400/10"
                  >
                    <SkipBack className="w-4 h-4 mr-2" />
                    Previous
                  </Button>

                  <div className="flex space-x-2">
                    <Button
                      onClick={markLessonComplete}
                      className="bg-green-400 text-black hover:bg-green-300"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark Complete
                    </Button>

                    <Button
                      variant="outline"
                      disabled={currentLesson === course.lessons.length - 1}
                      onClick={() => setCurrentLesson(currentLesson + 1)}
                      className="border-green-400/30 text-green-400 hover:bg-green-400/10"
                    >
                      Next
                      <SkipForward className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default CoursePage;
