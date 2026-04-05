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

type Transaction = {
  amount: number;
  date: string;
  type: "income" | "expense";
};

export default function MonthlySpendingChart({
  data = [],
}: {
  data: Transaction[];
}) {
  // Group data
  const grouped = data.reduce((acc: any, curr: Transaction) => {
    const date = new Date(curr.date);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const label = date.toLocaleString("default", {
      month: "short",
      year: "2-digit",
    });

    if (!acc[key]) {
      acc[key] = {
        month: label,
        income: 0,
        expenses: 0,
        sortKey: new Date(date.getFullYear(), date.getMonth(), 1).getTime(),
      };
    }

    if (curr.type === "income") {
      acc[key].income += curr.amount;
    } else {
      acc[key].expenses += curr.amount;
    }

    return acc;
  }, {});

  const monthlyData = Object.values(grouped).sort(
    (a: any, b: any) => a.sortKey - b.sortKey
  );

  return (
    <div className="card">
      {/* Title */}
      <h3 className="text-xl font-bold mb-4 text-foreground">
        Monthly Spending
      </h3>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyData}>
            <CartesianGrid stroke="#374151" strokeDasharray="3 3" />

            <XAxis
              dataKey="month"
              stroke="#9CA3AF"
              tick={{ fill: "#9CA3AF" }}
            />

            <YAxis stroke="#9CA3AF" tick={{ fill: "#9CA3AF" }} />

            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
              }}
            />

            <Legend wrapperStyle={{ color: "#9CA3AF" }} />

            <Bar dataKey="income" fill="#10B981" radius={[6, 6, 0, 0]} />
            <Bar dataKey="expenses" fill="#6366F1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Empty state */}
      {monthlyData.length === 0 && (
        <p className="text-muted-foreground text-center mt-4">
          No data available
        </p>
      )}
    </div>
  );
}