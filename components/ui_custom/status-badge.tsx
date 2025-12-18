import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
  type: 'machine' | 'robot' | 'job' | 'workflow';
  className?: string;
}

export function StatusBadge({ status, type, className }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase();

  const getStatusStyles = () => {
    switch (type) {
      case 'machine':
        return getMachineStatusStyles(normalizedStatus);
      case 'robot':
        return getRobotStatusStyles(normalizedStatus);
      case 'job':
        return getJobStatusStyles(normalizedStatus);
      case 'workflow':
        return getWorkflowStatusStyles(normalizedStatus);
      default:
        return getDefaultStyles();
    }
  };

  const styles = getStatusStyles();

  return (
    <Badge
      variant="outline"
      className={cn(
        "capitalize border text-xs font-medium",
        styles.bg,
        styles.text,
        styles.border,
        className
      )}
    >
      {status}
    </Badge>
  );
}

// Machine status styles
function getMachineStatusStyles(status: string) {
  switch (status) {
    case "connected":
    case "active":
      return {
        bg: "bg-green-500/10",
        text: "text-green-700 dark:text-green-400",
        border: "border-green-500/20",
      };
    case "registered":
    case "idle":
      return {
        bg: "bg-blue-500/10",
        text: "text-blue-700 dark:text-blue-400",
        border: "border-blue-500/20",
      };
    case "cutting":
    case "tending":
      return {
        bg: "bg-orange-500/10",
        text: "text-orange-700 dark:text-orange-400",
        border: "border-orange-500/20",
      };
    case "waiting":
      return {
        bg: "bg-yellow-500/10",
        text: "text-yellow-700 dark:text-yellow-400",
        border: "border-yellow-500/20",
      };
    case "offline":
    case "error":
    case "maintenance":
      return {
        bg: "bg-red-500/10",
        text: "text-red-700 dark:text-red-400",
        border: "border-red-500/20",
      };
    default:
      return getDefaultStyles();
  }
}

// Robot status styles
function getRobotStatusStyles(status: string) {
  switch (status) {
    case "idle":
      return {
        bg: "bg-blue-500/10",
        text: "text-blue-700 dark:text-blue-400",
        border: "border-blue-500/20",
      };
    case "tending":
    case "active":
      return {
        bg: "bg-green-500/10",
        text: "text-green-700 dark:text-green-400",
        border: "border-green-500/20",
      };
    case "charging":
      return {
        bg: "bg-yellow-500/10",
        text: "text-yellow-700 dark:text-yellow-400",
        border: "border-yellow-500/20",
      };
    case "error":
    case "offline":
      return {
        bg: "bg-red-500/10",
        text: "text-red-700 dark:text-red-400",
        border: "border-red-500/20",
      };
    default:
      return getDefaultStyles();
  }
}

// Job status styles
function getJobStatusStyles(status: string) {
  switch (status) {
    case "active":
      return {
        bg: "bg-green-500/10",
        text: "text-green-700 dark:text-green-400",
        border: "border-green-500/20",
      };
    case "scheduled":
      return {
        bg: "bg-blue-500/10",
        text: "text-blue-700 dark:text-blue-400",
        border: "border-blue-500/20",
      };
    case "completed":
      return {
        bg: "bg-gray-500/10",
        text: "text-gray-700 dark:text-gray-400",
        border: "border-gray-500/20",
      };
    case "paused":
      return {
        bg: "bg-yellow-500/10",
        text: "text-yellow-700 dark:text-yellow-400",
        border: "border-yellow-500/20",
      };
    case "cancelled":
    case "failed":
      return {
        bg: "bg-red-500/10",
        text: "text-red-700 dark:text-red-400",
        border: "border-red-500/20",
      };
    default:
      return getDefaultStyles();
  }
}

// Workflow status styles
function getWorkflowStatusStyles(status: string) {
  switch (status) {
    case "active":
      return {
        bg: "bg-green-500/10",
        text: "text-green-700 dark:text-green-400",
        border: "border-green-500/20",
      };
    case "draft":
      return {
        bg: "bg-yellow-500/10",
        text: "text-yellow-700 dark:text-yellow-400",
        border: "border-yellow-500/20",
      };
    case "tested":
      return {
        bg: "bg-blue-500/10",
        text: "text-blue-700 dark:text-blue-400",
        border: "border-blue-500/20",
      };
    default:
      return getDefaultStyles();
  }
}

// Default styles for unknown statuses
function getDefaultStyles() {
  return {
    bg: "bg-muted",
    text: "text-muted-foreground",
    border: "border-border",
  };
}
