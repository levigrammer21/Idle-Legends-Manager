export type SkillId = 'woodcutting'|'mining'|'fishing'|'gathering'|'hunting'|'processing'|'smithing'|'fletching'|'cooking'|'tailoring'|'crafting'|'melee'|'ranged'|'magic'|'monsterMastery';
export type ItemId = 'copper_ore'|'tin_ore'|'iron_ore'|'oak_log'|'elder_bark'|'river_fish'|'wild_fiber'|'rat_carcass'|'rat_hide'|'small_bone'|'rat_tooth'|'bronze_axe'|'iron_axe'|'training_sword'|'kings_seal';
export type ActivityKind = 'gather'|'combat'|'process'|'craft';
export type CharacterStatus = 'idle'|'traveling'|'working';

export interface LocationNode {
  id: string;
  name: string;
  type: 'capital'|'city'|'outpost'|'wild'|'dungeon'|'boss';
  x: number;
  y: number;
  level: string;
  description: string;
  unlock?: string;
  activities: string[];
}

export interface ActivityDef {
  id: string;
  name: string;
  kind: ActivityKind;
  locationId: string;
  skill: SkillId;
  level: number;
  seconds: number;
  tool?: ItemId;
  input?: Partial<Record<ItemId, number>>;
  output: Partial<Record<ItemId, number>>;
  xp: number;
  description: string;
  repeatable?: boolean;
  enemy?: { hp: number; maxHit: number; accuracy: number; family: string; kills: number };
}

export interface SkillState { level: number; xp: number; treePoints: number; build: string; }
export interface Character {
  id: string;
  name: string;
  portrait: string;
  locationId: string;
  destinationId?: string;
  status: CharacterStatus;
  activityId?: string;
  startedAt?: number;
  endsAt?: number;
  inventory: Partial<Record<ItemId, number>>;
  skills: Record<SkillId, SkillState>;
  hp: number;
  maxHp: number;
}
export interface Expedition {
  id: string;
  userId: string;
  name: string;
  banner: string;
  gold: number;
  hardened: boolean;
  royalCharterEndsAt?: number;
  unlockedLocations: string[];
  bank: Partial<Record<ItemId, number>>;
  characters: Character[];
  log: string[];
}
