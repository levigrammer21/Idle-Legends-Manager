import type { ActivityDef, ItemId, LocationNode, SkillId } from './types';

export const SKILLS: { id: SkillId; name: string; group: string; purpose: string }[] = [
  { id: 'woodcutting', name: 'Woodcutting', group: 'Gathering', purpose: 'Logs for tools, fletching, handles, construction, and higher-tier recipes.' },
  { id: 'mining', name: 'Mining', group: 'Gathering', purpose: 'Ore and stone for metal, gear, upgrades, and guild projects.' },
  { id: 'fishing', name: 'Fishing', group: 'Gathering', purpose: 'Fish for cooking and combat sustain.' },
  { id: 'gathering', name: 'Gathering', group: 'Gathering', purpose: 'Fibers, herbs, flax, cotton, mushrooms, and other natural inputs.' },
  { id: 'hunting', name: 'Hunting', group: 'Gathering', purpose: 'Tracks creatures, traps beasts, and supports rare beast materials.' },
  { id: 'processing', name: 'Processing', group: 'Refining', purpose: 'Turns carcasses, hides, bones, fibers, and raw drops into usable materials.' },
  { id: 'smithing', name: 'Smithing', group: 'Production', purpose: 'Metal tools, weapons, armor, and equipment upgrades.' },
  { id: 'fletching', name: 'Fletching', group: 'Production', purpose: 'Bows, arrows, shafts, handles, and ranged supplies.' },
  { id: 'cooking', name: 'Cooking', group: 'Production', purpose: 'Turns food into healing and travel supplies.' },
  { id: 'tailoring', name: 'Tailoring', group: 'Production', purpose: 'Cloth armor, robes, bags, banners, and cosmetic bases.' },
  { id: 'crafting', name: 'Crafting', group: 'Production', purpose: 'General assembly, tools, trinkets, and cross-skill components.' },
  { id: 'melee', name: 'Melee', group: 'Combat', purpose: 'Close combat. Skill trees support crit builds, speed builds, and on-hit builds.' },
  { id: 'ranged', name: 'Ranged', group: 'Combat', purpose: 'Bows and ranged weapons. Accuracy, speed, piercing, and ammo efficiency.' },
  { id: 'magic', name: 'Magic', group: 'Combat', purpose: 'Spells, magical combat, enchanting, and alchemical-style transformations.' },
  { id: 'monsterMastery', name: 'Monster Mastery', group: 'Combat', purpose: 'Knowledge of monster families, boss unlocks, better tactics, and rare material efficiency.' }
];

export const ITEMS: Record<ItemId, { name: string; type: string; text: string; value: number }> = {
  copper_ore: { name: 'Copper Ore', type: 'Ore', text: 'Base metal used in early bars and bronze tools.', value: 4 },
  tin_ore: { name: 'Tin Ore', type: 'Ore', text: 'Combined with copper for bronze.', value: 4 },
  iron_ore: { name: 'Iron Ore', type: 'Ore', text: 'Core metal for early serious tools and weapons.', value: 14 },
  oak_log: { name: 'Oak Log', type: 'Wood', text: 'Common but permanently useful for handles, shafts, fires, and upgrades.', value: 3 },
  elder_bark: { name: 'Elder Bark', type: 'Rare Wood', text: 'Rare wood component from the locked Elder Woods.', value: 240 },
  river_fish: { name: 'River Fish', type: 'Food', text: 'Cookable fish used as early combat healing.', value: 5 },
  wild_fiber: { name: 'Wild Fiber', type: 'Fiber', text: 'Gathered from plants. Used in tailoring, crafting, and bowstrings.', value: 3 },
  rat_carcass: { name: 'Rat Carcass', type: 'Raw Creature', text: 'Can be discarded or processed into materials.', value: 1 },
  rat_hide: { name: 'Rat Hide', type: 'Hide', text: 'Processed creature material used for tiny leather scraps.', value: 2 },
  small_bone: { name: 'Small Bone', type: 'Bone', text: 'Processing output for crafting, magic, and guild projects.', value: 2 },
  rat_tooth: { name: 'Rat Tooth', type: 'Rare Component', text: 'Tiny rare component used in early trinkets and trophies.', value: 18 },
  bronze_axe: { name: 'Bronze Axe', type: 'Tool', text: 'Basic woodcutting axe. Later consumed when upgrading into better axes.', value: 25 },
  iron_axe: { name: 'Iron Axe', type: 'Tool', text: 'Improved axe requiring iron materials and an older axe frame.', value: 90 },
  training_sword: { name: 'Training Sword', type: 'Weapon', text: 'Starter melee weapon issued to new expeditions.', value: 1 },
  kings_seal: { name: "King's Seal", type: 'Royal Item', text: 'Tradable. Activate to add 30 Royal Charter days, capped at 300. Preserves Hardened status.', value: 50000 }
};

