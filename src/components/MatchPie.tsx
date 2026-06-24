import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export function MatchPie({
  score,
  size = 120,
  label = true,
}: {
  score: number;
  size?: number;
  label?: boolean;
}) {
  const data = [
    { name: "match", value: score },
    { name: "gap", value: 100 - score },
  ];
  const color =
    score >= 70 ? "var(--primary)" : score >= 40 ? "var(--lime)" : "var(--muted-foreground)";

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            innerRadius="72%"
            outerRadius="100%"
            startAngle={90}
            endAngle={-270}
            stroke="none"
            isAnimationActive
          >
            <Cell fill={color} />
            <Cell fill="color-mix(in oklab, var(--foreground) 10%, transparent)" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="font-display text-2xl leading-none">{score}%</div>
        {label && (
          <div className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground mt-1">
            match
          </div>
        )}
      </div>
    </div>
  );
}
