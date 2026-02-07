import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { mockCollections, mockCards } from '@/data/mockData';
import { Collection } from '@/types/collection';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Plus, 
  Search, 
  FolderOpen,
  Lock,
  Globe,
  Crown,
  LayoutGrid,
  List
} from 'lucide-react';

type ViewMode = 'grid' | 'list';

export default function Collections() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedGame, setSelectedGame] = useState<'all' | 'mtg' | 'pokemon'>('all');
  
  const isPremium = user?.plan === 'premium';

  const filteredCollections = mockCollections.filter(collection => {
    const matchesSearch = collection.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGame = selectedGame === 'all' || collection.game === selectedGame;
    return matchesSearch && matchesGame;
  });

  const CollectionCard = ({ collection }: { collection: Collection }) => (
    <Link to={`/collections/${collection.id}`}>
      <Card className="hover:border-primary transition-all h-full">
        <CardContent className="p-0">
          <div className="aspect-video relative overflow-hidden rounded-t-lg bg-muted">
            {collection.coverImage && (
              <img
                src={collection.coverImage}
                alt={collection.name}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute top-2 right-2 flex gap-1">
              {collection.isDeck && (
                <Badge variant="secondary" className="text-xs">Deck</Badge>
              )}
              {collection.isPublic ? (
                <Badge variant="outline" className="bg-background/80">
                  <Globe className="h-3 w-3" />
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-background/80">
                  <Lock className="h-3 w-3" />
                </Badge>
              )}
            </div>
            <div className="absolute bottom-2 left-2">
              <Badge variant={collection.game === 'mtg' ? 'default' : 'secondary'}>
                {collection.game === 'mtg' ? 'MTG' : 'PKM'}
              </Badge>
            </div>
          </div>
          <div className="p-4 space-y-2">
            <h3 className="font-semibold truncate">{collection.name}</h3>
            {collection.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {collection.description}
              </p>
            )}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{collection.cardsCount} cartas</span>
              <span className="font-medium text-foreground">
                ${collection.totalValue.toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  const CollectionListItem = ({ collection }: { collection: Collection }) => (
    <Link to={`/collections/${collection.id}`}>
      <Card className="hover:border-primary transition-all">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="h-16 w-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
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
              <h3 className="font-semibold truncate">{collection.name}</h3>
              {collection.isDeck && (
                <Badge variant="secondary" className="text-xs">Deck</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {collection.cardsCount} cartas • ${collection.totalValue.toFixed(2)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={collection.game === 'mtg' ? 'default' : 'secondary'}>
              {collection.game === 'mtg' ? 'MTG' : 'PKM'}
            </Badge>
            {collection.isPublic ? (
              <Globe className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Lock className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Minhas Coleções</h1>
          <p className="text-muted-foreground">
            Gerencie suas cartas e decks
          </p>
        </div>
        
        {isPremium ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Coleção
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Nova Coleção</DialogTitle>
                <DialogDescription>
                  Crie uma coleção personalizada para organizar suas cartas
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Nome da Coleção</Label>
                  <Input placeholder="Ex: Deck Modern Burn" />
                </div>
                <div className="space-y-2">
                  <Label>Descrição (opcional)</Label>
                  <Input placeholder="Descrição da coleção..." />
                </div>
              </div>
              <DialogFooter>
                <Button>Criar Coleção</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : (
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="flex items-center gap-3 p-3">
              <Crown className="h-5 w-5 text-primary" />
              <div className="text-sm">
                <p className="font-medium">Coleções Limitadas</p>
                <p className="text-muted-foreground">
                  Upgrade para criar coleções personalizadas
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar coleções..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Tabs value={selectedGame} onValueChange={(v) => setSelectedGame(v as typeof selectedGame)}>
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="mtg">MTG</TabsTrigger>
            <TabsTrigger value="pokemon">Pokémon</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex gap-1 border rounded-md p-1">
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Collections */}
      {filteredCollections.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg">Nenhuma coleção encontrada</h3>
            <p className="text-muted-foreground text-center max-w-md">
              {searchQuery 
                ? 'Tente buscar por outro termo'
                : 'Comece escaneando cartas para criar sua primeira coleção'
              }
            </p>
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCollections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCollections.map((collection) => (
            <CollectionListItem key={collection.id} collection={collection} />
          ))}
        </div>
      )}
    </div>
  );
}
