import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type GameType = 'mtg' | 'pokemon' | 'onepiece';

interface GameBadgeProps {
  game: GameType;
  size?: 'sm' | 'md';
  className?: string;
}

const gameLabels: Record<GameType, string> = {
  mtg: 'MTG',
  pokemon: 'Pokémon',
  onepiece: 'One Piece',
};

export function GameBadge({ game, size = 'sm', className }: GameBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'border font-semibold',
        game === 'mtg' && 'bg-game-mtg/15 text-game-mtg border-game-mtg/30',
        game === 'pokemon' && 'bg-game-pokemon/15 text-game-pokemon border-game-pokemon/30',
        game === 'onepiece' && 'bg-game-onepiece/15 text-game-onepiece border-game-onepiece/30',
        size === 'sm' && 'text-xs px-2 py-0.5',
        size === 'md' && 'text-sm px-3 py-1',
        className
      )}
    >
      {gameLabels[game]}
    </Badge>
  );
}
