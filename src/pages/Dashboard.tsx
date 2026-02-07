import { useAuth } from '@/contexts/AuthContext';
import { mockCards, mockCollections } from '@/data/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Scan, 
  FolderOpen, 
  TrendingUp, 
  Crown,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  
  const totalCards = mockCollections.reduce((acc, c) => acc + c.cardsCount, 0);
  const totalValue = mockCollections.reduce((acc, c) => acc + c.totalValue, 0);
  
  const recentCards = mockCards.slice(0, 4);

  return (
    <div className="min-h-0 p-4 sm:p-6 space-y-4 sm:space-y-6 pb-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground truncate">
            Olá, {user?.username}! 👋
          </h1>
          <p className="text-sm text-muted-foreground">
            Bem-vindo de volta ao OracleCards
          </p>
        </div>
        
        {user?.plan === 'free' && (
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 shrink-0">
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Total de Cartas
            </CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground shrink-0" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold">{totalCards}</div>
            <p className="text-xs text-muted-foreground">
              em {mockCollections.length} coleções
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Valor Total
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground shrink-0" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold truncate">
              ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              valor de mercado
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Scans este mês
            </CardTitle>
            <Scan className="h-4 w-4 text-muted-foreground shrink-0" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              +12% vs mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <Card className="hover:border-primary transition-colors">
          <Link to="/scanner">
            <CardContent className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Scan className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm sm:text-base">Escanear Carta</h3>
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                  Use a câmera para identificar e catalogar
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0" />
            </CardContent>
          </Link>
        </Card>
        
        <Card className="hover:border-primary transition-colors">
          <Link to="/collections">
            <CardContent className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <FolderOpen className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm sm:text-base">Minhas Coleções</h3>
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                  Gerencie suas cartas e decks
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0" />
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Recent Cards */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="min-w-0">
              <CardTitle className="text-base sm:text-lg">Cartas Recentes</CardTitle>
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
                className="group relative aspect-[2.5/3.5] rounded-lg overflow-hidden border border-border hover:border-primary transition-all"
              >
                <img 
                  src={card.imageUrl} 
                  alt={card.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-sm font-medium truncate">{card.name}</p>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="text-xs">
                        {card.game === 'mtg' ? 'MTG' : 'PKM'}
                      </Badge>
                      {card.prices.usd && (
                        <span className="text-xs text-muted-foreground">
                          ${card.prices.usd}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {card.isFoil && (
                  <div className="absolute top-2 right-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Collections Preview */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="min-w-0">
              <CardTitle className="text-base sm:text-lg">Suas Coleções</CardTitle>
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
                className="flex items-center gap-3 sm:gap-4 p-3 rounded-lg border border-border hover:border-primary hover:bg-accent/50 transition-all"
              >
                <div className="h-12 w-12 rounded-lg overflow-hidden bg-muted">
                  {collection.coverImage && (
                    <img 
                      src={collection.coverImage} 
                      alt={collection.name}
                      className="w-full h-full object-cover"
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
                    {collection.cardsCount} cartas • ${collection.totalValue.toFixed(2)}
                  </p>
                </div>
                <Badge variant="outline">
                  {collection.game === 'mtg' ? 'MTG' : 'PKM'}
                </Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
