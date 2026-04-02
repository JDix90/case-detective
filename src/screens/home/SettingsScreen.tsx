import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/gameStore';
import { useAuth } from '../../contexts/AuthContext';
import { clearAllData } from '../../lib/storage';
import { CATEGORY_LABELS } from '../../data/allForms';
import type { WordCategory } from '../../types';

export function SettingsScreen() {
  const navigate = useNavigate();
  const { settings, updateSettings, toggleCategory } = useGameStore();
  const { profile, loading: authLoading, updateProfile, signOut } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName);
      setEmail(profile.email);
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    if (!profile) return;
    setProfileMessage(null);
    const nextDisplay = displayName.trim();
    const nextEmail = email.trim().toLowerCase();
    const displayChanged = nextDisplay !== profile.displayName;
    const emailChanged = nextEmail !== profile.email.toLowerCase();
    if (!displayChanged && !emailChanged) {
      setProfileMessage({ type: 'ok', text: 'No changes to save.' });
      return;
    }
    if (!nextDisplay) {
      setProfileMessage({ type: 'err', text: 'Display name cannot be empty.' });
      return;
    }
    setSavingProfile(true);
    const { error, info } = await updateProfile({
      ...(displayChanged ? { displayName: nextDisplay } : {}),
      ...(emailChanged ? { email: nextEmail } : {}),
    });
    setSavingProfile(false);
    if (error) {
      setProfileMessage({ type: 'err', text: error });
    } else {
      setProfileMessage({ type: 'ok', text: info ?? 'Saved.' });
    }
  };

  const handleClearData = () => {
    if (window.confirm('Clear all progress data? This cannot be undone.')) {
      clearAllData();
      window.location.reload();
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-5">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button onClick={() => navigate('/home')} className="text-slate-400 hover:text-white">
            ← Back
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">Settings</h1>
            <p className="text-slate-500 text-sm mt-0.5">Game preferences and account</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        {/* Profile */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 space-y-4">
          <h2 className="text-white font-bold">Profile</h2>
          {authLoading && !profile ? (
            <p className="text-slate-400 text-sm">Loading account…</p>
          ) : profile ? (
            <>
              <div className="space-y-4">
                <div>
                  <label htmlFor="settings-display-name" className="text-slate-400 text-sm font-medium block mb-1.5">
                    Display name
                  </label>
                  <input
                    id="settings-display-name"
                    type="text"
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    autoComplete="name"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="settings-email" className="text-slate-400 text-sm font-medium block mb-1.5">
                    Email
                  </label>
                  <input
                    id="settings-email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete="email"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
                    Changing email may send a confirmation link, depending on your Supabase auth settings.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-slate-400 text-sm font-medium">Role</span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-slate-700 text-slate-200 text-sm capitalize border border-slate-600">
                    {profile.role}
                  </span>
                  {profile.role === 'admin' ? (
                    <span className="text-slate-500 text-xs">Use the admin bar at the top to switch Student / Teacher view.</span>
                  ) : (
                    <span className="text-slate-500 text-xs">(contact an admin to change)</span>
                  )}
                </div>
              </div>

              {profileMessage && (
                <div
                  className={`rounded-xl px-4 py-3 text-sm ${
                    profileMessage.type === 'ok'
                      ? 'bg-emerald-950 border border-emerald-800 text-emerald-200'
                      : 'bg-red-950 border border-red-800 text-red-300'
                  }`}
                >
                  {profileMessage.text}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl font-semibold transition-colors"
                >
                  {savingProfile ? 'Saving…' : 'Save profile'}
                </button>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold transition-colors"
                >
                  Sign out
                </button>
              </div>
            </>
          ) : (
            <p className="text-slate-400 text-sm">Could not load profile. Try signing in again.</p>
          )}
        </div>

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
