import { useEffect, useRef, useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDetected: (code: string) => void;
}

export function BarcodeScanner({ open, onOpenChange, onDetected }: Props) {
  const { t } = useApp();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const stop = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((tr) => tr.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    if (!open) {
      stop();
      setError(null);
      return;
    }

    let cancelled = false;

    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
        });
        if (cancelled) { stream.getTracks().forEach((tr) => tr.stop()); return; }
        streamRef.current = stream;
        const vid = videoRef.current;
        if (vid) { vid.srcObject = stream; await vid.play(); }

        // استخدام ZXing عبر CDN - يعمل على جميع الأجهزة
        const ZXing = await import("https://cdn.jsdelivr.net/npm/@zxing/library@0.20.0/+esm" as any);
        const codeReader = new ZXing.BrowserMultiFormatReader();

        const scan = async () => {
          const v = videoRef.current;
          if (!v || v.readyState < 2) { setTimeout(scan, 300); return; }
          try {
            const result = await codeReader.decodeFromVideoElement(v);
            if (result) {
              stop();
              onDetected(result.getText());
              onOpenChange(false);
            }
          } catch {
            if (!cancelled) setTimeout(scan, 500);
          }
        };

        scan();
      } catch {
        if (!cancelled) setError("لا يمكن الوصول إلى الكاميرا");
      }
    };

    start();
    return () => { cancelled = true; stop(); };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 shrink-0">
        <span className="text-white font-semibold text-base">{t.scanner.title}</span>
        <Button variant="ghost" size="icon" className="text-white hover:text-white hover:bg-white/20" onClick={() => onOpenChange(false)}>
          <X className="w-5 h-5" />
        </Button>
      </div>
      <div className="flex-1 relative overflow-hidden">
        <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" playsInline muted autoPlay />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <div className="w-64 h-48 relative">
            <span className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-gold rounded-tl-lg" />
            <span className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-gold rounded-tr-lg" />
            <span className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-gold rounded-bl-lg" />
            <span className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-gold rounded-br-lg" />
            <div className="absolute inset-x-0 h-0.5 bg-gold/80" style={{ animation: "scanline 2s linear infinite", top: "50%" }} />
          </div>
          <p className="text-white text-sm bg-black/60 px-4 py-2 rounded-full">{error ?? t.scanner.hint}</p>
        </div>
      </div>
      <style>{`@keyframes scanline { 0% { transform: translateY(-96px); opacity: 1; } 50% { opacity: 0.6; } 100% { transform: translateY(96px); opacity: 1; } }`}</style>
    </div>
  );
}
