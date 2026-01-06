import { useRef } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
  onImageSelect: (imageData: string) => void;
}

export function ImageUpload({ onImageSelect }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        onImageSelect(result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      <Button
        variant="outline"
        onClick={() => inputRef.current?.click()}
        className="flex-1 h-14 gap-3"
      >
        <ImageIcon className="h-5 w-5" />
        <span>Galeria</span>
      </Button>
    </>
  );
}
