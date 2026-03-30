import type {
  MasteryRecord,
  AdaptiveReviewQueueItem,
  SessionAnswerEvent,
} from '../types';
import { confusionPairs } from '../data/confusionPairs';
import {
  ADAPTIVE_FAST_THRESHOLD_MS,
  ADAPTIVE_SLOW_THRESHOLD_MS,
  ADAPTIVE_QUEUE_MAX_SIZE,
  ADAPTIVE_PRIORITY_THRESHOLD,
} from '../data/gameConfigs';

// ─── Mastery ─────────────────────────────────────────────────────────────────

export function createMasteryRecord(formKey: string): MasteryRecord {
  return {
    formKey,
    attempts: 0,
    correct: 0,
    lastSeenAt: new Date().toISOString(),
    easeScore: 1.0,
    masteryScore: 0,
    consecutiveCorrect: 0,
    consecutiveWrong: 0,
    confusionWith: [],
    status: 'unseen',
  };
}

export function updateMasteryRecord(
  record: MasteryRecord,
  event: SessionAnswerEvent
): MasteryRecord {
  const updated = { ...record };
  updated.attempts += 1;
  updated.lastSeenAt = new Date().toISOString();

  if (event.wasCorrect) {
    updated.correct += 1;
    updated.consecutiveCorrect += 1;
    updated.consecutiveWrong = 0;
    updated.lastCorrectAt = new Date().toISOString();

    if (event.responseMs <= ADAPTIVE_FAST_THRESHOLD_MS) {
      updated.easeScore += 0.08;
    } else if (event.responseMs <= ADAPTIVE_SLOW_THRESHOLD_MS) {
      updated.easeScore += 0.03;
    }
    // Very slow correct: no change
  } else {
    updated.consecutiveWrong += 1;
    updated.consecutiveCorrect = 0;
    updated.easeScore -= 0.12;

    // Track confusion pairs
    const cp = confusionPairs.find(
      p =>
        (p.formA === event.selectedAnswer || p.formB === event.selectedAnswer) &&
        (p.formA === event.correctAnswer || p.formB === event.correctAnswer)
    );
    if (cp && !updated.confusionWith.includes(event.selectedAnswer)) {
      updated.confusionWith = [...updated.confusionWith, event.selectedAnswer];
    }
  }

  // Clamp easeScore
  updated.easeScore = Math.min(2.5, Math.max(0.5, updated.easeScore));

  // Compute masteryScore
  const accuracy = updated.attempts > 0 ? updated.correct / updated.attempts : 0;
  const easeNormalized = (updated.easeScore - 0.5) / 2.0;
  const streakNormalized = Math.min(updated.consecutiveCorrect, 5) / 5;
  updated.masteryScore = Math.round(
    Math.min(100, Math.max(0,
      accuracy * 70 + easeNormalized * 20 + streakNormalized * 10
    ))
  );

  // Compute status
  if (updated.masteryScore <= 39) {
    updated.status = 'introduced';
  } else if (updated.masteryScore <= 54) {
    updated.status = 'shaky';
  } else if (updated.masteryScore <= 74) {
    updated.status = 'improving';
  } else if (updated.masteryScore <= 89) {
    updated.status = 'strong';
  } else if (updated.masteryScore >= 90 && updated.consecutiveCorrect >= 4) {
    updated.status = 'mastered';
  } else {
    updated.status = 'strong';
  }

  return updated;
}

// ─── Adaptive Queue ───────────────────────────────────────────────────────────

export function enqueueFromEvent(
  queue: AdaptiveReviewQueueItem[],
  event: SessionAnswerEvent,
  masteryRecord: MasteryRecord
): AdaptiveReviewQueueItem[] {
  let newQueue = [...queue];

  if (!event.wasCorrect) {
    newQueue = addOrUpdateQueueItem(newQueue, {
      formKey: masteryRecord.formKey,
      priorityScore: 100,
      scheduledAfterQuestions: 2,
      questionsSinceEnqueue: 0,
      source: 'wrong_answer',
    });

    // Check confusion pair
    const cp = confusionPairs.find(
      p =>
        (p.formA === event.selectedAnswer || p.formB === event.selectedAnswer) &&
        (p.formA === event.correctAnswer || p.formB === event.correctAnswer)
    );
    if (cp) {
      const pairedForm = cp.formA === event.correctAnswer ? cp.formB : cp.formA;
      newQueue = addOrUpdateQueueItem(newQueue, {
        formKey: pairedForm,
        priorityScore: 40,
        scheduledAfterQuestions: 5,
        questionsSinceEnqueue: 0,
        source: 'confusion_pair',
      });
    }
  } else if (event.responseMs > ADAPTIVE_SLOW_THRESHOLD_MS) {
    newQueue = addOrUpdateQueueItem(newQueue, {
      formKey: masteryRecord.formKey,
      priorityScore: 50,
      scheduledAfterQuestions: 4,
      questionsSinceEnqueue: 0,
      source: 'slow_correct',
    });
  } else if (event.responseMs > ADAPTIVE_FAST_THRESHOLD_MS) {
    newQueue = addOrUpdateQueueItem(newQueue, {
      formKey: masteryRecord.formKey,
      priorityScore: 25,
      scheduledAfterQuestions: 6,
      questionsSinceEnqueue: 0,
      source: 'slow_correct',
    });
  }

  // Passive mastery gap
  if (masteryRecord.status === 'shaky' || masteryRecord.status === 'introduced') {
    const bonus = masteryRecord.status === 'shaky' ? 10 : 6;
    newQueue = addOrUpdateQueueItem(newQueue, {
      formKey: masteryRecord.formKey,
      priorityScore: bonus,
      scheduledAfterQuestions: 8,
      questionsSinceEnqueue: 0,
      source: 'mastery_gap',
    });
  }

  // Cap queue
  if (newQueue.length > ADAPTIVE_QUEUE_MAX_SIZE) {
    newQueue.sort((a, b) => b.priorityScore - a.priorityScore);
    newQueue = newQueue.slice(0, ADAPTIVE_QUEUE_MAX_SIZE);
  }

  return newQueue;
}

