"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface ChecklistItem {
  id: string;
  positionName: string;
  purpose: string;
  status: "not-taught" | "taught";
}

interface TeachingChecklistTableProps {
  items: ChecklistItem[];
  onUpdate: (id: string, field: keyof ChecklistItem, value: string) => void;
  onRemove: (id: string) => void;
}

export function TeachingChecklistTable({
  items,
  onUpdate,
  onRemove,
}: TeachingChecklistTableProps) {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-muted/50">
          <tr>
            <th className="text-left p-4 font-semibold text-sm w-12">
              <Checkbox disabled />
            </th>
            <th className="text-left p-4 font-semibold text-sm">Position Name</th>
            <th className="text-left p-4 font-semibold text-sm">Purpose</th>
            <th className="text-left p-4 font-semibold text-sm w-32">Status</th>
            <th className="text-center p-4 font-semibold text-sm w-20">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-muted/30 transition-colors">
              <td className="p-4">
                <Checkbox
                  checked={item.status === "taught"}
                  onCheckedChange={(checked) =>
                    onUpdate(item.id, "status", checked ? "taught" : "not-taught")
                  }
                />
              </td>
              <td className="p-4">
                <input
                  type="text"
                  value={item.positionName}
                  onChange={(e) => onUpdate(item.id, "positionName", e.target.value)}
                  placeholder="Position name"
                  className="w-full bg-transparent border-0 border-b-2 border-transparent focus:border-orange-500 outline-none transition-colors pb-1 text-sm"
                />
              </td>
              <td className="p-4">
                <input
                  type="text"
                  value={item.purpose}
                  onChange={(e) => onUpdate(item.id, "purpose", e.target.value)}
                  placeholder="Purpose"
                  className="w-full bg-transparent border-0 border-b-2 border-transparent focus:border-orange-500 outline-none transition-colors pb-1 text-sm"
                />
              </td>
              <td className="p-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.status === "taught"
                      ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {item.status === "taught" ? "Taught" : "Not taught"}
                </span>
              </td>
              <td className="p-4 text-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemove(item.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
