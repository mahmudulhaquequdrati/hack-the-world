import { Module, Phase } from "@/lib/types";
import CourseTree from "./CourseTree";

interface DashboardOverviewTabProps {
  phases: Phase[];
  expandedPhases: string[];
  onTogglePhase: (phaseId: string) => void;
  onModuleClick: (module: Module) => void;
  getAllModules: () => Module[];
  getEnrolledModules: () => Module[];
  getCompletedModules: () => Module[];
}

export const DashboardOverviewTab = ({
  phases,
  expandedPhases,
  onTogglePhase,
  onModuleClick,
  getAllModules,
  getEnrolledModules,
  getCompletedModules,
}: DashboardOverviewTabProps) => {
  return (
    <CourseTree
      phases={phases}
      expandedPhases={expandedPhases}
      onTogglePhase={onTogglePhase}
      onModuleClick={onModuleClick}
      getAllModules={getAllModules}
      getEnrolledModules={getEnrolledModules}
      getCompletedModules={getCompletedModules}
    />
  );
};
