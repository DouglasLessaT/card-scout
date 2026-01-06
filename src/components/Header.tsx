import { CreditCard, Sparkles } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <CreditCard className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-foreground">CardScanner</h1>
            <p className="text-xs text-muted-foreground">MTG & Pokémon</p>
          </div>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-accent text-accent-foreground">
          <Sparkles className="h-3 w-3" />
          <span className="text-xs font-medium">MVP</span>
        </div>
      </div>
    </header>
  );
}
