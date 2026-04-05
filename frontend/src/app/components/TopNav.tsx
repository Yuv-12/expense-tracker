import { useEffect, useState, useRef } from "react";
import { Sun, Moon, Bell, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";

export function TopNav() {
  const navigate = useNavigate();

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

  // ✅ TOGGLE + SAVE
  const toggleTheme = () => {
    const newDark = !dark;
    setDark(newDark);

    if (newDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // ✅ CLOSE DROPDOWN
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotif(false);
      }
      
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/sign-in");
  };

  return (
    <header className="bg-white/50 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 py-4 px-8 flex justify-end items-center gap-4">
      {/* THEME */}
      <button
        onClick={toggleTheme}
        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        {dark ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* NOTIFICATION */}
      <div ref={notifRef} className="relative">
        <button
          onClick={() => setShowNotif(!showNotif)}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Bell size={20} />
        </button>
      </div>

      {/* PROFILE */}
      <div className="relative">
        <UserButton
  afterSignOutUrl="/sign-in"
  appearance={{
    variables: {
      colorBackground: "#0B1220",
      colorText: "#FFFFFF",
      colorNeutral: "#D1D5DB",
    },
    elements: {
      // MAIN CARD
      userButtonPopoverCard:
        "!bg-gray-900 !text-white border border-gray-800 shadow-xl",

      // HEADER TEXT
      userPreviewMainIdentifier: "!text-white",
      userPreviewSecondaryIdentifier: "!text-gray-400",

      // ACTION BUTTONS
      userButtonPopoverActionButton:
        "!text-gray-200 hover:!bg-gray-800 hover:!text-white",

      // ICONS
      userButtonPopoverActionButtonIcon: "!text-gray-400",

      // FOOTER
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
