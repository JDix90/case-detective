import type { ConfusionPair } from '../types';

export const confusionPairs: ConfusionPair[] = [
  // Pronoun confusion pairs
  {
    id: 'cp_ee_ey',
    formA: 'её',
    formB: 'ей',
    reason: 'её is Genitive/Accusative of она; ей is Dative of она. Both look similar but serve different grammatical roles.',
    targetCaseIds: ['genitive', 'accusative', 'dative'],
    targetLemmaIds: ['ona'],
  },
  {
    id: 'cp_ee_ney',
    formA: 'её',
    formB: 'ней',
    reason: 'её is used without a preposition; ней is used after prepositions (с ней, о ней).',
    targetCaseIds: ['genitive', 'accusative', 'instrumental', 'prepositional'],
    targetLemmaIds: ['ona'],
  },
  {
    id: 'cp_mne_menya',
    formA: 'мне',
    formB: 'меня',
    reason: 'мне is Dative/Prepositional of я; меня is Genitive/Accusative of я.',
    targetCaseIds: ['dative', 'genitive', 'accusative', 'prepositional'],
    targetLemmaIds: ['ya'],
  },
  {
    id: 'cp_emu_ego',
    formA: 'ему',
    formB: 'его',
    reason: 'ему is Dative of он/оно; его is Genitive/Accusative of он/оно.',
    targetCaseIds: ['dative', 'genitive', 'accusative'],
    targetLemmaIds: ['on', 'ono'],
  },
  {
    id: 'cp_ey_ney',
    formA: 'ей',
    formB: 'ней',
    reason: 'ей is Dative of она (no preposition); ней is used after prepositions (Instrumental/Prepositional).',
    targetCaseIds: ['dative', 'instrumental', 'prepositional'],
    targetLemmaIds: ['ona'],
  },
  {
    id: 'cp_im_ikh',
    formA: 'им',
    formB: 'их',
    reason: 'им is Dative of они; их is Genitive/Accusative of они.',
    targetCaseIds: ['dative', 'genitive', 'accusative'],
    targetLemmaIds: ['oni'],
  },
  {
    id: 'cp_nimi_nikh',
    formA: 'ними',
    formB: 'них',
    reason: 'ними is Instrumental of они (after prepositions); них is Genitive/Accusative/Prepositional of они after prepositions.',
    targetCaseIds: ['instrumental', 'prepositional', 'genitive'],
    targetLemmaIds: ['oni'],
  },
  {
    id: 'cp_nyom_ego',
    formA: 'нём',
    formB: 'его',
    reason: 'нём is Prepositional of он/оно (after о, на); его is Genitive/Accusative without preposition.',
    targetCaseIds: ['prepositional', 'genitive', 'accusative'],
    targetLemmaIds: ['on', 'ono'],
  },

  // Name confusion pairs
  {
    id: 'cp_lene_leny',
    formA: 'Лене',
    formB: 'Лены',
    reason: 'Лене is Dative/Prepositional of Лена; Лены is Genitive. Feminine -а names swap -е (Dat/Prep) vs -ы (Gen).',
    targetCaseIds: ['dative', 'prepositional', 'genitive'],
    targetLemmaIds: ['lena'],
  },
  {
    id: 'cp_marii_mariyu',
    formA: 'Марии',
    formB: 'Марию',
    reason: 'Марии is Genitive/Dative/Prepositional; Марию is Accusative. Soft-stem feminine names like Мария share forms across Gen/Dat/Prep.',
    targetCaseIds: ['genitive', 'dative', 'prepositional', 'accusative'],
    targetLemmaIds: ['mariya'],
  },
  {
    id: 'cp_borisa_borisu',
    formA: 'Бориса',
    formB: 'Борису',
    reason: 'Бориса is Genitive/Accusative; Борису is Dative. The -а vs -у ending distinguishes them.',
    targetCaseIds: ['genitive', 'accusative', 'dative'],
    targetLemmaIds: ['boris'],
  },

  // Noun confusion pairs (common ending confusions)
  {
    id: 'cp_fem_gen_dat',
    formA: 'книги',
    formB: 'книге',
    reason: 'книги is Genitive (-и after г); книге is Dative/Prepositional. Feminine -а nouns: Gen -ы/-и vs Dat/Prep -е.',
    targetCaseIds: ['genitive', 'dative', 'prepositional'],
    targetLemmaIds: ['kniga'],
  },
  {
    id: 'cp_masc_gen_dat',
    formA: 'стола',
    formB: 'столу',
    reason: 'стола is Genitive (-а); столу is Dative (-у). Common masculine hard-stem ending confusion.',
    targetCaseIds: ['genitive', 'dative'],
    targetLemmaIds: ['stol'],
  },
  {
    id: 'cp_soft_fem_forms',
    formA: 'модели',
    formB: 'моделью',
    reason: 'модели is Gen/Dat/Prep of модель; моделью is Instrumental. Soft-stem feminine nouns share three case forms.',
    targetCaseIds: ['genitive', 'dative', 'prepositional', 'instrumental'],
    targetLemmaIds: ['model'],
  },
  {
    id: 'cp_masc_acc_animate',
    formA: 'друга',
    formB: 'друг',
    reason: 'For animate masculine nouns, Accusative = Genitive (друга). For inanimate, Accusative = Nominative (стол). A common source of errors.',
    targetCaseIds: ['accusative', 'nominative', 'genitive'],
    targetLemmaIds: ['drug', 'stol'],
  },
  {
    id: 'cp_neuter_gen_prep',
    formA: 'окна',
    formB: 'окне',
    reason: 'окна is Genitive of окно; окне is Prepositional. Neuter -о nouns: Gen -а vs Prep -е.',
    targetCaseIds: ['genitive', 'prepositional'],
    targetLemmaIds: ['okno'],
  },
];

export function isConfusionPair(formA: string, formB: string): ConfusionPair | undefined {
  return confusionPairs.find(
    cp =>
      (cp.formA === formA && cp.formB === formB) ||
      (cp.formA === formB && cp.formB === formA)
  );
}
