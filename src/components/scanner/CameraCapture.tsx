import { useRef, useState, useCallback, useEffect } from 'react';
import { Camera, X, SwitchCamera, Sparkles, MoveHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const FOIL_FRAME_COUNT = 5;
const FOIL_FRAME_INTERVAL_MS = 300;

interface CameraCaptureProps {
  /** Modo 'single': captura 1 foto. Modo 'foil': captura 5 frames para detecção FOIL. */
  mode?: 'single' | 'foil';
  /** Chamado no modo 'single' com o base64 da imagem capturada. */
  onCapture: (imageData: string) => void;
  /** Chamado no modo 'foil' com o array de 5 frames base64. */
  onFoilCapture?: (frames: string[]) => void;
  onClose: () => void;
}

export function CameraCapture({
  mode = 'single',
  onCapture,
  onFoilCapture,
  onClose,
}: CameraCaptureProps) {
  const videoRef  = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [stream,           setStream]           = useState<MediaStream | null>(null);
  const [isReady,          setIsReady]          = useState(false);
  const [facingMode,       setFacingMode]       = useState<'environment' | 'user'>('environment');
  const [error,            setError]            = useState<string | null>(null);
  const [foilCaptureCount, setFoilCaptureCount] = useState(0);
  const [isCapturingFoil,  setIsCapturingFoil]  = useState(false);

  // -------------------------------------------------------------------------
  // Camera lifecycle
  // -------------------------------------------------------------------------

  const stopCamera = useCallback(() => {
    stream?.getTracks().forEach(t => t.stop());
    setStream(null);
    setIsReady(false);
  }, [stream]);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1920 }, height: { ideal: 1080 } },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => setIsReady(true);
      }
    } catch {
      setError('Não foi possível acessar a câmera. Verifique as permissões.');
    }
  }, [facingMode]);

  useEffect(() => {
    startCamera();
    return () => { stream?.getTracks().forEach(t => t.stop()); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode]);

  const toggleCamera = () => {
    stopCamera();
    setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'));
  };

  // -------------------------------------------------------------------------
  // Frame capture helper
  // -------------------------------------------------------------------------

  const captureFrame = useCallback((): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.9);
  }, []);

  // -------------------------------------------------------------------------
  // Modo single: captura 1 foto
  // -------------------------------------------------------------------------

  const capturePhoto = useCallback(() => {
    const imageData = captureFrame();
    if (!imageData) return;
    stopCamera();
    onCapture(imageData);
  }, [captureFrame, stopCamera, onCapture]);

  // -------------------------------------------------------------------------
  // Modo foil: captura FOIL_FRAME_COUNT frames com intervalo entre eles
  // O usuário deve mover levemente a carta durante a captura.
  // -------------------------------------------------------------------------

  const captureFoilFrames = useCallback(async () => {
    if (isCapturingFoil) return;
    setIsCapturingFoil(true);
    setFoilCaptureCount(0);

    const frames: string[] = [];

    for (let i = 0; i < FOIL_FRAME_COUNT; i++) {
      const frame = captureFrame();
      if (frame) frames.push(frame);
      setFoilCaptureCount(i + 1);
      if (i < FOIL_FRAME_COUNT - 1) {
        await new Promise<void>(resolve => setTimeout(resolve, FOIL_FRAME_INTERVAL_MS));
      }
    }

    setIsCapturingFoil(false);
    stopCamera();
    onFoilCapture?.(frames);
  }, [isCapturingFoil, captureFrame, stopCamera, onFoilCapture]);

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  const foilProgress = (foilCaptureCount / FOIL_FRAME_COUNT) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-foreground flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-card/90 backdrop-blur-sm">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => { stopCamera(); onClose(); }}
          className="text-card-foreground"
          disabled={isCapturingFoil}
        >
          <X className="h-6 w-6" />
        </Button>

        <span className="text-card-foreground font-medium flex items-center gap-2">
          {mode === 'foil' && <Sparkles className="h-4 w-4 text-yellow-400" />}
          {mode === 'foil' ? 'Detecção FOIL' : 'Capturar Carta'}
        </span>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCamera}
          className="text-card-foreground"
          disabled={isCapturingFoil}
        >
          <SwitchCamera className="h-6 w-6" />
        </Button>
      </div>

      {/* Camera View */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {error ? (
          <div className="text-center p-8">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={startCamera}>Tentar Novamente</Button>
          </div>
        ) : (
          <>
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />

            {/* Overlay de enquadramento */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className={`w-[280px] h-[400px] border-2 rounded-lg transition-colors ${
                  isCapturingFoil ? 'border-yellow-400 opacity-90' : 'border-primary opacity-70'
                }`}
              >
                <div
                  className={`absolute -top-6 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs whitespace-nowrap ${
                    isCapturingFoil
                      ? 'bg-yellow-400/90 text-yellow-900'
                      : 'bg-primary/80 text-primary-foreground'
                  }`}
                >
                  {isCapturingFoil ? `Capturando frame ${foilCaptureCount}/${FOIL_FRAME_COUNT}...` : 'Posicione a carta aqui'}
                </div>
              </div>
            </div>

            {/* Instrução e progresso FOIL (visível apenas no modo foil) */}
            {mode === 'foil' && (
              <div className="absolute bottom-32 left-0 right-0 flex flex-col items-center gap-3 px-8">
                <div
                  className={`flex items-center gap-2 text-white text-sm font-medium ${
                    isCapturingFoil ? 'opacity-100' : 'opacity-70'
                  }`}
                >
                  <MoveHorizontal className={`h-4 w-4 ${isCapturingFoil ? 'animate-bounce' : ''}`} />
                  {isCapturingFoil
                    ? 'Continue movendo a carta suavemente...'
                    : 'Mova suavemente a carta ao capturar'}
                </div>

                {isCapturingFoil && (
                  <div className="w-full max-w-[240px]">
                    <Progress value={foilProgress} className="h-2 bg-white/20" />
                    <div className="flex justify-between mt-1 px-1">
                      {Array.from({ length: FOIL_FRAME_COUNT }, (_, i) => (
                        <span
                          key={i}
                          className={`text-sm transition-colors ${
                            i < foilCaptureCount ? 'text-yellow-400' : 'text-white/30'
                          }`}
                        >
                          ●
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Capture Button */}
      <div className="p-6 bg-card/90 backdrop-blur-sm flex flex-col items-center gap-3">
        {mode === 'foil' ? (
          <>
            <Button
              size="lg"
              onClick={captureFoilFrames}
              disabled={!isReady || isCapturingFoil}
              className="h-14 px-8 gap-2 bg-yellow-500 hover:bg-yellow-600 text-yellow-950 disabled:opacity-60"
            >
              <Sparkles className="h-5 w-5" />
              {isCapturingFoil
                ? `Capturando ${foilCaptureCount}/${FOIL_FRAME_COUNT}...`
                : 'Iniciar Detecção FOIL'}
            </Button>
            {!isCapturingFoil && (
              <p className="text-xs text-card-foreground/60 text-center max-w-[240px]">
                Pressione e mova a carta levemente durante {(FOIL_FRAME_COUNT * FOIL_FRAME_INTERVAL_MS / 1000).toFixed(1)}s de captura
              </p>
            )}
          </>
        ) : (
          <Button
            size="lg"
            onClick={capturePhoto}
            disabled={!isReady}
            className="w-20 h-20 rounded-full"
          >
            <Camera className="h-8 w-8" />
          </Button>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
