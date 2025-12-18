import { ReactNode } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function DetailDrawer({
  open,
  onOpenChange,
  title,
  description,
  children,
  actions,
  className,
}: DetailDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className={className} side="right">
        <SheetHeader className="border-b border-border">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-8">
              <SheetTitle className="text-xl font-bold">{title}</SheetTitle>
              {description && (
                <SheetDescription className="mt-2">{description}</SheetDescription>
              )}
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-140px)] pr-4 pb-12">
          <div className="py-6">{children}</div>
        </ScrollArea>

        {actions && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-background">
            {actions}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
