import { useEffect, useState, useRef } from "react";
import { Sun, Moon, Bell, Menu } from "lucide-react";
import { UserButton } from "@clerk/clerk-react";

interface TopNavProps {
  onMenuClick?: () => void; // ✅ new — opens sidebar on mobile
}

export function TopNav({ onMenuClick }: TopNavProps) {
  const [dark, setDark] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // ✅ LOAD THEME FROM STORAGE
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  // ✅ TOGGLE THEME + SAVE
  const toggleTheme = () => {
    const newDark = !dark;
    setDark(newDark);
    document.documentElement.classList.toggle("dark", newDark);
    localStorage.setItem("theme", newDark ? "dark" : "light");
  };

  // ✅ CLOSE NOTIFICATION DROPDOWN ON OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotif(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white/50 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 py-4 px-6 flex justify-between items-center gap-4">

      {/* ✅ HAMBURGER — only visible on mobile */}
      <button
        onClick={onMenuClick}
        className="md:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      {/* ✅ RIGHT SIDE ACTIONS */}
      <div className="flex items-center gap-4 ml-auto">

        {/* THEME TOGGLE */}
        <button
          onClick={toggleTheme}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
          aria-label="Toggle theme"
        >
          {dark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* NOTIFICATION BELL */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setShowNotif(!showNotif)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
            aria-label="Notifications"
          >
            <Bell size={20} />
          </button>

          {/* DROPDOWN */}
          {showNotif && (
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 p-4">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Notifications
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">
                No new notifications
              </p>
            </div>
          )}
        </div>

        {/* CLERK USER BUTTON */}
        <UserButton
          afterSignOutUrl="/sign-in"
          appearance={{
            variables: {
              colorBackground: "#0B1220",
              colorText: "#FFFFFF",
              colorNeutral: "#D1D5DB",
            },
            elements: {
              userButtonPopoverCard:
                "!bg-gray-900 !text-white border border-gray-800 shadow-xl",
              userPreviewMainIdentifier: "!text-white",
              userPreviewSecondaryIdentifier: "!text-gray-400",
              userButtonPopoverActionButton:
                "!text-gray-200 hover:!bg-gray-800 hover:!text-white",
              userButtonPopoverActionButtonIcon: "!text-gray-400",
              userButtonPopoverFooter:
                "!bg-gray-900 !text-gray-400 border-t border-gray-800",
              avatarBox: "w-10 h-10",
            },
          }}
        />
      </div>
    </header>
  );
}