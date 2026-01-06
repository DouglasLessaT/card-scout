import { CardGame } from '@/types/card';
import { cn } from '@/lib/utils';

interface GameSelectorProps {
  selected: CardGame | null;
  onSelect: (game: CardGame | null) => void;
}

export function GameSelector({ selected, onSelect }: GameSelectorProps) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onSelect(selected === 'mtg' ? null : 'mtg')}
        className={cn(
          'flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all duration-200',
          selected === 'mtg'
            ? 'border-chart-4 bg-chart-4/10 shadow-lg shadow-chart-4/20'
            : 'border-border bg-card hover:border-chart-4/50 hover:bg-chart-4/5'
        )}
      >
        <div className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm transition-colors',
          selected === 'mtg' ? 'bg-chart-4 text-primary-foreground' : 'bg-muted text-muted-foreground'
        )}>
          MTG
        </div>
        <div className="text-left">
          <p className={cn(
            'font-semibold text-sm transition-colors',
            selected === 'mtg' ? 'text-chart-4' : 'text-foreground'
          )}>Magic</p>
          <p className="text-xs text-muted-foreground">The Gathering</p>
        </div>
      </button>

      <button
        onClick={() => onSelect(selected === 'pokemon' ? null : 'pokemon')}
        className={cn(
          'flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all duration-200',
          selected === 'pokemon'
            ? 'border-chart-2 bg-chart-2/10 shadow-lg shadow-chart-2/20'
            : 'border-border bg-card hover:border-chart-2/50 hover:bg-chart-2/5'
        )}
      >
        <div className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm transition-colors',
          selected === 'pokemon' ? 'bg-chart-2 text-primary-foreground' : 'bg-muted text-muted-foreground'
        )}>
          PKM
        </div>
        <div className="text-left">
          <p className={cn(
            'font-semibold text-sm transition-colors',
            selected === 'pokemon' ? 'text-chart-2' : 'text-foreground'
          )}>Pokémon</p>
          <p className="text-xs text-muted-foreground">TCG</p>
        </div>
      </button>
    </div>
  );
}
