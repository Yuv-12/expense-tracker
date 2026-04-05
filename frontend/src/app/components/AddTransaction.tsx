import { useState } from "react";
import { X } from "lucide-react";
import API from "../../api/api";

export default function AddTransaction({
  onClose,
  refresh,
  type = "expense",
  data = null,
}: any) {

  // ✅ FIXED: inside component
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    amount: data?.amount || "",
    category: data?.category || "",
    description: data?.description || "",
    date: data?.date ? data.date.slice(0, 10) : "",
    type: data?.type || type,
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      if (data) {
        await API.put(`/transactions/${data._id}`, form);
      } else {
        await API.post("/transactions", form);
      }

      refresh();
      onClose();

    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        "Expense cannot exceed income";

      setError(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

      {/* MODAL */}
      <div className="w-full max-w-md rounded-2xl shadow-xl p-6
        bg-white dark:bg-gray-900
        text-gray-900 dark:text-white">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {data ? "Edit Transaction" : "Add Transaction"}
          </h2>

          <button onClick={onClose}>
            <X className="text-gray-500 dark:text-gray-400 hover:text-red-500" />
          </button>
        </div>

        {/* ✅ ERROR MESSAGE */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-600 
            dark:text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* AMOUNT */}
          <input
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) =>
              setForm({ ...form, amount: e.target.value })
            }
            className="input dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            required
          />

          {/* CATEGORY */}
          <input
            type="text"
            placeholder="Category"
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
            className="input dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            required
          />

          {/* DESCRIPTION */}
          <input
            type="text"
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="input dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />

          {/* DATE */}
          <input
            type="date"
            value={form.date}
            onChange={(e) =>
              setForm({ ...form, date: e.target.value })
            }
            className="input dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            required
          />

          {/* TYPE */}
          <select
            value={form.type}
            onChange={(e) =>
              setForm({ ...form, type: e.target.value })
            }
            className="input dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          {/* BUTTONS */}
          <div className="flex justify-end gap-3 pt-2">

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 
              text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-indigo-700"
            >
              {data ? "Update" : "Add"}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}     