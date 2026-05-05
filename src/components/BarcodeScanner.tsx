import { useEffect, useRef, useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { X, Keyboard } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDetected: (code: string) => void;
}

type BarcodeFormat =
  | "ean_13" | "ean_8" | "code_128" | "code_39"
  | "qr_code" | "upc_a" | "upc_e" | "itf";

interface BarcodeDetectorResult { rawValue: string; }
interface BarcodeDetectorInstance {
  detect(source: HTMLVideoElement): Promise<BarcodeDetectorResult[]>;
}
interface BarcodeDetectorConstructor {
  new(options?: { formats: BarcodeFormat[] }): BarcodeDetectorInstance;
}
declare global {
  interface Window { BarcodeDetector?: BarcodeDetectorConstructor; }
}

type ScanMode = "barcode-detector" | "html5" | "manual" | "loading";

export function BarcodeScanner({ open, onOpenChange, onDetected }: Props) {
  const { t } = useApp();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const html5QrRef = useRef<{ stop: () => Promise<void> } | null>(null);
  const [mode, setMode] = useState<ScanMode>("loading");
  const [error, setError] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState("");

  /* ── cleanup ─────────────────────────────────────────── */
  const stopAll = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((tr) => tr.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    if (html5QrRef.current) {
      html5QrRef.current.stop().catch(() => {});
      html5QrRef.current = null;
    }
  };

  /* ── main effect ──────────────────────────────────────── */
  useEffect(() => {
    if (!open) {
      stopAll();
      setError(null);
      setMode("loading");
      setManualCode("");
      return;
    }

    let cancelled = false;

    /* Path A — native BarcodeDetector (Chrome 90+, Android 9+) */
    const startBarcodeDetector = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      if (cancelled) { stream.getTracks().forEach((tr) => tr.stop()); return; }
      streamRef.current = stream;
      const vid = videoRef.current;
      if (vid) { vid.srcObject = stream; await vid.play(); }
      setMode("barcode-detector");

      const detector = new window.BarcodeDetector!({
        formats: ["ean_13", "ean_8", "code_128", "code_39", "qr_code", "upc_a", "upc_e"],
      });

      const scan = async () => {
        if (cancelled) return;
        const v = videoRef.current;
        if (!v || v.readyState < 2) {
          rafRef.current = requestAnimationFrame(scan);
          return;
        }
        try {
          const results = await detector.detect(v);
          if (results.length > 0) {
            const code = results[0].rawValue;
            stopAll();
            onDetected(code);
            onOpenChange(false);
            return;
          }
        } catch { /* ignore per-frame errors */ }
        if (!cancelled) rafRef.current = requestAnimationFrame(scan);
      };
      rafRef.current = requestAnimationFrame(scan);
    };

    /* Path B — html5-qrcode fallback (broader compatibility) */
    const startHtml5 = async () => {
      setMode("html5");
      await new Promise((r) => setTimeout(r, 80)); // let DOM render
      if (cancelled) return;

      const { Html5Qrcode } = await import("html5-qrcode");
      if (cancelled) return;

      const containerId = "bscan-html5-root";
      const el = document.getElementById(containerId);
      if (!el) return;

      const h5 = new Html5Qrcode(containerId, { verbose: false });
      html5QrRef.current = h5;

      await h5.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 260, height: 200 } },
        (decoded: string) => {
          if (cancelled) return;
          stopAll();
          onDetected(decoded);
          onOpenChange(false);
        },
        () => { /* ignore non-fatal errors */ },
      );
    };

    /* Entry point */
    const start = async () => {
      try {
        if (window.BarcodeDetector) {
          await startBarcodeDetector();
        } else {
          await startHtml5();
        }
      } catch (err) {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : "";
          if (msg.includes("Permission") || msg.includes("NotAllowed")) {
            setError(t.scanner.permissionDenied);
          } else if (!window.BarcodeDetector) {
            // html5-qrcode also failed — offer manual fallback
            setMode("manual");
          } else {
            setError(t.scanner.permissionDenied);
          }
        }
      }
    };

    start();
    return () => {
      cancelled = true;
      stopAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  /* ── manual submit ────────────────────────────────────── */
  const submitManual = () => {
    const code = manualCode.trim();
    if (!code) return;
    onDetected(code);
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0">
        <span className="text-white font-semibold text-base">{t.scanner.title}</span>
        <div className="flex items-center gap-1">
          {mode !== "manual" && (
            <Button
              variant="ghost"
              size="icon"
              className="text-white/70 hover:text-white hover:bg-white/20"
              title="إدخال يدوي"
              onClick={() => { stopAll(); setMode("manual"); }}
            >
              <Keyboard className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:text-white hover:bg-white/20"
            onClick={() => onOpenChange(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 relative overflow-hidden">

        {/* ── BarcodeDetector mode ── */}
        {(mode === "barcode-detector" || mode === "loading") && (
          <>
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              playsInline
              muted
              autoPlay
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <div className="w-64 h-48 relative">
                <span className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-gold rounded-tl-lg" />
                <span className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-gold rounded-tr-lg" />
                <span className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-gold rounded-bl-lg" />
                <span className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-gold rounded-br-lg" />
                <div
                  className="absolute inset-x-0 h-0.5 bg-gold/80"
                  style={{ animation: "scanline 2s linear infinite", top: "50%" }}
                />
              </div>
              <p className="text-white text-sm bg-black/60 px-4 py-2 rounded-full">
                {error ?? t.scanner.hint}
              </p>
            </div>
          </>
        )}

        {/* ── html5-qrcode fallback mode ── */}
        {mode === "html5" && (
          <>
            {/* html5-qrcode renders its video inside this div */}
            <div
              id="bscan-html5-root"
              className="absolute inset-0 [&_video]:!w-full [&_video]:!h-full [&_video]:object-cover [&_#bscan-html5-root__dashboard]:hidden [&_#bscan-html5-root__header-message]:hidden"
            />
            {/* Our overlay on top */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 pointer-events-none">
              <div className="w-64 h-48 relative">
                <span className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-gold rounded-tl-lg" />
                <span className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-gold rounded-tr-lg" />
                <span className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-gold rounded-bl-lg" />
                <span className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-gold rounded-br-lg" />
                <div
                  className="absolute inset-x-0 h-0.5 bg-gold/80"
                  style={{ animation: "scanline 2s linear infinite", top: "50%" }}
                />
              </div>
              <p className="text-white text-sm bg-black/60 px-4 py-2 rounded-full">
                {t.scanner.hint}
              </p>
            </div>
          </>
        )}

        {/* ── Manual entry fallback ── */}
        {mode === "manual" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6">
            <p className="text-white text-sm text-center">
              {t.scanner.permissionDenied}
            </p>
            <p className="text-white/60 text-xs text-center">
              {t.scanner.hint}
            </p>
            <div className="w-full max-w-xs space-y-3">
              <Input
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitManual()}
                placeholder="أدخل الباركود يدوياً..."
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                autoFocus
              />
              <Button
                variant="gold"
                className="w-full"
                onClick={submitManual}
                disabled={!manualCode.trim()}
              >
                {t.form.save}
              </Button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes scanline {
          0%   { transform: translateY(-96px); opacity: 1; }
          50%  { opacity: 0.6; }
          100% { transform: translateY(96px); opacity: 1; }
        }
        #bscan-html5-root > div > div > img { display: none !important; }
        #bscan-html5-root > div > div > select { display: none !important; }
        #bscan-html5-root > div > span { display: none !important; }
      `}</style>
    </div>
  );
}
