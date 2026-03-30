import { create } from 'zustand';
import type { MasteryRecord, AdaptiveReviewQueueItem, SessionSummary, ModeId, DifficultyId, WordCategory } from '../types';
import {
  loadMasteryRecords,
  saveMasteryRecords,
  loadAdaptiveQueue,
  saveAdaptiveQueue,
  loadSettings,
  saveSettings,
  loadSessionHistory,
  appendSessionSummary,
  checkAndMigrateSchema,
  type AppSettings,
} from '../lib/storage';

interface GameStore {
  settings: AppSettings;
  updateSettings: (s: Partial<AppSettings>) => void;

  masteryRecords: Record<string, MasteryRecord>;
  updateMasteryRecord: (record: MasteryRecord) => void;

  adaptiveQueue: AdaptiveReviewQueueItem[];
  setAdaptiveQueue: (queue: AdaptiveReviewQueueItem[]) => void;

  sessionHistory: SessionSummary[];
  addSessionSummary: (summary: SessionSummary) => void;

  currentMode: ModeId | null;
  currentDifficulty: DifficultyId;
  setCurrentMode: (mode: ModeId | null) => void;
  setCurrentDifficulty: (d: DifficultyId) => void;

  toggleCategory: (cat: WordCategory) => void;

  init: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  settings: loadSettings(),
  masteryRecords: loadMasteryRecords(),
  adaptiveQueue: loadAdaptiveQueue(),
  sessionHistory: loadSessionHistory(),
  currentMode: null,
  currentDifficulty: 'standard',

  updateSettings: (partial) => {
    const updated = { ...get().settings, ...partial };
    saveSettings(updated);
    set({ settings: updated });
  },

  updateMasteryRecord: (record) => {
    const updated = { ...get().masteryRecords, [record.formKey]: record };
    saveMasteryRecords(updated);
    set({ masteryRecords: updated });
  },

  setAdaptiveQueue: (queue) => {
    saveAdaptiveQueue(queue);
    set({ adaptiveQueue: queue });
  },

  addSessionSummary: (summary) => {
    appendSessionSummary(summary);
    set({ sessionHistory: [summary, ...get().sessionHistory].slice(0, 50) });
  },

  setCurrentMode: (mode) => set({ currentMode: mode }),
  setCurrentDifficulty: (d) => set({ currentDifficulty: d }),

  toggleCategory: (cat) => {
    const current = get().settings.activeCategories;
    let updated: WordCategory[];
    if (current.includes(cat)) {
      updated = current.filter(c => c !== cat);
      if (updated.length === 0) updated = [cat];
    } else {
      updated = [...current, cat];
    }
    const newSettings = { ...get().settings, activeCategories: updated };
    saveSettings(newSettings);
    set({ settings: newSettings });
  },

  init: () => {
    checkAndMigrateSchema();
    set({
      settings: loadSettings(),
      masteryRecords: loadMasteryRecords(),
      adaptiveQueue: loadAdaptiveQueue(),
      sessionHistory: loadSessionHistory(),
    });
  },
}));
