import { useEffect, useState, useCallback } from "react";
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from "lucide-react";
import { useUser } from "@clerk/clerk-react";

import { getTransactions, type Transaction } from "../../api/api";
import StatCard from "../components/StatCard";
import ExpenseByCategory from "../components/ExpenseByCategory";
import MonthlySpendingCharts from "../components/MonthlySpendingCharts";
import RecentTransactions from "../components/RecentTransactions";

export default function DashboardPage() {
  const { user } = useUser();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //////////////////////////////////////////////////////
  // ✅ FETCH DATA
  //////////////////////////////////////////////////////
  const fetchData = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const res = await getTransactions(user.id); // ✅ uses typed helper
      setTransactions(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load transactions.");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Fetch on mount + when user changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ✅ Listen for transactions added/updated from the sidebar modal
  // This replaces the duplicate AddTransaction modal that was here before
  useEffect(() => {
    window.addEventListener("transaction-added", fetchData);
    return () => window.removeEventListener("transaction-added", fetchData);
  }, [fetchData]);

  //////////////////////////////////////////////////////
  // CALCULATIONS
  //////////////////////////////////////////////////////
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalBalance = totalIncome - totalExpenses;
  const savings = totalIncome > 0 ? totalBalance : 0;

  const savingsRate =
    totalIncome > 0 ? ((savings / totalIncome) * 100).toFixed(1) : "0.0";

  const expenseRate =
    totalIncome > 0
      ? ((totalExpenses / totalIncome) * 100).toFixed(1)
      : "0.0";

  //////////////////////////////////////////////////////
  // LOADING
  //////////////////////////////////////////////////////
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Loading your dashboard…
          </p>
        </div>
      </div>
    );
  }

  //////////////////////////////////////////////////////
  // ERROR
  //////////////////////////////////////////////////////
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="card max-w-md text-center">
          <p className="text-red-500 font-semibold text-lg mb-1">
            Something went wrong
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
            {error}
          </p>
          {/* ✅ Retry calls fetchData directly instead of reloading the page */}
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////
  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Welcome back, {user?.firstName ?? "there"}! Here's your financial overview.
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Total Balance"
          value={`₹${totalBalance.toFixed(2)}`}
          change={totalBalance >= 0 ? "Positive" : "Negative"}
          changeType={totalBalance >= 0 ? "positive" : "negative"}
          icon={Wallet}
          iconColor="text-white"
          iconBg="bg-indigo-600"
        />
        <StatCard
          label="Total Income"
          value={`₹${totalIncome.toFixed(2)}`}
          change={`${transactions.filter((t) => t.type === "income").length} transactions`}
          changeType="positive"
          icon={TrendingUp}
          iconColor="text-white"
          iconBg="bg-green-500"
        />
        <StatCard
          label="Total Expenses"
          value={`₹${totalExpenses.toFixed(2)}`}
          change={`${expenseRate}% of income`}
          changeType="negative"
          icon={TrendingDown}
          iconColor="text-white"
          iconBg="bg-red-500"
        />
        <StatCard
          label="Net Savings"
          value={`₹${savings.toFixed(2)}`}
          change={`${savingsRate}% savings rate`}
          changeType={savings >= 0 ? "positive" : "negative"}
          icon={PiggyBank}
          iconColor="text-white"
          iconBg="bg-purple-500"
        />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <ExpenseByCategory data={transactions} />
        </div>
        <div className="card">
          <MonthlySpendingCharts data={transactions} />
        </div>
      </div>

      {/* RECENT TRANSACTIONS */}
      <div className="card">
        <RecentTransactions data={transactions} refresh={fetchData} />
      </div>

    </div>
  );
}