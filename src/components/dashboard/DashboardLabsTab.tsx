import { Module, Phase } from "@/lib/types";
import {
  ChevronDown,
  ChevronRight,
  Clock,
  Code,
  Target,
  Terminal,
} from "lucide-react";
import { useState } from "react";

interface DashboardLabsTabProps {
  phases: Phase[];
  getModulesByPhase: (phaseId: string, enrolledOnly?: boolean) => Module[];
}

interface LabItem {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  duration: string;
  skills: string[];
  moduleTitle: string;
  moduleColor: string;
  moduleBgColor: string;
  completed: boolean;
  available: boolean;
  phaseId: string;
  phaseTitle: string;
  moduleId: string;
}

export const DashboardLabsTab = ({
  phases,
  getModulesByPhase,
}: DashboardLabsTabProps) => {
  const [expandedPhases, setExpandedPhases] = useState<string[]>(["beginner"]);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);

  const togglePhase = (phaseId: string) => {
    setExpandedPhases((prev) =>
      prev.includes(phaseId)
        ? prev.filter((id) => id !== phaseId)
        : [...prev, phaseId]
    );
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  // Generate lab items from enrolled modules, organized by module
  const generateLabsFromModules = (): LabItem[] => {
    const labs: LabItem[] = [];

    phases.forEach((phase) => {
      const phaseModules = getModulesByPhase(phase.id, true); // Only enrolled modules

      phaseModules.forEach((module) => {
        for (let i = 1; i <= module.labs; i++) {
          const isAvailable = module.progress > (i - 1) * (100 / module.labs);
          const isCompleted = module.completed && Math.random() > 0.3;

          labs.push({
            id: `${module.id}-lab-${i}`,
            name: `Lab ${i}: ${module.topics[i % module.topics.length]}`,
            description: `Hands-on practice for ${
              module.topics[Math.floor(Math.random() * module.topics.length)]
            }. This lab will test your understanding and provide practical experience with real-world scenarios.`,
            difficulty: module.difficulty,
            duration: "30-45 min",
            skills: module.topics.slice(0, 3),
            moduleTitle: module.title,
            moduleColor: module.color,
            moduleBgColor: module.bgColor,
            completed: isCompleted,
            available: isAvailable,
            phaseId: phase.id,
            phaseTitle: phase.title,
            moduleId: module.id,
          });
        }
      });
    });

    return labs;
  };

  const labs = generateLabsFromModules();

  // Group labs by phase, then by module
  const labsByPhase = phases.reduce((acc, phase) => {
    const phaseModules = getModulesByPhase(phase.id, true);
    if (phaseModules.length === 0) return acc;

    acc[phase.id] = {
      phase,
      modules: phaseModules.reduce((moduleAcc, module) => {
        const moduleLabs = labs.filter((lab) => lab.moduleId === module.id);
        if (moduleLabs.length > 0) {
          moduleAcc[module.id] = {
            module,
            labs: moduleLabs,
          };
        }
        return moduleAcc;
      }, {} as Record<string, { module: Module; labs: LabItem[] }>),
    };
    return acc;
  }, {} as Record<string, { phase: Phase; modules: Record<string, { module: Module; labs: LabItem[] }> }>);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "text-green-400 bg-green-400/20 border-green-400/30";
      case "intermediate":
        return "text-yellow-400 bg-yellow-400/20 border-yellow-400/30";
      case "advanced":
        return "text-red-400 bg-red-400/20 border-red-400/30";
      case "expert":
        return "text-purple-400 bg-purple-400/20 border-purple-400/30";
      case "master":
        return "text-orange-400 bg-orange-400/20 border-orange-400/30";
      default:
        return "text-blue-400 bg-blue-400/20 border-blue-400/30";
    }
  };

  const getPhaseColor = (phaseId: string) => {
    switch (phaseId) {
      case "beginner":
        return "text-green-400";
      case "intermediate":
        return "text-yellow-400";
      case "advanced":
        return "text-red-400";
      default:
        return "text-blue-400";
    }
  };

  const getPhaseIcon = (phaseId: string) => {
    switch (phaseId) {
      case "beginner":
        return "🌱";
      case "intermediate":
        return "🎯";
      case "advanced":
        return "🧠";
      default:
        return "📚";
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-black/60 border border-green-400/30 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Terminal className="w-5 h-5 text-green-400" />
          <span className="text-green-400 font-mono text-sm">
            ~/labs$ find . -name "*.lab" -type f | grep enrolled | sort -k1,2
          </span>
        </div>

        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-green-400 font-mono mb-2">
            HANDS-ON_LABORATORIES
          </h3>
          <p className="text-green-300/70 font-mono text-sm">
            Organized by phases → modules → labs • {labs.length} total labs
            available
          </p>
        </div>

        {labs.length === 0 ? (
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-green-400/30 mx-auto mb-4" />
            <h4 className="text-green-400 font-mono text-lg mb-2">
              NO_LABS_AVAILABLE
            </h4>
            <p className="text-green-300/60 font-mono text-sm">
              Enroll in courses to access hands-on laboratories
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(labsByPhase).map(
              ([phaseId, { phase, modules }]) => {
                const isPhaseExpanded = expandedPhases.includes(phaseId);
                const phaseLabCount = Object.values(modules).reduce(
                  (sum, { labs }) => sum + labs.length,
                  0
                );
                const phaseCompletedCount = Object.values(modules).reduce(
                  (sum, { labs }) =>
                    sum + labs.filter((lab) => lab.completed).length,
                  0
                );

                if (phaseLabCount === 0) return null;

                return (
                  <div key={phaseId} className="space-y-4">
                    {/* Phase Header */}
                    <div
                      className={`bg-gradient-to-r from-${
                        phaseId === "beginner"
                          ? "green"
                          : phaseId === "intermediate"
                          ? "yellow"
                          : "red"
                      }-400/10 to-transparent border border-${
                        phaseId === "beginner"
                          ? "green"
                          : phaseId === "intermediate"
                          ? "yellow"
                          : "red"
                      }-400/30 rounded-lg p-4 cursor-pointer transition-all hover:border-opacity-80`}
                      onClick={() => togglePhase(phaseId)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="text-2xl">
                            {getPhaseIcon(phaseId)}
                          </div>
                          <div>
                            <div className="flex items-center space-x-3 mb-1">
                              <h2
                                className={`text-xl font-bold font-mono ${getPhaseColor(
                                  phaseId
                                )}`}
                              >
                                {phase.title.toUpperCase()}
                              </h2>
                              <span className="text-xs font-mono px-2 py-1 rounded bg-black/40 text-green-300">
                                {Object.keys(modules).length} modules
                              </span>
                            </div>
                            <p className="text-green-300/70 text-sm">
                              {phaseLabCount} labs • {phaseCompletedCount}{" "}
                              completed • {phaseLabCount - phaseCompletedCount}{" "}
                              remaining
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <div
                              className={`${getPhaseColor(
                                phaseId
                              )} font-mono text-sm font-bold`}
                            >
                              {Math.round(
                                (phaseCompletedCount / phaseLabCount) * 100
                              )}
                              % COMPLETE
                            </div>
                            <div className="text-xs text-green-300/60">
                              phase progress
                            </div>
                          </div>
                          {isPhaseExpanded ? (
                            <ChevronDown
                              className={`w-5 h-5 ${getPhaseColor(phaseId)}`}
                            />
                          ) : (
                            <ChevronRight
                              className={`w-5 h-5 ${getPhaseColor(phaseId)}`}
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Phase Modules */}
                    {isPhaseExpanded && (
                      <div className="ml-6 space-y-4">
                        {Object.entries(modules).map(
                          ([moduleId, { module, labs: moduleLabs }]) => {
                            const isModuleExpanded =
                              expandedModules.includes(moduleId);

                            return (
                              <div key={moduleId} className="space-y-3">
                                {/* Module Header */}
                                <div
                                  className={`${module.bgColor} ${module.borderColor} border rounded-lg p-4 cursor-pointer transition-all hover:border-opacity-80`}
                                  onClick={() => toggleModule(moduleId)}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                      <div
                                        className={`p-2 rounded-lg ${module.bgColor}`}
                                      >
                                        <module.icon
                                          className={`w-5 h-5 ${module.color}`}
                                        />
                                      </div>
                                      <div>
                                        <div className="flex items-center space-x-2 mb-1">
                                          <h3 className="text-lg font-bold font-mono text-green-400">
                                            {module.title}
                                          </h3>
                                        </div>
                                        <p className="text-green-300/70 text-sm">
                                          {moduleLabs.length} labs •{" "}
                                          {
                                            moduleLabs.filter(
                                              (lab) => lab.completed
                                            ).length
                                          }{" "}
                                          completed •{" "}
                                          {
                                            moduleLabs.filter(
                                              (lab) =>
                                                lab.available && !lab.completed
                                            ).length
                                          }{" "}
                                          available
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                      <div className="text-right">
                                        <div className="text-green-400 font-mono text-sm font-bold">
                                          {Math.round(
                                            (moduleLabs.filter(
                                              (lab) => lab.completed
                                            ).length /
                                              moduleLabs.length) *
                                              100
                                          )}
                                          % COMPLETE
                                        </div>
                                        <div className="text-xs text-green-300/60">
                                          {module.progress}% module progress
                                        </div>
                                      </div>
                                      {isModuleExpanded ? (
                                        <ChevronDown className="w-5 h-5 text-green-400" />
                                      ) : (
                                        <ChevronRight className="w-5 h-5 text-green-400" />
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Module Labs */}
                                {isModuleExpanded && (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-6">
                                    {moduleLabs.map((lab, index) => (
                                      <div
                                        key={lab.id}
                                        className={`bg-black/40 border border-green-400/30 rounded-lg overflow-hidden hover:border-green-400/60 transition-all duration-300 ${
                                          !lab.available ? "opacity-50" : ""
                                        }`}
                                      >
                                        {/* Lab Header */}
                                        <div className="bg-gradient-to-r from-yellow-400/10 to-yellow-400/5 border-b border-yellow-400/20 px-4 py-3">
                                          <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                              <div className="w-8 h-8 rounded bg-yellow-400/20 border border-yellow-400/40 flex items-center justify-center">
                                                <Target className="w-4 h-4 text-yellow-400" />
                                              </div>
                                              <div>
                                                <div className="text-yellow-400 font-mono text-sm font-bold">
                                                  LAB_
                                                  {(index + 1)
                                                    .toString()
                                                    .padStart(2, "0")}
                                                </div>
                                                <h4 className="text-green-400 font-semibold">
                                                  {lab.name}
                                                </h4>
                                              </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                              <div
                                                className={`px-2 py-1 rounded border text-xs font-mono font-bold ${getDifficultyColor(
                                                  lab.difficulty
                                                )}`}
                                              >
                                                {lab.difficulty.toUpperCase()}
                                              </div>
                                              <div className="flex items-center space-x-1 text-green-300/70 font-mono text-xs">
                                                <Clock className="w-3 h-3" />
                                                <span>{lab.duration}</span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Lab Content */}
                                        <div className="p-4">
                                          <p className="text-green-300/90 mb-4 text-sm leading-relaxed">
                                            {lab.description}
                                          </p>

                                          {/* Skills Section */}
                                          <div className="mb-4">
                                            <h5 className="text-green-400 font-mono text-xs font-bold mb-2 flex items-center">
                                              <Code className="w-3 h-3 mr-1" />
                                              SKILLS_COVERED
                                            </h5>
                                            <div className="flex flex-wrap gap-1">
                                              {lab.skills.map(
                                                (skill, skillIndex) => (
                                                  <div
                                                    key={skillIndex}
                                                    className="bg-blue-400/10 border border-blue-400/30 rounded px-2 py-0.5 text-xs text-blue-400 font-mono hover:bg-blue-400/20 transition-colors"
                                                  >
                                                    #
                                                    {skill
                                                      .toLowerCase()
                                                      .replace(/\s+/g, "_")}
                                                  </div>
                                                )
                                              )}
                                            </div>
                                          </div>

                                          {/* Lab Actions & Status */}
                                          <div className="flex items-center justify-between pt-3 border-t border-green-400/20">
                                            <div className="text-green-400 font-mono text-xs">
                                              {lab.completed
                                                ? "✓ COMPLETED"
                                                : lab.available
                                                ? "○ AVAILABLE"
                                                : "⚬ LOCKED"}
                                            </div>
                                            {lab.available && (
                                              <button className="px-3 py-1 bg-green-400/20 border border-green-400/40 rounded text-green-400 font-mono text-xs hover:bg-green-400/30 transition-colors">
                                                {lab.completed
                                                  ? "REVIEW"
                                                  : "START_LAB"}
                                              </button>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          }
                        )}
                      </div>
                    )}
                  </div>
                );
              }
            )}
          </div>
        )}
      </div>
    </div>
  );
};
