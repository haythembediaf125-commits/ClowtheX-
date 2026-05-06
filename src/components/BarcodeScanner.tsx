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
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [status, setStatus] = useState<"loading" | "scanning" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  const stopAll = () => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    if (videoRef.current) { videoRef.current.srcObject = null; }
  };

  useEffect(() => {
    if (!open) { stopAll(); setStatus("loading"); setErrorMsg(""); return; }

    let alive = true;

    (async () => {
      try {
        // طلب الكاميرا الخلفية
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });

        if (!alive) { stream.getTracks().forEach(t => t.stop()); return; }

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

        // محاولة BarcodeDetector (الأجهزة الحديثة)
        if ("BarcodeDetector" in window) {
          // @ts-ignore
          const detector = new window.BarcodeDetector({ formats: ["ean_13","ean_8","code_128","code_39","qr_code","upc_a","upc_e"] });
          intervalRef.current = setInterval(async () => {
            if (!vid || vid.readyState < 2) return;
            try {
              // @ts-ignore
              const results = await detector.detect(vid);
              if (results.length > 0 && alive) {
                stopAll();
                onDetected(results[0].rawValue);
                onOpenChange(false);
              }
            } catch { /* تجاهل أخطاء الإطار */ }
          }, 400);

        } else {
          // Fallback: Canvas + jscanify عبر CDN
          const canvas = canvasRef.current!;
          const ctx = canvas.getContext("2d")!;

          intervalRef.current = setInterval(() => {
            if (!vid || vid.readyState < 2 || !alive) return;
            canvas.width = vid.videoWidth;
            canvas.height = vid.videoHeight;
            ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);

            // محاولة قراءة QR بواسطة jsQR
            try {
              const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              // @ts-ignore
              if (typeof window.jsQR !== "undefined") {
                // @ts-ignore
                const result = window.jsQR(imageData.data, imageData.width, imageData.height);
                if (result && alive) {
                  stopAll();
                  onDetected(result.data);
                  onOpenChange(false);
                }
              }
            } catch { /* تجاهل */ }
          }, 500);

          // تحميل jsQR من CDN
          if (!document.getElementById("jsqr-script")) {
            const script = document.createElement("script");
            script.id = "jsqr-script";
            script.src = "https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js";
            document.head.appendChild(script);
          }
        }

      } catch (err: any) {
        if (!alive) return;
        setStatus("error");
        if (err?.name === "NotAllowedError") {
          setErrorMsg("❌ تم رفض إذن الكاميرا — اذهب لإعدادات الجهاز وأعط الإذن");
        } else if (err?.name === "NotFoundError") {
          setErrorMsg("❌ لم يتم العثور على كاميرا في هذا الجهاز");
        } else {
          setErrorMsg("❌ خطأ في تشغيل الكاميرا: " + (err?.message ?? "غير معروف"));
        }
      }
    })();

    return () => { alive = false; stopAll(); };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0 bg-black/80">
        <span className="text-white font-semibold text-base">{t.scanner.title}</span>
        <Button variant="ghost" size="icon" className="text-white hover:text-white hover:bg-white/20" onClick={() => { stopAll(); onOpenChange(false); }}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Video */}
      <div className="flex-1 relative overflow-hidden bg-black">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          playsInline
          muted
          autoPlay
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          {status === "loading" && (
            <div className="flex flex-col items-center gap-3">
              <Camera className="w-12 h-12 text-white animate-pulse" />
              <p className="text-white text-sm bg-black/60 px-4 py-2 rounded-full">جاري تشغيل الكاميرا...</p>
            </div>
          )}

          {status === "scanning" && (
            <>
              <div className="w-64 h-48 relative">
                <span className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-yellow-400 rounded-tl-lg" />
                <span className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-yellow-400 rounded-tr-lg" />
                <span className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-yellow-400 rounded-bl-lg" />
                <span className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-yellow-400 rounded-br-lg" />
                <div className="absolute inset-x-0 h-0.5 bg-yellow-400/80" style={{ animation: "scanline 2s linear infinite", top: "50%" }} />
              </div>
              <p className="text-white text-sm bg-black/60 px-4 py-2 rounded-full">{t.scanner.hint}</p>
            </>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center gap-3 px-6 text-center">
              <p className="text-white text-sm bg-red-900/80 px-4 py-3 rounded-xl">{errorMsg}</p>
              <Button variant="outline" className="text-white border-white/40" onClick={() => onOpenChange(false)}>إغلاق</Button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes scanline {
          0%   { transform: translateY(-96px); opacity: 1; }
          50%  { opacity: 0.6; }
          100% { transform: translateY(96px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
