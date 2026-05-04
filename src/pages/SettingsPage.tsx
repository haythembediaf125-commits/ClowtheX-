import { useEffect, useState } from "react";
import { Coins, Palette, Store, Save, Archive } from "lucide-react";

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
import { getSetting, setSetting } from "@/lib/db";
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

  useEffect(() => {
    (async () => {
      setStoreName((await getSetting<string>("storeName")) || "");
      setStorePhone((await getSetting<string>("storePhone")) || "");
      setStoreAddress((await getSetting<string>("storeAddress")) || "");
    })();
  }, []);

  const saveStore = async (key: string, value: string) => {
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

  return (
    <div className="px-4 py-5 space-y-5">
      <h2 className="text-xl font-bold">{t.settings.title}</h2>

      <Section icon={<Archive className="w-4 h-4" />} title="Settings">
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
            value={exchangeRate}
            onChange={(e) =>
              setExchangeRate(Math.max(0, Number(e.target.value) || 0))
            }
            className="mt-1"
          />
        </div>
      </Section>

      <Section icon={<Palette className="w-4 h-4" />}>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={theme === "light" ? "gold" : "outline"}
            onClick={() => setTheme("light")}
          >
            Light
          </Button>

          <Button
            variant={theme === "dark" ? "gold" : "outline"}
            onClick={() => setTheme("dark")}
          >
            Dark
          </Button>
        </div>
      </Section>

      <Section icon={<Store className="w-4 h-4" />} title="Store">
        <div>
          <Label className="text-xs">{t.settings.storeName}</Label>
          <Input
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
          />
        </div>

        <div>
          <Label className="text-xs">{t.settings.storePhone}</Label>
          <Input
            value={storePhone}
            onChange={(e) => setStorePhone(e.target.value)}
          />
        </div>

        <div>
          <Label className="text-xs">{t.settings.storeAddress}</Label>
          <Input
            value={storeAddress}
            onChange={(e) => setStoreAddress(e.target.value)}
          />
        </div>

        <Button className="w-full mt-2" onClick={handleSaveStore}>
          <Save className="w-4 h-4" />
          {t.form.save}
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
    <div className="rounded-xl border bg-card p-4 space-y-3">
      <div className="flex items-center gap-2 text-gold">
        {icon}
        {title && <span className="text-sm font-semibold">{title}</span>}
      </div>
      {children}
    </div>
  );
}