import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { TopNav } from "./components/TopNav";
import { useState } from "react";
import AddTransaction from "./components/AddTransaction";

import {
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/clerk-react";

export function Layout() {
  const location = useLocation();

  // ✅ Active tab logic
  const activeTab =
    location.pathname === "/" ? "dashboard" : location.pathname.slice(1);

  // ✅ Modal state
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState<"income" | "expense">("expense");

  return (
    <>
      {/* 🔐 USER LOGGED IN */}
      <SignedIn>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
          
          {/* ✅ MODAL */}
          {showForm && (
            <AddTransaction
              type={type}
              onClose={() => setShowForm(false)}
              refresh={() => {
                // 🔥 BETTER THAN window.reload
                window.dispatchEvent(new Event("transaction-added"));
              }}
            />
          )}

          {/* ✅ SIDEBAR */}
          <Sidebar
            activeTab={activeTab}
            onAddTransaction={(t) => {
              setType(t);
              setShowForm(true);
            }}
          />

          {/* ✅ MAIN CONTENT */}
          <div className="ml-64 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <TopNav />

            <main className="p-8">
              <Outlet />
            </main>
          </div>
        </div>
      </SignedIn>

      {/* ❌ NOT LOGGED IN */}
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}