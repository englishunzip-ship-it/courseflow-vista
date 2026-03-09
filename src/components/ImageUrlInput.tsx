import { ExternalLink, X, Image, Link2 } from "lucide-react";
import { ImagePreview } from "@/components/ImagePreview";

interface ImageUrlInputProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
}

export function ImageUrlInput({ label, value, onChange, placeholder = "https://..." }: ImageUrlInputProps) {
  return (
    <div className="space-y-2">
      {label && <label className="text-xs font-medium text-muted-foreground">{label}</label>}
      <div className="flex gap-2 items-center">
        <div className="relative flex-1 min-w-0">
          <Image className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-9 pr-8 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-muted-foreground/60"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <a
          href="https://postimages.org"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity whitespace-nowrap flex-shrink-0"
        >
          <Link2 className="h-3.5 w-3.5" />
          Get URL
        </a>
      </div>

      {value && (
        <div className="rounded-lg border border-border bg-accent/20 p-3">
          <ImagePreview file={null} url={value} size="lg" onRemove={() => onChange("")} />
        </div>
      )}
    </div>
  );
}
