import { DashboardLabsTab } from "@/components/dashboard";
import {
  useGetDashboardLabsAndGamesQuery,
  useGetPhasesWithModulesQuery,
} from "@/features/api/apiSlice";
import { useAuthRTK } from "@/hooks/useAuthRTK";
import { FlaskConical } from "lucide-react";
import React from "react";

const LabsPage = () => {
  const { user } = useAuthRTK();

  const { data: phasesWithModules, isLoading: phasesLoading } =
    useGetPhasesWithModulesQuery();

  const { data: labsGamesData, isLoading: labsGamesLoading } =
    useGetDashboardLabsAndGamesQuery(undefined, { skip: !user });

  // Process labs data
  const labsData = React.useMemo(() => {
    if (!labsGamesData?.success || !labsGamesData.data) {
      return { success: false, data: { content: [] } };
    }
    return { success: true, data: { content: labsGamesData.data.labs } };
  }, [labsGamesData]);

  const isLoading = phasesLoading || labsGamesLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-green-400">
        <div className="max-w-7xl mx-auto py-10 space-y-6 px-4">
          <div className="text-center">
            <div className="animate-pulse text-green-400/60 font-mono">
              Loading labs...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-green-400">
      <div className="max-w-7xl mx-auto py-10 space-y-6 px-4">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400/20 to-blue-600/20 border-2 border-blue-400/50 flex items-center justify-center">
            <FlaskConical className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-blue-400 font-mono">
              {">> "}My Labs
            </h1>
            <p className="text-blue-400/80 font-mono text-sm">
              Hands-on cybersecurity laboratories
            </p>
          </div>
        </div>

        {/* Labs Content */}
        <DashboardLabsTab
          phases={phasesWithModules || []}
          labsData={labsData}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default LabsPage;
