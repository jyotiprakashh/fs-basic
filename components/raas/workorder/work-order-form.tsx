"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import { createWorkflow } from "@/lib/instant-db";
import { toast } from "sonner"

interface RobotInstruction {
  id: string;
  instruction: string;
}

interface ChecklistItem {
  id: string;
  positionName: string;
  purpose: string;
  status: "not-taught" | "taught";
}

export function WorkOrderForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useRobot, setUseRobot] = useState(false);
  const [robotInstructions, setRobotInstructions] = useState<RobotInstruction[]>([
    { id: "1", instruction: "Robot opens CNC door." },
    { id: "2", instruction: "Robot removes finished part from chuck." },
    { id: "3", instruction: "Robot puts finished part in OK bin." },
    { id: "4", instruction: "Robot picks raw part from input bin." },
    { id: "5", instruction: "Robot loads part in chuck and closes door." },
    { id: "6", instruction: "Robot presses cycle start." },
  ]);

  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
    { id: "1", positionName: "Home / Safe Park", purpose: "Safe resting position", status: "not-taught" },
    { id: "2", positionName: "Raw Bin – Approach", purpose: "Hover above raw bin", status: "not-taught" },
  ]);

  const [formData, setFormData] = useState({
    jobCardNo: "",
    customer: "",
    part: "",
    quantity: "",
    machine: "",
    material: "",
    drawingNo: "",
    robot: "",
    amr: "",
    shift: "Day",
    toolChangeRule: "",
    qcSampling: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddInstruction = () => {
    const newInstruction: RobotInstruction = {
      id: Date.now().toString(),
      instruction: "",
    };
    setRobotInstructions([...robotInstructions, newInstruction]);
  };

  const handleUpdateInstruction = (id: string, instruction: string) => {
    setRobotInstructions(
      robotInstructions.map((item) =>
        item.id === id ? { ...item, instruction } : item
      )
    );
  };

  const handleRemoveInstruction = (id: string) => {
    setRobotInstructions(robotInstructions.filter((item) => item.id !== id));
  };

  const handleAddChecklistItem = () => {
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      positionName: "",
      purpose: "",
      status: "not-taught",
    };
    setChecklistItems([...checklistItems, newItem]);
  };

  const handleUpdateChecklistItem = (
    id: string,
    field: keyof ChecklistItem,
    value: string
  ) => {
    setChecklistItems(
      checklistItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleRemoveChecklistItem = (id: string) => {
    setChecklistItems(checklistItems.filter((item) => item.id !== id));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Prepare workflow data
      const workflowData = {
        jobCardNo: formData.jobCardNo,
        customer: formData.customer,
        part: formData.part,
        quantity: formData.quantity,
        machine: formData.machine,
        material: formData.material,
        drawingNo: formData.drawingNo,
        useRobot,
        robot: formData.robot,
        amr: formData.amr,
        shift: formData.shift,
        toolChangeRule: formData.toolChangeRule,
        qcSampling: formData.qcSampling,
        instructions: robotInstructions.map((inst) => ({
          instruction: inst.instruction,
        })),
        checklists: checklistItems.map((item) => ({
          positionName: item.positionName,
          purpose: item.purpose,
          status: item.status,
        })),
      };

      // Create workflow in InstantDB
      const workflowId = await createWorkflow(workflowData);

      toast("Success!", {
        description: `Workflow ${formData.jobCardNo} created successfully.`,
      });

      // Navigate back to workorders list
      router.push("/raas/workorder");
    } catch (error) {
      console.error("Error creating workflow:", error);
      toast("Error", {
        description: "Failed to create workflow. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white dark:bg-gray-900 p-8 rounded-sm shadow-sm border">
      {/* Header */}
      <div className="mb-6 pb-4 border-b">
        <h1 className="text-3xl font-bold mb-1">Create a Job</h1>
      </div>

      {/* Main Form Grid - 3 Columns */}
      <div className="grid grid-cols-3 gap-x-8 gap-y-3 mb-6">
        {/* Left Column */}
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium block mb-1">Job Card No.:</label>
            <input
              type="text"
              value={formData.jobCardNo}
              onChange={(e) => handleInputChange("jobCardNo", e.target.value)}
              className="w-full border-b border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white outline-none bg-transparent py-1 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium block mb-1">Customer:</label>
            <input
              type="text"
              value={formData.customer}
              onChange={(e) => handleInputChange("customer", e.target.value)}
              className="w-full border-b border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white outline-none bg-transparent py-1 text-sm"
              placeholder="_____"
            />
          </div>
          <div>
            <label className="text-xs font-medium block mb-1">Part:</label>
            <input
              type="text"
              value={formData.part}
              onChange={(e) => handleInputChange("part", e.target.value)}
              className="w-full border-b border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white outline-none bg-transparent py-1 text-sm"
            />
          </div>
        </div>

        {/* Middle Column */}
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium block mb-1">Quantity:</label>
            <input
              type="text"
              value={formData.quantity}
              onChange={(e) => handleInputChange("quantity", e.target.value)}
              className="w-full border-b border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white outline-none bg-transparent py-1 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium block mb-1">Machine:</label>
            <input
              type="text"
              value={formData.machine}
              onChange={(e) => handleInputChange("machine", e.target.value)}
              className="w-full border-b border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white outline-none bg-transparent py-1 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium block mb-1">Material:</label>
            <input
              type="text"
              value={formData.material}
              onChange={(e) => handleInputChange("material", e.target.value)}
              className="w-full border-b border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white outline-none bg-transparent py-1 text-sm"
              placeholder="_____"
            />
          </div>
          <div>
            <label className="text-xs font-medium block mb-1">Drawing No.:</label>
            <input
              type="text"
              value={formData.drawingNo}
              onChange={(e) => handleInputChange("drawingNo", e.target.value)}
              className="w-full border-b border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white outline-none bg-transparent py-1 text-sm"
              placeholder="_____"
            />
          </div>
        </div>

        {/* Right Column - Robot Operator */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold mb-2">Robot Operator</h3>
          <div className="flex items-center justify-between">
            <label className="text-xs">Use Robot for this job? (Yes / No)</label>
            <Switch checked={useRobot} onCheckedChange={setUseRobot} className="scale-75" />
          </div>
          <div>
            <label className="text-xs font-medium block mb-1">Robot:</label>
            <select
              value={formData.robot}
              onChange={(e) => handleInputChange("robot", e.target.value)}
              className="w-full border-b border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white outline-none bg-transparent py-1 text-sm"
            >
              <option>Fanuc CX-10</option>
              <option>Hachidori</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium block mb-1">AMR:</label>
            <select
              value={formData.amr}
              onChange={(e) => handleInputChange("amr", e.target.value)}
              className="w-full border-b border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white outline-none bg-transparent py-1 text-sm"
            >
              <option>None</option>
              <option>AMR-1</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium block mb-1">Shift:</label>
            <select
              value={formData.shift}
              onChange={(e) => handleInputChange("shift", e.target.value)}
              className="w-full border-b border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white outline-none bg-transparent py-1 text-sm"
            >
              <option>Day</option>
              <option>Night</option>
            </select>
          </div>
        </div>
      </div>

      {/* Robot Work Instructions */}
      <div className="mb-6 pb-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold">Robot Work Instructions</h3>
          <Button onClick={handleAddInstruction} variant="outline" size="sm" className="h-7 text-xs">
            + Add More
          </Button>
        </div>
        <ol className="list-decimal list-inside space-y-1.5">
          {robotInstructions.map((item, index) => (
            <li key={item.id} className="flex items-center gap-2">
              <input
                type="text"
                value={item.instruction}
                onChange={(e) => handleUpdateInstruction(item.id, e.target.value)}
                className="flex-1 border-b border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white outline-none bg-transparent py-0.5 text-sm"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveInstruction(item.id)}
                className="h-6 w-6 text-gray-400 hover:text-red-500"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </li>
          ))}
        </ol>
      </div>

      {/* Tool Change and QC Grid */}
      <div className="grid grid-cols-2 gap-x-8 mb-6 pb-4 border-b">
        <div>
          <h3 className="text-sm font-bold mb-2">Tool Change Rule:</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Pause robot every ___ parts for tool change.</p>
          <input
            type="text"
            value={formData.toolChangeRule}
            onChange={(e) => handleInputChange("toolChangeRule", e.target.value)}
            className="w-full border-b border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white outline-none bg-transparent py-1 text-sm"
          />
        </div>
        <div>
          <h3 className="text-sm font-bold mb-2">QC Sampling:</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Send 1 part to QC every ___ parts.</p>
          <input
            type="text"
            value={formData.qcSampling}
            onChange={(e) => handleInputChange("qcSampling", e.target.value)}
            className="w-full border-b border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white outline-none bg-transparent py-1 text-sm"
          />
        </div>
      </div>

      {/* Teaching Checklist Table */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold">Block B – "Teaching Checklist" (printed-style checklist)</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">Looks like a checklist table they might print:</p>
          </div>
          <Button onClick={handleAddChecklistItem} variant="outline" size="sm" className="h-7 text-xs">
            + Add Row
          </Button>
        </div>

        <table className="w-full border-collapse border border-gray-300 dark:border-gray-700 text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="border border-gray-300 dark:border-gray-700 p-2 text-left font-bold text-xs w-12">
                ✓
              </th>
              <th className="border border-gray-300 dark:border-gray-700 p-2 text-left font-bold text-xs">
                Position Name
              </th>
              <th className="border border-gray-300 dark:border-gray-700 p-2 text-left font-bold text-xs">
                Purpose
              </th>
              <th className="border border-gray-300 dark:border-gray-700 p-2 text-left font-bold text-xs w-32">
                Status
              </th>
              <th className="border border-gray-300 dark:border-gray-700 p-2 text-center font-bold text-xs w-16">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {checklistItems.map((item) => (
              <tr key={item.id}>
                <td className="border border-gray-300 dark:border-gray-700 p-2 text-center">
                  <Checkbox
                    checked={item.status === "taught"}
                    onCheckedChange={(checked) =>
                      handleUpdateChecklistItem(item.id, "status", checked ? "taught" : "not-taught")
                    }
                  />
                </td>
                <td className="border border-gray-300 dark:border-gray-700 p-2">
                  <input
                    type="text"
                    value={item.positionName}
                    onChange={(e) => handleUpdateChecklistItem(item.id, "positionName", e.target.value)}
                    className="w-full bg-transparent outline-none text-xs"
                  />
                </td>
                <td className="border border-gray-300 dark:border-gray-700 p-2">
                  <input
                    type="text"
                    value={item.purpose}
                    onChange={(e) => handleUpdateChecklistItem(item.id, "purpose", e.target.value)}
                    className="w-full bg-transparent outline-none text-xs"
                  />
                </td>
                <td className="border border-gray-300 dark:border-gray-700 p-2 text-xs">
                  {item.status === "taught" ? "Taught" : "Not taught"}
                </td>
                <td className="border border-gray-300 dark:border-gray-700 p-2 text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveChecklistItem(item.id)}
                    className="h-6 w-6 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/raas/workorder")}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          size="sm"
          className="bg-orange-500 hover:bg-orange-600 text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create Workflow"}
        </Button>
      </div>
    </div>
  );
}
