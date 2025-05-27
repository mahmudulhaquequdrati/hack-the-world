interface FilterTabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  count?: number;
}

export const FilterTab = ({
  label,
  isActive,
  onClick,
  count,
}: FilterTabProps) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-mono text-sm transition-all duration-300 ${
        isActive
          ? "bg-green-400 text-black"
          : "bg-black/50 text-green-400 border border-green-400/30 hover:bg-green-400/10"
      }`}
    >
      {label}
      {count !== undefined && (
        <span
          className={`ml-2 ${isActive ? "text-black/70" : "text-gray-400"}`}
        >
          ({count})
        </span>
      )}
    </button>
  );
};
