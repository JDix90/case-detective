import type { MasteryRecord } from '../../types';

interface MasteryBadgeProps {
  status: MasteryRecord['status'];
  score?: number;
  size?: 'sm' | 'md';
}

const statusConfig = {
  unseen: { label: 'Unseen', color: '#64748b', icon: '○' },
  introduced: { label: 'Introduced', color: '#f59e0b', icon: '◔' },
  shaky: { label: 'Shaky', color: '#ef4444', icon: '◑' },
  improving: { label: 'Improving', color: '#3b82f6', icon: '◕' },
  strong: { label: 'Strong', color: '#22c55e', icon: '●' },
  mastered: { label: 'Mastered', color: '#a855f7', icon: '★' },
};

export function MasteryBadge({ status, score, size = 'md' }: MasteryBadgeProps) {
  const cfg = statusConfig[status];
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold ${textSize}`}
      style={{ backgroundColor: cfg.color + '22', color: cfg.color, border: `1px solid ${cfg.color}44` }}
    >
      <span>{cfg.icon}</span>
      <span>{cfg.label}</span>
      {score !== undefined && <span className="opacity-70">({score})</span>}
    </span>
  );
}
