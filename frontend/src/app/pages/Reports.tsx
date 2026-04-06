import { useEffect, useState, useCallback } from "react";
import { Download } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { getTransactions, type Transaction } from "../../api/api";

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export function ReportsPage() {
  const { user } = useUser();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState("all");

  // ✅ Fetch with userId — no more fetching all users' data
  const fetchData = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getTransactions(user.id);
      setTransactions(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data.");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ✅ Listen for transactions added via sidebar
  useEffect(() => {
    window.addEventListener("transaction-added", fetchData);
    return () => window.removeEventListener("transaction-added", fetchData);
  }, [fetchData]);

  const formatCategory = (cat: string) =>
    cat.charAt(0).toUpperCase() + cat.slice(1);

  // FILTER BY DATE RANGE
  const filteredTransactions = transactions.filter((t) => {
    if (dateRange === "all") return true;
    const date = new Date(t.date);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - Number(dateRange));
    return date >= cutoff;
  });

  // MONTHLY INCOME/EXPENSE DATA
  const monthlyMap: Record<string, { month: string; income: number; expenses: number }> = {};
  filteredTransactions.forEach((t) => {
    const month = new Date(t.date).toLocaleString("default", { month: "short" });
    if (!monthlyMap[month]) monthlyMap[month] = { month, income: 0, expenses: 0 };
    if (t.type === "income") monthlyMap[month].income += t.amount;
    else monthlyMap[month].expenses += t.amount;
  });

  const monthlyData = Object.values(monthlyMap).map((m) => ({
    ...m,
    savings: m.income - m.expenses,
  }));

  // CUMULATIVE SAVINGS GROWTH
  let running = 0;
  const savingsGrowth = monthlyData.map((m) => {
    running += m.savings;
    return { month: m.month, amount: running };
  });

  // CATEGORY BREAKDOWN
  const categoryMap: Record<string, number> = {};
  filteredTransactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      const key = t.category.trim().toLowerCase();
      categoryMap[key] = (categoryMap[key] || 0) + t.amount;
    });

  const totalExpenses = Object.values(categoryMap).reduce((a, b) => a + b, 0);

  const categoryBreakdown = Object.entries(categoryMap)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  // ✅ EXPORT CSV — fixed MIME type + memory cleanup
  const handleExport = () => {
    const headers = ["Date", "Category", "Description", "Type", "Amount"];
    const rows = filteredTransactions.map((t) => [
      new Date(t.date).toLocaleDateString("en-IN"),
      formatCategory(t.category),
      t.description || "",
      t.type,
      t.amount,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url); // ✅ free memory
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">Loading reports…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="card max-w-md text-center">
          <p className="text-red-500 font-semibold text-lg mb-1">Something went wrong</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{error}</p>
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

  return (
    <>
      {/* HEADER */}
      <div className="flex justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Reports</h1>
          <p className="text-gray-500 dark:text-gray-400">Real-time analytics from your transactions</p>
        </div>
        <div className="flex gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="input"
          >
            <option value="all">All Time</option>
            <option value="30">Last 30 Days</option>
            <option value="7">Last 7 Days</option>
          </select>
          <button onClick={handleExport} className="btn-primary flex items-center gap-2">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Income vs Expenses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip />
              <Legend />
              <Line dataKey="income" stroke="#10B981" strokeWidth={3} />
              <Line dataKey="expenses" stroke="#EF4444" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Savings Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={savingsGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip />
              <Area dataKey="amount" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CATEGORY BREAKDOWN */}
      <div className="card">
        <h3 className="mb-6 font-semibold text-gray-900 dark:text-white">Expense Breakdown</h3>

        {categoryBreakdown.length === 0 ? (
          <p className="text-center text-gray-400 py-6 text-sm">No expense data yet.</p>
        ) : (
          categoryBreakdown.map((c) => ( // ✅ key is category string, not index
            <div key={c.category} className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {formatCategory(c.category)}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  ₹{c.amount.toFixed(2)} ({c.percentage}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded transition-all"
                  style={{ width: `${c.percentage}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}