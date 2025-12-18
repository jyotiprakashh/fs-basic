"use client";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";
import React from "react";
import Image from "next/image";
import { mainNavItems, moreNavItems } from "./nav-items";
import { Msme } from "@/lib/types";

// Combine all nav items for unified active state detection
const allNavItems = [...mainNavItems, ...moreNavItems];

interface IconNavbarProps extends React.HTMLAttributes<HTMLElement> {
    msme?: Msme;
    defaultItemId?: string;
}

export function IconNavbar({ className, msme, defaultItemId, ...props }: IconNavbarProps) {
    const router = useRouter();
    const pathname = usePathname();

    // Determine active item by finding the nav item whose href is a prefix of the current path
    let activeItem = allNavItems.find((item) => pathname.startsWith(item.href));

    // Fallback to default ID if no active item is found
    if (!activeItem && defaultItemId) {
        activeItem = allNavItems.find((item) => item.id === defaultItemId);
    }

    const activeTabId = activeItem?.id;

    // Get page title based on current route
    const getPageTitle = () => {
        // Fallback to active item label if no direct route match
        if (activeItem) {
            return activeItem.label;
        }

        // Default fallback
        return "Dashboard";
    };

    const handleNavClick = (href: string) => {
        router.push(href);
    };

    const handleAiClick = () => {
        router.push("/app");
    };

    return (
        <header
            className={cn(
                "sticky top-0 z-40 w-full",
                className
            )}
            {...props}
        >
            <div className="flex h-16 items-center">
                {/* Left Section: Page Title */}
                <div className="flex items-center flex-1 ">
                    <div className="flex flex-col">
                        <h1 className="md:text-3xl sm:text-3xl text-2xl font-bold text-foreground truncate">
                            {getPageTitle()}
                        </h1>
                        <p className="text-sm text-gray-700 italic">
                            {msme?.name || "Company"} {msme?.state ? `, ${msme?.state}` : ""}
                        </p>
                    </div>
                </div>

                {/* Center Section: Main Navigation */}
                <nav className="hidden md:flex items-center justify-center flex-1">
                    <div className="flex items-center space-x-2">
                        {mainNavItems.map((item) => {
                            const isActive = activeTabId === item.id;
                            return (
                                <div key={item.id} className="flex flex-col items-center rounded-xl" onClick={(e) => {
                                    e.stopPropagation();
                                    handleNavClick(item.href)
                                }}>
                                    <Button
                                        key={item.id}
                                        variant="ghost"
                                        className={cn(
                                            "h-14 w-14 transition-all duration-200 flex flex-col items-center justify-center gap-1",
                                        )}
                                    >
                                        <div className="flex items-center justify-center w-16 h-16">
                                            {React.cloneElement(item.icon as React.ReactElement)}
                                        </div>
                                    </Button>
                                    <span className={`text-xs leading-tight text-center ${isActive ? 'text-background font-bold bg-orange-500 rounded-full px-2 py-1 cursor-pointer' : 'text-gray-700 font-medium hover:text-foreground hover:bg-muted/50 cursor-pointer'}`}>{item.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </nav>

                {/* Right Section: Company Info, Controls and User Menu */}
                <div className="flex items-center gap-3 flex-1 justify-end">

                    <div className="flex items-center gap-3">
                        <Image
                            src="/fs-logo.jpg"
                            alt="AI Icon"
                            width={180}
                            height={180}
                            className="hidden md:block"
                        />
                        {/* <UserButton
                            appearance={{
                                elements: {
                                    avatarBox: "h-10 w-10 rounded-full"
                                }
                            }}
                        /> */}
                        <DropdownMenu>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="h-10 w-10 rounded-full p-0 transition-all duration-200 bg-black hover:bg-muted/80 hover:scale-105 text-white hover:text-foreground"
                                                aria-label="More options"
                                            >
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>More Options</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <DropdownMenuContent align="end" className="w-48">
                                {moreNavItems.map((item) => {
                                    const isActive = activeTabId === item.id;
                                    return (
                                        <DropdownMenuItem
                                            key={item.id}
                                            onClick={() => handleNavClick(item.href)}
                                            className={cn(
                                                "flex items-center gap-2 justify-between",
                                                isActive && "bg-muted"
                                            )}
                                        >
                                            <span>{item.label}</span>
                                            {item.icon}
                                        </DropdownMenuItem>
                                    );
                                })}
                            </DropdownMenuContent>
                        </DropdownMenu>


                        {/* Navigation Controls */}
                        <TooltipProvider>
                            <div className="hidden sm:flex items-center gap-2 ml-2 border-l border-border/40 pl-3">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            onClick={() => router.back()}
                                            className="h-10 w-10 rounded-full p-0 transition-all duration-200 text-white bg-black hover:scale-105"
                                            aria-label="Go back"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Go Back</p>
                                    </TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            onClick={() => router.forward()}
                                            className="h-10 w-10 rounded-full p-0 transition-all duration-200 bg-black hover:scale-105 text-white"
                                            aria-label="Go forward"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Go Forward</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        </TooltipProvider>
                    </div>
                </div>
            </div>
        </header>
    );
}
