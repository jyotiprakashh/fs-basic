"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { NavItem, mobileNavItems as navItems } from "./nav-items";

export function FooterNav() {
  const router = useRouter();
  const pathname = usePathname();

  // Determine active tab based on current pathname
  const activeItem = navItems.find((item) => pathname.startsWith(item.href));
  const activeTabId = activeItem ? activeItem.id : null;

  const handleClick = (item: NavItem) => {
    router.push(item.href);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-40">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = activeTabId === item.id;
          return (
            <button
              key={item.id}
              className={cn(
                "flex flex-col items-center justify-center w-full py-1.5 transition-colors",
                isActive ? "text-primary" : "text-gray-600 hover:text-gray-900"
              )}
              onClick={() => handleClick(item)}
            >
              <div className={cn(
                "flex items-center justify-center w-10 h-10 rounded-lg transition-colors",
                isActive ? "bg-primary/10" : "hover:bg-gray-100"
              )}>
                {React.cloneElement(item.icon as React.ReactElement)}
              </div>
              <span className="text-[10px] font-medium mt-1 text-center leading-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
