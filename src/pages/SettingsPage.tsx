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
    value: string
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

  // --- Export Logic
  const handleExport = async () => {
    try {
      const db = await getDB();
      // Fetch all data from the three main object stores
      const [products, sales, settings] = await Promise.all([
        db.getAll("products"),
        db.getAll("sales"),
        db.getAll("settings"),
      ]);

      const backupData = {
        version: 1,
        exportedAt: Date.now(),
        products,
        sales,
        settings,
      };

      const blob = new Blob([JSON.stringify(backupData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `clowthex-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Use translation if available, otherwise fallback to Arabic
      toast.success(t.settings.exported || "تم تصدير النسخة الاحتياطية بنجاح");
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("فشل تصدير البيانات");
    }
  };

  // --- Import Logic
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        const data = JSON.parse(content);

        // Basic validation of the backup file structure
        if (!data.products || !data.sales || !data.settings) {
          throw new Error("Invalid backup file format");
        }

        const db = await getDB();
        // Start a readwrite transaction for all stores
        const tx = db.transaction(["products", "sales", "settings"], "readwrite");

        // Clear existing data
        await Promise.all([
          tx.objectStore("products").clear(),
          tx.objectStore("sales").clear(),
          tx.objectStore("settings").clear(),
        ]);

        // Restore data
        for (const item of data.products) await tx.objectStore("products").put(item);
        for (const item of data.sales) await tx.objectStore("sales").put(item);
        for (const item of data.settings) await tx.objectStore("settings").put(item);

        await tx.done;
        
        toast.success(t.settings.imported || "تم استيراد البيانات بنجاح");

        // Refresh local state for store info
        setStoreName((await getSetting<string>("storeName")) || "");
        setStorePhone((await getSetting<string>("storePhone")) || "");
        setStoreAddress((await getSetting<string>("storeAddress")) || "");
        
        // Force reload to ensure all contexts (like inventory and sales) are updated
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (error) {
        console.error("Import failed:", error);
        toast.error(t.settings.importError || "فشل استيراد الملف، تأكد من أنه ملف نسخة احتياطية صحيح");
      }
    };

    reader.readAsText(file);
    // Clear the input so the same file can be uploaded again if needed
    e.target.value = "";
  };

  return (
    <div className="px-4 py-5 space-y-5">
      <h2 className="text-xl font-bold">{t.settings.title}</h2>

      {/* Language Section */}
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

      {/* Currency Section */}
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
              <SelectItem value="DZD">DZD - د.ج</SelectItem>
              <SelectItem value="EUR">EUR - €</SelectItem>
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

      {/* Theme Section */}
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

      {/* Store Info Section */}
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
          <Save className="w-4 h-4 mr-2" />
          {t.form.save}
        </Button>
      </Section>

      {/* Backup & Restore Section */}
      <Section
        icon={<DatabaseBackup className="w-4 h-4" />}
        title={t.settings.backup || "النسخ الاحتياطي"}
      >
        <div className="space-y-3">
          {/* Hidden file input */}
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
            <Download className="w-4 h-4 mr-2" />
            {t.settings.export || "تصدير البيانات"}
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => importRef.current?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            {t.settings.import || "استيراد البيانات"}
          </Button>
          
          <p className="text-[10px] text-muted-foreground text-center px-2">
            {lang === "ar" 
              ? "ملاحظة: استيراد البيانات سيؤدي إلى مسح كافة البيانات الحالية واستبدالها ببيانات الملف."
              : "Note: Importing data will overwrite all current data with the file content."}
          </p>
        </div>
      </Section>
    </div>
  );
}

function Section({
  children,
  icon,
  title,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
  title?: string;
}) {
  return (
    <div className="bg-card rounded-xl border border-border p-4 space-y-4 shadow-sm">
      {(title || icon) && (
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground/70 border-b border-border/50 pb-2">
          {icon}
          {title}
        </div>
      )}
      <div className="space-y-4">{children}</div>
    </div>
  );
}
