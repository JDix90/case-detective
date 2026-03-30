import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/gameStore';
import { getTotalFormCount, CATEGORY_LABELS } from '../../data/allForms';
import type { WordCategory } from '../../types';

const modes = [
  {
    id: 'learn_table',
    path: '/learn',
    title: 'Learn Table',
    description: 'Study the full declension table with interactive highlighting.',
    icon: '📋',
    color: '#3b82f6',
    tag: 'Study',
  },
  {
    id: 'practice',
    path: '/practice',
    title: 'Practice',
    description: 'Adaptive fill-in-the-blank questions that focus on your weak spots.',
    icon: '🎯',
    color: '#22c55e',
    tag: 'Core',
  },
  {
    id: 'speed_round',
    path: '/speed',
    title: 'Speed Round',
    description: 'Race the clock. Answer as many as you can in 60 seconds.',
    icon: '⚡',
    color: '#f59e0b',
    tag: 'Timed',
  },
  {
    id: 'boss_battle',
    path: '/boss',
    title: 'Boss Battle',
    description: 'Team vs. boss. Deal damage with correct answers before time runs out.',
    icon: '⚔️',
    color: '#ef4444',
    tag: 'Multiplayer',
  },
  {
    id: 'memory_match',
    path: '/memory',
    title: 'Memory Match',
    description: 'Flip cards to match words with their declined forms.',
    icon: '🃏',
    color: '#a855f7',
    tag: 'Recognition',
  },
  {
    id: 'grid_challenge',
    path: '/grid',
    title: 'Grid Challenge',
    description: 'Complete the full declension grid from memory.',
    icon: '🔲',
    color: '#14b8a6',
    tag: 'Mastery',
  },
];

export function HomeScreen() {
  const navigate = useNavigate();
  const { masteryRecords, sessionHistory, settings, toggleCategory } = useGameStore();

  const totalAttempts = Object.values(masteryRecords).reduce((s, r) => s + r.attempts, 0);
  const masteredCount = Object.values(masteryRecords).filter(r => r.status === 'mastered').length;
  const totalForms = getTotalFormCount(settings.activeCategories);
  const recentSession = sessionHistory[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              🔍 Case Detective
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">Russian Case Declensions</p>
          </div>
          <button
            onClick={() => navigate('/settings')}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
            title="Settings"
          >
            ⚙️
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Category Quick-Toggles */}
        <div className="flex gap-2">
          {(['pronoun', 'name', 'noun'] as WordCategory[]).map(cat => {
            const info = CATEGORY_LABELS[cat];
            const active = settings.activeCategories.includes(cat);
            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                  active
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-500 hover:bg-slate-700 hover:text-slate-300'
                }`}
              >
                {info.icon} {info.label}
              </button>
            );
          })}
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-800 rounded-xl p-4 text-center border border-slate-700">
            <p className="text-2xl font-bold text-white">{totalAttempts}</p>
            <p className="text-slate-400 text-xs mt-1">Total Answers</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 text-center border border-slate-700">
            <p className="text-2xl font-bold text-purple-400">{masteredCount}/{totalForms}</p>
            <p className="text-slate-400 text-xs mt-1">Forms Mastered</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 text-center border border-slate-700">
            <p className="text-2xl font-bold text-green-400">
              {recentSession ? `${Math.round(recentSession.accuracy * 100)}%` : '—'}
            </p>
            <p className="text-slate-400 text-xs mt-1">Last Accuracy</p>
          </div>
        </div>

        {/* Mode Grid */}
        <div>
          <h2 className="text-slate-300 text-sm font-semibold uppercase tracking-wider mb-4">
            Choose a Mode
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {modes.map(mode => (
              <button
                key={mode.id}
                onClick={() => navigate(mode.path)}
                className="group bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-500 rounded-2xl p-5 text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-xl"
                style={{ '--mode-color': mode.color } as React.CSSProperties}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{mode.icon}</span>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: mode.color + '22', color: mode.color }}
                  >
                    {mode.tag}
                  </span>
                </div>
                <h3 className="text-white font-bold text-base mb-1">{mode.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{mode.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        {sessionHistory.length > 0 && (
          <div>
            <h2 className="text-slate-300 text-sm font-semibold uppercase tracking-wider mb-3">
              Recent Sessions
            </h2>
            <div className="space-y-2">
              {sessionHistory.slice(0, 3).map(s => (
                <div
                  key={s.id}
                  className="flex items-center justify-between bg-slate-800 rounded-xl px-4 py-3 border border-slate-700"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">
                      {modes.find(m => m.id === s.modeId)?.icon ?? '🎮'}
                    </span>
                    <div>
                      <p className="text-white text-sm font-medium">
                        {modes.find(m => m.id === s.modeId)?.title ?? s.modeId}
                      </p>
                      <p className="text-slate-500 text-xs">
                        {new Date(s.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">{s.score.toLocaleString()}</p>
                    <p className="text-slate-400 text-xs">{Math.round(s.accuracy * 100)}% acc</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
