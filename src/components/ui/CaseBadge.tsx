import type { CaseId } from '../../types';
import { caseMetadata } from '../../data/caseMetadata';

interface CaseBadgeProps {
  caseId: CaseId;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
  lg: 'text-base px-4 py-1.5',
};

export function CaseBadge({ caseId, size = 'md', showLabel = true }: CaseBadgeProps) {
  const meta = caseMetadata[caseId];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold ${sizeClasses[size]}`}
      style={{ backgroundColor: meta.color + '22', color: meta.color, border: `1px solid ${meta.color}55` }}
    >
      <span>{meta.icon}</span>
      {showLabel && <span>{meta.label}</span>}
    </span>
  );
}
