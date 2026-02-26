import { useAuth } from '@/contexts/AuthContext';
import { mockCards, mockCollections } from '@/data/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GameBadge } from '@/components/GameBadge';
import { XpProgressBar } from '@/components/XpProgressBar';
import { AchievementCard, type Achievement } from '@/components/AchievementCard';
import { StreakDisplay } from '@/components/StreakDisplay';
import { Progress } from '@/components/ui/progress';
import { 
  Scan, 
  FolderOpen, 
  TrendingUp, 
  Crown,
  ArrowRight,
  Sparkles,
  Target
} from 'lucide-react';
import { Link } from 'react-router-dom';

const mockAchievements: Achievement[] = [
  { id: '1', title: 'Primeiro Scan', description: 'Escaneie sua primeira carta', icon: '📸', tier: 'bronze', unlocked: true, unlockedAt: '2024-01-15' },
  { id: '2', title: 'Colecionador', description: 'Tenha 50 cartas catalogadas', icon: '🃏', tier: 'silver', unlocked: true, unlockedAt: '2024-02-01' },
  { id: '3', title: 'Mestre MTG', description: 'Complete um set de MTG', icon: '🏆', tier: 'gold', unlocked: false },
];

export default function Dashboard() {
  const { user } = useAuth();
  
  const totalCards = mockCollections.reduce((acc, c) => acc + c.cardsCount, 0);
  const totalValue = mockCollections.reduce((acc, c) => acc + c.totalValue, 0);
  
  const recentCards = mockCards.slice(0, 4);

  return (
    <div className="min-h-0 p-4 sm:p-6 space-y-4 sm:space-y-6 pb-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4 motion-safe:animate-fade-in">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground truncate font-serif">
            Olá, {user?.username}! 👋
          </h1>
          <p className="text-sm text-muted-foreground">
            Bem-vindo de volta ao OracleCards
          </p>
        </div>
        
        {user?.plan === 'free' && (
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 shrink-0 motion-safe:animate-slide-up">
            <CardContent className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4">
              <Crown className="h-6 w-6 sm:h-8 sm:w-8 text-primary shrink-0" />
              <div className="min-w-0">
                <p className="font-semibold text-sm sm:text-base">Upgrade para Premium</p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Desbloqueie coleções ilimitadas
                </p>
              </div>
              <Button size="sm" className="shrink-0">
                Upgrade
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Gamification Row: XP + Streak */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 motion-safe:animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="sm:col-span-2">
          <Card>
            <CardContent className="p-4">
              <XpProgressBar current={340} max={500} level={7} />
            </CardContent>
          </Card>
        </div>
        <StreakDisplay days={5} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {[
          { label: 'Total de Cartas', value: totalCards, sub: `em ${mockCollections.length} coleções`, icon: FolderOpen, delay: '0.15s' },
          { label: 'Valor Total', value: `$${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, sub: 'valor de mercado', icon: TrendingUp, delay: '0.2s' },
          { label: 'Scans este mês', value: 24, sub: '+12% vs mês anterior', icon: Scan, delay: '0.25s' },
        ].map(({ label, value, sub, icon: Icon, delay }) => (
          <Card key={label} className="hover:border-primary/40 transition-colors duration-300 motion-safe:animate-slide-up" style={{ animationDelay: delay }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                {label}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="text-xl sm:text-2xl font-bold font-mono">{value}</div>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <Card className="group hover:border-primary hover:shadow-lg transition-all duration-300">
          <Link to="/scanner">
            <CardContent className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                <Scan className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm sm:text-base">Escanear Carta</h3>
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                  Use a câmera para identificar e catalogar
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0 group-hover:translate-x-1 transition-transform" />
            </CardContent>
          </Link>
        </Card>
        
        <Card className="group hover:border-primary hover:shadow-lg transition-all duration-300">
          <Link to="/collections">
            <CardContent className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                <FolderOpen className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm sm:text-base">Minhas Coleções</h3>
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                  Gerencie suas cartas e decks
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0 group-hover:translate-x-1 transition-transform" />
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Achievements */}
      <Card className="motion-safe:animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <CardHeader className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base sm:text-lg font-serif">Conquistas</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Progresso de suas conquistas</CardDescription>
            </div>
            <Badge variant="outline" className="font-mono text-xs">
              {mockAchievements.filter(a => a.unlocked).length}/{mockAchievements.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {mockAchievements.map((a) => (
              <AchievementCard key={a.id} achievement={a} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Cards with 2.5D */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="min-w-0">
              <CardTitle className="text-base sm:text-lg font-serif">Cartas Recentes</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Últimas cartas adicionadas</CardDescription>
            </div>
            <Link to="/collections" className="shrink-0">
              <Button variant="ghost" size="sm">
                Ver todas
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {recentCards.map((card) => (
              <div 
                key={card.id}
                className="card-3d group relative aspect-[2.5/3.5] rounded-lg overflow-hidden border border-border hover:border-primary transition-all duration-300"
              >
                <div className="card-3d-inner w-full h-full">
                  <img 
                    src={card.imageUrl} 
                    alt={card.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {card.isFoil && (
                    <div className="absolute inset-0 foil-effect pointer-events-none" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-sm font-semibold truncate">{card.name}</p>
                      <div className="flex items-center gap-1">
                        <GameBadge game={card.game as 'mtg' | 'pokemon'} />
                        {card.prices.usd && (
                          <span className="text-xs text-muted-foreground font-mono">
                            ${card.prices.usd}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {card.isFoil && (
                    <div className="absolute top-2 right-2">
                      <Sparkles className="h-4 w-4 text-primary motion-safe:animate-float" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Collections with set completion progress */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="min-w-0">
              <CardTitle className="text-base sm:text-lg font-serif">Suas Coleções</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Gerencie suas coleções de cartas</CardDescription>
            </div>
            <Link to="/collections" className="shrink-0">
              <Button variant="ghost" size="sm">
                Ver todas
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="space-y-2 sm:space-y-3">
            {mockCollections.map((collection) => (
              <Link 
                key={collection.id}
                to={`/collections/${collection.id}`}
                className="group flex items-center gap-3 sm:gap-4 p-3 rounded-lg border border-border hover:border-primary hover:bg-accent/50 transition-all duration-300"
              >
                <div className="h-12 w-12 rounded-lg overflow-hidden bg-muted shrink-0">
                  {collection.coverImage && (
                    <img 
                      src={collection.coverImage} 
                      alt={collection.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{collection.name}</p>
                    {collection.isDeck && (
                      <Badge variant="secondary" className="text-xs">Deck</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {collection.cardsCount} cartas • <span className="font-mono">${collection.totalValue.toFixed(2)}</span>
                  </p>
                  {/* Set completion progress */}
                  <div className="mt-1.5">
                    <Progress value={Math.min(collection.cardsCount / 2, 100)} className="h-1.5 bg-muted" />
                  </div>
                </div>
                <GameBadge game={collection.game as 'mtg' | 'pokemon'} />
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
