import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="
        flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-700
        hover:border-gray-500 text-gray-400 hover:text-white
        transition-all duration-200 text-sm font-medium
        bg-transparent hover:bg-gray-800
      "
    >
      {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
      <span className="hidden sm:inline">
        {theme === "dark" ? "Light" : "Dark"}
      </span>
    </button>
  );
}