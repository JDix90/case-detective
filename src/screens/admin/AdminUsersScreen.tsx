import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

interface ProfileRow {
  id: string;
  role: string;
  display_name: string;
  email: string | null;
  created_at: string;
}

export function AdminUsersScreen() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error: qErr } = await supabase
        .from('profiles')
        .select('id, role, display_name, email, created_at')
        .order('created_at', { ascending: false });
      if (cancelled) return;
      if (qErr) setError(qErr.message);
      setRows((data ?? []) as ProfileRow[]);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-5">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <button type="button" onClick={() => navigate('/admin')} className="text-slate-400 hover:text-white">
            ← Admin
          </button>
          <h1 className="text-xl font-bold text-white">Users</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-4 rounded-xl border border-red-800 bg-red-950 px-4 py-3 text-red-300 text-sm">{error}</div>
        )}
        {loading ? (
          <p className="text-slate-400">Loading…</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-900 text-left text-slate-400">
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Role</th>
                  <th className="px-4 py-3 font-semibold">User ID</th>
                  <th className="px-4 py-3 font-semibold">Created</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.id} className="border-t border-slate-800 bg-slate-900/40">
                    <td className="px-4 py-3 text-white font-medium">{r.display_name}</td>
                    <td className="px-4 py-3 text-slate-300">{r.email ?? '—'}</td>
                    <td className="px-4 py-3 capitalize text-slate-300">{r.role}</td>
                    <td className="px-4 py-3 text-slate-500 font-mono text-xs">{r.id}</td>
                    <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                      {new Date(r.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
