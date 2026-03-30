interface StreakDisplayProps {
  streak: number;
  max?: number;
}

export function StreakDisplay({ streak, max = 10 }: StreakDisplayProps) {
  if (streak === 0) return null;
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-950 border border-orange-500">
      <span className="text-orange-400 text-sm font-bold">🔥 {streak}</span>
      {streak >= max && <span className="text-orange-300 text-xs">MAX</span>}
    </div>
  );
}
