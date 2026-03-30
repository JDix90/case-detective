import type { DeclensionForm } from '../types';

export const pronounForms: DeclensionForm[] = [
  // Я (I)
  { lemmaId: 'ya', lemmaDisplay: 'я', englishGloss: 'I', category: 'pronoun', caseId: 'nominative', surfaceForm: 'я', helperWord: 'это', questionPrompt: 'кто? что?', exampleSentence: 'Это я.', afterPreposition: false, acceptedVariants: ['я'] },
  { lemmaId: 'ya', lemmaDisplay: 'я', englishGloss: 'I', category: 'pronoun', caseId: 'genitive', surfaceForm: 'меня', helperWord: 'нет', questionPrompt: 'кого? чего?', exampleSentence: 'У меня нет книги.', afterPreposition: false, acceptedVariants: ['меня'] },
  { lemmaId: 'ya', lemmaDisplay: 'я', englishGloss: 'I', category: 'pronoun', caseId: 'dative', surfaceForm: 'мне', helperWord: 'дай', questionPrompt: 'кому? чему?', exampleSentence: 'Дай мне книгу.', afterPreposition: false, acceptedVariants: ['мне'] },
  { lemmaId: 'ya', lemmaDisplay: 'я', englishGloss: 'I', category: 'pronoun', caseId: 'accusative', surfaceForm: 'меня', helperWord: 'люблю', questionPrompt: 'кого? что?', exampleSentence: 'Он любит меня.', afterPreposition: false, acceptedVariants: ['меня'] },
  { lemmaId: 'ya', lemmaDisplay: 'я', englishGloss: 'I', category: 'pronoun', caseId: 'instrumental', surfaceForm: 'мной', helperWord: 'с', questionPrompt: 'кем? чем?', exampleSentence: 'Он идёт со мной.', afterPreposition: false, acceptedVariants: ['мной', 'мною'] },
  { lemmaId: 'ya', lemmaDisplay: 'я', englishGloss: 'I', category: 'pronoun', caseId: 'prepositional', surfaceForm: 'мне', helperWord: 'о', questionPrompt: 'о ком? о чём?', exampleSentence: 'Он думает обо мне.', afterPreposition: true, acceptedVariants: ['мне'] },

  // ТЫ (you singular)
  { lemmaId: 'ty', lemmaDisplay: 'ты', englishGloss: 'you (sg)', category: 'pronoun', caseId: 'nominative', surfaceForm: 'ты', helperWord: 'это', questionPrompt: 'кто? что?', exampleSentence: 'Это ты.', afterPreposition: false, acceptedVariants: ['ты'] },
  { lemmaId: 'ty', lemmaDisplay: 'ты', englishGloss: 'you (sg)', category: 'pronoun', caseId: 'genitive', surfaceForm: 'тебя', helperWord: 'нет', questionPrompt: 'кого? чего?', exampleSentence: 'У меня нет тебя.', afterPreposition: false, acceptedVariants: ['тебя'] },
  { lemmaId: 'ty', lemmaDisplay: 'ты', englishGloss: 'you (sg)', category: 'pronoun', caseId: 'dative', surfaceForm: 'тебе', helperWord: 'дай', questionPrompt: 'кому? чему?', exampleSentence: 'Я дам тебе книгу.', afterPreposition: false, acceptedVariants: ['тебе'] },
  { lemmaId: 'ty', lemmaDisplay: 'ты', englishGloss: 'you (sg)', category: 'pronoun', caseId: 'accusative', surfaceForm: 'тебя', helperWord: 'люблю', questionPrompt: 'кого? что?', exampleSentence: 'Я люблю тебя.', afterPreposition: false, acceptedVariants: ['тебя'] },
  { lemmaId: 'ty', lemmaDisplay: 'ты', englishGloss: 'you (sg)', category: 'pronoun', caseId: 'instrumental', surfaceForm: 'тобой', helperWord: 'с', questionPrompt: 'кем? чем?', exampleSentence: 'Я иду с тобой.', afterPreposition: false, acceptedVariants: ['тобой', 'тобою'] },
  { lemmaId: 'ty', lemmaDisplay: 'ты', englishGloss: 'you (sg)', category: 'pronoun', caseId: 'prepositional', surfaceForm: 'тебе', helperWord: 'о', questionPrompt: 'о ком? о чём?', exampleSentence: 'Я думаю о тебе.', afterPreposition: true, acceptedVariants: ['тебе'] },

  // ОН (he)
  { lemmaId: 'on', lemmaDisplay: 'он', englishGloss: 'he', category: 'pronoun', gender: 'masculine', caseId: 'nominative', surfaceForm: 'он', helperWord: 'это', questionPrompt: 'кто? что?', exampleSentence: 'Это он.', afterPreposition: false, acceptedVariants: ['он'] },
  { lemmaId: 'on', lemmaDisplay: 'он', englishGloss: 'he', category: 'pronoun', gender: 'masculine', caseId: 'genitive', surfaceForm: 'его', helperWord: 'нет', questionPrompt: 'кого? чего?', exampleSentence: 'У меня нет его.', afterPreposition: false, acceptedVariants: ['его'] },
  { lemmaId: 'on', lemmaDisplay: 'он', englishGloss: 'he', category: 'pronoun', gender: 'masculine', caseId: 'dative', surfaceForm: 'ему', helperWord: 'дай', questionPrompt: 'кому? чему?', exampleSentence: 'Дай ему книгу.', afterPreposition: false, acceptedVariants: ['ему'] },
  { lemmaId: 'on', lemmaDisplay: 'он', englishGloss: 'he', category: 'pronoun', gender: 'masculine', caseId: 'accusative', surfaceForm: 'его', helperWord: 'люблю', questionPrompt: 'кого? что?', exampleSentence: 'Я вижу его.', afterPreposition: false, acceptedVariants: ['его'] },
  { lemmaId: 'on', lemmaDisplay: 'он', englishGloss: 'he', category: 'pronoun', gender: 'masculine', caseId: 'instrumental', surfaceForm: 'ним', helperWord: 'с', questionPrompt: 'кем? чем?', exampleSentence: 'Я иду с ним.', afterPreposition: true, acceptedVariants: ['ним'] },
  { lemmaId: 'on', lemmaDisplay: 'он', englishGloss: 'he', category: 'pronoun', gender: 'masculine', caseId: 'prepositional', surfaceForm: 'нём', helperWord: 'о', questionPrompt: 'о ком? о чём?', exampleSentence: 'Я думаю о нём.', afterPreposition: true, acceptedVariants: ['нём'] },

  // ОНА (she)
  { lemmaId: 'ona', lemmaDisplay: 'она', englishGloss: 'she', category: 'pronoun', gender: 'feminine', caseId: 'nominative', surfaceForm: 'она', helperWord: 'это', questionPrompt: 'кто? что?', exampleSentence: 'Это она.', afterPreposition: false, acceptedVariants: ['она'] },
  { lemmaId: 'ona', lemmaDisplay: 'она', englishGloss: 'she', category: 'pronoun', gender: 'feminine', caseId: 'genitive', surfaceForm: 'её', helperWord: 'нет', questionPrompt: 'кого? чего?', exampleSentence: 'У меня нет её.', afterPreposition: false, acceptedVariants: ['её', 'ее'] },
  { lemmaId: 'ona', lemmaDisplay: 'она', englishGloss: 'she', category: 'pronoun', gender: 'feminine', caseId: 'dative', surfaceForm: 'ей', helperWord: 'дай', questionPrompt: 'кому? чему?', exampleSentence: 'Я дал ей книгу.', afterPreposition: false, acceptedVariants: ['ей'] },
  { lemmaId: 'ona', lemmaDisplay: 'она', englishGloss: 'she', category: 'pronoun', gender: 'feminine', caseId: 'accusative', surfaceForm: 'её', helperWord: 'люблю', questionPrompt: 'кого? что?', exampleSentence: 'Я вижу её.', afterPreposition: false, acceptedVariants: ['её', 'ее'] },
  { lemmaId: 'ona', lemmaDisplay: 'она', englishGloss: 'she', category: 'pronoun', gender: 'feminine', caseId: 'instrumental', surfaceForm: 'ней', helperWord: 'с', questionPrompt: 'кем? чем?', exampleSentence: 'Я иду с ней.', afterPreposition: true, acceptedVariants: ['ней'] },
  { lemmaId: 'ona', lemmaDisplay: 'она', englishGloss: 'she', category: 'pronoun', gender: 'feminine', caseId: 'prepositional', surfaceForm: 'ней', helperWord: 'о', questionPrompt: 'о ком? о чём?', exampleSentence: 'Я думаю о ней.', afterPreposition: true, acceptedVariants: ['ней'] },

  // ОНО (it)
  { lemmaId: 'ono', lemmaDisplay: 'оно', englishGloss: 'it', category: 'pronoun', gender: 'neuter', caseId: 'nominative', surfaceForm: 'оно', helperWord: 'это', questionPrompt: 'кто? что?', exampleSentence: 'Это оно.', afterPreposition: false, acceptedVariants: ['оно'] },
  { lemmaId: 'ono', lemmaDisplay: 'оно', englishGloss: 'it', category: 'pronoun', gender: 'neuter', caseId: 'genitive', surfaceForm: 'его', helperWord: 'нет', questionPrompt: 'кого? чего?', exampleSentence: 'У меня нет его.', afterPreposition: false, acceptedVariants: ['его'] },
  { lemmaId: 'ono', lemmaDisplay: 'оно', englishGloss: 'it', category: 'pronoun', gender: 'neuter', caseId: 'dative', surfaceForm: 'ему', helperWord: 'дай', questionPrompt: 'кому? чему?', exampleSentence: 'Дай ему.', afterPreposition: false, acceptedVariants: ['ему'] },
  { lemmaId: 'ono', lemmaDisplay: 'оно', englishGloss: 'it', category: 'pronoun', gender: 'neuter', caseId: 'accusative', surfaceForm: 'его', helperWord: 'люблю', questionPrompt: 'кого? что?', exampleSentence: 'Я вижу его.', afterPreposition: false, acceptedVariants: ['его'] },
  { lemmaId: 'ono', lemmaDisplay: 'оно', englishGloss: 'it', category: 'pronoun', gender: 'neuter', caseId: 'instrumental', surfaceForm: 'ним', helperWord: 'с', questionPrompt: 'кем? чем?', exampleSentence: 'Я иду с ним.', afterPreposition: true, acceptedVariants: ['ним'] },
  { lemmaId: 'ono', lemmaDisplay: 'оно', englishGloss: 'it', category: 'pronoun', gender: 'neuter', caseId: 'prepositional', surfaceForm: 'нём', helperWord: 'о', questionPrompt: 'о ком? о чём?', exampleSentence: 'Я думаю о нём.', afterPreposition: true, acceptedVariants: ['нём'] },

  // МЫ (we)
  { lemmaId: 'my', lemmaDisplay: 'мы', englishGloss: 'we', category: 'pronoun', caseId: 'nominative', surfaceForm: 'мы', helperWord: 'это', questionPrompt: 'кто? что?', exampleSentence: 'Это мы.', afterPreposition: false, acceptedVariants: ['мы'] },
  { lemmaId: 'my', lemmaDisplay: 'мы', englishGloss: 'we', category: 'pronoun', caseId: 'genitive', surfaceForm: 'нас', helperWord: 'нет', questionPrompt: 'кого? чего?', exampleSentence: 'У меня нет нас.', afterPreposition: false, acceptedVariants: ['нас'] },
  { lemmaId: 'my', lemmaDisplay: 'мы', englishGloss: 'we', category: 'pronoun', caseId: 'dative', surfaceForm: 'нам', helperWord: 'дай', questionPrompt: 'кому? чему?', exampleSentence: 'Дай нам книгу.', afterPreposition: false, acceptedVariants: ['нам'] },
  { lemmaId: 'my', lemmaDisplay: 'мы', englishGloss: 'we', category: 'pronoun', caseId: 'accusative', surfaceForm: 'нас', helperWord: 'люблю', questionPrompt: 'кого? что?', exampleSentence: 'Он любит нас.', afterPreposition: false, acceptedVariants: ['нас'] },
  { lemmaId: 'my', lemmaDisplay: 'мы', englishGloss: 'we', category: 'pronoun', caseId: 'instrumental', surfaceForm: 'нами', helperWord: 'с', questionPrompt: 'кем? чем?', exampleSentence: 'Он идёт с нами.', afterPreposition: false, acceptedVariants: ['нами'] },
  { lemmaId: 'my', lemmaDisplay: 'мы', englishGloss: 'we', category: 'pronoun', caseId: 'prepositional', surfaceForm: 'нас', helperWord: 'о', questionPrompt: 'о ком? о чём?', exampleSentence: 'Он думает о нас.', afterPreposition: true, acceptedVariants: ['нас'] },

  // ВЫ (you plural / formal)
  { lemmaId: 'vy', lemmaDisplay: 'вы', englishGloss: 'you (pl)', category: 'pronoun', caseId: 'nominative', surfaceForm: 'вы', helperWord: 'это', questionPrompt: 'кто? что?', exampleSentence: 'Это вы.', afterPreposition: false, acceptedVariants: ['вы'] },
  { lemmaId: 'vy', lemmaDisplay: 'вы', englishGloss: 'you (pl)', category: 'pronoun', caseId: 'genitive', surfaceForm: 'вас', helperWord: 'нет', questionPrompt: 'кого? чего?', exampleSentence: 'У меня нет вас.', afterPreposition: false, acceptedVariants: ['вас'] },
  { lemmaId: 'vy', lemmaDisplay: 'вы', englishGloss: 'you (pl)', category: 'pronoun', caseId: 'dative', surfaceForm: 'вам', helperWord: 'дай', questionPrompt: 'кому? чему?', exampleSentence: 'Дай вам книгу.', afterPreposition: false, acceptedVariants: ['вам'] },
  { lemmaId: 'vy', lemmaDisplay: 'вы', englishGloss: 'you (pl)', category: 'pronoun', caseId: 'accusative', surfaceForm: 'вас', helperWord: 'люблю', questionPrompt: 'кого? что?', exampleSentence: 'Я вижу вас.', afterPreposition: false, acceptedVariants: ['вас'] },
  { lemmaId: 'vy', lemmaDisplay: 'вы', englishGloss: 'you (pl)', category: 'pronoun', caseId: 'instrumental', surfaceForm: 'вами', helperWord: 'с', questionPrompt: 'кем? чем?', exampleSentence: 'Я иду с вами.', afterPreposition: false, acceptedVariants: ['вами'] },
  { lemmaId: 'vy', lemmaDisplay: 'вы', englishGloss: 'you (pl)', category: 'pronoun', caseId: 'prepositional', surfaceForm: 'вас', helperWord: 'о', questionPrompt: 'о ком? о чём?', exampleSentence: 'Я думаю о вас.', afterPreposition: true, acceptedVariants: ['вас'] },

  // ОНИ (they)
  { lemmaId: 'oni', lemmaDisplay: 'они', englishGloss: 'they', category: 'pronoun', caseId: 'nominative', surfaceForm: 'они', helperWord: 'это', questionPrompt: 'кто? что?', exampleSentence: 'Это они.', afterPreposition: false, acceptedVariants: ['они'] },
  { lemmaId: 'oni', lemmaDisplay: 'они', englishGloss: 'they', category: 'pronoun', caseId: 'genitive', surfaceForm: 'их', helperWord: 'нет', questionPrompt: 'кого? чего?', exampleSentence: 'У меня нет их.', afterPreposition: false, acceptedVariants: ['их'] },
  { lemmaId: 'oni', lemmaDisplay: 'они', englishGloss: 'they', category: 'pronoun', caseId: 'dative', surfaceForm: 'им', helperWord: 'дай', questionPrompt: 'кому? чему?', exampleSentence: 'Дай им книгу.', afterPreposition: false, acceptedVariants: ['им'] },
  { lemmaId: 'oni', lemmaDisplay: 'они', englishGloss: 'they', category: 'pronoun', caseId: 'accusative', surfaceForm: 'их', helperWord: 'люблю', questionPrompt: 'кого? что?', exampleSentence: 'Я вижу их.', afterPreposition: false, acceptedVariants: ['их'] },
  { lemmaId: 'oni', lemmaDisplay: 'они', englishGloss: 'they', category: 'pronoun', caseId: 'instrumental', surfaceForm: 'ними', helperWord: 'с', questionPrompt: 'кем? чем?', exampleSentence: 'Я иду с ними.', afterPreposition: true, acceptedVariants: ['ними'] },
  { lemmaId: 'oni', lemmaDisplay: 'они', englishGloss: 'they', category: 'pronoun', caseId: 'prepositional', surfaceForm: 'них', helperWord: 'о', questionPrompt: 'о ком? о чём?', exampleSentence: 'Я думаю о них.', afterPreposition: true, acceptedVariants: ['них'] },
];

export function getForm(lemmaId: string, caseId: string): DeclensionForm | undefined {
  return pronounForms.find(f => f.lemmaId === lemmaId && f.caseId === caseId);
}

export function getFormsForLemma(lemmaId: string): DeclensionForm[] {
  return pronounForms.filter(f => f.lemmaId === lemmaId);
}

export function getFormsForCase(caseId: string): DeclensionForm[] {
  return pronounForms.filter(f => f.caseId === caseId);
}
