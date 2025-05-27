interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner = ({
  message = "LOADING...",
}: LoadingSpinnerProps) => {
  return (
    <div className="min-h-screen bg-black text-green-400 relative flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
        <p className="font-mono">{message}</p>
      </div>
    </div>
  );
};
