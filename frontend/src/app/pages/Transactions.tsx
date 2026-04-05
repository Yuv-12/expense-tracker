import { useState, useEffect } from "react";
import { Search, Download, Plus } from "lucide-react";
import API from "../../api/api";
import AddTransaction from "../components/AddTransaction";

export default function TransactionsPage() {
  const [allTransactions, setAllTransactions] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  // FETCH DATA
  const fetchData = () => {
    API.get("/transactions")
      .then((res) => setAllTransactions(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // DELETE
  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this transaction?")) return;

    try {
      await API.delete(`/transactions/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // EDIT
  const handleEdit = (transaction: any) => {
    setEditData(transaction);
    setShowForm(true);
  };

  // EXPORT CSV
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

    const blob = new Blob([csv]);
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
  };

  // CATEGORY LIST
  const categories = [
    "all",
    ...Array.from(
      new Set(allTransactions.map((t) => t.category?.toLowerCase().trim()))
    ).filter(Boolean),
  ];

  // FILTER LOGIC
  const filteredTransactions = allTransactions.filter((t) => {
    const category = t.category?.toLowerCase();

    const matchesSearch =
      t.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category?.includes(searchQuery.toLowerCase());

    const matchesCategory =
      filterCategory === "all" || category === filterCategory;

    const matchesType =
      filterType === "all" || t.type === filterType;

    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <>
      {/* MODAL */}
      {showForm && (
        <AddTransaction
          data={editData}
          type={editData?.type || "expense"}
          onClose={() => {
            setShowForm(false);
            setEditData(null);
          }}
          refresh={fetchData}
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

        {/* 🔥 FILTER + ACTION BAR */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

          {/* LEFT FILTERS */}
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

          {/* RIGHT BUTTONS */}
          <div className="flex items-center gap-3 shrink-0">

            {/* EXPORT */}
            <button
              onClick={handleExport}
              className="btn-outline h-[40px] px-4 flex items-center gap-2 whitespace-nowrap"
            >
              <Download size={16} />
              Export
            </button>

            {/* ADD */}
            <button
              onClick={() => {
                setEditData(null);
                setShowForm(true);
              }}
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
                  {new Date(t.date).toLocaleDateString()}
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
                        : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
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
                  {t.type === "income" ? "+" : "-"}₹{t.amount}
                </td>

                <td className="px-4 py-3 text-right space-x-3">
                  <button
                    onClick={() => handleEdit(t)}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(t._id)}
                    className="text-red-500 dark:text-red-400 hover:underline font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredTransactions.length === 0 && (
          <p className="text-center py-6 text-gray-500 dark:text-gray-400">
            No transactions found
          </p>
        )}
      </div>
    </>
  );
}