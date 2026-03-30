import type { BossBattleConfig, CaseId } from '../types';
import { defaultBossBattleConfig } from '../data/gameConfigs';

export interface BossState {
  hp: number;
  maxHp: number;
  shieldHp: number;
  round: number;
  teamStreak: number;
  teamScores: Record<string, number>;
  isDefeated: boolean;
  isLost: boolean;
  suddenDeathActive: boolean;
}

export function createBossState(config: BossBattleConfig = defaultBossBattleConfig): BossState {
  return {
    hp: config.startingHp,
    maxHp: config.startingHp,
    shieldHp: 0,
    round: 0,
    teamStreak: 0,
    teamScores: {},
    isDefeated: false,
    isLost: false,
    suddenDeathActive: false,
  };
}

export function computeDamage(
  config: BossBattleConfig,
  streak: number,
  responseMs: number,
  difficulty: 'beginner' | 'standard' | 'advanced',
  isWeaknessHit: boolean,
  isContrastQuestion: boolean
): number {
  const streakBonus = Math.floor(streak / 3) * config.damageStreakBonusPerStep;
  const speedBonus = responseMs <= 3000 ? config.damageFastBonus : 0;
  const difficultyBonus = difficulty === 'beginner' ? 0 : difficulty === 'standard' ? 2 : 4;
  const weaknessBonus = isWeaknessHit ? 3 : 0;
  const contrastBonus = isContrastQuestion ? 2 : 0;

  const total = config.damageBase + streakBonus + speedBonus + difficultyBonus + weaknessBonus + contrastBonus;
  return Math.max(config.damageBase, Math.round(total));
}

export function computeHeal(
  config: BossBattleConfig,
  isConfusionPairMistake: boolean,
  responseMs: number
): number {
  let penaltyBonus = 0;
  if (isConfusionPairMistake) penaltyBonus += 2;
  if (responseMs <= 2000) penaltyBonus += 2;
  return Math.min(config.healOnWrong + penaltyBonus, 10);
}

export function computeShieldHp(config: BossBattleConfig, roundNumber: number): number {
  return config.shieldBase + roundNumber;
}

export function applyDamage(state: BossState, damage: number): BossState {
  const updated = { ...state };

  if (updated.shieldHp > 0) {
    const overflow = damage - updated.shieldHp;
    updated.shieldHp = Math.max(0, updated.shieldHp - damage);
    if (overflow > 0) {
      updated.hp = Math.max(0, updated.hp - overflow);
    }
  } else {
    updated.hp = Math.max(0, updated.hp - damage);
  }

  if (updated.hp <= 0) {
    updated.isDefeated = true;
  }

  return updated;
}

export function applyHeal(state: BossState, heal: number): BossState {
  return {
    ...state,
    hp: Math.min(state.maxHp, state.hp + heal),
    teamStreak: 0,
  };
}

export function advanceRound(
  state: BossState,
  config: BossBattleConfig = defaultBossBattleConfig
): BossState {
  const updated = { ...state, round: state.round + 1 };

  // Apply shield every N rounds
  if (updated.round % config.shieldEveryRounds === 0) {
    updated.shieldHp = computeShieldHp(config, updated.round);
  }

  // Check loss condition
  const maxRounds = 15;
  if (updated.round > maxRounds) {
    if (!updated.suddenDeathActive && state.hp <= 15) {
      updated.suddenDeathActive = true;
    } else {
      updated.isLost = true;
    }
  }

  return updated;
}

export function addTeamScore(
  state: BossState,
  teamId: string,
  points: number
): BossState {
  return {
    ...state,
    teamScores: {
      ...state.teamScores,
      [teamId]: (state.teamScores[teamId] ?? 0) + points,
    },
  };
}

export function incrementStreak(state: BossState): BossState {
  return { ...state, teamStreak: state.teamStreak + 1 };
}

export function getMvpTeam(state: BossState): string | null {
  const entries = Object.entries(state.teamScores);
  if (entries.length === 0) return null;
  return entries.reduce((a, b) => (a[1] >= b[1] ? a : b))[0];
}

export function isWeaknessHit(
  questionCaseId: CaseId,
  weaknessCaseId: CaseId | undefined
): boolean {
  return !!weaknessCaseId && questionCaseId === weaknessCaseId;
}
