import { Progress } from '@/components/ui/progress';
import { FileSearch, Search, DollarSign, Sparkles } from 'lucide-react';

export type ScanStage = 'ocr' | 'search' | 'prices' | 'foil';

interface ScanProgressProps {
  stage: ScanStage;
  progress: number;
  imagePreview: string;
}

const stageInfo: Record<ScanStage, { icon: React.ElementType; label: string; accent?: string }> = {
  ocr: {
    icon: FileSearch,
    label: 'Extraindo texto da imagem...',
  },
  search: {
    icon: Search,
    label: 'Buscando carta nas APIs...',
  },
  prices: {
    icon: DollarSign,
    label: 'Obtendo cotações...',
  },
  foil: {
    icon: Sparkles,
    label: 'Analisando reflexo FOIL...',
    accent: 'text-yellow-500',
  },
};

export function ScanProgress({ stage, progress, imagePreview }: ScanProgressProps) {
  const { icon: Icon, label, accent } = stageInfo[stage];

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-6">
      <div
        className={`w-48 h-64 rounded-lg overflow-hidden shadow-lg border transition-colors ${
          stage === 'foil' ? 'border-yellow-400/60' : 'border-border'
        }`}
      >
        <img src={imagePreview} alt="Carta capturada" className="w-full h-full object-cover" />
      </div>

      <div className="w-full max-w-xs space-y-4">
        <div className={`flex items-center justify-center gap-3 ${accent ?? 'text-primary'}`}>
          <Icon className="h-5 w-5 animate-pulse" />
          <span className="text-sm font-medium">{label}</span>
        </div>

        <Progress value={progress} className="h-2" />

        <p className="text-center text-xs text-muted-foreground">{Math.round(progress)}% concluído</p>
      </div>
    </div>
  );
}
