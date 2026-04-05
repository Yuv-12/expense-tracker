import { User, Bell, Lock, Globe, Shield, Mail } from "lucide-react";

import { UserProfile } from "@clerk/clerk-react";

export function SettingsPage() {
  return (
    <>
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Settings
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage your account preferences and application settings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {/* 🔥 CLERK PROFILE (REPLACES YOUR FORM) */}
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <div className="flex items-center gap-3 mb-6">
              <User className="text-indigo-500" />
              <h3 className="section-title">Profile</h3>
            </div>

            <UserProfile
              appearance={{
                variables: {
                  colorBackground: "#0B1220",
                  colorInputBackground: "#1F2937",
                  colorText: "#FFFFFF",
                  colorPrimary: "#6366F1",
                },
                elements: {
                  // MAIN CARD
                  card: "bg-gray-900 border border-gray-800 text-white",

                  // LEFT SIDEBAR FIX ✅
                  sidebar: "bg-gray-900 border-r border-gray-800",
                  navbar: "bg-gray-900",

                  // SIDEBAR ITEMS
                  navbarButton: "text-gray-300 hover:bg-gray-800",
                  navbarButtonActive: "bg-gray-800 text-white",

                  // PAGE AREA
                  pageScrollBox: "bg-gray-900",

                  // INPUTS
                  formFieldInput: "bg-gray-800 border-gray-700 text-white",

                  // BUTTONS
                  formButtonPrimary:
                    "bg-indigo-600 hover:bg-indigo-700 text-white",

                  // REMOVE WHITE SECTIONS
                  profileSection: "bg-gray-900",
                  formFieldRow: "bg-gray-900",
                },
              }}
            />
          </div>

          {/* NOTIFICATIONS */}
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="text-green-500" />
              <h3 className="section-title">Notifications</h3>
            </div>

            {[
              { key: "email", label: "Email Notifications" },
              { key: "transaction", label: "Transaction Alerts" },
              { key: "monthly", label: "Monthly Reports" },
              { key: "budget", label: "Budget Alerts" },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700"
              >
                <span className="text-gray-700 dark:text-gray-300">
                  {item.label}
                </span>

                <input type="checkbox" className="w-4 h-4 accent-indigo-500" />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          {/* PREFERENCES */}
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="text-purple-500" />
              <h3 className="section-title">Preferences</h3>
            </div>

            <select className="input mb-3">
              <option>English</option>
            </select>

            <select className="input mb-3">
              <option>INR (₹)</option>
            </select>

            <select className="input">
              <option>IST (UTC+5:30)</option>
            </select>
          </div>

          {/* ACTIONS */}
          <div className="card">
            <h3 className="section-title mb-4">Account Actions</h3>

            <div className="space-y-3">
              {/* ✅ CONTACT SUPPORT */}
              <button
                onClick={() =>
                  (window.location.href =
                    "mailto:support@yourapp.com?subject=Support Request")
                }
                className="btn-outline flex items-center gap-2"
              >
                <Mail size={16} /> Contact Support
              </button>

              {/* ✅ PRIVACY POLICY */}
              <button
                onClick={() => window.open("/privacy-policy", "_blank")}
                className="btn-outline flex items-center gap-2"
              >
                <Shield size={16} /> Privacy Policy
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
