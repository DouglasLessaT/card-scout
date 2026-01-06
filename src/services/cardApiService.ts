import { CardInfo, CardGame } from '@/types/card';

// Scryfall API for Magic: The Gathering
const SCRYFALL_API = 'https://api.scryfall.com';

// Pokemon TCG API
const POKEMON_API = 'https://api.pokemontcg.io/v2';

// Simple in-memory cache
const cache = new Map<string, { data: CardInfo[]; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCached(key: string): CardInfo[] | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

function setCache(key: string, data: CardInfo[]): void {
  cache.set(key, { data, timestamp: Date.now() });
}

export async function searchMTGCard(query: string): Promise<CardInfo[]> {
  const cacheKey = `mtg:${query.toLowerCase()}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(
      `${SCRYFALL_API}/cards/search?q=${encodeURIComponent(query)}&order=released&dir=desc`,
      { signal: controller.signal }
    );
    
    clearTimeout(timeout);
    
    if (!response.ok) {
      if (response.status === 404) return [];
      throw new Error('Failed to fetch MTG cards');
    }
    
    const data = await response.json();
    
    const results = data.data.slice(0, 5).map((card: any) => ({
      id: card.id,
      name: card.name,
      game: 'mtg' as CardGame,
      set: card.set.toUpperCase(),
      setName: card.set_name,
      number: card.collector_number,
      rarity: card.rarity,
      imageUrl: card.image_uris?.normal || card.card_faces?.[0]?.image_uris?.normal || '',
      artist: card.artist,
      isFoil: false,
      prices: {
        usd: card.prices?.usd ? parseFloat(card.prices.usd) : null,
        usdFoil: card.prices?.usd_foil ? parseFloat(card.prices.usd_foil) : null,
      },
      type: card.type_line,
      text: card.oracle_text,
    }));
    
    setCache(cacheKey, results);
    return results;
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      console.warn('MTG search timeout');
      return [];
    }
    console.error('Error searching MTG cards:', error);
    return [];
  }
}

export async function searchPokemonCard(query: string): Promise<CardInfo[]> {
  const cacheKey = `pokemon:${query.toLowerCase()}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(
      `${POKEMON_API}/cards?q=name:"${encodeURIComponent(query)}*"&pageSize=5&orderBy=-set.releaseDate`,
      { signal: controller.signal }
    );
    
    clearTimeout(timeout);
    
    if (!response.ok) {
      throw new Error('Failed to fetch Pokemon cards');
    }
    
    const data = await response.json();
    
    const results = data.data.map((card: any) => ({
      id: card.id,
      name: card.name,
      game: 'pokemon' as CardGame,
      set: card.set.id.toUpperCase(),
      setName: card.set.name,
      number: card.number,
      rarity: card.rarity || 'Unknown',
      imageUrl: card.images?.large || card.images?.small || '',
      artist: card.artist,
      isFoil: false,
      prices: {
        usd: card.tcgplayer?.prices?.normal?.market || card.tcgplayer?.prices?.holofoil?.market || null,
        usdFoil: card.tcgplayer?.prices?.holofoil?.market || null,
      },
      type: card.supertype,
      text: card.flavorText,
    }));
    
    setCache(cacheKey, results);
    return results;
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      console.warn('Pokemon search timeout');
      return [];
    }
    console.error('Error searching Pokemon cards:', error);
    return [];
  }
}

export async function searchCard(
  query: string,
  game?: CardGame
): Promise<CardInfo[]> {
  if (!query.trim()) return [];
  
  // Clean and optimize query
  const cleanQuery = query.trim().split(' ').slice(0, 3).join(' ');
  
  if (game === 'mtg') {
    return searchMTGCard(cleanQuery);
  }
  
  if (game === 'pokemon') {
    return searchPokemonCard(cleanQuery);
  }
  
  // Search both APIs in parallel with race condition handling
  const [mtgResults, pokemonResults] = await Promise.all([
    searchMTGCard(cleanQuery),
    searchPokemonCard(cleanQuery),
  ]);
  
  return [...mtgResults, ...pokemonResults];
}
