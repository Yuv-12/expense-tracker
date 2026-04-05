import { useEffect, useState } from "react";
import API from "../../api/api";

import AddTransaction from "../components/AddTransaction";
import StatCard from "../components/StatCard";
import ExpenseByCategory from "../components/ExpenseByCategory";
import MonthlySpendingCharts from "../components/MonthlySpendingCharts";
import RecentTransactions from "../components/RecentTransactions";

import { Wallet, TrendingUp, TrendingDown, PiggyBank } from "lucide-react";

interface Transaction {
  _id?: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  date: string;
  description?: string;
}

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch Data
  const fetchData = () => {
    API.get("/transactions")
      .then((res) => {
        setTransactions(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load transactions.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculations
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

  // Loading UI
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">
            Loading your dashboard…
          </p>
        </div>
      </div>
    );
  }

  // Error UI
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="card max-w-md text-center">
          <p className="text-red-500 font-semibold text-lg mb-1">
            Something went wrong
          </p>
          <p className="text-muted-foreground text-sm">{error}</p>

          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-500 text-white text-sm rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* Modal */}
      {showForm && (
        <AddTransaction
          refresh={fetchData}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* HEADER */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back! Here's your financial overview.
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="bg-primary text-white px-5 py-2 rounded-xl hover:opacity-90 transition"
        >
          + Add
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        <StatCard
          label="Total Balance"
          value={`$${totalBalance.toFixed(2)}`}
          change={totalBalance >= 0 ? "Positive" : "Negative"}
          changeType={totalBalance >= 0 ? "positive" : "negative"}
          icon={Wallet}
          iconColor="text-white"
          iconBg="bg-indigo-600"
        />

        <StatCard
          label="Total Income"
          value={`$${totalIncome.toFixed(2)}`}
          change={`${transactions.filter((t) => t.type === "income").length} transactions`}
          changeType="positive"
          icon={TrendingUp}
          iconColor="text-white"
          iconBg="bg-green-500"
        />

        <StatCard
          label="Total Expenses"
          value={`$${totalExpenses.toFixed(2)}`}
          change={`${expenseRate}% of income`}
          changeType="negative"
          icon={TrendingDown}
          iconColor="text-white"
          iconBg="bg-red-500"
        />

        <StatCard
          label="Net Savings"
          value={`$${savings.toFixed(2)}`}
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
        <RecentTransactions
          data={transactions}
          refresh={fetchData}
        />
      </div>

    </div>
  );
}