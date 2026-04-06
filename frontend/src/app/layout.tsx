import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { TopNav } from "./components/TopNav";
import { useState } from "react";
import AddTransaction from "./components/AddTransaction";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

type ModalState = {
  open: boolean;
  type: "income" | "expense";
};

export function Layout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Handles both top-level and nested routes correctly
  const activeTab = location.pathname.split("/")[1] || "dashboard";

  // Single state object instead of two separate ones
  const [modal, setModal] = useState<ModalState>({ open: false, type: "expense" });

  const openModal = (type: "income" | "expense") =>
    setModal({ open: true, type });

  const closeModal = () =>
    setModal((prev) => ({ ...prev, open: false }));

  const handleTransactionAdded = () => {
    closeModal();
    window.dispatchEvent(new Event("transaction-added"));
  };

  return (
    <>
      {/* 🔐 AUTHENTICATED VIEW */}
      <SignedIn>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">

          {/* ✅ ADD TRANSACTION MODAL */}
          {modal.open && (
            <AddTransaction
              type={modal.type}
              onClose={closeModal}
              refresh={handleTransactionAdded}
            />
          )}

          {/* ✅ MOBILE OVERLAY — closes sidebar when tapping outside */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-20 bg-black/50 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* ✅ SIDEBAR */}
          <Sidebar
            activeTab={activeTab}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            onAddTransaction={openModal}
          />

          {/* ✅ MAIN CONTENT — offset on desktop, full-width on mobile */}
          <div className="md:ml-64 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <TopNav onMenuClick={() => setSidebarOpen(true)} />

            <main className="p-4 md:p-8">
              <Outlet />
            </main>
          </div>
        </div>
      </SignedIn>

      {/* ❌ UNAUTHENTICATED — redirect to sign in */}
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}