interface ScorePillProps {
  score: number;
  label?: string;
  icon?: string;
  color?: string;
}

export function ScorePill({ score, label = 'Score', icon = '⭐', color = '#f59e0b' }: ScorePillProps) {
  return (
    <div
      className="flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm"
      style={{ backgroundColor: color + '22', color, border: `1px solid ${color}44` }}
    >
      <span>{icon}</span>
      <span>{label}: {score.toLocaleString()}</span>
    </div>
  );
}
