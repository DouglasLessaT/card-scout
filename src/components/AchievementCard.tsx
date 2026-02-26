import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Trophy, Lock } from 'lucide-react';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  tier: 'gold' | 'silver' | 'bronze';
  unlocked: boolean;
  unlockedAt?: string;
}

interface AchievementCardProps {
  achievement: Achievement;
  className?: string;
}

const tierStyles = {
  gold: 'border-achievement-gold/40 bg-achievement-gold/10',
  silver: 'border-achievement-silver/40 bg-achievement-silver/10',
  bronze: 'border-achievement-bronze/40 bg-achievement-bronze/10',
};

const tierTextStyles = {
  gold: 'text-achievement-gold',
  silver: 'text-achievement-silver',
  bronze: 'text-achievement-bronze',
};

export function AchievementCard({ achievement, className }: AchievementCardProps) {
  return (
    <Card
      className={cn(
        'motion-safe:animate-scale-in transition-all duration-300',
        achievement.unlocked
          ? tierStyles[achievement.tier]
          : 'opacity-50 grayscale border-border',
        achievement.unlocked && 'achievement-glow',
        className
      )}
    >
      <CardContent className="flex items-center gap-3 p-3">
        <div className={cn(
          'h-10 w-10 rounded-lg flex items-center justify-center text-lg shrink-0',
          achievement.unlocked ? tierStyles[achievement.tier] : 'bg-muted'
        )}>
          {achievement.unlocked ? (
            <span role="img" aria-label={achievement.title}>{achievement.icon}</span>
          ) : (
            <Lock className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn(
            'font-semibold text-sm truncate',
            achievement.unlocked ? tierTextStyles[achievement.tier] : 'text-muted-foreground'
          )}>
            {achievement.title}
          </p>
          <p className="text-xs text-muted-foreground truncate">{achievement.description}</p>
        </div>
        {achievement.unlocked && (
          <Trophy className={cn('h-4 w-4 shrink-0', tierTextStyles[achievement.tier])} />
        )}
      </CardContent>
    </Card>
  );
}
