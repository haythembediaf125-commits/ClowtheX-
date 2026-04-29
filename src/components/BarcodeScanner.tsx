import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
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
        // Wait for DOM element
        await new Promise((r) => setTimeout(r, 50));
        if (cancelled) return;
        const el = document.getElementById(containerId);
        if (!el) return;
        const scanner = new Html5Qrcode(containerId, { verbose: false });
        scannerRef.current = scanner;
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 150 } },
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
