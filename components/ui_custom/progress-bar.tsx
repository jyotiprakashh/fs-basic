import { cn } from "@/lib/utils";

interface ProgressBarProps {
  current: number;
  total: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ProgressBar({
  current,
  total,
  showLabel = true,
  size = 'md',
  className,
}: ProgressBarProps) {
  const percentage = total > 0 ? Math.min((current / total) * 100, 100) : 0;

  const heightClass = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  }[size];

  const getProgressColor = () => {
    if (percentage >= 100) {
      return 'bg-green-500';
    } else if (percentage >= 75) {
      return 'bg-blue-500';
    } else if (percentage >= 50) {
      return 'bg-yellow-500';
    } else if (percentage >= 25) {
      return 'bg-orange-500';
    } else {
      return 'bg-red-500';
    }
  };

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex items-center justify-between mb-1 text-xs text-muted-foreground">
          <span>{current} / {total}</span>
          <span className="font-medium">{percentage.toFixed(0)}%</span>
        </div>
      )}
      <div className={cn(
        "w-full bg-muted rounded-full overflow-hidden",
        heightClass
      )}>
        <div
          className={cn(
            "h-full transition-all duration-300 ease-in-out",
            getProgressColor()
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
