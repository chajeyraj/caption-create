import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="h-9 w-9" />;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="h-9 w-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105"
      style={{
        border: "1px solid hsl(var(--border))",
        background: "hsl(var(--muted))",
        color: "hsl(var(--muted-foreground))",
      }}
    >
      {isDark ? (
        <Sun className="h-4 w-4 transition-transform duration-300" />
      ) : (
        <Moon className="h-4 w-4 transition-transform duration-300" />
      )}
    </button>
  );
};
