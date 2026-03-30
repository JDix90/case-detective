interface FeedbackPanelProps {
  isCorrect: boolean;
  correctAnswer: string;
  explanation: string;
  onContinue: () => void;
  responseMs?: number;
}

export function FeedbackPanel({ isCorrect, correctAnswer, explanation, onContinue, responseMs }: FeedbackPanelProps) {
  return (
    <div className={`rounded-2xl border-2 p-6 space-y-3 ${
      isCorrect
        ? 'bg-green-950 border-green-500'
        : 'bg-red-950 border-red-500'
    }`}>
      <div className="flex items-center gap-3">
        <span className="text-3xl">{isCorrect ? '✅' : '❌'}</span>
        <div>
          <p className={`text-xl font-bold ${isCorrect ? 'text-green-300' : 'text-red-300'}`}>
            {isCorrect ? 'Correct!' : 'Not quite'}
          </p>
          {!isCorrect && (
            <p className="text-slate-300 text-sm">
              Correct answer: <span className="font-bold text-white text-lg">{correctAnswer}</span>
            </p>
          )}
          {responseMs && (
            <p className="text-slate-500 text-xs">{(responseMs / 1000).toFixed(1)}s</p>
          )}
        </div>
      </div>
      <p className="text-slate-300 text-sm leading-relaxed">{explanation}</p>
      <button
        onClick={onContinue}
        className="w-full mt-2 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold transition-colors"
      >
        Continue →
      </button>
    </div>
  );
}
