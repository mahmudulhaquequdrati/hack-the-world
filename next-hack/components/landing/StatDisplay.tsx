interface StatDisplayProps {
  stats: Array<{
    label: string;
    value: string;
  }>;
  className?: string;
}

const StatDisplay = ({ stats, className = "" }: StatDisplayProps) => {
  return (
    <div className={`flex items-center space-x-6 ${className}`}>
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          <div className="text-2xl font-bold text-green-400">{stat.value}</div>
          <div className="text-sm text-green-300/60">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default StatDisplay;