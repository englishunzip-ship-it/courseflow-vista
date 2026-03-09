import { useEffect, useState } from "react";
import { X, ZoomIn, ImageOff } from "lucide-react";

interface Props {
  file: File | null;
  url?: string;
  onRemove?: () => void;
  size?: "sm" | "md" | "lg";
}

export function ImagePreview({ file, url, onRemove, size = "md" }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (url) {
      setPreview(url);
    } else {
      setPreview(null);
    }
  }, [file, url]);

  if (!preview) return null;

  if (error) {
    return (
      <div className="mt-2 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive/10 text-destructive text-xs">
        <ImageOff className="h-4 w-4" />
        ইমেজ লোড হয়নি
        {onRemove && (
          <button type="button" onClick={onRemove} className="ml-1 hover:text-destructive/80">
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
    );
  }

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-full max-w-sm aspect-video",
  };

  return (
    <>
      <div className="relative mt-2 inline-block group">
        <img
          src={preview}
          alt="Preview"
          onError={() => setError(true)}
          className={`${sizeClasses[size]} rounded-xl object-cover border-2 border-border/50 cursor-pointer transition-all duration-200 hover:border-primary/40 hover:shadow-lg`}
          onClick={() => setZoomed(true)}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-xl transition-colors flex items-center justify-center pointer-events-none">
          <ZoomIn className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
        </div>
        {onRemove && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="absolute -top-2 -right-2 p-1 rounded-full bg-destructive text-destructive-foreground shadow-md hover:scale-110 transition-transform"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {zoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setZoomed(false)}
        >
          <button
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            onClick={() => setZoomed(false)}
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={preview}
            alt="Preview"
            className="max-w-full max-h-[85vh] rounded-xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
