import { RefreshCw } from "lucide-react";
import { useState } from "react";

interface DataSourceIndicatorProps {
  className?: string;
  showRefresh?: boolean;
}

/**
 * Component to display the current data source (API Connected)
 * Shows that the app is using RTK Query for API calls
 */
const DataSourceIndicator: React.FC<DataSourceIndicatorProps> = ({
  className = "",
  showRefresh = false,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Refresh the page to reload all API data
      await new Promise((resolve) => setTimeout(resolve, 500));
      window.location.reload();
    } catch (error) {
      console.error("Failed to refresh:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div
      className={`bg-black/80 border border-green-500/30 rounded px-3 py-2 text-xs flex items-center gap-2 ${className}`}
    >
      <span className="text-green-400">🟢 API Connected</span>

      {showRefresh && (
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="text-green-400 hover:text-green-300 transition-colors disabled:opacity-50"
          title="Refresh data"
        >
          <RefreshCw size={12} className={isRefreshing ? "animate-spin" : ""} />
        </button>
      )}
    </div>
  );
};

export default DataSourceIndicator;
