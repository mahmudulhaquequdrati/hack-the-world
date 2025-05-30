import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthRTK } from "@/hooks/useAuthRTK";
import { getInitials } from "@/lib";
import { Award, LogOut, Settings, Shield, Terminal, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserAvatar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthRTK();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      // Navigate anyway in case of error
      navigate("/", { replace: true });
    }
  };

  // If no user data, don't render
  if (!user) {
    return null;
  }

  // Format user display name
  const displayName =
    user.profile?.displayName ||
    (user.profile?.firstName && user.profile?.lastName
      ? `${user.profile.firstName} ${user.profile.lastName}`
      : user.username);

  // Format experience level for display
  const formatExperienceLevel = (level: string) => {
    return level.charAt(0).toUpperCase() + level.slice(1);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <div
          className="relative h-8 w-8 rounded-full border-2 border-green-400/50 hover:border-green-400 transition-colors cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {user.profile?.avatar ? (
            <img
              src={user.profile.avatar}
              alt={displayName}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <div className="h-full w-full rounded-full bg-green-400/20 flex items-center justify-center text-green-400 font-bold">
              {getInitials(displayName)}
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-400 border-2 border-black"></div>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-64  border-green-400/30 text-green-400"
        align="end"
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-3">
              {user.profile?.avatar ? (
                <img
                  src={user.profile.avatar}
                  alt={displayName}
                  className="h-12 w-12 rounded-full object-cover border border-green-400/50"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-green-400/20 flex items-center justify-center text-green-400 font-bold border border-green-400/50">
                  {getInitials(displayName)}
                </div>
              )}
              <div className="flex flex-col">
                <p className="text-sm font-medium text-green-400">
                  {displayName}
                </p>
                <p className="text-xs text-green-300/70">{user.email}</p>
                <p className="text-xs text-green-300/60">@{user.username}</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs mt-1.5">
              <div className="flex items-center space-x-1">
                <Shield className="w-3 h-3 text-green-400" />
                <span className="text-green-300">
                  {formatExperienceLevel(user.experienceLevel)}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Award className="w-3 h-3 text-yellow-400" />
                <span className="text-green-300">
                  {user.stats?.totalPoints || 0} pts
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1">
                <Terminal className="w-3 h-3 text-blue-400" />
                <span className="text-green-300">
                  Level {user.stats?.level || 1}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-green-300">
                  {user.stats?.coursesCompleted || 0} courses
                </span>
              </div>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-green-400/30" />

        <DropdownMenuItem
          className="text-green-400 hover:bg-green-400/10 cursor-pointer"
          onClick={() => {
            navigate("/dashboard");
            setIsOpen(false);
          }}
        >
          <Terminal className="mr-2 h-4 w-4" />
          <span>Dashboard</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="text-green-400 hover:bg-green-400/10 cursor-pointer"
          onClick={() => {
            navigate("/profile");
            setIsOpen(false);
          }}
        >
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="text-green-400 hover:bg-green-400/10 cursor-pointer"
          onClick={() => {
            navigate("/settings");
            setIsOpen(false);
          }}
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-green-400/30" />

        <DropdownMenuItem
          className="text-red-400 hover:bg-red-400/10 cursor-pointer"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAvatar;
