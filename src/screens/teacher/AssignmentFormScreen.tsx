import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import type { CaseId, WordCategory, ModeId } from '../../types';

const ALL_CASES: CaseId[] = ['nominative', 'genitive', 'dative', 'accusative', 'instrumental', 'prepositional'];
const ALL_CATEGORIES: { value: WordCategory; label: string }[] = [
  { value: 'pronoun', label: 'Pronouns' },
  { value: 'name', label: 'Names' },
  { value: 'noun', label: 'Nouns' },
];
const ALL_MODES: { value: ModeId; label: string }[] = [
  { value: 'practice', label: 'Practice' },
  { value: 'speed_round', label: 'Speed Round' },
  { value: 'boss_battle', label: 'Boss Battle' },
];

export function AssignmentFormScreen() {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const { profile } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [modeId, setModeId] = useState<ModeId>('practice');
  const [selectedCases, setSelectedCases] = useState<CaseId[]>([...ALL_CASES]);
  const [selectedCategories, setSelectedCategories] = useState<WordCategory[]>(['pronoun']);
  const [minQuestions, setMinQuestions] = useState(10);
  const [minAccuracy, setMinAccuracy] = useState(70);
  const [dueDate, setDueDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const toggleCase = (c: CaseId) => {
    setSelectedCases(prev =>
      prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]
    );
  };

  const toggleCategory = (c: WordCategory) => {
    setSelectedCategories(prev => {
      const next = prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c];
      return next.length === 0 ? [c] : next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError('Title is required.'); return; }
    setError('');
    setSubmitting(true);

    const { error: dbError } = await supabase.from('assignments').insert({
      class_id: classId,
      teacher_id: profile!.id,
      title: title.trim(),
      description: description.trim() || null,
      mode_id: modeId,
      case_ids: selectedCases,
      categories: selectedCategories,
      min_questions: minQuestions,
      min_accuracy: minAccuracy / 100,
      due_date: dueDate || null,
    });

    setSubmitting(false);
    if (dbError) {
      setError(dbError.message);
    } else {
      navigate(`/teacher/class/${classId}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-5">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white">
            ← Back
          </button>
          <h1 className="text-xl font-bold text-white">New Assignment</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        {error && (
          <div className="bg-red-950 border border-red-700 text-red-300 text-sm rounded-xl px-4 py-3">{error}</div>
        )}

        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 space-y-4">
          <div>
            <label className="text-slate-300 text-sm font-semibold block mb-1.5">Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500"
              placeholder="e.g. Genitive Case Practice"
              required
            />
          </div>

          <div>
            <label className="text-slate-300 text-sm font-semibold block mb-1.5">Description (optional)</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
              className="w-full bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500 resize-none"
              placeholder="Instructions for students..."
            />
          </div>
        </div>

        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 space-y-4">
          <h2 className="text-white font-bold">Game Mode</h2>
          <div className="flex gap-3">
            {ALL_MODES.map(m => (
              <button
                key={m.value}
                type="button"
                onClick={() => setModeId(m.value)}
                className={`flex-1 py-2 rounded-xl font-semibold text-sm transition-colors ${
                  modeId === m.value
                    ? 'bg-blue-600 text-white border-2 border-blue-400'
                    : 'bg-slate-700 text-slate-300 border-2 border-slate-600 hover:border-slate-400'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 space-y-4">
          <h2 className="text-white font-bold">Cases</h2>
          <div className="flex flex-wrap gap-2">
            {ALL_CASES.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => toggleCase(c)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold capitalize transition-colors ${
                  selectedCases.includes(c)
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 space-y-4">
          <h2 className="text-white font-bold">Word Categories</h2>
          <div className="flex gap-3">
            {ALL_CATEGORIES.map(c => (
              <button
                key={c.value}
                type="button"
                onClick={() => toggleCategory(c.value)}
                className={`px-4 py-2 rounded-xl font-semibold text-sm transition-colors ${
                  selectedCategories.includes(c.value)
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 space-y-4">
          <h2 className="text-white font-bold">Requirements</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 text-sm block mb-1.5">Min Questions</label>
              <input
                type="number"
                value={minQuestions}
                onChange={e => setMinQuestions(Number(e.target.value))}
                min={5}
                max={100}
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-slate-300 text-sm block mb-1.5">Min Accuracy (%)</label>
              <input
                type="number"
                value={minAccuracy}
                onChange={e => setMinAccuracy(Number(e.target.value))}
                min={0}
                max={100}
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 space-y-4">
          <h2 className="text-white font-bold">Due Date (optional)</h2>
          <input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-green-600 hover:bg-green-500 disabled:bg-green-800 text-white rounded-xl font-bold text-base transition-colors"
        >
          {submitting ? 'Creating...' : 'Create Assignment'}
        </button>
      </form>
    </div>
  );
}
