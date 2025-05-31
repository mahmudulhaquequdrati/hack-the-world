import PasswordSettings, {
  PasswordUpdateData,
} from "@/components/settings/PasswordSettings";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { useChangePasswordMutation } from "@/features/auth/authApi";
import { AlertCircle, CheckCircle, Settings } from "lucide-react";
import { useState } from "react";

const SettingsPage: React.FC = () => {
  const [changePassword, { isLoading: isUpdating }] =
    useChangePasswordMutation();
  const [updateMessage, setUpdateMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handlePasswordUpdate = async (
    data: PasswordUpdateData
  ): Promise<void> => {
    setUpdateMessage(null);

    try {
      const result = await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }).unwrap();

      setUpdateMessage({
        type: "success",
        message: result.message || "Password updated successfully!",
      });

      // Clear message after 5 seconds
      setTimeout(() => setUpdateMessage(null), 5000);
    } catch (error: unknown) {
      let errorMessage = "Failed to update password";

      if (error && typeof error === "object" && "data" in error) {
        const apiError = error as { data?: { message?: string } };
        errorMessage = apiError.data?.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setUpdateMessage({
        type: "error",
        message: errorMessage,
      });

      // Re-throw to let the component handle it
      throw new Error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="w-8 h-8 text-green-400" />
            <h1 className="text-3xl font-bold text-green-400 font-mono">
              Account Settings
            </h1>
          </div>
          <p className="text-gray-400">
            Manage your account security and preferences.
          </p>
        </div>

        {/* Global Messages */}
        {updateMessage && (
          <div className="mb-6">
            <Alert
              className={`${
                updateMessage.type === "success"
                  ? "border-green-500/50 bg-green-500/10"
                  : "border-red-500/50 bg-red-500/10"
              }`}
            >
              {updateMessage.type === "success" ? (
                <CheckCircle className="h-4 w-4 text-green-400" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-400" />
              )}
              <AlertDescription
                className={`${
                  updateMessage.type === "success"
                    ? "text-green-400"
                    : "text-red-400"
                } font-mono`}
              >
                {updateMessage.message}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Settings Sections */}
        <div className="space-y-8">
          {/* Security Section */}
          <div>
            <h2 className="text-xl font-semibold text-green-400 font-mono mb-4 border-b border-green-500/30 pb-2">
              Security Settings
            </h2>

            <PasswordSettings
              onPasswordUpdate={handlePasswordUpdate}
              isLoading={isUpdating}
            />
          </div>

          {/* Future Settings Sections */}
          <div>
            <h2 className="text-xl font-semibold text-green-400 font-mono mb-4 border-b border-green-500/30 pb-2">
              Profile Settings
            </h2>

            <Card className="border-green-500/30 bg-slate-900/50">
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <Settings className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-400 font-mono mb-2">
                    Coming Soon
                  </h3>
                  <p className="text-gray-500">
                    Profile editing, notification preferences, and other account
                    settings will be available here.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preferences Section */}
          <div>
            <h2 className="text-xl font-semibold text-green-400 font-mono mb-4 border-b border-green-500/30 pb-2">
              Learning Preferences
            </h2>

            <Card className="border-green-500/30 bg-slate-900/50">
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <Settings className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-400 font-mono mb-2">
                    Coming Soon
                  </h3>
                  <p className="text-gray-500">
                    Learning path preferences, difficulty settings, and
                    notification controls will be available here.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <h4 className="text-blue-400 font-semibold mb-2 font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Security Notice
          </h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Always use a strong, unique password for your account</li>
            <li>• Log out from shared or public computers</li>
            <li>• Report any suspicious activity to our support team</li>
            <li>• Keep your account information up to date</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
