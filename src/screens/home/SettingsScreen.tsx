import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/gameStore';
import { clearAllData } from '../../lib/storage';
import { CATEGORY_LABELS } from '../../data/allForms';
import type { WordCategory } from '../../types';

export function SettingsScreen() {
  const navigate = useNavigate();
  const { settings, updateSettings, toggleCategory } = useGameStore();

  const handleClearData = () => {
    if (window.confirm('Clear all progress data? This cannot be undone.')) {
      clearAllData();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-5">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button onClick={() => navigate('/')} className="text-slate-400 hover:text-white">
            ← Back
          </button>
          <h1 className="text-xl font-bold text-white">Settings</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        {/* Difficulty */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 space-y-4">
          <h2 className="text-white font-bold">Default Difficulty</h2>
          <div className="flex gap-3">
            {(['beginner', 'standard', 'advanced'] as const).map(d => (
              <button
                key={d}
                onClick={() => updateSettings({ difficulty: d })}
                className={`flex-1 py-2 rounded-xl font-semibold capitalize transition-colors ${
                  settings.difficulty === d
                    ? 'bg-blue-600 text-white border-2 border-blue-400'
                    : 'bg-slate-700 text-slate-300 border-2 border-slate-600 hover:border-slate-400'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Display Options */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 space-y-4">
          <h2 className="text-white font-bold">Display Options</h2>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-slate-300">Show helper words</span>
            <input
              type="checkbox"
              checked={settings.showHelperWords}
              onChange={e => updateSettings({ showHelperWords: e.target.checked })}
              className="w-5 h-5 accent-blue-500"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-slate-300">Show English gloss</span>
            <input
              type="checkbox"
              checked={settings.showEnglishGloss}
              onChange={e => updateSettings({ showEnglishGloss: e.target.checked })}
              className="w-5 h-5 accent-blue-500"
            />
          </label>
        </div>

        {/* Active Categories */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 space-y-4">
          <h2 className="text-white font-bold">Active Word Categories</h2>
          <p className="text-slate-400 text-sm">Choose which word types appear in Practice, Speed, and Boss modes.</p>
          <div className="space-y-3">
            {(['pronoun', 'name', 'noun'] as WordCategory[]).map(cat => {
              const info = CATEGORY_LABELS[cat];
              const active = settings.activeCategories.includes(cat);
              return (
                <label key={cat} className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-300 flex items-center gap-2">
                    <span>{info.icon}</span>
                    <span>{info.label}</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => toggleCategory(cat)}
                    className="w-5 h-5 accent-blue-500"
                  />
                </label>
              );
            })}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-950 rounded-2xl border border-red-800 p-6 space-y-3">
          <h2 className="text-red-300 font-bold">Danger Zone</h2>
          <p className="text-red-400 text-sm">This will erase all mastery data and session history.</p>
          <button
            onClick={handleClearData}
            className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors"
          >
            Clear All Progress
          </button>
        </div>
      </div>
    </div>
  );
}
