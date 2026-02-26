import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface XpProgressBarProps {
  current: number;
  max: number;
  level: number;
  className?: string;
}

export function XpProgressBar({ current, max, level, className }: XpProgressBarProps) {
  const pct = Math.min((current / max) * 100, 100);

  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-foreground">Nível {level}</span>
        <span className="text-muted-foreground font-mono">{current}/{max} XP</span>
      </div>
      <Progress
        value={pct}
        className="h-2 bg-muted"
      />
    </div>
  );
}
