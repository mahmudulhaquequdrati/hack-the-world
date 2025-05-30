import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, RefreshCw, Terminal } from "lucide-react";
import React, { Component, ErrorInfo } from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    // You can also log the error to an error reporting service here
    // logErrorToService(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback } = this.props;

      if (Fallback && this.state.error) {
        return <Fallback error={this.state.error} retry={this.handleRetry} />;
      }

      // Default error UI with cybersecurity theme
      return (
        <div className="min-h-screen bg-black text-green-400 flex items-center justify-center p-6">
          <Card className="w-full max-w-md bg-black/90 border-red-500/50">
            <CardHeader className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-3 rounded-full border border-red-500/50 bg-red-500/10">
                  <AlertCircle className="w-8 h-8 text-red-400" />
                </div>
              </div>
              <CardTitle className="text-xl font-bold text-red-400">
                System Error Detected
              </CardTitle>
              <p className="text-red-300/70 font-mono text-sm">
                Critical system failure encountered
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="bg-red-500/10 border border-red-500/30 rounded p-4">
                <div className="font-mono text-xs text-red-400 space-y-1">
                  <div>$ system_check --verbose</div>
                  <div>
                    ERROR:{" "}
                    {this.state.error?.message || "Unknown error occurred"}
                  </div>
                  <div>Status: SYSTEM_FAILURE</div>
                  <div className="flex items-center">
                    <span>Process: </span>
                    <span className="ml-2">CRASHED</span>
                    <span className="terminal-cursor ml-1 text-red-400">|</span>
                  </div>
                </div>
              </div>

              {process.env.NODE_ENV === "development" &&
                this.state.errorInfo && (
                  <details className="bg-gray-900 border border-gray-700 rounded p-3">
                    <summary className="text-gray-400 font-mono text-xs cursor-pointer hover:text-gray-300">
                      <Terminal className="w-3 h-3 inline mr-1" />
                      Debug Information
                    </summary>
                    <pre className="text-xs text-gray-500 mt-2 overflow-auto max-h-40">
                      {this.state.error?.stack}
                      {"\n\n"}
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}

              <div className="space-y-3">
                <Button
                  onClick={this.handleRetry}
                  className="w-full bg-green-500/20 border border-green-500 text-green-400 hover:bg-green-500 hover:text-black font-mono"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry Operation
                </Button>

                <Button
                  onClick={this.handleReload}
                  variant="outline"
                  className="w-full border-gray-600 text-gray-400 hover:bg-gray-800 font-mono"
                >
                  <Terminal className="w-4 h-4 mr-2" />
                  Restart System
                </Button>
              </div>

              <div className="text-center">
                <p className="text-gray-500 font-mono text-xs">
                  If the problem persists, contact system administrator
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
