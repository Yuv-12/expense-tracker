import { createBrowserRouter } from "react-router-dom";

import { Layout } from "./layout";
import DashboardPage from "./pages/Dashboard";
import TransactionsPage from "./pages/Transactions";
import { ReportsPage } from "./pages/Reports";
import { SettingsPage } from "./pages/Settings";
import { NotFound } from "./pages/NotFound";
import ProfilePage from "./pages/ProfilePage";

import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";

export const router = createBrowserRouter([
  // 🔐 AUTH ROUTES (public)
  { path: "/sign-in", Component: SignInPage },
  { path: "/sign-up", Component: SignUpPage },

  // ✅ PROTECTED APP ROUTES
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: DashboardPage },
      { path: "transactions", Component: TransactionsPage },
      { path: "reports", Component: ReportsPage },
      { path: "settings", Component: SettingsPage },
      { path: "profile", Component: ProfilePage }, // ✅ was missing
    ],
  },

  // 404
  { path: "*", Component: NotFound },
]);