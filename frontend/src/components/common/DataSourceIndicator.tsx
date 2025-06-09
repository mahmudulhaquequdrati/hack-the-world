import { useDataSource } from "@/hooks/useDataService";
import { RefreshCw } from "lucide-react";
import { useState } from "react";

interface DataSourceIndicatorProps {
  className?: string;
  showRefresh?: boolean;
}

/**
 * Component to display the current data source (API or Dummy Data)
 * and optionally allow refreshing the API status
 */
const DataSourceIndicator: React.FC<DataSourceIndicatorProps> = ({
  className = "",
  showRefresh = false,
}) => {
  const { dataSource, refreshStatus } = useDataSource();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshStatus();
    } catch (error) {
      console.error("Failed to refresh API status:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const isUsingApi = dataSource === "API";
  const statusColor = isUsingApi ? "text-green-400" : "text-yellow-400";
  const statusIcon = isUsingApi ? "🟢" : "🟡";

  return (
    <div
      className={`bg-black/80 border border-green-500/30 rounded px-3 py-2 text-xs flex items-center gap-2 ${className}`}
    >
      <span className={statusColor}>
        {statusIcon} Data: {dataSource}
      </span>

      {showRefresh && (
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="text-green-400 hover:text-green-300 transition-colors disabled:opacity-50"
          title="Refresh API status"
        >
          <RefreshCw size={12} className={isRefreshing ? "animate-spin" : ""} />
        </button>
      )}
    </div>
  );
};

export default DataSourceIndicator;
