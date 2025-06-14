import { getDifficultyColor, getPhaseColor, getPhaseIcon } from "@/lib";
import { Module, Phase } from "@/lib/types";
import { ChevronDown, ChevronRight, Target, Terminal } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
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

  const handleStartLab = (lab: LabItem) => {
    // Navigate to dedicated lab route
    const labId = lab.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    navigate(`/learn/${lab.moduleId}/lab/${labId}`);
  };

  // Generate lab items from enrolled modules, organized by module
  const generateLabsFromModules = (): LabItem[] => {
    const labs: LabItem[] = [];

    phases.forEach((phase) => {
      const phaseModules = getModulesByPhase(phase.id, true); // Only enrolled modules

      phaseModules.forEach((module) => {
        const labCount = module.labs || module.content?.labs?.length || 0;
        for (let i = 1; i <= labCount; i++) {
          const isAvailable = module.progress > (i - 1) * (100 / labCount);
          const isCompleted = module.completed && Math.random() > 0.3;

          labs.push({
            id: `${module.id}-lab-${i}`,
            name: `Lab ${i}: ${module.topics[i % module.topics.length]}`,
            description: `Hands-on laboratory exercise focusing on ${
              module.topics[Math.floor(Math.random() * module.topics.length)]
            }. Practice real-world scenarios in a controlled environment.`,
            difficulty: module.difficulty,
            duration: `${Math.floor(Math.random() * 60) + 30} min`,
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
                                          completed
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
                                        <div className="bg-gradient-to-r from-cyan-400/10 to-cyan-400/5 border-b border-cyan-400/20 px-4 py-3">
                                          <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                              <div className="w-8 h-8 rounded bg-cyan-400/20 border border-cyan-400/40 flex items-center justify-center">
                                                <Target className="w-4 h-4 text-cyan-400" />
                                              </div>
                                              <div>
                                                <div className="text-cyan-400 font-mono text-sm font-bold">
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
                                            </div>
                                          </div>
                                        </div>

                                        {/* Lab Content */}
                                        <div className="p-4">
                                          <p className="text-green-300/90 mb-4 text-sm leading-relaxed">
                                            {lab.description}
                                          </p>

                                          {/* Lab Stats */}
                                          <div className="grid grid-cols-2 gap-3 mb-4">
                                            <div className="bg-black/40 border border-green-400/20 rounded p-2">
                                              <div className="text-green-400 font-mono text-xs font-bold mb-1">
                                                DURATION
                                              </div>
                                              <div className="text-green-300 text-sm">
                                                {lab.duration}
                                              </div>
                                            </div>
                                            <div className="bg-black/40 border border-green-400/20 rounded p-2">
                                              <div className="text-green-400 font-mono text-xs font-bold mb-1">
                                                SKILLS
                                              </div>
                                              <div className="text-green-300 text-sm">
                                                {lab.skills.length} topics
                                              </div>
                                            </div>
                                          </div>

                                          {/* Skills Tags */}
                                          <div className="flex flex-wrap gap-1 mb-4">
                                            {lab.skills.map(
                                              (skill, skillIndex) => (
                                                <span
                                                  key={skillIndex}
                                                  className="px-2 py-1 bg-green-400/10 border border-green-400/30 rounded text-xs text-green-300 font-mono"
                                                >
                                                  {skill}
                                                </span>
                                              )
                                            )}
                                          </div>

                                          {/* Lab Actions & Status */}
                                          <div className="flex items-center justify-between pt-3 border-t border-green-400/20">
                                            <div className="flex items-center space-x-2">
                                              <div className="text-green-400 font-mono text-xs">
                                                {lab.completed ? (
                                                  <div className="flex items-center space-x-1">
                                                    <span className="text-green-400">
                                                      ✓
                                                    </span>
                                                    <span>COMPLETED</span>
                                                  </div>
                                                ) : lab.available ? (
                                                  "○ AVAILABLE"
                                                ) : (
                                                  "⚬ LOCKED"
                                                )}
                                              </div>
                                            </div>
                                            {lab.available && (
                                              <button
                                                className="px-3 py-1 bg-cyan-400/20 border border-cyan-400/40 rounded text-cyan-400 font-mono text-xs hover:bg-cyan-400/30 transition-colors"
                                                onClick={() =>
                                                  handleStartLab(lab)
                                                }
                                              >
                                                {lab.completed
                                                  ? "REVIEW_LAB"
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
