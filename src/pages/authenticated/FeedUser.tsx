import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ParticleCanvas } from '@/components/ui/ParticleCanvas';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Heart,
  MessageCircle,
  Share2,
  Sparkles,
  Trophy,
  FolderOpen,
  Scan,
  ChevronDown,
  ChevronUp,
  Send,
  Users,
  TrendingUp,
  Flame,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Game = 'mtg' | 'pokemon' | 'all';
type PostType = 'card_scan' | 'new_collection' | 'achievement' | 'trade_offer';

interface PostComment {
  id: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
}

interface FeedPost {
  id: string;
  authorName: string;
  authorAvatar?: string;
  authorPlan: 'free' | 'premium';
  type: PostType;
  game?: 'mtg' | 'pokemon';
  content: string;
  cardName?: string;
  cardImage?: string;
  cardPrice?: string;
  collectionName?: string;
  cardCount?: number;
  achievementTitle?: string;
  likes: number;
  isLiked: boolean;
  comments: PostComment[];
  createdAt: string;
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const MOCK_POSTS: FeedPost[] = [
  {
    id: '1',
    authorName: 'Matheus Silva',
    authorPlan: 'premium',
    type: 'card_scan',
    game: 'mtg',
    content: 'Acabei de escanear essa Black Lotus que encontrei em um leilão! Simplesmente incrível.',
    cardName: 'Black Lotus',
    cardImage: 'https://cards.scryfall.io/large/front/b/d/bd8fa327-dd41-4737-8f19-2cf5eb1f7cdd.jpg',
    cardPrice: '$3.500,00',
    likes: 47,
    isLiked: false,
    comments: [
      { id: 'c1', authorName: 'Rodrigo Alves', content: 'Cara, que achado épico! Parabéns!', createdAt: '5min' },
      { id: 'c2', authorName: 'Julia Mendes', content: 'Quanto pagou nisso? rsrs', createdAt: '3min' },
    ],
    createdAt: '10 min atrás',
  },
  {
    id: '2',
    authorName: 'Ana Costa',
    authorPlan: 'premium',
    type: 'new_collection',
    game: 'pokemon',
    content: 'Finalizei minha coleção de Charizard! 3 anos juntando cada versão que saiu.',
    collectionName: 'Charizard Collection',
    cardCount: 28,
    likes: 132,
    isLiked: true,
    comments: [
      { id: 'c3', authorName: 'Carlos Neto', content: 'Demais! Tem o Charizard ex da Paldea?', createdAt: '1h' },
    ],
    createdAt: '2 horas atrás',
  },
  {
    id: '3',
    authorName: 'Pedro Lopes',
    authorPlan: 'free',
    type: 'achievement',
    game: 'mtg',
    content: 'Desbloqueei a conquista "Colecionador Ávido" com 500 cartas escaneadas!',
    achievementTitle: 'Colecionador Ávido',
    likes: 23,
    isLiked: false,
    comments: [],
    createdAt: '5 horas atrás',
  },
  {
    id: '4',
    authorName: 'Fernanda Reis',
    authorPlan: 'premium',
    type: 'card_scan',
    game: 'pokemon',
    content: 'Olha esse Pikachu Illustrator que apareceu no scanner! Alguém sabe se é autêntico?',
    cardName: 'Pikachu Illustrator',
    cardImage: 'https://images.pokemontcg.io/basep/1_hires.png',
    cardPrice: '$5.275,00',
    likes: 89,
    isLiked: false,
    comments: [
      { id: 'c4', authorName: 'Marcelo Duarte', content: 'Leva num avaliador antes de qualquer coisa!', createdAt: '30min' },
      { id: 'c5', authorName: 'Sonia Freitas', content: 'A fonte parece diferente do original...', createdAt: '20min' },
      { id: 'c6', authorName: 'Bruno Dias', content: 'Mesmo assim, que carta incrível!', createdAt: '10min' },
    ],
    createdAt: '6 horas atrás',
  },
  {
    id: '5',
    authorName: 'Lucas Ferreira',
    authorPlan: 'free',
    type: 'trade_offer',
    game: 'mtg',
    content: 'Tenho algumas Fetchlands da Zendikar para troca. Procuro Dual Lands ou Moxen. Chama no privado!',
    likes: 15,
    isLiked: false,
    comments: [],
    createdAt: '1 dia atrás',
  },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function PostTypeIcon({ type }: { type: PostType }) {
  switch (type) {
    case 'card_scan': return <Scan className="h-3.5 w-3.5" />;
    case 'new_collection': return <FolderOpen className="h-3.5 w-3.5" />;
    case 'achievement': return <Trophy className="h-3.5 w-3.5" />;
    case 'trade_offer': return <Share2 className="h-3.5 w-3.5" />;
  }
}

function PostTypeLabel({ type }: { type: PostType }) {
  const labels: Record<PostType, string> = {
    card_scan: 'Carta escaneada',
    new_collection: 'Nova coleção',
    achievement: 'Conquista',
    trade_offer: 'Oferta de troca',
  };
  return <span>{labels[type]}</span>;
}

function GameBadge({ game }: { game?: 'mtg' | 'pokemon' }) {
  if (!game) return null;
  return (
    <Badge
      variant="outline"
      className={
        game === 'mtg'
          ? 'border-orange-500/40 text-orange-400 text-xs'
          : 'border-yellow-500/40 text-yellow-400 text-xs'
      }
    >
      {game === 'mtg' ? 'MTG' : 'Pokémon'}
    </Badge>
  );
}

function PostCard({ post, onLike }: { post: FeedPost; onLike: (id: string) => void }) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const avatarInitial = post.authorName.trim()[0]?.toUpperCase() ?? 'U';

  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader className="p-4 pb-3">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10 shrink-0 border-2 border-border">
            <AvatarImage src={post.authorAvatar} alt={post.authorName} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {avatarInitial}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-semibold text-sm">{post.authorName}</span>
              {post.authorPlan === 'premium' && (
                <Badge variant="default" className="text-xs px-1.5 py-0 h-4">
                  <Sparkles className="h-2.5 w-2.5 mr-1" />
                  Premium
                </Badge>
              )}
              <GameBadge game={post.game} />
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
              <PostTypeIcon type={post.type} />
              <PostTypeLabel type={post.type} />
              <span>·</span>
              <span>{post.createdAt}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0 space-y-3">
        <p className="text-sm leading-relaxed">{post.content}</p>

        {/* Card scan preview */}
        {post.type === 'card_scan' && post.cardImage && (
          <div className="flex gap-3 p-3 rounded-lg bg-accent/30 border border-border">
            <img
              src={post.cardImage}
              alt={post.cardName}
              className="h-24 w-auto rounded-md object-cover shadow-md"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <div className="flex flex-col justify-center gap-1">
              <p className="font-semibold text-sm">{post.cardName}</p>
              {post.cardPrice && (
                <p className="text-primary font-bold text-base">{post.cardPrice}</p>
              )}
              <Badge variant="secondary" className="text-xs w-fit">
                Identificada pelo Scanner
              </Badge>
            </div>
          </div>
        )}

        {/* New collection */}
        {post.type === 'new_collection' && post.collectionName && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/30 border border-border">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <FolderOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-sm">{post.collectionName}</p>
              <p className="text-xs text-muted-foreground">{post.cardCount} cartas</p>
            </div>
          </div>
        )}

