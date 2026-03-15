import { CardGame } from '@/types/card';

const API_BASE = import.meta.env.VITE_API_URL ?? '/api';

export interface FoilDetectionResult {
  isFoil: boolean;
  confidence: number;
  details: {
    framesAnalyzed: number;
    totalPixels: number;
    highVariancePixels: number;
    foilPixelRatio: number;
    threshold: number;
  };
}

export interface PHashResult {
  hash: string;
  matchThreshold: number;
}

/**
 * Envia 2–5 frames base64 para o backend detectar se a carta é FOIL.
 *
 * Os frames devem ser capturados consecutivamente enquanto o usuário
 * move levemente a carta (intervalo ~300ms entre frames).
 *
 * @param frames  Array de data URLs (canvas.toDataURL) ou base64 puro
 * @param game    Jogo opcional para contexto (informativo no backend)
 */
export async function detectFoil(
  frames: string[],
  game?: CardGame
): Promise<FoilDetectionResult> {
  const response = await fetch(`${API_BASE}/scan/foil`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ frames, game }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? `Erro ${response.status} na detecção FOIL`);
  }

  return response.json();
}

/**
 * Calcula o pHash de um frame de carta para identificação por similaridade de imagem.
 *
 * O hash retornado pode ser comparado (distância de Hamming ≤ matchThreshold)
 * com os hashes armazenados em Card.perceptualHash no banco de dados.
 *
 * @param frame  Data URL ou base64 da imagem capturada
 * @param game   Jogo opcional
 */
export async function computePHash(
  frame: string,
  game?: CardGame
): Promise<PHashResult> {
  const response = await fetch(`${API_BASE}/scan/phash`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ frame, game }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? `Erro ${response.status} ao calcular pHash`);
  }

  return response.json();
}
