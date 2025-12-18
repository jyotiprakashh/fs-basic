"use client";
import React from 'react';
import {
    Settings,
    Logs,
} from "lucide-react";
import Image from "next/image";
import { ROUTES } from "@/lib/constants";

export interface NavItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    href: string;
    description?: string;
}

export const mobileNavItems: NavItem[] = [
    {
        id: "dashboard",
        label: "Dashboard",
        icon: <Image src="/board.png" alt="Dashboard" width={24} height={24} />,
        href: `${ROUTES.RAAS.ROOT}`,
        description: "Dashboard",
    },
    {
        id: "work-orders",
        label: "Work Orders",
        icon: <Image src="/jobs.png" alt="Dashboard" width={24} height={24} />,
        href: `${ROUTES.RAAS.WORK_ORDERS.ROOT}`,
        description: "Dashboard",
    },
    {
        id: "tech",
        label: "Tech",
        icon: <Image src="/creative.png" alt="Tech" width={24} height={24} />,
        href: `${ROUTES.RAAS.TECH.ROOT}`,
        description: "Tech",
    },
    {
        id: "alerts",
        label: "Alerts",
        icon: <Image src="/industrial-robot.png" alt="Alerts" width={24} height={24} />,
        href: `${ROUTES.RAAS.ALERTS.ROOT}`,
    }
];

// Items that are always visible in the main navbar on larger screens
export const mainNavItems: NavItem[] = [
    {
        id: "dashboard",
        label: "Dashboard",
        icon: <Image src="/board.png" alt="Dashboard" width={40} height={40} />,
        href: `${ROUTES.RAAS.DASHBOARD.ROOT}`,
        description: "Dashboard",
    },
    {
        id: "work-orders",
        label: "Work Orders",
        icon: <Image src="/jobs.png" alt="Work Orders" width={40} height={40} />,
        href: `${ROUTES.RAAS.WORK_ORDERS.ROOT}`,
        description: "Dashboard",
    },
    {
        id: "tech",
        label: "Tech",
        icon: <Image src="/creative.png" alt="Tech" width={40} height={40} />,
        href: `${ROUTES.RAAS.TECH.ROOT}`,
        description: "Tech",
    },
    {
        id: "alerts",
        label: "Alerts",
        icon: <Image src="/industrial-robot.png" alt="Alerts" width={40} height={40} />,
        href: `${ROUTES.RAAS.ALERTS.ROOT}`,
    },
];

// Items that are tucked away in the "More" dropdown
export const moreNavItems: NavItem[] = [
    {
        id: "website",
        label: "Website",
        href: `${ROUTES.APP.WEBSITE.ROOT}`,
        icon: <></>,
        description: "Manage Your Website",
    },
    {
        id: "settings",
        label: "Settings",
        href: `${ROUTES.APP.SETTINGS.ROOT}`,
        icon: <Settings className="h-4 w-4" />,
        description: "Manage Company Details",
    },
    {
        id: "audit-logs",
        label: "Audit Logs",
        description: "Track all your changes on the Dashboard",
        href: `${ROUTES.APP.AUDIT_LOGS.ROOT}`,
        icon: <Logs className="h-4 w-4" />,
    }
];