        {/* Achievement */}
        {post.type === 'achievement' && post.achievementTitle && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <div className="h-10 w-10 rounded-lg bg-yellow-500/20 flex items-center justify-center shrink-0">
              <Trophy className="h-5 w-5 text-yellow-400" />
            </div>
            <div>
              <p className="font-semibold text-sm text-yellow-300">{post.achievementTitle}</p>
              <p className="text-xs text-muted-foreground">Conquista desbloqueada</p>
            </div>
          </div>
        )}

        <Separator className="opacity-50" />

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className={`gap-1.5 h-8 px-2.5 text-xs ${post.isLiked ? 'text-red-400 hover:text-red-400' : 'text-muted-foreground'}`}
            onClick={() => onLike(post.id)}
          >
            <Heart className={`h-3.5 w-3.5 ${post.isLiked ? 'fill-current' : ''}`} />
            {post.likes}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 h-8 px-2.5 text-xs text-muted-foreground"
            onClick={() => setShowComments((v) => !v)}
          >
            <MessageCircle className="h-3.5 w-3.5" />
            {post.comments.length}
            {showComments ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 h-8 px-2.5 text-xs text-muted-foreground ml-auto"
          >
            <Share2 className="h-3.5 w-3.5" />
            Compartilhar
          </Button>
        </div>

        {/* Comments section */}
        {showComments && (
          <div className="space-y-3 pt-1">
            {post.comments.length > 0 && (
              <div className="space-y-2.5">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-2.5">
                    <Avatar className="h-7 w-7 shrink-0">
                      <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                        {comment.authorName[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 bg-accent/30 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-xs font-medium">{comment.authorName}</span>
                        <span className="text-xs text-muted-foreground">· {comment.createdAt}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* New comment input */}
            <div className="flex gap-2.5">
              <Avatar className="h-7 w-7 shrink-0">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                  V
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 flex gap-2">
                <Textarea
                  placeholder="Escreva um comentário..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="min-h-0 h-9 py-2 resize-none text-xs"
                  rows={1}
                />
                <Button size="icon" className="h-9 w-9 shrink-0" disabled={!commentText.trim()}>
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Sidebar Widget ─────────────────────────────────────────────────────────────

function CommunityStats() {
  return (
    <Card className="glass-card">
      <CardHeader className="p-4 pb-2">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          Em alta agora
        </h3>
      </CardHeader>
      <CardContent className="p-4 pt-2 space-y-2">
        {['#BlackLotus', '#Charizard', '#FetchLands', '#PokemonTCG', '#MTGLegacy'].map(
          (tag, i) => (
            <div key={tag} className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground hover:text-primary cursor-pointer transition-colors">
                {tag}
              </span>
              <Badge variant="secondary" className="text-xs">
                <Flame className="h-2.5 w-2.5 mr-1 text-orange-400" />
                {[47, 38, 29, 24, 18][i]}
              </Badge>
            </div>
          ),
        )}
      </CardContent>
    </Card>
  );
}

function ActiveMembers() {
  const members = [
    { name: 'Ana Costa', badge: 'Top Colecionador' },
    { name: 'Matheus Silva', badge: 'Scanner Pro' },
    { name: 'Fernanda Reis', badge: 'Trader' },
  ];
  return (
    <Card className="glass-card">
      <CardHeader className="p-4 pb-2">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          Membros ativos
        </h3>
      </CardHeader>
      <CardContent className="p-4 pt-2 space-y-3">
        {members.map((m) => (
          <div key={m.name} className="flex items-center gap-2.5">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                {m.name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{m.name}</p>
              <p className="text-xs text-muted-foreground">{m.badge}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function FeedUser() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<FeedPost[]>(MOCK_POSTS);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [newPostText, setNewPostText] = useState('');

  const filteredPosts = posts.filter((p) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'mtg') return p.game === 'mtg';
    if (activeTab === 'pokemon') return p.game === 'pokemon';
    return true;
  });

  const handleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 }
          : p,
      ),
    );
  };

  const avatarInitial = user?.username?.trim()[0]?.toUpperCase() ?? 'U';

  return (
    <div className="relative">
      <ParticleCanvas />
      <div className="relative z-10 min-h-0 p-4 sm:p-6 pb-8">
        {/* Header */}
        <div className="mb-5 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Comunidade</h1>
          <p className="text-sm text-muted-foreground">
            Veja o que os colecionadores estão compartilhando
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-5">
          {/* Feed column */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* New post box */}
            <Card className="glass-card">
              <CardContent className="p-4 space-y-3">
                <div className="flex gap-3">
                  <Avatar className="h-9 w-9 shrink-0 border-2 border-border">
                    <AvatarImage src={user?.avatarUrl} alt={user?.username} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                      {avatarInitial}
                    </AvatarFallback>
                  </Avatar>
                  <Textarea
                    placeholder="Compartilhe uma carta, conquista ou oferta de troca..."
                    value={newPostText}
                    onChange={(e) => setNewPostText(e.target.value)}
                    className="resize-none min-h-[72px] text-sm"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end">
                  <Button size="sm" disabled={!newPostText.trim()}>
                    <Send className="h-3.5 w-3.5 mr-1.5" />
                    Publicar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Filter tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="all" className="flex-1 sm:flex-none">
                  Todos
                </TabsTrigger>
                <TabsTrigger value="mtg" className="flex-1 sm:flex-none">
                  MTG
                </TabsTrigger>
                <TabsTrigger value="pokemon" className="flex-1 sm:flex-none">
                  Pokémon
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Posts */}
            {filteredPosts.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="p-8 text-center">
                  <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Nenhuma publicação nesta categoria ainda.
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} onLike={handleLike} />
              ))
            )}
          </div>

          {/* Sidebar (hidden on small screens) */}
          <aside className="hidden lg:flex flex-col gap-4 w-72 shrink-0">
            <CommunityStats />
            <ActiveMembers />
          </aside>
        </div>
      </div>
    </div>
  );
}
