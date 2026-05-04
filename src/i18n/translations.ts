import { useEffect, useRef, useState } from "react";
import { Languages, Coins, Palette, Store, Save, Download, Upload, DatabaseBackup } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import { getDB, getSetting, setSetting } from "@/lib/db";
import { toast } from "sonner";
import type { Lang } from "@/i18n/translations";
import type { Currency } from "@/lib/db";

export function SettingsPage() {
  const {
    t,
    lang,
    setLang,
    theme,
    setTheme,
    currency,
    setCurrency,
    exchangeRate,
    setExchangeRate,
  } = useApp();
  const [storeName, setStoreName] = useState("");
  const [storePhone, setStorePhone] = useState("");
  const [storeAddress, setStoreAddress] = useState("");
  const importRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      setStoreName((await getSetting<string>("storeName")) || "");
      setStorePhone((await getSetting<string>("storePhone")) || "");
      setStoreAddress((await getSetting<string>("storeAddress")) || "");
    })();
  }, []);

  const saveStore = async (
    key: "storeName" | "storePhone" | "storeAddress",
    value: string,
  ) => {
    await setSetting(key, value);
  };

  const handleSaveStore = async () => {
    await Promise.all([
      setSetting("storeName", storeName),
      setSetting("storePhone", storePhone),
      setSetting("storeAddress", storeAddress),
    ]);
    toast.success(t.settings.saved);
  };

  // ── Export ──────────────────────────────────────────────────────────────────
  const handleExport = async () => {
    try {
      const db = await getDB();
      const [products, sales, settings] = await Promise.all([
        db.getAll("products"),
        db.getAll("sales"),
        db.getAll("settings"),
      ]);

      const backup = {
        version: 1,
        exportedAt: Date.now(),
        products,
        sales,
        settings,
      };

      const blob = new Blob([JSON.stringify(backup, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `clowthex-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      toast.error(t.settings.importError);
    }
  };

  // ── Import ──────────────────────────────────────────────────────────────────
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const raw = ev.target?.result as string;
        const data = JSON.parse(raw);

        if (!Array.isArray(data.products) || !Array.isArray(data.sales) || !Array.isArray(data.settings)) {
          throw new Error("invalid");
        }

        const db = await getDB();
        const tx = db.transaction(["products", "sales", "settings"], "readwrite");

        await tx.objectStore("products").clear();
        await tx.objectStore("sales").clear();
        await tx.objectStore("settings").clear();

        for (const p of data.products) await tx.objectStore("products").put(p);
        for (const s of data.sales) await tx.objectStore("sales").put(s);
        for (const s of data.settings) await tx.objectStore("settings").put(s);

        await tx.done;
        toast.success(t.settings.imported);

        // Reload store info from the newly imported settings
        setStoreName((await getSetting<string>("storeName")) || "");
        setStorePhone((await getSetting<string>("storePhone")) || "");
        setStoreAddress((await getSetting<string>("storeAddress")) || "");
      } catch {
        toast.error(t.settings.importError);
      }
    };

    reader.readAsText(file);
    // Reset input so the same file can be re-selected if needed
    e.target.value = "";
  };

  return (
    <div className="px-4 py-5 space-y-5">
      <h2 className="text-xl font-bold">{t.settings.title}</h2>

      <Section icon={<Languages className="w-4 h-4" />}>
        <div>
          <Label className="text-xs">{t.settings.language}</Label>
          <Select value={lang} onValueChange={(v) => setLang(v as Lang)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ar">العربية</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Section>

      <Section icon={<Coins className="w-4 h-4" />}>
        <div>
          <Label className="text-xs">{t.settings.currency}</Label>
          <Select
            value={currency}
            onValueChange={(v) => setCurrency(v as Currency)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DZD">DZD — د.ج</SelectItem>
              <SelectItem value="EUR">EUR — €</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">{t.settings.exchangeRate}</Label>
          <Input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            value={exchangeRate}
            onChange={(e) =>
              setExchangeRate(Math.max(0, Number(e.target.value) || 0))
            }
            className="mt-1"
          />
        </div>
      </Section>

      <Section icon={<Palette className="w-4 h-4" />}>
        <div>
          <Label className="text-xs">{t.settings.theme}</Label>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <Button
              variant={theme === "light" ? "gold" : "outline"}
              onClick={() => setTheme("light")}
              size="sm"
            >
              {t.settings.themeLight}
            </Button>
            <Button
              variant={theme === "dark" ? "gold" : "outline"}
              onClick={() => setTheme("dark")}
              size="sm"
            >
              {t.settings.themeDark}
            </Button>
          </div>
        </div>
      </Section>

      <Section icon={<Store className="w-4 h-4" />} title={t.settings.store}>
        <div>
          <Label className="text-xs">{t.settings.storeName}</Label>
          <Input
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            onBlur={() => saveStore("storeName", storeName)}
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-xs">{t.settings.storePhone}</Label>
          <Input
            value={storePhone}
            onChange={(e) => setStorePhone(e.target.value)}
            onBlur={() => saveStore("storePhone", storePhone)}
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-xs">{t.settings.storeAddress}</Label>
          <Input
            value={storeAddress}
            onChange={(e) => setStoreAddress(e.target.value)}
            onBlur={() => saveStore("storeAddress", storeAddress)}
            className="mt-1"
          />
        </div>
        <Button variant="gold" className="w-full" onClick={handleSaveStore}>
          <Save className="w-4 h-4" />
          {t.form.save}
        </Button>
      </Section>

      {/* ── Backup Section ───────────────────────────────────────────────────── */}
      <Section
        icon={<DatabaseBackup className="w-4 h-4" />}
        title={t.settings.backup}
      >
        {/* Hidden file input for import */}
        <input
          ref={importRef}
          type="file"
          accept=".json,application/json"
          className="hidden"
          onChange={handleImportFile}
        />

        <Button
          variant="gold"
          className="w-full"
          onClick={handleExport}
        >
          <Download className="w-4 h-4" />
          {t.settings.export}
        </Button>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => importRef.current?.click()}
        >
          <Upload className="w-4 h-4" />
          {t.settings.import}
        </Button>
      </Section>
    </div>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-elegant space-y-3">
      <div className="flex items-center gap-2 text-gold">
        <span className="w-7 h-7 rounded-md bg-gold/15 grid place-items-center">
          {icon}
        </span>
        {title && <span className="text-sm font-semibold">{title}</span>}
      </div>
      {children}
    </div>
  );
}