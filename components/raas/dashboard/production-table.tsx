"use client";

import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui_custom/data-table";
import { Badge } from "@/components/ui/badge";
import { Bot } from "lucide-react";

export interface ProductionRow {
  id: string;
  machine: string;
  jobCard: string | null;
  planned: number | null;
  done: number | null;
  balance: number | null;
  status: string;
  statusType: "running" | "idle" | "teaching" | "error";
  robot: "On" | "Setup" | "Off" | null;
  cycleInfo?: string;
  date?: string;
}

interface ProductionTableProps {
  data: ProductionRow[];
  onAddJob?: () => void;
}

const statusColors = {
  running: "bg-green-500/10 text-green-500 border-green-500/20",
  idle: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  teaching: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  error: "bg-red-500/10 text-red-500 border-red-500/20",
};

const robotColors = {
  On: "bg-green-500/10 text-green-500",
  Setup: "bg-yellow-500/10 text-yellow-500",
  Off: "bg-gray-500/10 text-gray-500",
};

export function ProductionTable({ data, onAddJob }: ProductionTableProps) {
  const columns: ColumnDef<ProductionRow>[] = useMemo(
    () => [
      {
        accessorKey: "machine",
        header: "Machine",
        cell: ({ row }) => (
          <div className="font-medium">{row.original.machine}</div>
        ),
        meta: {
          mobileHeader: "Machine",
        },
      },
      {
        accessorKey: "jobCard",
        header: "Job Card",
        cell: ({ row }) => (
          row.original.jobCard ? (
            <span className="font-mono text-sm">{row.original.jobCard}</span>
          ) : (
            <span className="text-muted-foreground">–</span>
          )
        ),
        meta: {
          mobileHeader: "Job Card",
        },
      },
      {
        accessorKey: "planned",
        header: "Planned",
        cell: ({ row }) => (
          <div>
            {row.original.planned !== null ? (
              row.original.planned.toLocaleString()
            ) : (
              <span className="text-muted-foreground">–</span>
            )}
          </div>
        ),
        meta: {
          mobileHeader: "Planned",
        },
      },
      {
        accessorKey: "done",
        header: "Done",
        cell: ({ row }) => (
          <div>
            {row.original.done !== null ? (
              row.original.done.toLocaleString()
            ) : (
              <span className="text-muted-foreground">–</span>
            )}
          </div>
        ),
        meta: {
          mobileHeader: "Done",
        },
      },
      {
        accessorKey: "balance",
        header: "Balance",
        cell: ({ row }) => (
          <div>
            {row.original.balance !== null ? (
              <div>
                <div className="font-medium">
                  {row.original.balance.toLocaleString()}
                </div>
                {row.original.date && (
                  <div className="text-xs text-muted-foreground">
                    Date: {row.original.date}
                  </div>
                )}
              </div>
            ) : (
              <span className="text-muted-foreground">–</span>
            )}
          </div>
        ),
        meta: {
          mobileHeader: "Balance",
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge
            variant="outline"
            className={statusColors[row.original.statusType]}
          >
            {row.original.status}
            {row.original.cycleInfo && (
              <span className="ml-1 text-xs">({row.original.cycleInfo})</span>
            )}
          </Badge>
        ),
        meta: {
          mobileHeader: "Status",
        },
      },
      {
        accessorKey: "robot",
        header: "Robot",
        cell: ({ row }) => (
          <div className="flex items-center justify-center gap-2">
            {row.original.robot ? (
              <>
                <Bot className="h-4 w-4" />
                <Badge
                  variant="secondary"
                  className={robotColors[row.original.robot]}
                >
                  {row.original.robot}
                </Badge>
              </>
            ) : (
              <span className="text-muted-foreground">–</span>
            )}
          </div>
        ),
        meta: {
          mobileHeader: "Robot",
        },
      },
    ],
    []
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      searchColumnId="machine"
      searchPlaceholder="Search machines..."
      showAddButton={!!onAddJob}
      addButtonText="Add a Job"
      onAddButtonClick={onAddJob}
      showPagination={false}
      tableId="production-table"
      noResultsMessage="No production data available"
    />
  );
}