function addOrUpdateQueueItem(
  queue: AdaptiveReviewQueueItem[],
  item: AdaptiveReviewQueueItem
): AdaptiveReviewQueueItem[] {
  const existing = queue.findIndex(q => q.formKey === item.formKey);
  if (existing >= 0) {
    const merged = { ...queue[existing] };
    merged.priorityScore += item.priorityScore;
    merged.scheduledAfterQuestions = Math.min(
      merged.scheduledAfterQuestions,
      item.scheduledAfterQuestions
    );
    const updated = [...queue];
    updated[existing] = merged;
    return updated;
  }
  return [...queue, item];
}

export function advanceQueue(queue: AdaptiveReviewQueueItem[]): AdaptiveReviewQueueItem[] {
  return queue.map(item => ({
    ...item,
    questionsSinceEnqueue: item.questionsSinceEnqueue + 1,
  }));
}

export function computeEffectivePriority(
  item: AdaptiveReviewQueueItem,
  masteryRecord: MasteryRecord | undefined,
  recentFormKeys: string[],
  confusionCount: number
): number {
  let priority = item.priorityScore;

  // Recency bonus
  const lastErrorIndex = recentFormKeys.lastIndexOf(item.formKey);
  if (lastErrorIndex >= 0 && recentFormKeys.length - lastErrorIndex <= 10) {
    priority += 15;
  }

  // Mastery gap bonus
  if (masteryRecord) {
    const gapBonus =
      masteryRecord.status === 'shaky' ? 25 :
      masteryRecord.status === 'introduced' ? 15 :
      masteryRecord.status === 'improving' ? 8 : 0;
    priority += gapBonus;
  }

  // Confusion bonus
  if (confusionCount >= 2) {
    priority += 20;
  }

  // Repetition penalty
  const last2 = recentFormKeys.slice(-2);
  const last5 = recentFormKeys.slice(-5);
  if (last2.includes(item.formKey)) {
    priority -= 60;
  } else if (last5.includes(item.formKey)) {
    priority -= 25;
  }

  return priority;
}

export function selectNextAdaptiveFormKey(
  queue: AdaptiveReviewQueueItem[],
  masteryRecords: Record<string, MasteryRecord>,
  recentFormKeys: string[],
  confusionCounts: Record<string, number>
): string | null {
  const eligible = queue.filter(
    item => item.questionsSinceEnqueue >= item.scheduledAfterQuestions
  );

  if (eligible.length === 0) return null;

  const scored = eligible.map(item => ({
    item,
    effectivePriority: computeEffectivePriority(
      item,
      masteryRecords[item.formKey],
      recentFormKeys,
      confusionCounts[item.formKey] ?? 0
    ),
  }));

  scored.sort((a, b) => b.effectivePriority - a.effectivePriority);

  if (scored[0].effectivePriority >= ADAPTIVE_PRIORITY_THRESHOLD) {
    return scored[0].item.formKey;
  }

  return null;
}

export function consumeQueueItem(
  queue: AdaptiveReviewQueueItem[],
  formKey: string
): AdaptiveReviewQueueItem[] {
  return queue
    .map(item =>
      item.formKey === formKey
        ? { ...item, priorityScore: item.priorityScore - 50 }
        : item
    )
    .filter(item => item.priorityScore > 0);
}

// ─── Grid Challenge Remediation ───────────────────────────────────────────────

export function enqueueFromGridResults(
  queue: AdaptiveReviewQueueItem[],
  incorrectFormKeys: string[],
  blankFormKeys: string[],
  editedFormKeys: string[]
): AdaptiveReviewQueueItem[] {
  let newQueue = [...queue];

  for (const fk of incorrectFormKeys) {
    newQueue = addOrUpdateQueueItem(newQueue, {
      formKey: fk,
      priorityScore: 80,
      scheduledAfterQuestions: 2,
      questionsSinceEnqueue: 0,
      source: 'wrong_answer',
    });
  }

  for (const fk of blankFormKeys) {
    newQueue = addOrUpdateQueueItem(newQueue, {
      formKey: fk,
      priorityScore: 60,
      scheduledAfterQuestions: 3,
      questionsSinceEnqueue: 0,
      source: 'wrong_answer',
    });
  }

  for (const fk of editedFormKeys) {
    newQueue = addOrUpdateQueueItem(newQueue, {
      formKey: fk,
      priorityScore: 25,
      scheduledAfterQuestions: 5,
      questionsSinceEnqueue: 0,
      source: 'slow_correct',
    });
  }

  return newQueue;
}
