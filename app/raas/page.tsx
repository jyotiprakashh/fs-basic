"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { ProductionMetrics } from "@/components/raas/dashboard/production-metrics";
import { ProductionTable, ProductionRow } from "@/components/raas/dashboard/production-table";
import { useWorkflows } from "@/lib/instant-db";

export default function RaasDashboardPage() {
  const router = useRouter();

  // Fetch all workflows (not just active ones for dashboard overview)
  const { data, isLoading, error } = useWorkflows();

  const handleAddJob = () => {
    router.push("/raas/workorder/new");
  };

  // Calculate metrics from workflows
  const metrics = useMemo(() => {
    if (!data?.workflows) {
      return {
        totalWorkflows: 0,
        activeWorkflows: 0,
        produced: 0,
        planned: 0,
        completionRate: 0,
      };
    }

    const workflows = data.workflows;
    const activeWorkflows = workflows.filter(w => w.status === "active");

    const totalProduced = workflows.reduce((sum, w) => sum + (w.produced || 0), 0);
    const totalPlanned = workflows.reduce((sum, w) => {
      const quantity = parseInt(w.quantity?.replace(/,/g, '') || '0');
      return sum + quantity;
    }, 0);

    const completionRate = totalPlanned > 0
      ? Math.round((totalProduced / totalPlanned) * 100)
      : 0;

    return {
      totalWorkflows: workflows.length,
      activeWorkflows: activeWorkflows.length,
      produced: totalProduced,
      planned: totalPlanned,
      completionRate,
    };
  }, [data]);

  // Map workflows to production table rows
  const productionData: ProductionRow[] = useMemo(() => {
    if (!data?.workflows) return [];

    return data.workflows.map(workflow => {
      const planned = parseInt(workflow.quantity?.replace(/,/g, '') || '0');
      const done = workflow.produced || 0;
      const balance = planned - done;

      // Map workflow status to production status type
      let statusType: ProductionRow['statusType'] = 'idle';
      let statusText = workflow.status;

      switch (workflow.status) {
        case 'active':
          statusType = 'running';
          statusText = 'Running';
          break;
        case 'pending':
          statusType = 'teaching';
          statusText = 'Pending Start';
          break;
        case 'paused':
          statusType = 'idle';
          statusText = 'Paused';
          break;
        case 'completed':
          statusType = 'idle';
          statusText = 'Completed';
          break;
      }

      // Determine robot status
      let robotStatus: ProductionRow['robot'] = null;
      if (workflow.useRobot && workflow.robot) {
        robotStatus = workflow.status === 'active' ? 'On' : workflow.status === 'pending' ? 'Setup' : 'Off';
      }

      return {
        id: workflow.id,
        machine: workflow.machine,
        jobCard: workflow.jobCardNo,
        planned,
        done,
        balance,
        status: statusText,
        statusType,
        robot: robotStatus,
        cycleInfo: workflow.status === 'active' ? `${Math.round((done / planned) * 100)}%` : undefined,
        date: new Date(workflow.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
      };
    });
  }, [data]);

  // Get current date and shift
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const currentHour = new Date().getHours();
  const currentShift = currentHour >= 6 && currentHour < 18 ? 'Day' : 'Night';

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">Error loading dashboard: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
        <ProductionMetrics
          date={currentDate}
          shift={currentShift}
          totalWorkflows={metrics.totalWorkflows}
          activeWorkflows={metrics.activeWorkflows}
          produced={metrics.produced}
          planned={metrics.planned}
          completionRate={metrics.completionRate}
        />

        <div>
          <h2 className="text-lg font-bold mb-3 uppercase tracking-wide">Machine Status</h2>
          <ProductionTable data={productionData} onAddJob={handleAddJob} />
        </div>
      </div>
    </div>
  );
}