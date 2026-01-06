import { useState } from 'react';
import { CardInfo, ExchangeRates } from '@/types/card';
import { PriceDisplay } from './PriceDisplay';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Sparkles, RotateCcw, ExternalLink } from 'lucide-react';

interface CardResultProps {
  card: CardInfo;
  rates: ExchangeRates;
  onScanAgain: () => void;
}

export function CardResult({ card, rates, onScanAgain }: CardResultProps) {
  const [isFoil, setIsFoil] = useState(false);
  const hasFoilPrice = card.prices.usdFoil !== null;

  const getRarityColor = (rarity: string) => {
    const rarityLower = rarity.toLowerCase();
    if (rarityLower.includes('mythic') || rarityLower.includes('secret')) {
      return 'bg-destructive/20 text-destructive border-destructive/30';
    }
    if (rarityLower.includes('rare') || rarityLower.includes('holo')) {
      return 'bg-chart-1/20 text-chart-1 border-chart-1/30';
    }
    if (rarityLower.includes('uncommon')) {
      return 'bg-chart-3/20 text-chart-3 border-chart-3/30';
    }
    return 'bg-secondary/20 text-secondary border-secondary/30';
  };

  const getGameBadge = () => {
    if (card.game === 'mtg') {
      return (
        <Badge variant="outline" className="bg-chart-4/20 text-chart-4 border-chart-4/30">
          Magic: The Gathering
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-chart-2/20 text-chart-2 border-chart-2/30">
        Pokémon TCG
      </Badge>
    );
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Card Image */}
      <div className="relative aspect-[2.5/3.5] max-h-[50vh] mx-auto w-full max-w-xs rounded-xl overflow-hidden shadow-xl border border-border">
        <img
          src={card.imageUrl}
          alt={card.name}
          className="w-full h-full object-contain bg-card"
        />
        {isFoil && (
          <div className="absolute inset-0 bg-gradient-to-br from-chart-1/20 via-transparent to-chart-3/20 pointer-events-none" />
        )}
      </div>

      {/* Card Info */}
      <Card className="mt-4 mx-4 border-border">
        <CardContent className="p-4 space-y-4">
          {/* Name and Badges */}
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">{card.name}</h2>
            <div className="flex flex-wrap gap-2">
              {getGameBadge()}
              <Badge variant="outline" className={getRarityColor(card.rarity)}>
                {card.rarity}
              </Badge>
            </div>
          </div>

          {/* Set Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Edição</p>
              <p className="font-medium text-foreground">{card.setName}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Número</p>
              <p className="font-medium text-foreground">
                {card.set} #{card.number}
              </p>
            </div>
          </div>

          {/* Foil Toggle */}
          {hasFoilPrice && (
            <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent-foreground" />
                <Label htmlFor="foil-toggle" className="text-sm font-medium">
                  Versão Foil
                </Label>
              </div>
              <Switch
                id="foil-toggle"
                checked={isFoil}
                onCheckedChange={setIsFoil}
              />
            </div>
          )}

          {/* Prices */}
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">
              Preço de Mercado {isFoil && '(Foil)'}
            </h3>
            <PriceDisplay
              usdPrice={card.prices.usd}
              usdFoilPrice={card.prices.usdFoil}
              rates={rates}
              isFoil={isFoil}
            />
          </div>

          {/* Artist */}
          {card.artist && (
            <p className="text-xs text-muted-foreground text-center">
              Ilustração: {card.artist}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="p-4 mt-auto">
        <Button onClick={onScanAgain} className="w-full gap-2" size="lg">
          <RotateCcw className="h-5 w-5" />
          Escanear Outra Carta
        </Button>
      </div>
    </div>
  );
}
