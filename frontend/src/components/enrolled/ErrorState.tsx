import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title: string;
  message: string;
  buttonText: string;
  onButtonClick: () => void;
}

export const ErrorState = ({
  title,
  message,
  buttonText,
  onButtonClick,
}: ErrorStateProps) => {
  return (
    <div className="min-h-screen bg-black text-green-400 relative flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold font-mono mb-4">{title}</h1>
        <p className="font-mono mb-6">{message}</p>
        <Button
          onClick={onButtonClick}
          className="bg-green-400 text-black hover:bg-green-300 font-mono"
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
};
