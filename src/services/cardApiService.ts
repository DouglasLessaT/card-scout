import { CardInfo, CardGame } from '@/types/card';

// Scryfall API for Magic: The Gathering
const SCRYFALL_API = 'https://api.scryfall.com';

// Pokemon TCG API
const POKEMON_API = 'https://api.pokemontcg.io/v2';

export async function searchMTGCard(query: string): Promise<CardInfo[]> {
  try {
    const response = await fetch(
      `${SCRYFALL_API}/cards/search?q=${encodeURIComponent(query)}&order=released&dir=desc`
    );
    
    if (!response.ok) {
      if (response.status === 404) return [];
      throw new Error('Failed to fetch MTG cards');
    }
    
    const data = await response.json();
    
    return data.data.slice(0, 5).map((card: any) => ({
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
  } catch (error) {
    console.error('Error searching MTG cards:', error);
    return [];
  }
}

export async function searchPokemonCard(query: string): Promise<CardInfo[]> {
  try {
    const response = await fetch(
      `${POKEMON_API}/cards?q=name:"${encodeURIComponent(query)}*"&pageSize=5&orderBy=-set.releaseDate`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch Pokemon cards');
    }
    
    const data = await response.json();
    
    return data.data.map((card: any) => ({
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
  } catch (error) {
    console.error('Error searching Pokemon cards:', error);
    return [];
  }
}

export async function searchCard(
  query: string,
  game?: CardGame
): Promise<CardInfo[]> {
  if (!query.trim()) return [];
  
  if (game === 'mtg') {
    return searchMTGCard(query);
  }
  
  if (game === 'pokemon') {
    return searchPokemonCard(query);
  }
  
  // Search both APIs in parallel
  const [mtgResults, pokemonResults] = await Promise.all([
    searchMTGCard(query),
    searchPokemonCard(query),
  ]);
  
  return [...mtgResults, ...pokemonResults];
}
