import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = ["#4F46E5", "#8B5CF6", "#EF4444", "#10B981", "#F59E0B", "#06B6D4"];

export default function ExpenseByCategory({ data }: any) {
  // Convert transactions → category totals
  const categoryData = Object.values(
    data
      .filter((t: any) => t.type === "expense")
      .reduce((acc: any, curr: any) => {
        if (!acc[curr.category]) {
          acc[curr.category] = { name: curr.category, value: 0 };
        }
        acc[curr.category].value += curr.amount;
        return acc;
      }, {})
  );

  return (
    <div className="card">
      {/* Title */}
      <h3 className="text-xl font-bold mb-4 text-foreground">
        Expense by Category
      </h3>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="value"
              outerRadius={110}
              innerRadius={40} // 👈 makes it modern (donut style)
              paddingAngle={2}
            >
              {categoryData.map((_: any, index: number) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            {/* Tooltip (dark friendly) */}
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
              }}
            />

            {/* Legend */}
            <Legend
              wrapperStyle={{
                color: "#9CA3AF",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}