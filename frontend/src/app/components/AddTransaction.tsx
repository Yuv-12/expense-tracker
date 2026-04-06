import { useState } from "react";
import { X } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import {
  createTransaction,
  updateTransaction,
  type Transaction,
} from "../../api/api";

interface AddTransactionProps {
  onClose: () => void;
  refresh: () => void;
  type?: "income" | "expense";
  data?: Transaction | null;
}

// Today's date formatted as YYYY-MM-DD for the date input default
const todayStr = new Date().toISOString().slice(0, 10);

export default function AddTransaction({
  onClose,
  refresh,
  type = "expense",
  data = null,
}: AddTransactionProps) {
  const { user } = useUser();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    amount: data?.amount?.toString() || "",
    category: data?.category || "",
    description: data?.description || "",
    date: data?.date ? data.date.slice(0, 10) : todayStr, // ✅ default to today
    type: data?.type || type,
  });

  const handleChange =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setError(""); // clear error when user starts typing
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setLoading(true);
    setError("");

    try {
      const payload = {
        ...form,
        amount: Number(form.amount),
        type: form.type as "income" | "expense",
        userId: user.id,
      };

      if (data) {
        await updateTransaction(data._id, payload);
      } else {
        await createTransaction(payload);
      }

      refresh();
      onClose();
    } catch (err) {
      // ✅ api.ts interceptor already normalises this to err.message
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl shadow-xl p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {data ? "Edit Transaction" : "Add Transaction"}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-gray-500 dark:text-gray-400 hover:text-red-500 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={handleChange("amount")}
            className={inputClass}
            min="0.01"        // ✅ no negatives
            step="0.01"       // ✅ allow cents
            required
          />

          <input
            type="text"
            placeholder="Category"
            value={form.category}
            onChange={handleChange("category")}
            className={inputClass}
            required
          />

          <input
            type="text"
            placeholder="Description (optional)"
            value={form.description}
            onChange={handleChange("description")}
            className={inputClass}
          />

          <input
            type="date"
            value={form.date}
            onChange={handleChange("date")}
            className={inputClass}
            required
          />

          <select
            value={form.type}
            onChange={handleChange("type")}
            className={inputClass}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? "Saving..." : data ? "Update" : "Add"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}