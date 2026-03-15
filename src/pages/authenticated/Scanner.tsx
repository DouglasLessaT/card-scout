import { useState, useCallback } from 'react';
import { Camera, Search, ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CameraCapture } from '@/components/scanner/CameraCapture';
import { ImageUpload } from '@/components/scanner/ImageUpload';
import { ScanProgress, ScanStage } from '@/components/scanner/ScanProgress';
import { CardSearchResults } from '@/components/scanner/CardSearchResults';
import { CardResult } from '@/components/scanner/CardResult';
import { GameSelector } from '@/components/scanner/GameSelector';
import { CardInfo, CardGame, ExchangeRates } from '@/types/card';
import { extractTextFromImage, parseCardInfo } from '@/services/ocrService';
import { searchCard } from '@/services/cardApiService';
import { getExchangeRates } from '@/services/currencyService';
import { detectFoil, FoilDetectionResult } from '@/services/scanService';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

type ScanState = 'idle' | 'camera' | 'foil-camera' | 'scanning' | 'results' | 'detail';

export default function Scanner() {
  const [scanState,         setScanState]         = useState<ScanState>('idle');
  const [scanStage,         setScanStage]         = useState<ScanStage>('ocr');
  const [scanProgress,      setScanProgress]      = useState(0);
  const [capturedImage,     setCapturedImage]     = useState<string>('');
  const [foundCards,        setFoundCards]        = useState<CardInfo[]>([]);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number>(0);
  const [exchangeRates,     setExchangeRates]     = useState<ExchangeRates>({ brl: 5, btc: 0.00001 });
  const [extractedText,     setExtractedText]     = useState('');
  const [manualSearch,      setManualSearch]      = useState('');
  const [selectedGame,      setSelectedGame]      = useState<CardGame | null>(null);
  const [foilResult,        setFoilResult]        = useState<FoilDetectionResult | null>(null);
  const { toast } = useToast();

  // -------------------------------------------------------------------------
  // Scan OCR normal (1 frame)
  // -------------------------------------------------------------------------

  const processImage = useCallback(async (imageData: string) => {
    setCapturedImage(imageData);
    setScanState('scanning');
    setScanStage('ocr');
    setScanProgress(0);

    try {
      const ocrResult = await extractTextFromImage(imageData, (progress) => {
        setScanProgress(progress * 0.5);
      });
      setExtractedText(ocrResult.text);

      setScanStage('search');
      setScanProgress(50);

      const { possibleName } = parseCardInfo(ocrResult.text);
      if (!possibleName) {
        toast({
          title: 'Texto não identificado',
          description: 'Não foi possível extrair texto da imagem.',
          variant: 'destructive',
        });
        setScanState('idle');
        return;
      }

      const cards = await searchCard(possibleName, selectedGame || undefined);
      setFoundCards(cards);
      setScanProgress(80);

      setScanStage('prices');
      const rates = await getExchangeRates();
      setExchangeRates(rates);
      setScanProgress(100);

      setScanState('results');
    } catch {
      toast({ title: 'Erro ao processar', description: 'Ocorreu um erro. Tente novamente.', variant: 'destructive' });
      setScanState('idle');
    }
  }, [toast, selectedGame]);

  // -------------------------------------------------------------------------
  // Scan FOIL (5 frames consecutivos)
  // -------------------------------------------------------------------------

  const handleFoilFrames = useCallback(async (frames: string[]) => {
    setCapturedImage(frames[0] ?? '');
    setScanState('scanning');
    setScanStage('foil');
    setScanProgress(20);

    try {
      setScanProgress(50);
      const result = await detectFoil(frames, selectedGame || undefined);
      setFoilResult(result);
      setScanProgress(100);

      toast({
        title: result.isFoil ? '✨ Carta FOIL detectada!' : 'Carta não-FOIL',
        description: `Confiança: ${result.confidence.toFixed(1)}%`,
      });

      setScanState('idle');
    } catch (err) {
      toast({
        title: 'Erro na detecção FOIL',
        description: err instanceof Error ? err.message : 'Tente novamente.',
        variant: 'destructive',
      });
      setScanState('idle');
    }
  }, [toast, selectedGame]);

  // -------------------------------------------------------------------------
  // Busca manual
  // -------------------------------------------------------------------------

  const handleManualSearch = async () => {
    if (!manualSearch.trim()) return;
    setScanState('scanning');
    setScanStage('search');
    setScanProgress(30);

    try {
      const cards = await searchCard(manualSearch, selectedGame || undefined);
      setFoundCards(cards);
      setScanProgress(70);

      setScanStage('prices');
      const rates = await getExchangeRates();
      setExchangeRates(rates);
      setScanProgress(100);

      setScanState('results');
    } catch {
      toast({ title: 'Erro na busca', description: 'Não foi possível buscar a carta.', variant: 'destructive' });
      setScanState('idle');
    }
  };

  const handleSelectCard = (card: CardInfo) => {
    const index = foundCards.findIndex(c => c.id === card.id);
    setSelectedCardIndex(index >= 0 ? index : 0);
    setScanState('detail');
  };

  const resetScan = () => {
    setScanState('idle');
    setCapturedImage('');
    setFoundCards([]);
    setSelectedCardIndex(0);
    setExtractedText('');
    setManualSearch('');
    setFoilResult(null);
  };

  // -------------------------------------------------------------------------
  // Camera states (renderizados fora do layout principal)
  // -------------------------------------------------------------------------

  if (scanState === 'camera') {
    return (
      <CameraCapture
        mode="single"
        onCapture={processImage}
        onClose={() => setScanState('idle')}
      />
    );
  }

  if (scanState === 'foil-camera') {
    return (
      <CameraCapture
        mode="foil"
        onCapture={processImage}
        onFoilCapture={handleFoilFrames}
        onClose={() => setScanState('idle')}
      />
    );
  }

  // -------------------------------------------------------------------------
  // Layout principal
  // -------------------------------------------------------------------------

  return (
    <div className="min-h-0 flex-1 flex flex-col">
      {scanState === 'idle' && (
        <div className="flex-1 min-h-0 overflow-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="icon" className="shrink-0">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold truncate">Scanner de Cartas</h1>
              <p className="text-sm text-muted-foreground line-clamp-2">
                Escaneie ou busque cartas para adicionar à sua coleção
              </p>
            </div>
          </div>

          {/* Resultado da última detecção FOIL */}
          {foilResult && (
            <Card className={`border-2 ${foilResult.isFoil ? 'border-yellow-400' : 'border-border'}`}>
              <CardContent className="p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Sparkles className={`h-5 w-5 shrink-0 ${foilResult.isFoil ? 'text-yellow-500' : 'text-muted-foreground'}`} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium">
                      {foilResult.isFoil ? 'Carta FOIL detectada' : 'Carta não-FOIL'}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      Confiança: {foilResult.confidence.toFixed(1)}% · {foilResult.details.framesAnalyzed} frames analisados
                    </p>
                  </div>
                </div>
                <Badge variant={foilResult.isFoil ? 'default' : 'secondary'} className="shrink-0">
                  {foilResult.isFoil ? 'FOIL' : 'Normal'}
                </Badge>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <p className="text-sm font-medium">Selecione o jogo (opcional)</p>
                <GameSelector selected={selectedGame} onSelect={setSelectedGame} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <Button
                  size="lg"
                  className="w-full h-14 gap-3 text-base"
                  onClick={() => setScanState('camera')}
                >
                  <Camera className="h-5 w-5" />
                  <span className="text-sm sm:text-base">Abrir Câmera</span>
                </Button>

                <div className="w-full min-h-[3.5rem]">
                  <ImageUpload onImageSelect={processImage} />
                </div>
              </div>

              {/* Botão de detecção FOIL */}
              <Button
                variant="outline"
                size="lg"
                className="w-full h-12 gap-2 border-yellow-400/50 hover:border-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-950/20"
                onClick={() => { setFoilResult(null); setScanState('foil-camera'); }}
              >
                <Sparkles className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">Detectar FOIL</span>
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">ou busque manualmente</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Nome da carta..."
                  value={manualSearch}
                  onChange={(e) => setManualSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleManualSearch()}
                  className="min-w-0"
                />
                <Button
                  onClick={handleManualSearch}
                  disabled={!manualSearch.trim()}
                  size="icon"
                  className="shrink-0"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {scanState === 'scanning' && (
        <div className="flex-1 min-h-0 flex items-center justify-center p-4">
          <ScanProgress
            stage={scanStage}
            progress={scanProgress}
            imagePreview={capturedImage || '/placeholder.svg'}
          />
        </div>
      )}

      {scanState === 'results' && (
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <CardSearchResults
            cards={foundCards}
            onSelect={handleSelectCard}
            extractedText={extractedText}
          />
          <div className="p-4 border-t border-border shrink-0">
            <Button variant="outline" className="w-full" onClick={resetScan}>
              Nova Busca
            </Button>
          </div>
        </div>
      )}

      {scanState === 'detail' && foundCards.length > 0 && (
        <CardResult
          cards={foundCards}
          selectedIndex={selectedCardIndex}
          rates={exchangeRates}
          onScanAgain={resetScan}
          onCardChange={setSelectedCardIndex}
        />
      )}
    </div>
  );
}
