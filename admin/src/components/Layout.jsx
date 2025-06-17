import {
  ArrowLeftEndOnRectangleIcon,
  Bars3Icon,
  ChartBarIcon,
  ChevronRightIcon,
  CubeIcon,
  DocumentIcon,
  FolderIcon,
  HomeIcon,
  UserIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: ChartBarIcon },
    { name: "Phases", href: "/phases", icon: CubeIcon },
    { name: "Modules", href: "/modules", icon: DocumentIcon },
    { name: "Content", href: "/content", icon: FolderIcon },
    { name: "Enrollments", href: "/enrollments", icon: UsersIcon },
  ];

  const isActive = (href) => location.pathname === href;

  // Generate breadcrumbs based on current path
  const generateBreadcrumbs = () => {
    const pathnames = location.pathname.split("/").filter((x) => x);
    const breadcrumbs = [
      { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    ];

    let currentPath = "";
    pathnames.forEach((pathname, index) => {
      currentPath += `/${pathname}`;

      // Skip the dashboard segment as it's already in the breadcrumbs
      if (pathname === "dashboard") return;

      const navItem = navigation.find((nav) => nav.href === currentPath);
      if (navItem) {
        breadcrumbs.push({
          name: navItem.name,
          href: currentPath,
          icon: navItem.icon,
        });
      } else {
        // Handle detail pages
        if (pathname.match(/^[a-f0-9]{24}$/)) {
          // MongoDB ObjectId pattern
          const detailType = pathnames[index - 1];
          if (detailType === "phases") {
            breadcrumbs.push({
              name: "Phase Details",
              href: currentPath,
              icon: CubeIcon,
            });
          } else if (detailType === "modules") {
            breadcrumbs.push({
              name: "Module Details",
              href: currentPath,
              icon: DocumentIcon,
            });
          } else if (detailType === "content") {
            breadcrumbs.push({
              name: "Content Details",
              href: currentPath,
              icon: FolderIcon,
            });
          }
        }
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <div className="min-h-screen bg-black flex">
      {/* Mobile sidebar */}
      <div className={`lg:hidden ${sidebarOpen ? "block" : "hidden"}`}>
        <div className="fixed inset-0 flex z-40">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-card border-r border-border/50">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-lg bg-card/80 backdrop-blur-sm border border-border/50 text-foreground hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                onClick={() => setSidebarOpen(false)}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-col h-full">
              {/* Logo/Header */}
              <div className="flex items-center justify-center h-16 px-6 border-b border-green-400/30">
                <h1 className="text-green-400 text-xl font-bold tracking-wider font-mono">
                  [HACK_ADMIN]
                </h1>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-[1.02] ${
                        isActive(item.href)
                          ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              {/* User info and logout */}
              <div className="border-t border-green-400/30 p-4">
                <div className="flex items-center p-3 mb-3 bg-muted/50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                    <UserIcon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {user?.name || user?.email || "Admin"}
                    </p>
                    <p className="text-xs text-muted-foreground">Administrator</p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center w-full px-4 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                >
                  <ArrowLeftEndOnRectangleIcon className="w-4 h-4 mr-3" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="w-64 bg-black/90 border-r border-green-400/30 fixed h-full backdrop-blur-sm">
          <div className="flex flex-col h-full">
            {/* Logo/Header */}
            <div className="flex items-center justify-center h-16 px-6 border-b border-green-400/30">
              <h1 className="text-green-400 text-xl font-bold tracking-wider font-mono">
                [HACK_ADMIN]
              </h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-[1.02] ${
                      isActive(item.href)
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* User info and logout */}
            <div className="border-t border-green-400/30 p-4">
              <div className="flex items-center p-3 mb-3 bg-muted/50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                  <UserIcon className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {user?.name || user?.email || "Admin"}
                  </p>
                  <p className="text-xs text-muted-foreground">Administrator</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="flex items-center w-full px-4 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
              >
                <ArrowLeftEndOnRectangleIcon className="w-4 h-4 mr-3" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-64">
        {/* Mobile header */}
        <div className="lg:hidden bg-card border-b border-border/50 px-4 py-3 flex items-center justify-between backdrop-blur-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <Bars3Icon className="h-5 w-5" />
          </button>
          <h1 className="text-primary text-lg font-bold tracking-wider">[ADMIN PANEL]</h1>
          <div className="w-9" /> {/* Spacer for centering */}
        </div>

        <div className="p-4 lg:p-8">
          {/* Breadcrumb Navigation */}
          {breadcrumbs.length > 1 && (
            <nav className="flex mb-8" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3 bg-muted/30 px-3 py-2 rounded-lg backdrop-blur-sm">
                {breadcrumbs.map((crumb, index) => {
                  const Icon = crumb.icon;
                  const isLast = index === breadcrumbs.length - 1;

                  return (
                    <li key={crumb.href} className="inline-flex items-center">
                      {index > 0 && (
                        <ChevronRightIcon className="w-4 h-4 text-muted-foreground mx-2" />
                      )}
                      {isLast ? (
                        <span className="inline-flex items-center text-sm font-medium text-primary">
                          <Icon className="w-4 h-4 mr-2" />
                          {crumb.name}
                        </span>
                      ) : (
                        <Link
                          to={crumb.href}
                          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Icon className="w-4 h-4 mr-2" />
                          {crumb.name}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>
          )}

          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
