export const ROUTES = {
    ROOT: "/",
    SIMPLIFIED: {
        ROOT: "/simplified",
    },
    WORKSPACE: {
        ROOT: "/workspace",
    },
    APP: {
        ROOT: "/app",
        ALERTS: {
            ROOT: "/app/alerts",
        },
        DASHBOARD: {
            ROOT: "/app/dashboard",
        },
        DELIVERY_CHALLAN: {
            ROOT: "/app/delivery-challan",
            NEW: "/app/delivery-challan/new",
        },
        DOCUMENTS: {
            ROOT: "/app/documents",
        },
        RFQ: {
            ROOT: "/app/rfq",
            NEW: "/app/rfq/new",
            DETAILS: "/app/rfq/:id",
            EDIT: "/app/rfq/edit/:id",
            QUOTATION_CREATE: "/app/rfq/quotations/create?rfq_id=",
            QUOTATION_DETAILS: "/app/rfq/quotations/view",
            PO_CREATE: "/app/rfq/po/execute",
            PURCHASE_ORDER: "/app/rfq/purchase-order",
        },
        KANBAN: {
            ROOT: "/app/kanban",
        },
        PRODUCTION_ORDERS: {
            ROOT: "/app/production-orders",
            NEW: "/app/production-orders/new",
        },
        SETTINGS: {
            ROOT: "/app/settings",
            PROFILE: "/app/settings/profile",
            SUPPORT: "/app/settings/support",
            COMPANY_DETAILS: "/app/settings/company-details",
            FEEDBACK: "/app/settings/feedback",
            MEMBERS: "/app/settings/members",
        },
        WEBSITE: {
            ROOT: "/app/website",
            GENERATE: "/app/website/generate",
            EDIT: "/app/website/edit",
        },
        SUPPORT: {
            ROOT: "/app/support",
        },
        AUDIT_LOGS: {
            ROOT: "/app/audit-logs",
        },
        ROBOT_CONSOLE: {
            ROOT: "/app/robot-console",
            NEW: "/app/robot-console/new",
            DETAILS: "/app/robot-console/:id",
            EDIT: "/app/robot-console/edit/:id",
            NEW_FLEET: "/app/robot-console/new-fleet",
        },
        STORAGE: {
            ROOT: "/app/storage",
            NEW: "/app/storage/new",
            DETAILS: "/app/storage/",
        }
    },
    RAAS: {
        ROOT: "/raas",
        DASHBOARD: {
            ROOT: "/raas/dashboard",
        },
        ALERTS: {
            ROOT: "/raas/alerts",
        },
        WORK_ORDERS: {
            ROOT: "/raas/workorder",
        },
        TECH: {
            ROOT: "/raas/tech",
        },
        SHOPFLOOR: {
            ROOT: "/raas/shopfloor",
        },
        OPS_CONSOLE: {
            ROOT: "/raas/ops-console",
        },
        MACHINES: {
            ROOT: "/raas/machines",
            NEW: "/raas/machines/new",
            DETAILS: "/raas/machines/:id",
            EDIT: "/raas/machines/edit/:id",
        },
        ROBOT_OPERATOR: {
            ROOT: "/raas/robot-operator",
        },
        WORKFLOWS: {
            ROOT: "/raas/workflows",
        },
        JOB: {
            ROOT: "/raas/job",
        }
    }

}