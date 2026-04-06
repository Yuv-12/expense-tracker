import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { type Transaction } from "../../api/api";

const COLORS = [
  "#4F46E5",
  "#8B5CF6",
  "#EF4444",
  "#10B981",
  "#F59E0B",
  "#06B6D4",
];

interface ExpenseByCategoryProps {
  data: Transaction[];
}

interface CategoryEntry {
  name: string;
  value: number;
}

export default function ExpenseByCategory({ data }: ExpenseByCategoryProps) {
  // ✅ Typed reduce — convert transactions to category totals
  const categoryData: CategoryEntry[] = Object.values(
    data
      .filter((t) => t.type === "expense")
      .reduce<Record<string, CategoryEntry>>((acc, curr) => {
        const key = curr.category.trim();
        if (!acc[key]) acc[key] = { name: key, value: 0 };
        acc[key].value += curr.amount;
        return acc;
      }, {})
  );

  // ✅ Empty state — no blank chart
  if (categoryData.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center h-80">
        <p className="text-gray-400 dark:text-gray-500 text-sm">
          No expense data yet.
        </p>
        <p className="text-gray-300 dark:text-gray-600 text-xs mt-1">
          Add some expenses to see the breakdown.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-4 text-foreground">
        Expense by Category
      </h3>

      <div className="h-80">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="value"
              outerRadius={110}
              innerRadius={40}
              paddingAngle={2}
            >
              {categoryData.map((entry, index) => (
                <Cell
                  key={entry.name} // ✅ stable key, not index
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            {/* ✅ Tooltip adapts to light/dark via CSS vars */}
            <Tooltip
              formatter={(value: number) => [`₹${value.toFixed(2)}`, "Amount"]}
              contentStyle={{
                backgroundColor: "var(--tooltip-bg, #1f2937)",
                border: "1px solid var(--tooltip-border, #374151)",
                borderRadius: "8px",
                color: "var(--tooltip-text, #f9fafb)",
              }}
            />

            <Legend wrapperStyle={{ color: "#9CA3AF" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}