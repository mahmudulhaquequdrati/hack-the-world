import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  BeakerIcon,
  BookmarkIcon,
  ChartBarIcon,
  ChevronRightIcon,
  CubeIcon,
  DocumentIcon,
  FolderIcon,
  HomeIcon,
  PuzzlePieceIcon,
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
    { name: "My Enrollments", href: "/my-enrollments", icon: BookmarkIcon },
    { name: "My Labs", href: "/my-labs", icon: BeakerIcon },
    { name: "My Games", href: "/my-games", icon: PuzzlePieceIcon },
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
    <div className="min-h-screen bg-gray-900 flex">
      {/* Mobile sidebar */}
      <div className={`lg:hidden ${sidebarOpen ? "block" : "hidden"}`}>
        <div className="fixed inset-0 flex z-40">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gray-800 border-r border-gray-700">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <XMarkIcon className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="flex flex-col h-full">
              {/* Logo/Header */}
              <div className="flex items-center justify-center h-16 px-4 border-b border-gray-700">
                <h1 className="text-cyber-green text-xl font-bold">
                  [ADMIN PANEL]
                </h1>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                        isActive(item.href)
                          ? "bg-cyber-green text-black"
                          : "text-green-400 hover:bg-gray-700 hover:text-cyber-green"
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              {/* User info and logout */}
              <div className="border-t border-gray-700 p-4">
                <div className="flex items-center mb-4">
                  <UserIcon className="w-8 h-8 text-green-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-green-400">
                      {user?.name || user?.email || "Admin"}
                    </p>
                    <p className="text-xs text-gray-400">Administrator</p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 rounded-md transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="w-64 bg-gray-800 border-r border-gray-700 fixed h-full">
          <div className="flex flex-col h-full">
            {/* Logo/Header */}
            <div className="flex items-center justify-center h-16 px-4 border-b border-gray-700">
              <h1 className="text-cyber-green text-xl font-bold">
                [ADMIN PANEL]
              </h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                      isActive(item.href)
                        ? "bg-cyber-green text-black"
                        : "text-green-400 hover:bg-gray-700 hover:text-cyber-green"
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* User info and logout */}
            <div className="border-t border-gray-700 p-4">
              <div className="flex items-center mb-4">
                <UserIcon className="w-8 h-8 text-green-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-green-400">
                    {user?.name || user?.email || "Admin"}
                  </p>
                  <p className="text-xs text-gray-400">Administrator</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 rounded-md transition-colors"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-64">
        {/* Mobile header */}
        <div className="lg:hidden bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-green-400 hover:text-cyber-green"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <h1 className="text-cyber-green text-lg font-bold">[ADMIN PANEL]</h1>
          <div className="w-6" /> {/* Spacer for centering */}
        </div>

        <div className="p-4 lg:p-8">
          {/* Breadcrumb Navigation */}
          {breadcrumbs.length > 1 && (
            <nav className="flex mb-6" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                {breadcrumbs.map((crumb, index) => {
                  const Icon = crumb.icon;
                  const isLast = index === breadcrumbs.length - 1;

                  return (
                    <li key={crumb.href} className="inline-flex items-center">
                      {index > 0 && (
                        <ChevronRightIcon className="w-4 h-4 text-gray-500 mx-2" />
                      )}
                      {isLast ? (
                        <span className="inline-flex items-center text-sm font-medium text-cyber-green">
                          <Icon className="w-4 h-4 mr-1" />
                          {crumb.name}
                        </span>
                      ) : (
                        <Link
                          to={crumb.href}
                          className="inline-flex items-center text-sm font-medium text-green-400 hover:text-cyber-green transition-colors"
                        >
                          <Icon className="w-4 h-4 mr-1" />
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
