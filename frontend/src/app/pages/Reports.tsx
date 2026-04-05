import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import API from "../../api/api";

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

interface Transaction {
  _id: string;
  amount: number;
  category: string;
  description?: string;
  type: "income" | "expense";
  date: string;
}

export function ReportsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [dateRange, setDateRange] = useState("all");

  // FETCH DATA
  useEffect(() => {
    API.get("/transactions")
      .then((res) => setTransactions(res.data))
      .catch((err) => console.error(err));
  }, []);

  // FORMAT CATEGORY
  const formatCategory = (cat: string) =>
    cat.charAt(0).toUpperCase() + cat.slice(1);

  // FILTER DATA
  const filteredTransactions = transactions.filter((t) => {
    if (dateRange === "all") return true;

    const now = new Date();
    const date = new Date(t.date);

    if (dateRange === "30") {
      const d = new Date();
      d.setDate(now.getDate() - 30);
      return date >= d;
    }

    if (dateRange === "7") {
      const d = new Date();
      d.setDate(now.getDate() - 7);
      return date >= d;
    }

    return true;
  });

  // MONTHLY DATA
  const monthlyMap: Record<
    string,
    { month: string; income: number; expenses: number }
  > = {};

  filteredTransactions.forEach((t) => {
    const month = new Date(t.date).toLocaleString("default", {
      month: "short",
    });

    if (!monthlyMap[month]) {
      monthlyMap[month] = { month, income: 0, expenses: 0 };
    }

    if (t.type === "income") {
      monthlyMap[month].income += t.amount;
    } else {
      monthlyMap[month].expenses += t.amount;
    }
  });

  const monthlyData = Object.values(monthlyMap).map((m) => ({
    ...m,
    savings: m.income - m.expenses,
  }));

  // CATEGORY BREAKDOWN
  const categoryMap: Record<string, number> = {};

  filteredTransactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      const key = t.category.trim().toLowerCase();

      if (!categoryMap[key]) categoryMap[key] = 0;

      categoryMap[key] += t.amount;
    });

  const totalExpenses = Object.values(categoryMap).reduce(
    (a, b) => a + b,
    0
  );

  const categoryBreakdown = Object.keys(categoryMap)
    .map((cat) => {
      const amount = categoryMap[cat];
      return {
        category: cat,
        amount,
        percentage:
          totalExpenses > 0
            ? Math.round((amount / totalExpenses) * 100)
            : 0,
      };
    })
    .sort((a, b) => b.amount - a.amount);

  // SAVINGS GROWTH
  let running = 0;
  const savingsGrowth = monthlyData.map((m) => {
    running += m.savings;
    return { month: m.month, amount: running };
  });

  // EXPORT CSV
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

    const blob = new Blob([csv]);
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "report.csv";
    a.click();
  };

  return (
    <>
      {/* HEADER */}
      <div className="flex justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Reports
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Real-time analytics from your transactions
          </p>
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

          <button
            onClick={handleExport}
            className="btn-primary flex items-center gap-2"
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
            Income vs Expenses
          </h3>

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
          <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
            Savings Growth
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={savingsGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip />
              <Area
                dataKey="amount"
                stroke="#8B5CF6"
                fill="#8B5CF6"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CATEGORY */}
      <div className="card">
        <h3 className="mb-6 font-semibold text-gray-900 dark:text-white">
          Expense Breakdown
        </h3>

        {categoryBreakdown.map((c, i) => (
          <div key={i} className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {formatCategory(c.category)}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                {c.percentage}%
              </span>
            </div>

            <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded"
                style={{ width: `${c.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}