import { Search } from "lucide-react";
import { useState } from "react";

interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  date: string;
  description?: string;
}

export default function RecentTransactions({ data }: any) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");

  const filtered = data.filter((t: any) => {
    const matchesSearch =
      t.category.toLowerCase().includes(search.toLowerCase()) ||
      (t.description ?? "").toLowerCase().includes(search.toLowerCase());

    const matchesFilter = filter === "all" || t.type === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow border border-gray-100 dark:border-gray-700 transition-colors">

      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Recent Transactions
        </h3>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-52
                border border-gray-200 dark:border-gray-700
                bg-white dark:bg-gray-900
                text-gray-900 dark:text-white
                rounded-xl text-sm
                focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Filter */}
          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value as "all" | "income" | "expense")
            }
            className="px-4 py-2
              border border-gray-200 dark:border-gray-700
              bg-white dark:bg-gray-900
              text-gray-600 dark:text-gray-300
              rounded-xl text-sm"
          >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-10 text-sm">
            No transactions found
          </p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Date
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Category
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Description
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Amount
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Type
                </th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((t: any) => (
                <tr
                  key={t.id}
                  className="border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition"
                >
                  <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-300">
                    {new Date(t.date).toLocaleDateString()}
                  </td>

                  <td className="py-4 px-4 text-sm font-medium text-gray-900 dark:text-white">
                    {t.category}
                  </td>

                  <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                    {t.description ?? "—"}
                  </td>

                  <td
                    className={`py-4 px-4 text-sm font-semibold text-right ${
                      t.type === "income"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {t.type === "income" ? "+" : "-"}₹{t.amount.toFixed(2)}
                  </td>

                  <td className="py-4 px-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        t.type === "income"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {t.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}