import { useState, useEffect, useCallback } from "react";
import { Search, Download, Plus } from "lucide-react";
import { useUser } from "@clerk/clerk-react";

import {
  getTransactions,
  deleteTransaction,
  type Transaction,
} from "../../api/api";
import AddTransaction from "../components/AddTransaction";

export default function TransactionsPage() {
  const { user } = useUser();

  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null); // ✅ inline confirm

  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState<Transaction | null>(null);

  //////////////////////////////////////////////////////
  // ✅ FETCH — uses typed helper with correct userId
  //////////////////////////////////////////////////////
  const fetchData = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const res = await getTransactions(user.id);
      setAllTransactions(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load transactions.");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ✅ Refresh when a transaction is added via the sidebar modal
  useEffect(() => {
    window.addEventListener("transaction-added", fetchData);
    return () => window.removeEventListener("transaction-added", fetchData);
  }, [fetchData]);

  //////////////////////////////////////////////////////
  // ✅ DELETE — sends userId, uses inline confirm
  //////////////////////////////////////////////////////
  const handleDelete = async (id: string) => {
    if (!user?.id) return;

    try {
      await deleteTransaction(id, user.id); // ✅ passes userId correctly
      setDeletingId(null);
      fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete.");
    }
  };

  //////////////////////////////////////////////////////
  // EDIT
  //////////////////////////////////////////////////////
  const handleEdit = (transaction: Transaction) => {
    setEditData(transaction);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditData(null);
  };

  //////////////////////////////////////////////////////
  // ✅ EXPORT CSV — fixed MIME type + memory leak
  //////////////////////////////////////////////////////
  const handleExport = () => {
    const headers = ["Date", "Category", "Description", "Type", "Amount"];

    const rows = allTransactions.map((t) => [
      new Date(t.date).toLocaleDateString("en-IN"),
      t.category,
      t.description || "",
      t.type,
      t.amount,
    ]);

    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" }); // ✅ MIME type
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();

    URL.revokeObjectURL(url); // ✅ free memory
  };

  //////////////////////////////////////////////////////
  // FILTER LOGIC
  //////////////////////////////////////////////////////
  const categories = [
    "all",
    ...Array.from(
      new Set(allTransactions.map((t) => t.category?.toLowerCase().trim()))
    ).filter(Boolean),
  ];

  const filteredTransactions = allTransactions.filter((t) => {
    const category = t.category?.toLowerCase();
    const matchesSearch =
      t.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category?.includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || category === filterCategory;
    const matchesType = filterType === "all" || t.type === filterType;
    return matchesSearch && matchesCategory && matchesType;
  });

  //////////////////////////////////////////////////////
  // LOADING
  //////////////////////////////////////////////////////
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Loading transactions…
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

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////
  return (
    <>
      {/* MODAL */}
      {showForm && (
        <AddTransaction
          data={editData}
          type={editData?.type || "expense"}
          onClose={handleCloseForm}
          refresh={() => { fetchData(); handleCloseForm(); }}
        />
      )}

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Transactions
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage your financial activity
        </p>
      </div>

      {/* CARD */}
      <div className="card">

        {/* FILTER + ACTION BAR */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

          <div className="flex items-center gap-3 flex-wrap w-full">
            {/* SEARCH */}
            <div className="relative flex-[2] min-w-[220px]">
              <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-9 h-[40px] w-full"
              />
            </div>

            {/* CATEGORY */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="input h-[40px] flex-1 min-w-[160px]"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "all"
                    ? "All Categories"
                    : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>

            {/* TYPE */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input h-[40px] flex-1 min-w-[140px]"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleExport}
              className="btn-outline h-[40px] px-4 flex items-center gap-2 whitespace-nowrap"
            >
              <Download size={16} />
              Export
            </button>

            <button
              onClick={() => { setEditData(null); setShowForm(true); }}
              className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white h-[40px] px-5 rounded-xl flex items-center gap-2 font-semibold shadow-md whitespace-nowrap"
            >
              <Plus size={16} />
              Add
            </button>
          </div>
        </div>

        {/* TABLE */}
        <table className="w-full text-sm border-separate border-spacing-y-2">
          <thead>
            <tr className="text-gray-500 dark:text-gray-400 text-xs uppercase">
              <th className="text-left px-4 py-2">Date</th>
              <th className="text-left px-4 py-2">Category</th>
              <th className="text-left px-4 py-2">Description</th>
              <th className="text-center px-4 py-2">Type</th>
              <th className="text-right px-4 py-2">Amount</th>
              <th className="text-right px-4 py-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredTransactions.map((t) => (
              <tr
                key={t._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                  {new Date(t.date).toLocaleDateString("en-IN")}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                  {t.category}
                </td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                  {t.description || "-"}
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      t.type === "income"
                        ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {t.type}
                  </span>
                </td>
                <td
                  className={`px-4 py-3 text-right font-semibold ${
                    t.type === "income"
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-500 dark:text-red-400"
                  }`}
                >
                  {t.type === "income" ? "+" : "-"}₹{t.amount.toFixed(2)}
                </td>

                {/* ✅ INLINE CONFIRM — replaces window.confirm */}
                <td className="px-4 py-3 text-right">
                  {deletingId === t._id ? (
                    <span className="flex items-center justify-end gap-2 text-xs">
                      <span className="text-gray-500">Sure?</span>
                      <button
                        onClick={() => handleDelete(t._id)}
                        className="text-red-500 font-semibold hover:underline"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setDeletingId(null)}
                        className="text-gray-400 hover:underline"
                      >
                        No
                      </button>
                    </span>
                  ) : (
                    <span className="space-x-3">
                      <button
                        onClick={() => handleEdit(t)}
                        className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeletingId(t._id)}
                        className="text-red-500 dark:text-red-400 hover:underline font-medium"
                      >
                        Delete
                      </button>
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredTransactions.length === 0 && (
          <p className="text-center py-8 text-gray-500 dark:text-gray-400">
            {allTransactions.length === 0
              ? "No transactions yet. Add your first one!"
              : "No transactions match your filters."}
          </p>
        )}
      </div>
    </>
  );
}