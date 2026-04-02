import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

interface ClassRow {
  id: string;
  name: string;
  join_code: string;
  created_at: string;
  teacher_id: string;
}

export function AdminClassesScreen() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<ClassRow[]>([]);
  const [teacherNames, setTeacherNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: classes, error: cErr } = await supabase
        .from('classes')
        .select('id, name, join_code, created_at, teacher_id')
        .order('created_at', { ascending: false });
      if (cancelled) return;
      if (cErr) {
        setError(cErr.message);
        setLoading(false);
        return;
      }
      const list = (classes ?? []) as ClassRow[];
      setRows(list);
      const ids = [...new Set(list.map(c => c.teacher_id))];
      if (ids.length > 0) {
        const { data: profs } = await supabase.from('profiles').select('id, display_name').in('id', ids);
        if (!cancelled && profs) {
          setTeacherNames(Object.fromEntries(profs.map(p => [p.id, p.display_name])));
        }
      }
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
          <h1 className="text-xl font-bold text-white">Classes</h1>
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
                  <th className="px-4 py-3 font-semibold">Class</th>
                  <th className="px-4 py-3 font-semibold">Teacher</th>
                  <th className="px-4 py-3 font-semibold">Join code</th>
                  <th className="px-4 py-3 font-semibold">Class ID</th>
                  <th className="px-4 py-3 font-semibold">Created</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.id} className="border-t border-slate-800">
                    <td className="px-4 py-3 text-white font-medium">{r.name}</td>
                    <td className="px-4 py-3 text-slate-300">{teacherNames[r.teacher_id] ?? r.teacher_id}</td>
                    <td className="px-4 py-3 font-mono text-amber-200">{r.join_code}</td>
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
