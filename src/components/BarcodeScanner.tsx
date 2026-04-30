import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import { Camera } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onDetected: (code: string) => void;
}

export function BarcodeScanner({ open, onOpenChange, onDetected }: Props) {
  const { t } = useApp();
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerId = "barcode-reader";
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    let cancelled = false;

    const start = async () => {
      try {
        await new Promise((r) => setTimeout(r, 30));
        if (cancelled) return;
        const el = document.getElementById(containerId);
        if (!el) return;
        const scanner = new Html5Qrcode(containerId, {
          verbose: false,
          formatsToSupport: [
            Html5QrcodeSupportedFormats.QR_CODE,
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.EAN_8,
            Html5QrcodeSupportedFormats.UPC_A,
            Html5QrcodeSupportedFormats.UPC_E,
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.CODE_39,
          ],
          useBarCodeDetectorIfSupported: true,
        });
        scannerRef.current = scanner;
        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 30,
            qrbox: (vw, vh) => {
              const minEdge = Math.min(vw, vh);
              const size = Math.floor(minEdge * 0.75);
              return { width: size, height: Math.floor(size * 0.7) };
            },
            aspectRatio: 1.7777,
            disableFlip: false,
            videoConstraints: {
              facingMode: "environment",
              width: { ideal: 1280 },
              height: { ideal: 720 },
              frameRate: { ideal: 30, max: 60 },
            },
          },
          (decoded) => {
            onDetected(decoded);
            stop();
            onOpenChange(false);
          },
          () => {},
        );
      } catch (e) {
        setError(t.scanner.permissionDenied);
      }
    };

    const stop = async () => {
      const s = scannerRef.current;
      if (s) {
        try {
          if (s.isScanning) await s.stop();
          await s.clear();
        } catch {
          /* ignore */
        }
        scannerRef.current = null;
      }
    };

    start();
    return () => {
      cancelled = true;
      stop();
    };
  }, [open, onDetected, onOpenChange, t.scanner.permissionDenied]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="w-4 h-4" /> {t.scanner.title}
          </DialogTitle>
        </DialogHeader>
        <p className="text-xs text-muted-foreground">{t.scanner.hint}</p>
        <div
          id={containerId}
          className="w-full aspect-video rounded-lg overflow-hidden bg-black"
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t.scanner.cancel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
