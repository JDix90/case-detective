import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

function generateJoinCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  const arr = new Uint8Array(6);
  crypto.getRandomValues(arr);
  for (let i = 0; i < 6; i++) {
    code += chars[arr[i] % chars.length];
  }
  return code;
}

interface ClassRow {
  id: string;
  name: string;
  join_code: string;
  created_at: string;
}

export function ClassListScreen() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!profile) return;
    const tid = profile.id;
    const isAdmin = profile.role === 'admin';
    const loadClasses = async () => {
      let q = supabase.from('classes').select('id, name, join_code, created_at').order('created_at', { ascending: false });
      if (!isAdmin) {
        q = q.eq('teacher_id', tid);
      }
      const { data } = await q;
      setClasses(data ?? []);
      setLoading(false);
    };
    loadClasses();
  }, [profile, refreshKey]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);

    const joinCode = generateJoinCode();
    const { error } = await supabase.from('classes').insert({
      teacher_id: profile!.id,
      name: newName.trim(),
      join_code: joinCode,
    });

    if (!error) {
      setNewName('');
      setShowForm(false);
      setRefreshKey(k => k + 1);
    }
    setCreating(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-5">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <button onClick={() => navigate('/teacher')} className="text-slate-400 hover:text-white">
            ← Dashboard
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">{profile?.role === 'admin' ? 'All Classes' : 'My Classes'}</h1>
            {profile?.role === 'admin' && (
              <p className="text-amber-400/90 text-xs mt-1">Admin view — all teachers</p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="w-full py-3 border-2 border-dashed border-slate-600 hover:border-blue-500 text-slate-400 hover:text-blue-400 rounded-2xl font-semibold transition-colors"
          >
            + Create New Class
          </button>
        ) : (
          <form onSubmit={handleCreate} className="bg-slate-800 rounded-2xl border border-slate-700 p-6 space-y-4">
            <h2 className="text-white font-bold">New Class</h2>
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="Class name (e.g. Russian 101 — Period 2)"
              className="w-full bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={creating || !newName.trim()}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white rounded-xl font-semibold transition-colors"
              >
                {creating ? 'Creating...' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setNewName(''); }}
                className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="text-slate-400 text-center py-12">Loading...</div>
        ) : classes.length === 0 ? (
          <p className="text-slate-500 text-center py-8">No classes created yet.</p>
        ) : (
          <div className="space-y-3">
            {classes.map(cls => (
              <button
                key={cls.id}
                onClick={() => navigate(`/teacher/class/${cls.id}`)}
                className="w-full flex items-center justify-between bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-2xl px-5 py-4 text-left transition-colors"
              >
                <div>
                  <p className="text-white font-bold">{cls.name}</p>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Created {new Date(cls.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-blue-950 text-blue-300 font-mono text-sm px-3 py-1 rounded-lg">
                  {cls.join_code}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