export const LOCATIONS: LocationNode[] = [
  { id: 'kingswatch', name: 'Kingswatch', type: 'capital', x: 50, y: 50, level: '1+', description: 'The central capital. Every road begins or returns here. Market, bank, guilds, and early training.', activities: ['oak_trees','city_rats','wild_fibers','cook_fish','craft_bronze_axe'] },
  { id: 'irondeep', name: 'Irondeep', type: 'city', x: 50, y: 17, level: '10+', description: 'Northern mountain city. Mining, smithing, tool upgrades, and metal economy.', activities: ['copper_vein','tin_vein','iron_vein','craft_iron_axe'] },
  { id: 'greenhaven', name: 'Greenhaven', type: 'city', x: 82, y: 50, level: '10+', description: 'Eastern living woods. Gathering, hunting, fibers, tailoring, and nature questlines.', activities: ['oak_trees','wild_fibers','snare_rabbits'] },
  { id: 'saltshore', name: 'Saltshore', type: 'city', x: 50, y: 83, level: '10+', description: 'Southern port. Fishing, cooking, ships, coastal monsters, and future island expansions.', activities: ['river_fishing','cook_fish'] },
  { id: 'emberfall', name: 'Emberfall', type: 'city', x: 18, y: 50, level: '10+', description: 'Western scarred city. Combat, Monster Mastery, boss quests, and dangerous roads.', activities: ['city_rats','bandit_scouts'] },
  { id: 'elderwoods', name: 'Elder Woods', type: 'wild', x: 86, y: 23, level: '65 Woodcutting', unlock: 'Complete The Sleeping Canopy quest from Greenhaven.', description: 'A locked ancient forest with rare trees and the Griffin Nest boss route.', activities: ['elder_bark'] },
  { id: 'griffin_nest', name: 'Griffin Nest', type: 'boss', x: 93, y: 15, level: 'Quest Boss', unlock: 'Complete The Sleeping Canopy and earn Griffin access.', description: 'High cliffs above Elder Woods. Griffin feathers, beaks, and extremely rare bonded mount chance.', activities: [] },
  { id: 'broken_quarry', name: 'Broken Quarry', type: 'outpost', x: 62, y: 10, level: '30 Mining', description: 'A small northern resource site. Rare veins deplete and respawn on timers.', activities: ['iron_vein'] }
];

