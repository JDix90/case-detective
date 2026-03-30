import type { QuestionTemplate, ModeId, DifficultyId, CaseId, WordCategory, DeclensionForm } from '../types';
import { questionTemplates } from '../data/questionTemplates';
import { getFormsByCategories } from '../data/allForms';
import { sentenceFrames } from '../data/sentenceFrames';

export interface GeneratedQuestion {
  template: QuestionTemplate;
  choices: string[];
  correctIndex: number;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateDistractors(
  correctForm: DeclensionForm,
  pool: DeclensionForm[],
  count: number
): string[] {
  const distractors = new Set<string>();

  // Strategy 1: same lemma, other cases
  const sameLemmaOtherCase = pool.filter(
    f => f.lemmaId === correctForm.lemmaId &&
         f.caseId !== correctForm.caseId &&
         f.surfaceForm !== correctForm.surfaceForm
  );
  for (const f of shuffle(sameLemmaOtherCase)) {
    if (distractors.size >= count) break;
    distractors.add(f.surfaceForm);
  }

  // Strategy 2: same case, other lemmas in same category
  if (distractors.size < count) {
    const sameCaseOtherLemma = pool.filter(
      f => f.caseId === correctForm.caseId &&
           f.lemmaId !== correctForm.lemmaId &&
           f.surfaceForm !== correctForm.surfaceForm &&
           f.category === correctForm.category
    );
    for (const f of shuffle(sameCaseOtherLemma)) {
      if (distractors.size >= count) break;
      distractors.add(f.surfaceForm);
    }
  }

  // Strategy 3: same case, any category
  if (distractors.size < count) {
    const sameCaseAny = pool.filter(
      f => f.caseId === correctForm.caseId &&
           f.lemmaId !== correctForm.lemmaId &&
           f.surfaceForm !== correctForm.surfaceForm
    );
    for (const f of shuffle(sameCaseAny)) {
      if (distractors.size >= count) break;
      distractors.add(f.surfaceForm);
    }
  }

  return [...distractors].slice(0, count);
}

function generateDynamicQuestion(
  categories: WordCategory[],
  difficulty: DifficultyId,
  filterCaseIds?: CaseId[],
  excludeFormKeys?: string[],
  targetFormKey?: string
): GeneratedQuestion | null {
  const categoryForms = getFormsByCategories(categories);
  if (categoryForms.length === 0) return null;

  let targetForm: DeclensionForm | undefined;

  if (targetFormKey) {
    const [lemmaId, caseId] = targetFormKey.split(':');
    targetForm = categoryForms.find(f => f.lemmaId === lemmaId && f.caseId === caseId);
  }

  if (!targetForm) {
    let pool = categoryForms.filter(f => f.caseId !== 'nominative');
    if (filterCaseIds && filterCaseIds.length > 0) {
      pool = pool.filter(f => filterCaseIds.includes(f.caseId));
    }
    if (excludeFormKeys && excludeFormKeys.length > 0) {
      const filtered = pool.filter(f => !excludeFormKeys.includes(`${f.lemmaId}:${f.caseId}`));
      if (filtered.length > 0) pool = filtered;
    }
    if (pool.length === 0) return null;
    targetForm = pool[Math.floor(Math.random() * pool.length)];
  }

  const frames = sentenceFrames.filter(sf => {
    if (sf.caseId !== targetForm!.caseId) return false;
    if (difficulty === 'beginner' && sf.difficulty === 'advanced') return false;
    if (sf.animacy === 'any') return true;
    if (!targetForm!.animacy) return true;
    return sf.animacy === targetForm!.animacy;
  });

  if (frames.length === 0) return null;
  const frame = frames[Math.floor(Math.random() * frames.length)];

  const distractors = generateDistractors(targetForm, categoryForms, 3);
  if (distractors.length < 2) return null;

  while (distractors.length < 3) {
    const filler = categoryForms.filter(
      f => f.surfaceForm !== targetForm!.surfaceForm && !distractors.includes(f.surfaceForm)
    );
    if (filler.length === 0) break;
    distractors.push(filler[Math.floor(Math.random() * filler.length)].surfaceForm);
  }

  const template: QuestionTemplate = {
    id: `dyn_${targetForm.lemmaId}_${targetForm.caseId}_${frame.id}`,
    type: 'multiple_choice',
    modeIds: ['practice', 'speed_round', 'boss_battle'],
    prompt: frame.frame,
    sentenceFrame: frame.frame,
    targetCaseId: targetForm.caseId,
    targetLemmaId: targetForm.lemmaId,
    targetCategory: targetForm.category,
    targetMeaning: targetForm.englishGloss,
    helperWord: frame.helperWord,
    questionPrompt: frame.questionPrompt,
    correctAnswer: targetForm.surfaceForm,
    acceptedAnswers: targetForm.acceptedVariants,
    distractors,
    explanation: `${frame.explanation} ${targetForm.lemmaDisplay} → ${targetForm.surfaceForm} (${targetForm.caseId}).`,
    difficulty,
    tags: [targetForm.category, targetForm.caseId, targetForm.lemmaId],
  };

  const allChoices = shuffle([template.correctAnswer, ...distractors.slice(0, 3)]);
  const correctIndex = allChoices.indexOf(template.correctAnswer);

  return { template, choices: allChoices, correctIndex };
}

export function generateQuestion(
  modeId: ModeId,
  difficulty: DifficultyId,
  filterCaseIds?: CaseId[],
  excludeIds: string[] = [],
  targetFormKey?: string,
  categories?: WordCategory[]
): GeneratedQuestion | null {
  // Try hand-authored templates first
  let pool = questionTemplates.filter(q =>
    q.modeIds.includes(modeId) &&
    !excludeIds.includes(q.id)
  );

  if (categories && categories.length > 0) {
    const catTags = categories as string[];
    pool = pool.filter(q =>
      q.tags.some(t => catTags.includes(t)) || !q.targetCategory || categories.includes(q.targetCategory)
    );
  }

  if (difficulty === 'beginner') {
    pool = pool.filter(q => q.difficulty === 'beginner');
  } else if (difficulty === 'standard') {
    pool = pool.filter(q => q.difficulty !== 'advanced');
  }

  if (filterCaseIds && filterCaseIds.length > 0) {
    pool = pool.filter(q => filterCaseIds.includes(q.targetCaseId));
  }

  if (targetFormKey) {
    const [lemmaId, caseId] = targetFormKey.split(':');
    const targeted = pool.filter(
      q => q.targetLemmaId === lemmaId && q.targetCaseId === caseId
    );
    if (targeted.length > 0) {
      pool = targeted;
    }
  }

  // If we have hand-authored templates, use them ~60% of the time; otherwise always use dynamic
  const useDynamic = pool.length === 0 || (categories && Math.random() > 0.6);

  if (!useDynamic && pool.length > 0) {
    const template = pool[Math.floor(Math.random() * pool.length)];
    const wrongChoices = shuffle(template.distractors).slice(0, 3);
    const allChoices = shuffle([template.correctAnswer, ...wrongChoices]);
    const correctIndex = allChoices.indexOf(template.correctAnswer);
    return { template, choices: allChoices, correctIndex };
  }

  const cats = categories && categories.length > 0 ? categories : ['pronoun', 'name', 'noun'] as WordCategory[];
  const excludeFormKeys = excludeIds
    .filter(id => id.startsWith('dyn_'))
    .map(id => {
      const parts = id.replace('dyn_', '').split('_');
      return parts.length >= 2 ? `${parts[0]}:${parts[1]}` : '';
    })
    .filter(Boolean);

  return generateDynamicQuestion(cats, difficulty, filterCaseIds, excludeFormKeys, targetFormKey);
}

export function generateQuestionSet(
  modeId: ModeId,
  difficulty: DifficultyId,
  count: number,
  filterCaseIds?: CaseId[],
  categories?: WordCategory[]
): GeneratedQuestion[] {
  const results: GeneratedQuestion[] = [];
  const usedIds: string[] = [];

  for (let i = 0; i < count; i++) {
    const q = generateQuestion(modeId, difficulty, filterCaseIds, usedIds, undefined, categories);
    if (!q) break;
    results.push(q);
    usedIds.push(q.template.id);
  }

  return results;
}
