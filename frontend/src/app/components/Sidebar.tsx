import {
  Home,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Plus,
} from "lucide-react";

import { Link } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";

interface SidebarProps {
  activeTab: string;
  onAddTransaction: (type: "income" | "expense") => void;
}

export function Sidebar({ activeTab, onAddTransaction }: SidebarProps) {
  const { signOut } = useClerk();

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, path: "/" },
    {
      id: "transactions",
      label: "Transactions",
      icon: FileText,
      path: "/transactions",
    },
    { id: "reports", label: "Reports", icon: BarChart3, path: "/reports" },
    { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
  ];

  // ✅ CLERK LOGOUT
  const handleLogout = async () => {
    await signOut({
      redirectUrl: "/sign-in",
    });
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 
      bg-white dark:bg-gray-900 
      border-r border-gray-200 dark:border-gray-800 
      flex flex-col shadow-sm transition-colors duration-300">

      {/* Logo */}
      <div className="p-6">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
          <span className="text-white font-bold text-xl">ET</span>
        </div>
      </div>

      {/* Add Buttons */}
      <div className="px-6 mb-8 space-y-3">
        <button
          onClick={() => onAddTransaction("expense")}
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-700 transition shadow-md"
        >
          <Plus size={20} />
          <span className="font-semibold">Add Expense</span>
        </button>

        <button
          onClick={() => onAddTransaction("income")}
          className="w-full bg-green-500 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-green-600 transition shadow-md"
        >
          <Plus size={20} />
          <span className="font-semibold">Add Income</span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <li key={item.id}>
                <Link
                  to={item.path}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 font-semibold"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* 🔥 LOGOUT BUTTON (CLERK) */}
      <div className="p-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 
          text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 
          rounded-xl transition-colors"
        >
          <LogOut size={20} />
          <span className="font-semibold">Logout</span>
        </button>
      </div>
    </aside>
  );
}