export const ACTIVITIES: Record<string, ActivityDef> = {
  oak_trees: { id:'oak_trees', name:'Cut Oak Trees', kind:'gather', locationId:'kingswatch', skill:'woodcutting', level:1, seconds:8, tool:'bronze_axe', output:{ oak_log:1 }, xp:6, repeatable:true, description:'Reliable logs. Low tier, always consumed in higher crafting chains.' },
  copper_vein: { id:'copper_vein', name:'Mine Copper Vein', kind:'gather', locationId:'irondeep', skill:'mining', level:1, seconds:9, output:{ copper_ore:1 }, xp:6, repeatable:true, description:'Base ore for early metalwork.' },
  tin_vein: { id:'tin_vein', name:'Mine Tin Vein', kind:'gather', locationId:'irondeep', skill:'mining', level:1, seconds:9, output:{ tin_ore:1 }, xp:6, repeatable:true, description:'Pairs with copper for bronze.' },
  iron_vein: { id:'iron_vein', name:'Mine Iron Vein', kind:'gather', locationId:'irondeep', skill:'mining', level:15, seconds:14, output:{ iron_ore:1 }, xp:14, repeatable:true, description:'Main early serious ore. Remote rare versions later use depletion timers.' },
  river_fishing: { id:'river_fishing', name:'Fish River Spot', kind:'gather', locationId:'saltshore', skill:'fishing', level:1, seconds:10, output:{ river_fish:1 }, xp:7, repeatable:true, description:'Catches fish that cooking turns into combat sustain.' },
  wild_fibers: { id:'wild_fibers', name:'Gather Wild Fibers', kind:'gather', locationId:'greenhaven', skill:'gathering', level:1, seconds:7, output:{ wild_fiber:1 }, xp:5, repeatable:true, description:'General gathering: flax, cotton, herbs, mushrooms, fibers, and natural oddities.' },
  city_rats: { id:'city_rats', name:'Clear City Rats', kind:'combat', locationId:'kingswatch', skill:'melee', level:1, seconds:12, output:{ rat_carcass:3 }, xp:9, repeatable:true, description:'Starter combat. Corpses can be discarded or processed.', enemy:{ hp:18, maxHit:2, accuracy:70, family:'Vermin', kills:3 } },
  bandit_scouts: { id:'bandit_scouts', name:'Fight Bandit Scouts', kind:'combat', locationId:'emberfall', skill:'melee', level:8, seconds:20, output:{}, xp:22, repeatable:true, description:'Early real combat. Introduces Monster Mastery and food demand.', enemy:{ hp:45, maxHit:5, accuracy:62, family:'Bandit', kills:1 } },
  process_rats: { id:'process_rats', name:'Process Rat Carcasses', kind:'process', locationId:'kingswatch', skill:'processing', level:1, seconds:10, input:{ rat_carcass:3 }, output:{ rat_hide:2, small_bone:2 }, xp:8, repeatable:true, description:'Trade combat time for processing materials. Royal Charter queue makes this smoother, not stronger.' },
  cook_fish: { id:'cook_fish', name:'Cook River Fish', kind:'craft', locationId:'saltshore', skill:'cooking', level:1, seconds:7, input:{ river_fish:1 }, output:{}, xp:7, repeatable:true, description:'Cooking converts fish into future healing food. Placeholder output will become cooked fish item in next content pass.' },
  craft_bronze_axe: { id:'craft_bronze_axe', name:'Craft Bronze Axe', kind:'craft', locationId:'kingswatch', skill:'smithing', level:1, seconds:12, input:{ copper_ore:2, tin_ore:1, oak_log:1 }, output:{ bronze_axe:1 }, xp:18, description:'Early tool craft. Lower-tier tools remain useful as upgrade frames.' },
  craft_iron_axe: { id:'craft_iron_axe', name:'Craft Iron Axe', kind:'craft', locationId:'irondeep', skill:'smithing', level:15, seconds:18, input:{ iron_ore:3, oak_log:2, bronze_axe:1 }, output:{ iron_axe:1 }, xp:40, description:'Consumes the older axe, keeping low-tier crafted tools relevant.' },
  elder_bark: { id:'elder_bark', name:'Cut Elder Bark', kind:'gather', locationId:'elderwoods', skill:'woodcutting', level:65, seconds:40, tool:'iron_axe', output:{ elder_bark:1 }, xp:80, repeatable:true, description:'Rare locked resource. Final version uses batch depletion and respawn timers.' },
  snare_rabbits: { id:'snare_rabbits', name:'Snare Rabbits', kind:'gather', locationId:'greenhaven', skill:'hunting', level:1, seconds:11, output:{ small_bone:1 }, xp:8, repeatable:true, description:'Hunting gathers creature resources without direct combat.' }
};

export function xpForLevel(level: number) { return Math.floor(50 * Math.pow(level, 2.15)); }
export function travelSeconds(from: string, to: string) {
  const a = LOCATIONS.find(l=>l.id===from); const b = LOCATIONS.find(l=>l.id===to);
  if (!a || !b || from === to) return 0;
  const dx = a.x-b.x, dy = a.y-b.y;
  return Math.max(10, Math.round(Math.sqrt(dx*dx+dy*dy)*1.4));
}
