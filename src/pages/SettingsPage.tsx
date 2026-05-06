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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

  const [showExportConfirm, setShowExportConfirm] = useState(false);
  const [showImportConfirm, setShowImportConfirm] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      setStoreName(String(await getSetting("storeName") || ""));
      setStorePhone(String(await getSetting("storePhone") || ""));
      setStoreAddress(String(await getSetting("storeAddress") || ""));
    };
    loadSettings();
  }, []);

  const handleSaveStore = async () => {
    await setSetting("storeName", storeName);
    await setSetting("storePhone", storePhone);
    await setSetting("storeAddress", storeAddress);
    toast.success(t.settings.saved);
  };

  const handleExport = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      const db = await getDB();
      const products = await db.getAll("products");
      const sales = await db.getAll("sales");
      const settings = await db.getAll("settings");

      const backup = {
        products,
        sales,
        settings,
        exportedAt: Date.now(),
        version: 1,
      };

      const json = JSON.stringify(backup, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `clowthex-backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("✅ تم تصدير النسخة الاحتياطية بنجاح");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("❌ فشل في تصدير البيانات");
    } finally {
      setIsExporting(false);
      setShowExportConfirm(false);
    }
  };

  // Called when user confirms import in the dialog
  const handleImportConfirmed = () => {
    setShowImportConfirm(false);
    // Small delay to let the dialog close before the file picker opens
    setTimeout(() => {
      importRef.current?.click();
    }, 150);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset the input so the same file can be selected again if needed
    e.target.value = "";

    setIsImporting(true);

    const reader = new FileReader();

    reader.onload = async (ev) => {
      try {
        const raw = ev.target?.result as string;
        const data = JSON.parse(raw);

        if (!data.products || !data.sales || !data.settings) {
          throw new Error("Invalid backup file structure");
        }

        const db = await getDB();
        const tx = db.transaction(["products", "sales", "settings"], "readwrite");

        await tx.objectStore("products").clear();
        await tx.objectStore("sales").clear();
        await tx.objectStore("settings").clear();

        for (const p of data.products) await tx.objectStore("products").put(p);
        for (const s of data.sales) await tx.objectStore("sales").put(s);
        for (const st of data.settings) await tx.objectStore("settings").put(st);

        await tx.done;

        toast.success("✅ تم استيراد البيانات بنجاح، جارٍ إعادة التشغيل...");
        setTimeout(() => window.location.reload(), 1500);
      } catch (error) {
        console.error("Import error:", error);
        toast.error("❌ فشل استيراد الملف — تأكد أن الملف صحيح");
      } finally {
        setIsImporting(false);
      }
    };

    reader.onerror = () => {
      toast.error("❌ تعذر قراءة الملف");
      setIsImporting(false);
    };

    reader.readAsText(file);
  };

  return (
    <div className="px-4 py-5 space-y-5">
      <h2 className="text-xl font-bold">{t.settings.title}</h2>

      <Section icon={<Languages className="w-4 h-4" />} title={t.settings.language}>
        <Select value={lang} onValueChange={(v) => setLang(v as Lang)}>
          <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ar">العربية</SelectItem>
            <SelectItem value="fr">Français</SelectItem>
            <SelectItem value="en">English</SelectItem>
          </SelectContent>
        </Select>
      </Section>

      <Section icon={<Coins className="w-4 h-4" />} title={t.settings.currency}>
        <Select value={currency} onValueChange={(v) => setCurrency(v as Currency)}>
          <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="DZD">DZD</SelectItem>
            <SelectItem value="EUR">EUR</SelectItem>
          </SelectContent>
        </Select>
        <div className="mt-3">
          <Label className="text-xs">{t.settings.exchangeRate}</Label>
          <Input
            type="number"
            value={exchangeRate}
            onChange={(e) => setExchangeRate(Number(e.target.value))}
            className="mt-1"
          />
        </div>
      </Section>

      <Section icon={<Palette className="w-4 h-4" />} title={t.settings.theme}>
        <div className="grid grid-cols-2 gap-2 mt-1">
          <Button variant={theme === "light" ? "gold" : "outline"} onClick={() => setTheme("light")}>
            {t.settings.themeLight}
          </Button>
          <Button variant={theme === "dark" ? "gold" : "outline"} onClick={() => setTheme("dark")}>
            {t.settings.themeDark}
          </Button>
        </div>
      </Section>

      <Section icon={<Store className="w-4 h-4" />} title={t.settings.store}>
        <div className="space-y-3">
          <Input
            placeholder={t.settings.storeName}
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
          />
          <Input
            placeholder={t.settings.storePhone}
            value={storePhone}
            onChange={(e) => setStorePhone(e.target.value)}
          />
          <Input
            placeholder={t.settings.storeAddress}
            value={storeAddress}
            onChange={(e) => setStoreAddress(e.target.value)}
          />
          <Button variant="gold" className="w-full" onClick={handleSaveStore}>
            <Save className="w-4 h-4 mr-2" />
            {t.form.save}
          </Button>
        </div>
      </Section>

      <Section icon={<DatabaseBackup className="w-4 h-4" />} title={t.settings.backup}>
        <div className="space-y-3">
          {/* Hidden file input — triggered programmatically after import confirmation */}
          <input
            ref={importRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImportFile}
          />

          <Button
            variant="gold"
            className="w-full"
            onClick={() => setShowExportConfirm(true)}
            disabled={isExporting}
          >
            <Download className="w-4 h-4 mr-2" />
            {isExporting ? "جارٍ التصدير..." : t.settings.export}
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowImportConfirm(true)}
            disabled={isImporting}
          >
            <Upload className="w-4 h-4 mr-2" />
            {isImporting ? "جارٍ الاستيراد..." : t.settings.import}
          </Button>
        </div>
      </Section>

      {/* Export confirmation dialog */}
      <AlertDialog open={showExportConfirm} onOpenChange={setShowExportConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تصدير النسخة الاحتياطية؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم تحميل ملف JSON يحتوي على جميع البيانات (المنتجات، المبيعات، الإعدادات).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleExport} disabled={isExporting}>
              {isExporting ? "جارٍ التصدير..." : "تصدير الآن"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Import confirmation dialog */}
      <AlertDialog open={showImportConfirm} onOpenChange={setShowImportConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">⚠️ تحذير هام</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف <strong>كل البيانات الحالية</strong> واستبدالها بالبيانات الجديدة.
              <br />
              هذا الإجراء لا يمكن التراجع عنه. هل أنت متأكد؟
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={handleImportConfirmed}
            >
              نعم، استورد
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
    <div className="bg-card rounded-xl border p-4 space-y-2 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-semibold border-b pb-2 mb-2">
        {icon}
        {title}
      </div>
      {children}
    </div>
  );
}
