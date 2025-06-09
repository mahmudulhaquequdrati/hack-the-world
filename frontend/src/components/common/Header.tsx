import { Menu, Play, Terminal, X } from "lucide-react";
import { useState } from "react";

import UserAvatar from "@/components/common/UserAvatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuthRTK } from "@/hooks/useAuthRTK";

interface HeaderProps {
  navigate: (path: string) => void;
}

export function Header({ navigate }: HeaderProps) {
  const { isAuthenticated, isLoading } = useAuthRTK();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const maxWidth7xl =
    window.location.pathname === "/" ||
    window.location.pathname === "/overview" ||
    window.location.pathname === "/dashboard";

  const navigationItems = [
    { name: "How it works", href: "/how-it-works" },
    { name: "Pricing", href: "/pricing" },
    { name: "About", href: "/about" },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="">
      <nav
        className={`flex justify-between items-center w-full mx-auto py-4 px-6 ${
          maxWidth7xl ? "max-w-7xl px-4 xl:px-0" : "xl:px-8"
        }`}
      >
        {/* Logo */}
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => handleNavigation("/")}
        >
          <Terminal className="w-8 h-8 text-green-400" />
          <span className="text-xl font-bold text-green-400 hidden lg:block">
            TH
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8">
          {navigationItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.href)}
              className="text-green-400/80 hover:text-green-400 transition-colors duration-200 font-medium"
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden lg:flex items-center space-x-4">
          {isLoading ? (
            <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
          ) : isAuthenticated ? (
            <UserAvatar />
          ) : (
            <>
              <Button
                variant="ghost"
                className="text-green-400 hover:bg-green-400/10 hacker-btn"
                onClick={() => handleNavigation("/login")}
              >
                Login
              </Button>
              <Button
                size="lg"
                className="bg-green-400 text-black hover:bg-green-300 font-medium"
                onClick={() => handleNavigation("/signup")}
              >
                <Play className="w-5 h-5 mr-2" />
                Start Hacking
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center space-x-4">
          {/* Mobile Auth Icons */}
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
          ) : isAuthenticated ? (
            <UserAvatar />
          ) : (
            <Button
              size="sm"
              className="bg-green-400 text-black hover:bg-green-300 font-medium px-3"
              onClick={() => handleNavigation("/signup")}
            >
              <Play className="w-4 h-4" />
            </Button>
          )}

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-green-400 hover:text-green-300 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-background border-t border-green-400/20">
          <div className="px-6 py-4 space-y-4">
            {navigationItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href)}
                className="block w-full text-left text-green-400/80 hover:text-green-400 transition-colors duration-200 font-medium py-2"
              >
                {item.name}
              </button>
            ))}

            {!isAuthenticated && (
              <div className="pt-4 border-t border-green-400/20 space-y-3">
                <Button
                  variant="ghost"
                  className="w-full text-green-400 hover:bg-green-400/10 hacker-btn justify-start"
                  onClick={() => handleNavigation("/login")}
                >
                  Login
                </Button>
                <Button
                  className="w-full bg-green-400 text-black hover:bg-green-300 font-medium justify-start"
                  onClick={() => handleNavigation("/signup")}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Hacking
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      <Separator className="w-full bg-green-400/20" />
    </div>
  );
}
