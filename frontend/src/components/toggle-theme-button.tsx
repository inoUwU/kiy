import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";

import { MonitorIcon, MoonIcon, PaletteIcon, SunIcon } from "lucide-react";
import { Button } from "./ui/button";

type ThemeMode = "system" | "light" | "dark";

const THEME_MODE_STORAGE_KEY = "theme-mode";

const getInitialThemeMode = (): ThemeMode => {
  if (typeof window === "undefined") {
    return "system";
  }

  const stored = window.localStorage.getItem(THEME_MODE_STORAGE_KEY);
  return stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
};

const ToggleThemeButton = () => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(getInitialThemeMode);
  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      const resolvedMode = themeMode === "system" ? (media.matches ? "dark" : "light") : themeMode;
      root.classList.toggle("dark", resolvedMode === "dark");
      root.style.colorScheme = resolvedMode;
    };

    applyTheme();
    window.localStorage.setItem(THEME_MODE_STORAGE_KEY, themeMode);

    const handleMediaChange = () => {
      if (themeMode === "system") {
        applyTheme();
      }
    };

    media.addEventListener("change", handleMediaChange);

    return () => {
      media.removeEventListener("change", handleMediaChange);
    };
  }, [themeMode]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="テーマ切り替え"
          className="fixed bottom-4 right-4 z-50 shadow-lg md:bottom-6 md:right-6"
          size="icon"
          type="button"
          variant="outline"
        >
          <PaletteIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          onValueChange={(value) => setThemeMode(value as ThemeMode)}
          value={themeMode}
        >
          <DropdownMenuRadioItem value="system">
            <MonitorIcon className="size-4" />
            System
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="light">
            <SunIcon className="size-4" />
            Light
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">
            <MoonIcon className="size-4" />
            Dark
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ToggleThemeButton;
