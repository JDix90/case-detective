import type { GeneratedQuestion } from '../../lib/questionGenerator';
import { CaseBadge } from '../ui/CaseBadge';

interface QuestionCardProps {
  question: GeneratedQuestion;
  showHelper?: boolean;
}

export function QuestionCard({ question, showHelper = true }: QuestionCardProps) {
  const { template } = question;

  // Split prompt on ___ to highlight the blank
  const parts = template.prompt.split('___');

  return (
    <div className="bg-slate-800 rounded-2xl border border-slate-600 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <CaseBadge caseId={template.targetCaseId} />
        {showHelper && (
          <span className="text-slate-400 text-sm">
            Helper: <span className="text-slate-200 font-semibold">{template.helperWord}</span>
          </span>
        )}
      </div>

      <div className="text-center py-4">
        <p className="text-3xl font-bold text-white leading-relaxed">
          {parts.map((part, i) => (
            <span key={i}>
              {part}
              {i < parts.length - 1 && (
                <span className="inline-block border-b-2 border-blue-400 min-w-[80px] mx-1 text-blue-400">
                  ___
                </span>
              )}
            </span>
          ))}
        </p>
      </div>

      {template.targetMeaning && (
        <p className="text-center text-slate-400 text-sm italic">
          ({template.targetMeaning})
        </p>
      )}
    </div>
  );
}
