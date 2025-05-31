import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/features/auth/authApi";
import {
  CalendarDays,
  Globe,
  Mail,
  MapPin,
  User as UserIcon,
} from "lucide-react";

interface ProfileInfoProps {
  user: User;
  className?: string;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ user, className = "" }) => {
  const getExperienceBadgeColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-500 text-black";
      case "intermediate":
        return "bg-yellow-500 text-black";
      case "advanced":
        return "bg-red-500 text-white";
      case "expert":
        return "bg-purple-500 text-white";
      default:
        return "bg-green-500 text-black";
    }
  };

  const getUserInitials = () => {
    if (user.profile.firstName && user.profile.lastName) {
      return `${user.profile.firstName[0]}${user.profile.lastName[0]}`.toUpperCase();
    }
    return user.username.slice(0, 2).toUpperCase();
  };

  const getDisplayName = () => {
    if (user.profile.displayName) return user.profile.displayName;
    if (user.profile.firstName && user.profile.lastName) {
      return `${user.profile.firstName} ${user.profile.lastName}`;
    }
    return user.username;
  };

  return (
    <Card className={`border-green-500/30 bg-slate-900/50 ${className}`}>
      <CardHeader className="text-center pb-4">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="w-24 h-24 border-2 border-green-500/50">
            <AvatarImage src={user.profile.avatar} alt={getDisplayName()} />
            <AvatarFallback className="bg-green-500/20 text-green-400 text-xl font-mono">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-2">
            <CardTitle className="text-2xl text-green-400 font-mono">
              {getDisplayName()}
            </CardTitle>
            <p className="text-gray-400 font-mono">@{user.username}</p>
            <Badge
              className={`${getExperienceBadgeColor(
                user.experienceLevel
              )} font-mono`}
            >
              {user.experienceLevel.toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-green-400 border-b border-green-500/30 pb-2 font-mono">
            Basic Information
          </h3>

          <div className="grid gap-3">
            <div className="flex items-center space-x-3">
              <Mail className="w-4 h-4 text-green-400" />
              <span className="text-gray-300 font-mono">{user.email}</span>
            </div>

            {user.profile.firstName && (
              <div className="flex items-center space-x-3">
                <UserIcon className="w-4 h-4 text-green-400" />
                <span className="text-gray-300 font-mono">
                  {user.profile.firstName} {user.profile.lastName || ""}
                </span>
              </div>
            )}

            {user.profile.location && (
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-green-400" />
                <span className="text-gray-300 font-mono">
                  {user.profile.location}
                </span>
              </div>
            )}

            {user.profile.website && (
              <div className="flex items-center space-x-3">
                <Globe className="w-4 h-4 text-green-400" />
                <a
                  href={user.profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 hover:text-green-300 font-mono underline"
                >
                  {user.profile.website}
                </a>
              </div>
            )}

            <div className="flex items-center space-x-3">
              <CalendarDays className="w-4 h-4 text-green-400" />
              <span className="text-gray-300 font-mono">
                Joined {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        {user.profile.bio && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-400 border-b border-green-500/30 pb-2 font-mono">
              About
            </h3>
            <p className="text-gray-300 leading-relaxed">{user.profile.bio}</p>
          </div>
        )}

        {/* Learning Stats */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-green-400 border-b border-green-500/30 pb-2 font-mono">
            Learning Progress
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black/30 rounded-lg p-3 border border-green-500/20">
              <div className="text-2xl font-bold text-green-400 font-mono">
                {user.stats.totalPoints}
              </div>
              <div className="text-sm text-gray-400">Total Points</div>
            </div>
            <div className="bg-black/30 rounded-lg p-3 border border-green-500/20">
              <div className="text-2xl font-bold text-green-400 font-mono">
                {user.stats.coursesCompleted}
              </div>
              <div className="text-sm text-gray-400">Courses Completed</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileInfo;
