"use client";

import { Card } from "@/components/ui/card";

interface ProductionMetricsProps {
  date: string;
  shift: string;
  totalWorkflows: number;
  activeWorkflows: number;
  produced: number;
  planned: number;
  completionRate: number;
}

export function ProductionMetrics({
  date,
  shift,
  totalWorkflows,
  activeWorkflows,
  produced,
  planned,
  completionRate,
}: ProductionMetricsProps) {
  return (
    <div className="space-y-4">
      {/* Date and Shift - Compact Industrial Style */}
      <div className="flex items-center gap-6 text-sm">
        <div>
          <span className="text-gray-500 dark:text-gray-400 uppercase font-medium">Date:</span>
          <span className="ml-2 font-bold text-gray-900 dark:text-gray-100">{date}</span>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400 uppercase font-medium">Shift:</span>
          <span className="ml-2 font-bold text-gray-900 dark:text-gray-100">{shift}</span>
        </div>
      </div>

      {/* Key Metrics Cards - Industrial Style */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {/* Total Workflows */}
        <Card className="p-3">
          <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-medium mb-1">
            Total Jobs
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {totalWorkflows}
          </div>
        </Card>

        {/* Active Workflows */}
        <Card className="p-3">
          <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-medium mb-1">
            Active Jobs
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {activeWorkflows}
          </div>
        </Card>

        {/* Produced */}
        <Card className="p-3">
          <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-medium mb-1">
            Produced
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {produced.toLocaleString()}
          </div>
        </Card>

        {/* Planned */}
        <Card className="p-3">
          <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-medium mb-1">
            Planned
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {planned.toLocaleString()}
          </div>
        </Card>

        {/* Completion Rate */}
        <Card className="p-3">
          <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-medium mb-1">
            Completion
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {completionRate}%
          </div>
          <div className="mt-1.5 w-full bg-gray-300 dark:bg-gray-700 h-1">
            <div
              className="bg-gray-900 dark:bg-gray-100 h-1 transition-all"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
