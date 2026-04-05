import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  changeType: "positive" | "negative";
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
}

export default function StatCard({
  label,
  value,
  change,
  changeType,
  icon: Icon,
  iconColor,
  iconBg,
}: StatCardProps) {
  return (
    <div className="card flex justify-between items-start">
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>

        <h2 className="text-2xl font-bold text-foreground mt-1">
          {value}
        </h2>

        <p
          className={`text-sm mt-2 ${
            changeType === "positive"
              ? "text-green-500"
              : "text-red-500"
          }`}
        >
          {change}
        </p>
      </div>

      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}
      >
        <Icon size={22} className={iconColor} />
      </div>
    </div>
  );
}