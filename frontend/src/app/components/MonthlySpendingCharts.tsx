import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { type Transaction } from "../../api/api";

interface MonthlyEntry {
  month: string;
  income: number;
  expenses: number;
  sortKey: number;
}

interface MonthlySpendingChartProps {
  data?: Transaction[];
}

export default function MonthlySpendingChart({ data = [] }: MonthlySpendingChartProps) {

  // ✅ Typed reduce — group transactions by month
  const grouped = data.reduce<Record<string, MonthlyEntry>>((acc, curr) => {
    const date = new Date(curr.date);
    const key = `${date.getFullYear()}-${date.getMonth()}`;

    if (!acc[key]) {
      acc[key] = {
        month: date.toLocaleString("default", { month: "short", year: "2-digit" }),
        income: 0,
        expenses: 0,
        sortKey: new Date(date.getFullYear(), date.getMonth(), 1).getTime(),
      };
    }

    if (curr.type === "income") acc[key].income += curr.amount;
    else acc[key].expenses += curr.amount;

    return acc;
  }, {});

  // ✅ Typed sort — no more `a: any, b: any`
  const monthlyData = Object.values(grouped).sort(
    (a, b) => a.sortKey - b.sortKey
  );

  // ✅ Empty state renders instead of the chart
  if (monthlyData.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center h-80">
        <p className="text-gray-400 dark:text-gray-500 text-sm">No data available.</p>
        <p className="text-gray-300 dark:text-gray-600 text-xs mt-1">
          Add transactions to see monthly spending.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-4 text-foreground">Monthly Spending</h3>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyData}>
            <CartesianGrid stroke="#374151" strokeDasharray="3 3" />

            <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fill: "#9CA3AF" }} />
            <YAxis stroke="#9CA3AF" tick={{ fill: "#9CA3AF" }} />

            {/* ✅ Tooltip adapts to light/dark + formats with ₹ */}
            <Tooltip
              formatter={(value: number) => [`₹${value.toFixed(2)}`, undefined]}
              contentStyle={{
                backgroundColor: "var(--tooltip-bg, #1f2937)",
                border: "1px solid var(--tooltip-border, #374151)",
                borderRadius: "8px",
                color: "var(--tooltip-text, #f9fafb)",
              }}
            />

            <Legend wrapperStyle={{ color: "#9CA3AF" }} />

            <Bar dataKey="income" fill="#10B981" radius={[6, 6, 0, 0]} />
            <Bar dataKey="expenses" fill="#6366F1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 