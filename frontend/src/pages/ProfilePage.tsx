import EditProfileForm from "@/components/profile/EditProfileForm";
import ProfileInfo from "@/components/profile/ProfileInfo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetCurrentUserQuery } from "@/features/auth/authApi";
import { selectCurrentUser } from "@/features/auth/authSlice";
import { AlertCircle, Edit, Loader2, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";

const ProfilePage: React.FC = () => {
  const currentUser = useSelector(selectCurrentUser);
  const {
    data: userResponse,
    isLoading,
    error,
    refetch,
  } = useGetCurrentUserQuery(undefined, {
    skip: false, // Always try to fetch to keep data fresh
  });

  const [isEditing, setIsEditing] = useState(false);

  // Prefer Redux state since it's optimistically updated, fallback to API response
  const user = currentUser || userResponse?.data?.user;

  const handleEditSuccess = () => {
    setIsEditing(false);
    // No need to manually refetch - optimistic updates and Redux sync handle this
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 text-green-400 animate-spin" />
          <p className="text-green-400 font-mono">Loading Profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-red-500/30 bg-slate-900/50">
          <CardContent className="flex flex-col items-center space-y-4 p-6">
            <AlertCircle className="w-12 h-12 text-red-400" />
            <div className="text-center">
              <h3 className="text-lg font-semibold text-red-400 font-mono">
                Failed to Load Profile
              </h3>
              <p className="text-gray-400 mt-2">
                Unable to fetch your profile information. Please try again.
              </p>
            </div>
            <Button
              onClick={() => refetch()}
              className="bg-green-600 hover:bg-green-700 text-black font-mono"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-yellow-500/30 bg-slate-900/50">
          <CardContent className="flex flex-col items-center space-y-4 p-6">
            <AlertCircle className="w-12 h-12 text-yellow-400" />
            <div className="text-center">
              <h3 className="text-lg font-semibold text-yellow-400 font-mono">
                No Profile Data
              </h3>
              <p className="text-gray-400 mt-2">
                Your profile information is not available. Please log in again.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-green-400 font-mono mb-2">
              Your Profile
            </h1>
            <p className="text-gray-400">
              {isEditing
                ? "Update your cybersecurity learning profile information."
                : "View and manage your cybersecurity learning profile information."}
            </p>
          </div>

          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-green-600 hover:bg-green-700 text-black font-mono"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>

        {/* Profile Content */}
        <div className="grid gap-6">
          {isEditing ? (
            <EditProfileForm
              user={user}
              onCancel={handleEditCancel}
              onSuccess={handleEditSuccess}
            />
          ) : (
            <ProfileInfo user={user} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
