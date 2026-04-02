import { supabase } from './supabase';
import type { MasteryRecord, SessionSummary } from '../types';
import type { AppSettings } from './storage';

export async function cloudLoadMasteryRecords(userId: string): Promise<Record<string, MasteryRecord>> {
  const { data, error } = await supabase
    .from('mastery_records')
    .select('*')
    .eq('user_id', userId);

  if (error || !data) return {};

  const records: Record<string, MasteryRecord> = {};
  for (const row of data) {
    records[row.form_key] = {
      formKey: row.form_key,
      attempts: row.attempts,
      correct: row.correct,
      lastSeenAt: row.last_seen_at,
      lastCorrectAt: row.last_correct_at ?? undefined,
      easeScore: row.ease_score,
      masteryScore: row.mastery_score,
      consecutiveCorrect: row.consecutive_correct,
      consecutiveWrong: row.consecutive_wrong,
      confusionWith: row.confusion_with ?? [],
      status: row.status,
    };
  }
  return records;
}

export async function cloudSaveMasteryRecord(userId: string, record: MasteryRecord): Promise<void> {
  await supabase.from('mastery_records').upsert({
    user_id: userId,
    form_key: record.formKey,
    attempts: record.attempts,
    correct: record.correct,
    last_seen_at: record.lastSeenAt,
    last_correct_at: record.lastCorrectAt ?? null,
    ease_score: record.easeScore,
    mastery_score: record.masteryScore,
    consecutive_correct: record.consecutiveCorrect,
    consecutive_wrong: record.consecutiveWrong,
    confusion_with: record.confusionWith,
    status: record.status,
  }, { onConflict: 'user_id,form_key' });
}

export async function cloudLoadSettings(userId: string): Promise<Partial<AppSettings>> {
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) return {};

  return {
    audioEnabled: data.audio_enabled,
    difficulty: data.difficulty,
    showHelperWords: data.show_helper_words,
    showEnglishGloss: data.show_english_gloss,
    activeCategories: data.active_categories,
  };
}

export async function cloudSaveSettings(userId: string, settings: AppSettings): Promise<void> {
  await supabase.from('user_settings').upsert({
    user_id: userId,
    audio_enabled: settings.audioEnabled,
    difficulty: settings.difficulty,
    show_helper_words: settings.showHelperWords,
    show_english_gloss: settings.showEnglishGloss,
    active_categories: settings.activeCategories,
  });
}

export async function cloudLoadSessionHistory(userId: string): Promise<SessionSummary[]> {
  const { data, error } = await supabase
    .from('session_summaries')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false })
    .limit(50);

  if (error || !data) return [];

  return data.map(row => ({
    id: row.id,
    modeId: row.mode_id,
    score: row.score,
    accuracy: row.accuracy,
    averageResponseMs: row.average_response_ms,
    totalQuestions: row.total_questions,
    correctAnswers: row.correct_answers,
    bestStreak: row.best_streak,
    weakForms: row.weak_forms ?? [],
    confusionPairsHit: row.confusion_pairs_hit ?? [],
    completedAt: row.completed_at,
    categories: row.categories ?? [],
  }));
}

export async function cloudAppendSessionSummary(userId: string, summary: SessionSummary): Promise<void> {
  await supabase.from('session_summaries').insert({
    user_id: userId,
    mode_id: summary.modeId,
    score: summary.score,
    accuracy: summary.accuracy,
    average_response_ms: summary.averageResponseMs,
    total_questions: summary.totalQuestions,
    correct_answers: summary.correctAnswers,
    best_streak: summary.bestStreak,
    weak_forms: summary.weakForms,
    confusion_pairs_hit: summary.confusionPairsHit,
    completed_at: summary.completedAt,
    categories: summary.categories ?? [],
  });
}

export async function migrateLocalToCloud(
  userId: string,
  masteryRecords: Record<string, MasteryRecord>,
  sessionHistory: SessionSummary[],
  settings: AppSettings
): Promise<void> {
  const records = Object.values(masteryRecords);
  if (records.length > 0) {
    const rows = records.map(r => ({
      user_id: userId,
      form_key: r.formKey,
      attempts: r.attempts,
      correct: r.correct,
      last_seen_at: r.lastSeenAt,
      last_correct_at: r.lastCorrectAt ?? null,
      ease_score: r.easeScore,
      mastery_score: r.masteryScore,
      consecutive_correct: r.consecutiveCorrect,
      consecutive_wrong: r.consecutiveWrong,
      confusion_with: r.confusionWith,
      status: r.status,
    }));

    for (let i = 0; i < rows.length; i += 50) {
      await supabase.from('mastery_records').upsert(rows.slice(i, i + 50), { onConflict: 'user_id,form_key' });
    }
  }

  if (sessionHistory.length > 0) {
    const sessRows = sessionHistory.map(s => ({
      user_id: userId,
      mode_id: s.modeId,
      score: s.score,
      accuracy: s.accuracy,
      average_response_ms: s.averageResponseMs,
      total_questions: s.totalQuestions,
      correct_answers: s.correctAnswers,
      best_streak: s.bestStreak,
      weak_forms: s.weakForms,
      confusion_pairs_hit: s.confusionPairsHit,
      completed_at: s.completedAt,
      categories: s.categories ?? [],
    }));

    for (let i = 0; i < sessRows.length; i += 50) {
      await supabase.from('session_summaries').insert(sessRows.slice(i, i + 50));
    }
  }

  await cloudSaveSettings(userId, settings);
}
