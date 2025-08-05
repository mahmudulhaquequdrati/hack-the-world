import { DashboardGamesTab } from "@/components/dashboard";
import {
  useGetDashboardLabsAndGamesQuery,
  useGetPhasesWithModulesQuery,
} from "@/features/api/apiSlice";
import { useAuthRTK } from "@/hooks/useAuthRTK";
import { Gamepad2 } from "lucide-react";
import React from "react";

const GamesPage = () => {
  const { user } = useAuthRTK();

  const { data: phasesWithModules, isLoading: phasesLoading } =
    useGetPhasesWithModulesQuery();

  const { data: labsGamesData, isLoading: labsGamesLoading } =
    useGetDashboardLabsAndGamesQuery(undefined, { skip: !user });

  // Process games data
  const gamesData = React.useMemo(() => {
    if (!labsGamesData?.success || !labsGamesData.data) {
      return { success: false, data: { content: [] } };
    }
    return { success: true, data: { content: labsGamesData.data.games } };
  }, [labsGamesData]);

  const isLoading = phasesLoading || labsGamesLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-green-400">
        <div className="max-w-7xl mx-auto py-10 space-y-6 px-4">
          <div className="text-center">
            <div className="animate-pulse text-green-400/60 font-mono">
              Loading games...
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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400/20 to-purple-600/20 border-2 border-purple-400/50 flex items-center justify-center">
            <Gamepad2 className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-purple-400 font-mono">
              {">> "}My Games
            </h1>
            <p className="text-purple-400/80 font-mono text-sm">
              Interactive cybersecurity challenges
            </p>
          </div>
        </div>

        {/* Games Content */}
        <DashboardGamesTab
          phases={phasesWithModules || []}
          gamesData={gamesData}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default GamesPage;
