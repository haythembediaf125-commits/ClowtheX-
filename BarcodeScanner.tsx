import { useEffect, useRef, useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { X, Camera } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDetected: (code: string) => void;
}

const SCANNER_ID = "html5qr-scanner";

export function BarcodeScanner({ open, onOpenChange, onDetected }: Props) {
  const { t } = useApp();
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [status, setStatus] = useState<"loading" | "scanning" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  const stopScanner = async () => {
    try {
      if (scannerRef.current) {
        const state = scannerRef.current.getState();
        if (state === 2 || state === 3) {
          await scannerRef.current.stop();
        }
        scannerRef.current.clear();
        scannerRef.current = null;
      }
    } catch {
      // تجاهل أخطاء الإيقاف
    }
  };

  useEffect(() => {
    if (!open) {
      stopScanner();
      setStatus("loading");
      setErrorMsg("");
      return;
    }

    let alive = true;

    const startScanner = async () => {
      await new Promise((r) => setTimeout(r, 300));
      if (!alive) return;

      try {
        const html5QrCode = new Html5Qrcode(SCANNER_ID, { verbose: false });
        scannerRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 180 },
            aspectRatio: 1.5,
            disableFlip: false,
          },
          (decodedText) => {
            if (!alive) return;
            stopScanner();
            onDetected(decodedText);
            onOpenChange(false);
          },
          () => {}
        );

        if (alive) setStatus("scanning");
      } catch (err: any) {
        if (!alive) return;
        setStatus("error");
        const msg = err?.message ?? String(err);
        if (msg.includes("Permission") || msg.includes("NotAllowed") || msg.includes("permission")) {
          setErrorMsg("❌ تم رفض إذن الكاميرا\nاذهب إلى إعدادات جهازك → التطبيقات → ClowtheX → الأذونات → فعّل الكاميرا");
        } else if (msg.includes("NotFound") || msg.includes("Devices not found")) {
          setErrorMsg("❌ لم يتم العثور على كاميرا في هذا الجهاز");
        } else if (msg.includes("NotReadable") || msg.includes("Could not start")) {
          setErrorMsg("❌ الكاميرا مستخدمة من تطبيق آخر\nأغلق التطبيقات الأخرى وأعد المحاولة");
        } else {
          setErrorMsg("❌ خطأ في الكاميرا:\n" + msg);
        }
      }
    };

    startScanner();
    return () => { alive = false; stopScanner(); };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 shrink-0 bg-black/90 backdrop-blur">
        <span className="text-white font-semibold text-base">{t.scanner.title}</span>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:text-white hover:bg-white/20"
          onClick={() => { stopScanner(); onOpenChange(false); }}
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex-1 relative overflow-hidden bg-black flex flex-col items-center justify-center">
        <div id={SCANNER_ID} className="w-full max-w-sm" style={{ minHeight: 300 }} />

        {status === "loading" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black">
            <Camera className="w-14 h-14 text-white animate-pulse" />
            <p className="text-white text-sm">جاري تشغيل الكاميرا...</p>
          </div>
        )}

        {status === "error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black px-8">
            <p className="text-white text-sm bg-red-900/90 px-5 py-4 rounded-2xl text-center leading-relaxed whitespace-pre-line">
              {errorMsg}
            </p>
            <Button
              variant="outline"
              className="text-white border-white/40 hover:bg-white/10"
              onClick={() => { stopScanner(); onOpenChange(false); }}
            >
              إغلاق
            </Button>
          </div>
        )}

        {status === "scanning" && (
          <p className="mt-4 text-white text-sm bg-black/60 px-4 py-2 rounded-full">
            {t.scanner.hint}
          </p>
        )}
      </div>

      <style>{`
        #${SCANNER_ID} video { border-radius: 12px; }
        #${SCANNER_ID} img { display: none !important; }
        #${SCANNER_ID} > div:last-child { display: none !important; }
      `}</style>
    </div>
  );
}
