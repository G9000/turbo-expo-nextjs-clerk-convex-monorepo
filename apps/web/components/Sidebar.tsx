"use client";

import { useState } from "react";
import { UserProfile } from "@/components/UserProfile";
import { Home, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useUser();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const displayName = user?.firstName || user?.fullName || "User";

  const navItems = [
    { href: "/", icon: Home, label: "Dashboard" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <aside
      className={cn(
        "bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 flex flex-col h-screen sticky top-0 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="p-6 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between w-full hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {!isCollapsed && (
          <div className="text-left">
            <h1 className="text-lg font-bold text-primary">Tappy</h1>
            <p className="text-sm text-muted-foreground">
              {getGreeting()}, {displayName}
            </p>
          </div>
        )}
        {isCollapsed && (
          <div className="w-full flex justify-center">
            <h1 className="text-2xl font-bold text-primary">T</h1>
          </div>
        )}
      </button>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800",
                isCollapsed && "justify-center",
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="font-medium">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile & Sign Out */}
      <div className="p-4 border-t border-gray-200 dark:border-zinc-800 space-y-4">
        {!isCollapsed && <UserProfile />}
        <SignOutButton>
          <button
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors",
              isCollapsed && "justify-center",
            )}
            title={isCollapsed ? "Sign Out" : undefined}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="font-medium">Sign Out</span>}
          </button>
        </SignOutButton>
      </div>
    </aside>
  );
}
