import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Award,
  BookOpen,
  LogOut,
  Settings,
  Shield,
  Terminal,
  User,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface UserAvatarProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
    level?: string;
    points?: number;
  };
}

const UserAvatar = ({ user }: UserAvatarProps) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Default user data for demo
  const defaultUser = {
    name: "Agent Smith",
    email: "agent@cybersec.academy",
    avatar:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150",
    level: "Elite Hacker",
    points: 2847,
  };

  const currentUser = user || defaultUser;

  const handleLogout = () => {
    // In real app, this would clear auth tokens
    navigate("/");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <div
          className="relative h-10 w-10 rounded-full border-2 border-green-400/50 hover:border-green-400 transition-colors "
          onClick={() => setIsOpen(!isOpen)}
        >
          {currentUser.avatar ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <div className="h-full w-full rounded-full bg-green-400/20 flex items-center justify-center text-green-400 font-bold">
              {getInitials(currentUser.name)}
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-400 border-2 border-black"></div>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-64  border-green-400/30 text-green-400"
        align="end"
        // forceMount
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-3">
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="h-12 w-12 rounded-full object-cover border border-green-400/50"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-green-400/20 flex items-center justify-center text-green-400 font-bold border border-green-400/50">
                  {getInitials(currentUser.name)}
                </div>
              )}
              <div className="flex flex-col">
                <p className="text-sm font-medium text-green-400">
                  {currentUser.name}
                </p>
                <p className="text-xs text-green-300/70">{currentUser.email}</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1">
                <Shield className="w-3 h-3 text-green-400" />
                <span className="text-green-300">{currentUser.level}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Award className="w-3 h-3 text-yellow-400" />
                <span className="text-green-300">{currentUser.points} pts</span>
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
            navigate("/courses");
            setIsOpen(false);
          }}
        >
          <BookOpen className="mr-2 h-4 w-4" />
          <span>My Courses</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="text-green-400 hover:bg-green-400/10 cursor-pointer"
          onClick={() => setIsOpen(false)}
        >
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="text-green-400 hover:bg-green-400/10 cursor-pointer"
          onClick={() => setIsOpen(false)}
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
