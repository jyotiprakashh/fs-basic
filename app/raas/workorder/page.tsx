"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Clock, AlertTriangle, User } from "lucide-react";
import { useWorkflows } from "@/lib/instant-db";

export default function WorkOrdersPage() {
  const router = useRouter();

  // Fetch workflows with status "active" (running)
  const { data, isLoading, error } = useWorkflows({ status: "active" });
  console.log(data);

  const handleAddWorkflow = () => {
    router.push("/raas/workorder/new");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400";
      case "completed":
        return "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400";
      case "pending":
        return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400";
      case "paused":
        return "bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300";
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading workflows...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">Error loading workflows: {error.message}</p>
        </div>
      </div>
    );
  }

  const workflows = data?.workflows || [];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-end mb-6">
        <Button
          onClick={handleAddWorkflow}
        >
          + Add a Job
        </Button>
      </div>

      {workflows.length === 0 ? (
        <div className="border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-12 text-center">
          <AlertTriangle className="h-12 w-12 text-gray-400 mb-4 mx-auto" />
          <p className="text-gray-700 dark:text-gray-300 text-lg mb-2 font-medium">No active workflows</p>
          <p className="text-gray-500 text-sm mb-4">Create your first workflow to get started</p>
          <Button
            onClick={handleAddWorkflow}
          >
            + Add a Job
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {workflows.map((workflow) => (
            <div
              key={workflow.id}
              className="border-2 border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-900 cursor-pointer hover:border-gray-600 dark:hover:border-gray-400 transition-colors"
              onClick={() => router.push(`/raas/workorder/${workflow.id}`)}
            >
              {/* Header */}
              <div className="border-b-2 border-gray-400 dark:border-gray-600 p-4 bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
                      JOB: {workflow.jobCardNo} – {workflow.part}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Machine: {workflow.machine} - Shift: {workflow.shift?.toUpperCase() || 'N/A'}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">TARGET</div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-500">
                      {workflow.quantity}
                    </div>
                  </div>
                </div>
              </div>

              {/* Production Data Table */}
              <div className="p-4">
                <div className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                  PRODUCTION DATA
                </div>
                <table className="w-full border-collapse border border-gray-400 dark:border-gray-600 text-xs">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-800">
                      <th className="border border-gray-400 dark:border-gray-600 p-2 text-center font-bold uppercase">Status</th>
                      <th className="border border-gray-400 dark:border-gray-600 p-2 text-center font-bold uppercase">Target</th>
                      <th className="border border-gray-400 dark:border-gray-600 p-2 text-center font-bold uppercase">Produced</th>
                      <th className="border border-gray-400 dark:border-gray-600 p-2 text-center font-bold uppercase">Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white dark:bg-gray-900">
                      <td className="border border-gray-400 dark:border-gray-600 p-2 text-center">
                        <span className={`px-2 py-1 text-xs font-medium uppercase ${getStatusColor(workflow.status)}`}>
                          {workflow.status}
                        </span>
                      </td>
                      <td className="border border-gray-400 dark:border-gray-600 p-2 text-center font-medium">
                        {workflow.quantity}
                      </td>
                      <td className="border border-gray-400 dark:border-gray-600 p-2 text-center font-medium">
                        {workflow.produced || 0}
                      </td>
                      <td className="border border-gray-400 dark:border-gray-600 p-2 text-center font-medium">
                        {workflow.quantity ?
                          `${Math.round(((workflow.produced || 0) / parseInt(workflow.quantity.replace(/,/g, ''))) * 100)}%`
                          : '0%'}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Additional Info */}
                <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="text-gray-500 dark:text-gray-400 uppercase font-medium mb-1">Robot</div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">{workflow.robot || 'None'}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 dark:text-gray-400 uppercase font-medium mb-1">AMR</div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">{workflow.amr || 'None'}</div>
                  </div>
                  {workflow.customer && (
                    <div className="col-span-2">
                      <div className="text-gray-500 dark:text-gray-400 uppercase font-medium mb-1">Customer</div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">{workflow.customer}</div>
                    </div>
                  )}
                  <div className="col-span-2">
                    <div className="text-gray-500 dark:text-gray-400 uppercase font-medium mb-1">Material</div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">{workflow.material || 'N/A'}</div>
                  </div>
                </div>

                {/* Footer with date */}
                <div className="mt-4 pt-3 border-t border-gray-300 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                  Created: {formatDate(workflow.createdAt)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
