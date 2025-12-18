"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RobotInstruction {
  id: string;
  instruction: string;
}

interface RobotInstructionsProps {
  instructions: RobotInstruction[];
  onUpdate: (id: string, instruction: string) => void;
  onRemove: (id: string) => void;
}

export function RobotInstructions({
  instructions,
  onUpdate,
  onRemove,
}: RobotInstructionsProps) {
  return (
    <div className="space-y-4">
      {instructions.map((item, index) => (
        <div key={item.id} className="flex items-start gap-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-sm font-semibold text-orange-600 dark:text-orange-400">
            {index + 1}
          </div>
          <div className="flex-1">
            <input
              type="text"
              value={item.instruction}
              onChange={(e) => onUpdate(item.id, e.target.value)}
              placeholder="Enter robot instruction"
              className="w-full bg-transparent border-0 border-b-2 border-border focus:border-orange-500 outline-none transition-colors pb-2 text-base placeholder:text-muted-foreground/50"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(item.id)}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
