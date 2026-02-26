import { Card, CardContent } from '@/components/ui/card';
import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreakDisplayProps {
  days: number;
  className?: string;
}

export function StreakDisplay({ days, className }: StreakDisplayProps) {
  const isActive = days > 0;

  return (
    <Card className={cn(
      'border transition-all duration-300',
      isActive ? 'border-streak/30 bg-streak/5' : 'border-border',
      className
    )}>
      <CardContent className="flex items-center gap-3 p-4">
        <div className={cn(
          'h-10 w-10 rounded-lg flex items-center justify-center shrink-0',
          isActive ? 'bg-streak/15' : 'bg-muted'
        )}>
          <Flame className={cn(
            'h-5 w-5',
            isActive && 'text-streak motion-safe:animate-streak-fire'
          )} />
        </div>
        <div className="min-w-0">
          <p className="text-2xl font-bold font-mono text-foreground">{days}</p>
          <p className="text-xs text-muted-foreground">dias seguidos</p>
        </div>
      </CardContent>
    </Card>
  );
}
