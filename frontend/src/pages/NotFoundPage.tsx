import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Home, Search, Terminal } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-gray-900 border-green-500/30 text-green-400">
        <CardContent className="p-8 text-center">
          {/* Terminal-style header */}
          <div className="flex items-center justify-center mb-6">
            <Terminal className="w-8 h-8 mr-2" />
            <span className="text-lg font-mono">SYSTEM ERROR</span>
          </div>

          {/* 404 Error Display */}
          <div className="mb-8">
            <div className="text-8xl font-bold font-mono mb-4 text-red-500">
              404
            </div>
            <div className="text-2xl font-mono mb-2">ACCESS DENIED</div>
            <div className="text-lg text-green-300/80 font-mono">
              The requested resource could not be found
            </div>
          </div>

          {/* Warning Icon */}
          <div className="flex justify-center mb-6">
            <AlertTriangle className="w-16 h-16 text-yellow-500" />
          </div>

          {/* Terminal-style error message */}
          <div className="bg-black p-4 rounded border border-green-500/30 mb-8 font-mono text-left">
            <div className="text-green-500 mb-2">$ ls -la /requested/path</div>
            <div className="text-red-400">
              ls: cannot access '/requested/path': No such file or directory
            </div>
            <div className="text-green-500 mt-2">
              $ echo "Error: Resource not found"
            </div>
            <div className="text-green-400">Error: Resource not found</div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex justify-center">
            <Button
              onClick={() => navigate("/")}
              className="bg-green-500 hover:bg-green-600 text-black font-mono w-full sm:w-auto"
            >
              <Home className="w-4 h-4 mr-2" />
              Return to Base
            </Button>

            <Button
              onClick={() => navigate("/dashboard")}
              variant="outline"
              className="border-green-500 text-green-400 hover:bg-green-500/10 font-mono w-full sm:w-auto"
            >
              <Search className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Button>
          </div>

          {/* Additional Help */}
          <div className="mt-8 text-sm text-green-300/60 font-mono">
            If you believe this is an error, please contact the system
            administrator
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFoundPage;
