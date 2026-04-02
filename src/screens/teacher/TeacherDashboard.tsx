import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface ClassSummary {
  id: string;
  name: string;
  join_code: string;
  created_at: string;
  studentCount: number;
}

export function TeacherDashboard() {
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();
  const [classes, setClasses] = useState<ClassSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;

    const loadClasses = async () => {
      const isAdmin = profile.role === 'admin';
      let q = supabase.from('classes').select('id, name, join_code, created_at').order('created_at', { ascending: false });
      if (!isAdmin) {
        q = q.eq('teacher_id', profile.id);
      }
      const { data: classRows } = await q;

      if (!classRows) {
        setLoading(false);
        return;
      }

      const classIds = classRows.map(c => c.id);
      const { data: memberships } = await supabase
        .from('class_memberships')
        .select('class_id')
        .in('class_id', classIds.length > 0 ? classIds : ['__none__']);

      const countMap: Record<string, number> = {};
      for (const m of memberships ?? []) {
        countMap[m.class_id] = (countMap[m.class_id] ?? 0) + 1;
      }

      setClasses(classRows.map(c => ({
        ...c,
        studentCount: countMap[c.id] ?? 0,
      })));
      setLoading(false);
    };

    loadClasses();
  }, [profile]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              👨‍🏫 Teacher Dashboard
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Welcome, {profile?.displayName}
              {profile?.role === 'admin' && (
                <span className="block text-amber-400/90 text-xs mt-1">Admin: viewing all classes</span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/settings')}
              className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
              title="Settings"
            >
              ⚙️
            </button>
            <button
              onClick={handleSignOut}
              className="text-slate-400 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-slate-300 text-sm font-semibold uppercase tracking-wider">
            My Classes
          </h2>
          <button
            onClick={() => navigate('/teacher/classes')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm transition-colors"
          >
            + New Class
          </button>
        </div>

        {loading ? (
          <div className="text-slate-400 text-center py-12">Loading classes...</div>
        ) : classes.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <div className="text-5xl">📚</div>
            <p className="text-slate-300 font-semibold">No classes yet</p>
            <p className="text-slate-500 text-sm">Create your first class and share the join code with students.</p>
            <button
              onClick={() => navigate('/teacher/classes')}
              className="mt-3 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-colors"
            >
              Create a Class
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {classes.map(cls => (
              <button
                key={cls.id}
                onClick={() => navigate(`/teacher/class/${cls.id}`)}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-500 rounded-2xl p-5 text-left transition-all hover:scale-[1.02] hover:shadow-xl"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-white font-bold text-lg">{cls.name}</h3>
                  <span className="bg-blue-950 text-blue-300 font-mono text-xs px-2 py-1 rounded-lg">
                    {cls.join_code}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-slate-400">
                    {cls.studentCount} {cls.studentCount === 1 ? 'student' : 'students'}
                  </span>
                  <span className="text-slate-600">
                    Created {new Date(cls.created_at).toLocaleDateString()}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
