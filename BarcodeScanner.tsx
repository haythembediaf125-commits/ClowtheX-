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

const SCANNER_ID = "clowthex-qr-region";

// إخفاء واجهة html5-qrcode فوراً قبل أي render لمنع الشاشة الرمادية
if (typeof document !== "undefined" && !document.getElementById("qr-hide-style")) {
  const s = document.createElement("style");
  s.id = "qr-hide-style";
  s.textContent = `
    #clowthex-qr-region > * { display: none !important; }
    #clowthex-qr-region video {
      display: block !important;
      position: absolute !important;
      inset: 0 !important;
      width: 100% !important;
      height: 100% !important;
      object-fit: cover !important;
    }
  `;
  document.head.appendChild(s);
}

export function BarcodeScanner({ open, onOpenChange, onDetected }: Props) {
  const { t } = useApp();
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [status, setStatus] = useState<"loading" | "scanning" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  const stopScanner = async () => {
    try {
      if (scannerRef.current) {
        const s = scannerRef.current;
        scannerRef.current = null;
        const state = s.getState();
        if (state === 2 || state === 3) await s.stop();
        s.clear();
      }
    } catch { /* ignore */ }
  };

  useEffect(() => {
    if (!open) {
      stopScanner();
      setStatus("loading");
      setErrorMsg("");
      return;
    }

    let alive = true;

    (async () => {
      await new Promise((r) => setTimeout(r, 400));
      if (!alive) return;

      try {
        const scanner = new Html5Qrcode(SCANNER_ID, { verbose: false });
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 240, height: 160 }, aspectRatio: 1.77 },
          (text) => {
            if (!alive) return;
            stopScanner().then(() => {
              onDetected(text);
              onOpenChange(false);
            });
          },
          () => {}
        );

        if (alive) setStatus("scanning");
      } catch (err: any) {
        if (!alive) return;
        setStatus("error");
        const msg = String(err?.message ?? err);
        if (/NotAllowed|Permission|permission/i.test(msg)) {
          setErrorMsg("❌ لا يمكن الوصول إلى الكاميرا\nاذهب: إعدادات ← التطبيقات ← ClowtheX ← الأذونات ← فعّل الكاميرا");
        } else if (/NotFound|not found|Devices/i.test(msg)) {
          setErrorMsg("❌ لم يتم العثور على كاميرا");
        } else if (/NotRead
