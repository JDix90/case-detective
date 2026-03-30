interface AnswerButtonProps {
  label: string;
  onClick: () => void;
  state?: 'default' | 'correct' | 'wrong' | 'disabled';
  index?: number;
  className?: string;
}

const stateStyles = {
  default: 'bg-slate-800 border-slate-600 text-slate-100 hover:bg-slate-700 hover:border-slate-400 cursor-pointer',
  correct: 'bg-green-900 border-green-400 text-green-200 cursor-default',
  wrong: 'bg-red-900 border-red-400 text-red-200 cursor-default',
  disabled: 'bg-slate-900 border-slate-700 text-slate-500 cursor-not-allowed',
};

const indexLabels = ['A', 'B', 'C', 'D'];

export function AnswerButton({ label, onClick, state = 'default', index, className = '' }: AnswerButtonProps) {
  return (
    <button
      onClick={state === 'default' ? onClick : undefined}
      disabled={state === 'disabled'}
      className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl border-2 text-left text-lg font-medium transition-all duration-150 ${stateStyles[state]} ${className}`}
    >
      {index !== undefined && (
        <span className="flex-shrink-0 w-7 h-7 rounded-full border border-current flex items-center justify-center text-sm font-bold opacity-60">
          {indexLabels[index]}
        </span>
      )}
      <span className="font-bold text-xl">{label}</span>
    </button>
  );
}
