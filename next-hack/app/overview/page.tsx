"use client";

import Layout from "@/components/layout/Layout";
import OverviewHeader from "@/components/overview/OverviewHeader";
import PhaseNavigation from "@/components/overview/PhaseNavigation";
import PhaseCard from "@/components/overview/PhaseCard";
import ModuleTree from "@/components/overview/ModuleTree";
import PhaseCompletionCTA from "@/components/overview/PhaseCompletionCTA";
import { useAuth } from "@/lib/context/AuthContext";
import { Phase, Module, UserEnrollment } from "@/lib/types/course";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import apiClient from "@/lib/api/client";

// Mock phases data if API fails (fallback) - moved outside component to avoid dependency warning
const mockPhases = [
  {
    id: "1",
    title: "Cybersecurity Fundamentals",
    description: "Master the essential concepts, terminology, and foundational knowledge of cybersecurity.",
    icon: "shield",
    color: "green",
    difficulty: "beginner" as const,
    order: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    modules: [
      { 
        id: "1", 
        title: "Introduction to Cybersecurity", 
        description: "Learn the basics of cybersecurity",
        icon: "book",
        color: "green",
        phaseId: "1",
        difficulty: "beginner" as const,
        order: 1,
        isActive: true,
        estimatedDuration: 120,
        prerequisites: [],
        labs: 2, 
        games: 1, 
        content: { videos: [{}, {}, {}] },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  }
] satisfies Phase[];

export default function CyberSecOverview() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [phasesWithModules, setPhasesWithModules] = useState<Phase[]>([]);
  const [enrollmentResponse, setEnrollmentResponse] = useState<{data: UserEnrollment[]} | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);

  // Create enrollment lookup map for O(1) access - matching original pattern
  const enrollmentMap = useMemo(() => {
    const map = new Map();
    enrollmentResponse?.data?.forEach((enrollment) => {
      map.set(enrollment.moduleId, {
        enrollmentId: enrollment.id,
        status: enrollment.status,
        progressPercentage: enrollment.progress,
        isCompleted: enrollment.status === 'completed',
        enrolledAt: enrollment.enrolledAt,
        completedAt: enrollment.completedAt,
      });
    });
    return map;
  }, [enrollmentResponse]);

  // Process phases data with enrollment information - matching original
  const phasesData = useMemo(() => {
    return phasesWithModules.map((phase) => {
      const phaseModules = (phase.modules || []).map((module: Module) => {
        const enrollmentInfo = enrollmentMap.get(module.id);
        return {
          ...module,
          enrolled: !!enrollmentInfo,
          completed: enrollmentInfo?.isCompleted || false,
          progress: enrollmentInfo?.progressPercentage || 0,
          enrollmentId: enrollmentInfo?.enrollmentId,
          enrolledAt: enrollmentInfo?.enrolledAt,
          completedAt: enrollmentInfo?.completedAt,
        };
      });
      return { ...phase, modules: phaseModules };
    });
  }, [phasesWithModules, enrollmentMap]);

  // Calculate overall progress for authenticated users
  const overallProgress = enrollmentResponse?.data?.length > 0 
    ? Math.round(enrollmentResponse.data.reduce((acc, enrollment) => acc + enrollment.progress, 0) / enrollmentResponse.data.length)
    : 0;

  // Fetch phases with modules data - single comprehensive query matching original
  useEffect(() => {
    const fetchPhasesWithModules = async () => {
      try {
        // Single comprehensive endpoint - matching original efficient pattern
        const response = await apiClient.get('/api/modules/with-phases');
        setPhasesWithModules(response.data.data || []);
      } catch (error) {
        console.error('Error fetching phases with modules:', error);
        setError('Failed to load course data');
        // Use mock data as fallback
        setPhasesWithModules(mockPhases as Phase[]);
      }
    };

    fetchPhasesWithModules();
  }, []);

  // Fetch enrollments for authenticated users - conditional loading
  useEffect(() => {
    const fetchEnrollments = async () => {
      if (isAuthenticated && user) {
        try {
          const response = await apiClient.get('/api/enrollments/user/me');
          setEnrollmentResponse(response.data);
        } catch (error) {
          console.error('Error fetching enrollments:', error);
        }
      }
      setLoading(false);
    };

    fetchEnrollments();
  }, [isAuthenticated, user]);


  const displayPhases = phasesData.length > 0 ? phasesData : mockPhases;
  const currentPhase = displayPhases[activePhaseIndex];

  // Handle module navigation - matching original pattern
  const handleModuleNavigation = (moduleId: string) => {
    router.push(`/course/${moduleId}`);
  };

  // Handle enrollment - matching original pattern
  const handleEnroll = async (moduleId: string) => {
    try {
      const response = await apiClient.post(`/api/enrollments/module/${moduleId}`);
      if (response.data.success) {
        // Refresh enrollments after successful enrollment
        const enrollmentResponse = await apiClient.get('/api/enrollments/user/me');
        setEnrollmentResponse(enrollmentResponse.data);
        // Navigate to enrolled course
        router.push(`/enrolled-course/${moduleId}`);
      }
    } catch (error) {
      console.error('Error enrolling in module:', error);
    }
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      router.push("/signup");
    }
  };

  if (error && phasesData.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-6 max-w-md">
            <h2 className="text-red-400 text-xl font-bold mb-4">Error Loading Courses</h2>
            <p className="text-gray-300 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-red-400 text-black px-4 py-2 rounded hover:bg-red-300 font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-black">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header - matching original design */}
          <OverviewHeader 
            overallProgress={overallProgress}
            showProgress={isAuthenticated && enrollmentResponse?.data && enrollmentResponse.data.length > 0}
          />

          {/* Phase Navigation - tab-based navigation matching original */}
          <PhaseNavigation 
            phases={displayPhases}
            activePhaseIndex={activePhaseIndex}
            onPhaseChange={setActivePhaseIndex}
          />

          {/* Loading State */}
          {loading && (
            <div className="mt-8">
              <div className="animate-pulse space-y-4">
                <div className="h-32 bg-gray-800/50 rounded-lg"></div>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-gray-800/50 rounded-lg"></div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Current Phase Content */}
          {!loading && currentPhase && (
            <div className="mt-8 space-y-8">
              {/* Phase Details Card */}
              <PhaseCard 
                phase={currentPhase}
                showProgress={isAuthenticated}
                enrollmentMap={enrollmentMap}
              />
              
              {/* Module Tree - terminal-style course listing */}
              <ModuleTree 
                phase={currentPhase}
                modules={currentPhase.modules || []}
                onModuleClick={handleModuleNavigation}
                onEnroll={handleEnroll}
                isAuthenticated={isAuthenticated}
                enrollmentMap={enrollmentMap}
              />
            </div>
          )}

          {/* Phase Completion CTA */}
          {!loading && currentPhase && (
            <PhaseCompletionCTA 
              phase={currentPhase}
              isAuthenticated={isAuthenticated}
              onGetStarted={handleGetStarted}
            />
          )}
        </div>
      </div>
    </Layout>
  );
}