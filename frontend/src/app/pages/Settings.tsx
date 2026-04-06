import { useState } from "react";
import { User, Bell, Globe, Shield, Mail, Pencil, X } from "lucide-react";
import { useUser, UserProfile } from "@clerk/clerk-react";

const NOTIFICATION_KEYS = [
  "emailNotifications",
  "transactionAlerts",
  "monthlyReports",
  "budgetAlerts",
] as const;

type NotificationKey = (typeof NOTIFICATION_KEYS)[number];

const NOTIFICATION_LABELS: Record<NotificationKey, string> = {
  emailNotifications: "Email Notifications",
  transactionAlerts: "Transaction Alerts",
  monthlyReports: "Monthly Reports",
  budgetAlerts: "Budget Alerts",
};

const STORAGE_KEY = "notificationPrefs";

function loadPrefs(): Record<NotificationKey, boolean> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return {
    emailNotifications: true,
    transactionAlerts: true,
    monthlyReports: false,
    budgetAlerts: true,
  };
}

export function SettingsPage() {
  const { user } = useUser();
  const [notifPrefs, setNotifPrefs] = useState<Record<NotificationKey, boolean>>(loadPrefs);
  const [showEditModal, setShowEditModal] = useState(false);

  const toggleNotif = (key: NotificationKey) => {
    setNotifPrefs((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Settings
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage your account preferences and application settings.
        </p>
      </div>

      {/* ✅ PROFILE — custom UI, compact and clean */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow border border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <User className="text-indigo-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Profile
            </h3>
          </div>
          <button
            onClick={() => setShowEditModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <Pencil size={14} />
            Edit Profile
          </button>
        </div>

        {/* PROFILE CARD */}
        <div className="flex items-center gap-5">
          {/* AVATAR */}
          {user?.imageUrl ? (
            <img
              src={user.imageUrl}
              alt="Avatar"
              className="w-16 h-16 rounded-full object-cover ring-2 ring-indigo-500"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold ring-2 ring-indigo-500">
              {user?.firstName?.[0] ?? "?"}
            </div>
          )}

          {/* INFO */}
          <div className="flex-1 min-w-0">
            <p className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {user?.fullName || "—"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {user?.primaryEmailAddress?.emailAddress || "—"}
            </p>
            {user?.username && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                @{user.username}
              </p>
            )}
          </div>
        </div>

        {/* DETAILS ROW */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3">
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Full Name</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {user?.fullName || "—"}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3">
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Username</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {user?.username || "—"}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3 sm:col-span-2">
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Email</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {user?.primaryEmailAddress?.emailAddress || "—"}
            </p>
          </div>
        </div>
      </div>

      {/* ✅ NOTIFICATIONS */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow border border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="text-green-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Notifications
          </h3>
        </div>

        {NOTIFICATION_KEYS.map((key) => (
          <div
            key={key}
            className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-none"
          >
            <span className="text-gray-700 dark:text-gray-300">
              {NOTIFICATION_LABELS[key]}
            </span>
            <input
              type="checkbox"
              checked={notifPrefs[key]}
              onChange={() => toggleNotif(key)}
              className="w-4 h-4 accent-indigo-500 cursor-pointer"
            />
          </div>
        ))}
      </div>

      {/* ✅ PREFERENCES */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow border border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3 mb-6">
          <Globe className="text-purple-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Preferences
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
              Language
            </label>
            <select className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
              <option>English</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
              Currency
            </label>
            <select className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
              <option>INR (₹)</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
              Timezone
            </label>
            <select className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
              <option>IST (UTC+5:30)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ✅ ACCOUNT ACTIONS */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow border border-gray-200 dark:border-gray-800">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Account Actions
        </h3>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() =>
              window.open("mailto:support@yourapp.com?subject=Support Request", "_blank")
            }
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <Mail size={16} /> Contact Support
          </button>

          <button
            onClick={() => window.open("/privacy-policy", "_blank")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <Shield size={16} /> Privacy Policy
          </button>
        </div>
      </div>

      {/* ✅ EDIT PROFILE MODAL — Clerk UserProfile in a modal overlay */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              <X size={16} />
            </button>

            <UserProfile
              appearance={{
                elements: {
                  card: "shadow-none border-none",
                  navbar: "!hidden",
                  navbarMobileMenuButton: "!hidden",
                  footer: "!hidden",
                  pageScrollBox: "!px-6 !py-4",
                },
              }}
            />
          </div>
        </div>
      )}

    </div>
  );
}