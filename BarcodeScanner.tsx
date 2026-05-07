import { useEffect, useRef, useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { X, Camera } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDetected: (code: string) => void;
}

export function BarcodeScanner({ open, onOpenChange, onDetected }: Props) {
  const { t } = useApp();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const [status, setStatus] = useState<"loading" | "scanning" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  const stopAll = () => {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    if (streamRef.current) { streamRef.current.getTracks().forEach((tr) => tr.stop()); streamRef.current = null; }
    if (videoRef.current) { videoRef.current.srcObject = null; }
  };

  const loadScript = (src: string, id: string): Promise<void> =>
    new Promise((res, rej) => {
      if (document.getElementById(id)) { res(); return; }
      const s = document.createElement("script");
      s.id = id; s.src = src;
      s.onload = () => res();
      s.onerror = () => rej(new Error("script load failed: " + src));
      document.head.appendChild(s);
    });

  useEffect(() => {
    if (!open) { stopAll(); setStatus("loading"); setErrorMsg(""); return; }

    let alive = true;

    (async () => {
      try {
        // 1. طلب الكاميرا
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        if (!alive) { stream.getTracks().forEach((tr) => tr.stop()); return; }
        streamRef.current = stream;

        const vid = videoRef.current!;
        vid.srcObject = stream;
        await new Promise<void>((res, rej) => {
          vid.onloadedmetadata = () => res();
          vid.onerror = () => rej(new Error("video error"));
          setTimeout(() => rej(new Error("timeout")), 8000);
        });
        await vid.play();
        if (!alive) return;
        setStatus("scanning");

        // 2. تحميل jsQR
        await loadScript("https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js", "jsqr-cdn");

        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d", { willReadFrequently: true })!;

        // 3. حلقة المسح
        const tick = () => {
          if (!alive || !videoRef.current) return;
          const v = videoRef.current;
          if (v.readyState >= 2 && v.videoWidth > 0) {
            canvas.width = v.videoWidth;
            canvas.height = v.videoHeight;
            ctx.drawImage(v, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            // محاولة jsQR
            // @ts-ignore
            if (typeof window.jsQR !== "undefined") {
              // @ts-ignore
              const qr = window.jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "dontInvert" });
              if (qr?.data && alive) {
                stopAll();
                onDetected(qr.data);
                onOpenChange(false);
                return;
              }
            }

            // محاولة BarcodeDetector (أجهزة حديثة)
            if ("BarcodeDetector" in window) {
              // @ts-ignore
              new window.BarcodeDetector({ formats: ["ean_13","ean_8","code_128","code_39","qr_code","upc_a","upc_e"] })
                .detect(v)
                .then((results: any[]) => {
                  if (results.length > 0 && alive) {
                    stopAll();
                    onDetected(results[0].rawValue);
                    onOpenChange(false);
                  }
                })
                .catch(() => {});
            }
          }
          if (alive) rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);

      } catch (err: any) {
        if (!alive) return;
        setStatus("error");
        if (err?.name === "NotAllowedError" || err?.name === "PermissionDeniedError") {
          setErrorMsg("❌ تم رفض إذن الكاميرا\nاذهب إلى إعدادات الجهاز وأعط إذن الكاميرا للتطبيق");
        } else if (err?.name === "NotFoundError") {
          setErrorMsg("❌ لم يتم العثور على كاميرا في هذا الجهاز");
        } else if (err?.name === "NotReadableError") {
          setErrorMsg("❌ الكاميرا مستخدمة من تطبيق آخر، أغلقه وأعد المحاولة");
        } else {
          setErrorMsg("❌ خطأ: " + (err?.message ?? "غير معروف"));
        }
      }
    })();

    return () => { alive = false; stopAll(); };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* رأس الصفحة */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0 bg-black/80 backdrop-blur">
        <span className="text-white font-semibold text-base">{t.scanner.title}</span>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:text-white hover:bg-white/20"
          onClick={() => { stopAll(); onOpenChange(false); }}
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* الفيديو */}
      <div className="flex-1 relative overflow-hidden bg-black">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          playsInline
          muted
          autoPlay
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* طبقة التراكب */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 pointer-events-none">
          {status === "loading" && (
            <div className="flex flex-col items-center gap-3">
              <Camera className="w-14 h-14 text-white animate-pulse" />
              <p className="text-white text-sm bg-black/60 px-4 py-2 rounded-full">
                جاري تشغيل الكاميرا...
              </p>
            </div>
          )}

          {status === "scanning" && (
            <>
              {/* إطار المسح */}
              <div className="w-64 h-48 relative">
                <span className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-yellow-400 rounded-tl-xl" />
                <span className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-yellow-400 rounded-tr-xl" />
                <span className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-yellow-400 rounded-bl-xl" />
                <span className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-yellow-400 rounded-br-xl" />
                {/* خط المسح المتحرك */}
                <div
                  className="absolute inset-x-2 h-0.5 bg-yellow-400 opacity-80 rounded"
                  style={{ animation: "scan 2s ease-in-out infinite" }}
                />
              </div>
              <p className="text-white text-sm bg-black/60 px-4 py-2 rounded-full">
                {t.scanner.hint}
              </p>
            </>
          )}

          {status === "error" && (
            <div className="pointer-events-auto flex flex-col items-center gap-3 px-8 text-center">
              <p className="text-white text-sm bg-red-900/90 px-5 py-4 rounded-2xl leading-relaxed whitespace-pre-line">
                {errorMsg}
              </p>
              <Button
                variant="outline"
                className="text-white border-white/40 hover:bg-white/10"
                onClick={() => { stopAll(); onOpenChange(false); }}
              >
                إغلاق
              </Button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0%   { top: 8px;  opacity: 1; }
          50%  { opacity: 0.5; }
          100% { top: calc(100% - 8px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
