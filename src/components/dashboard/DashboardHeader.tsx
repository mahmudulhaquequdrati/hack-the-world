export const DashboardHeader = () => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-4xl font-bold neon-glow font-mono">
          {">> "}command_center.exe
        </h1>
        <p className="text-green-300/70 font-mono">
          [STATUS] Welcome back, Agent. Ready for your next mission?
        </p>
      </div>
    </div>
  );
};

export default DashboardHeader;
