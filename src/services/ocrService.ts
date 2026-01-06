import Tesseract from 'tesseract.js';

export interface OCRResult {
  text: string;
  confidence: number;
}

export async function extractTextFromImage(
  imageSource: string | File,
  onProgress?: (progress: number) => void
): Promise<OCRResult> {
  const result = await Tesseract.recognize(imageSource, 'eng', {
    logger: (m) => {
      if (m.status === 'recognizing text' && onProgress) {
        onProgress(m.progress * 100);
      }
    },
  });

  return {
    text: result.data.text,
    confidence: result.data.confidence,
  };
}

export function parseCardInfo(text: string): {
  possibleName: string;
  possibleSet: string;
  possibleNumber: string;
} {
  const lines = text.split('\n').filter((line) => line.trim().length > 0);
  
  // First non-empty line is usually the card name
  const possibleName = lines[0]?.trim() || '';
  
  // Look for set code pattern (e.g., "XY12", "SV1", "NEO")
  const setPattern = /\b([A-Z]{2,4}\d{0,3})\b/;
  const setMatch = text.match(setPattern);
  const possibleSet = setMatch ? setMatch[1] : '';
  
  // Look for card number pattern (e.g., "123/200", "45/102")
  const numberPattern = /(\d{1,3})\s*[\/\\]\s*(\d{1,3})/;
  const numberMatch = text.match(numberPattern);
  const possibleNumber = numberMatch ? numberMatch[1] : '';
  
  return {
    possibleName: cleanCardName(possibleName),
    possibleSet,
    possibleNumber,
  };
}

function cleanCardName(name: string): string {
  // Remove common OCR artifacts and clean up the name
  return name
    .replace(/[^\w\s'-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
