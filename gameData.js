export const GAME = {
  version: "sprint-3-combat-complete",
  maxActionMs: 8 * 60 * 60 * 1000,

  skills: {
    woodcutting: { name: "Woodcutting", icon: "🪓", purpose: "Logs for tools, bows, staffs, handles, construction later, and higher-tier recipes." },
    mining: { name: "Mining", icon: "⛏️", purpose: "Ore, stone, gems, and rare veins for smithing, crafting, and future guild projects." },
    fishing: { name: "Fishing", icon: "🎣", purpose: "Fish for cooking, combat food, bait chains, oils, and future sea content." },
    gathering: { name: "Gathering", icon: "🌿", purpose: "General wild materials: flax, reeds, cotton, herbs, berries, mushrooms, sticks, fibers." },
    hunting: { name: "Hunting", icon: "🏹", purpose: "Tracking, traps, nests, feathers, hides, and future creature encounters." },
    processing: { name: "Processing", icon: "🔪", purpose: "Turns carcasses and raw creature remains into hides, bones, teeth, glands, scales, and components." },
    melee: { name: "Melee", icon: "⚔️", purpose: "Close combat. Future tree supports crit builds, speed builds, bleed builds, and tank builds." },
    ranged: { name: "Ranged", icon: "🏹", purpose: "Projectile combat. Future tree supports precision, speed, poison, and multi-shot." },
    magic: { name: "Magic", icon: "✨", purpose: "Spells, runes, alchemy-style transformations, barriers, and elemental combat." },
    monsterMastery: { name: "Monster Mastery", icon: "🐲", purpose: "Knowledge of monster families, boss access, better scouting, and improved processing." },
    leadership: { name: "Leadership", icon: "📜", purpose: "Expedition management, queue depth, future adventurer recruitment, and raid planning." },
    smithing: { name: "Smithing", icon: "⚒️", purpose: "Metal tools, weapons, armor, and boss-component gear." },
    fletching: { name: "Fletching", icon: "🏹", purpose: "Bows, arrows, tool handles, staffs, and ranged upgrades." },
    cooking: { name: "Cooking", icon: "🍳", purpose: "Food, combat meals, travel rations, and future pet feed." },
    tailoring: { name: "Tailoring", icon: "🧵", purpose: "Cloth armor, robes, capes, bags, banners, and cosmetics." },
    crafting: { name: "Crafting", icon: "💎", purpose: "Jewelry, utility items, parts, mount gear, charms, and pet items." }
  },

  equipmentSlots: { weapon: "Weapon", body: "Body", tool: "Active Tool" },

  items: {
    gold: { name: "Gold", icon: "🪙", type: "currency", description: "Main currency." },
    kingsSeal: { name: "King's Seal", icon: "👑", type: "premium-token", description: "Tradable. Opening consumes it and grants 30 days of Royal Charter. Does not remove Hardened status." },

    crudeAxe: { name: "Crude Axe", icon: "🪓", type: "tool", slot: "tool", toolFor: "woodcutting", tier: 1, description: "Starter axe required for Woodcutting." },
    copperAxe: { name: "Copper Axe", icon: "🪓", type: "tool", slot: "tool", toolFor: "woodcutting", tier: 2, description: "Crafted Woodcutting upgrade." },
    crackedPickaxe: { name: "Cracked Pickaxe", icon: "⛏️", type: "tool", slot: "tool", toolFor: "mining", tier: 1, description: "Starter pickaxe required for Mining." },
    copperPickaxe: { name: "Copper Pickaxe", icon: "⛏️", type: "tool", slot: "tool", toolFor: "mining", tier: 2, description: "Crafted Mining upgrade." },
    reedRod: { name: "Reed Fishing Rod", icon: "🎣", type: "tool", slot: "tool", toolFor: "fishing", tier: 1, description: "Starter fishing rod." },
    fieldKnife: { name: "Field Knife", icon: "🔪", type: "tool", slot: "tool", toolFor: "processing", tier: 1, description: "Starter processing knife." },

    trainingSword: { name: "Training Sword", icon: "🗡️", type: "weapon", slot: "weapon", combatStyle: "melee", power: 2, accuracy: 4, tier: 1, description: "Starter melee weapon." },
    oakShortbow: { name: "Oak Shortbow", icon: "🏹", type: "weapon", slot: "weapon", combatStyle: "ranged", power: 3, accuracy: 3, tier: 1, description: "Basic ranged weapon crafted by Fletching." },
    paddedVest: { name: "Padded Vest", icon: "🥋", type: "armor", slot: "body", defense: 3, tier: 1, description: "Beginner armor made from processed hide and flax." },

    oakLog: { name: "Oak Log", icon: "🪵", type: "resource", description: "Common log used in tools, bows, handles, and higher-tier recipes." },
    stickBundle: { name: "Stick Bundle", icon: "🌾", type: "resource", description: "Gathered sticks/reeds used by Fletching and Crafting." },
    flax: { name: "Flax", icon: "🌱", type: "resource", description: "Fiber used by Tailoring and Fletching." },
    copperOre: { name: "Copper Ore", icon: "🟠", type: "resource", description: "Early ore for first upgraded tools." },
    copperBar: { name: "Copper Bar", icon: "🟧", type: "processed", description: "Smelted bar used in upgraded tools." },
    ironOre: { name: "Iron Ore", icon: "🪨", type: "resource", description: "Ore used by Smithing." },
    riverMinnow: { name: "River Minnow", icon: "🐟", type: "fish", description: "Basic fish for Cooking and bait chains." },
    cookedMinnow: { name: "Cooked Minnow", icon: "🍢", type: "food", heal: 8, description: "Basic food consumed automatically in combat when HP is low." },

    ratCarcass: { name: "Rat Carcass", icon: "🐀", type: "carcass", description: "Can be processed into hide, bone, and teeth." },
    ratHide: { name: "Rat Hide", icon: "🟫", type: "processed", description: "Used in beginner Tailoring and Crafting." },
    smallBone: { name: "Small Bone", icon: "🦴", type: "processed", description: "Used in Crafting, Magic components, and future pet feed." },
    ratTooth: { name: "Rat Tooth", icon: "🦷", type: "processed", description: "Uncommon processing item used in charms/components." },
    goblinEar: { name: "Goblin Ear", icon: "👂", type: "component", description: "Monster component used later in Monster Mastery recipes." },
    ashCharm: { name: "Ash Charm", icon: "🧿", type: "component", description: "Bandit drop used for early magic/crafting." },
    scorpionTail: { name: "Scorpion Tail", icon: "🦂", type: "boss-component", description: "Boss component. Not equippable until crafted into gear." },
    griffinFeather: { name: "Griffin Feather", icon: "🪶", type: "boss-component", description: "Rare boss component from Griffin Nest." },
    forestEgg: { name: "Mysterious Forest Egg", icon: "🥚", type: "egg", description: "Rare egg. Contents and albino status unknown until hatching." }
  },

  recipes: {
    smeltCopperBar: { name: "Smelt Copper Bar", icon: "🔥", skill: "smithing", level: 1, seconds: 6, xp: 8, station: "Forge", inputs: [{ item: "copperOre", qty: 2 }], outputs: [{ item: "copperBar", qty: 1 }], description: "Turns copper ore into bars." },
    craftCopperAxe: { name: "Craft Copper Axe", icon: "🪓", skill: "smithing", level: 2, seconds: 12, xp: 20, station: "Forge", inputs: [{ item: "copperBar", qty: 2 }, { item: "oakLog", qty: 1 }, { item: "crudeAxe", qty: 1 }], outputs: [{ item: "copperAxe", qty: 1 }], description: "Consumes old axe to prevent dead item buildup." },
    craftCopperPickaxe: { name: "Craft Copper Pickaxe", icon: "⛏️", skill: "smithing", level: 2, seconds: 12, xp: 20, station: "Forge", inputs: [{ item: "copperBar", qty: 2 }, { item: "oakLog", qty: 1 }, { item: "crackedPickaxe", qty: 1 }], outputs: [{ item: "copperPickaxe", qty: 1 }], description: "Consumes old pickaxe." },
    fletchOakShortbow: { name: "Fletch Oak Shortbow", icon: "🏹", skill: "fletching", level: 1, seconds: 9, xp: 14, station: "Workshop", inputs: [{ item: "oakLog", qty: 2 }, { item: "flax", qty: 1 }], outputs: [{ item: "oakShortbow", qty: 1 }], description: "Early ranged weapon." },
    tailorPaddedVest: { name: "Tailor Padded Vest", icon: "🥋", skill: "tailoring", level: 1, seconds: 10, xp: 16, station: "Tailor", inputs: [{ item: "ratHide", qty: 3 }, { item: "flax", qty: 2 }], outputs: [{ item: "paddedVest", qty: 1 }], description: "Beginner body armor." },
    cookMinnow: { name: "Cook Minnow", icon: "🍢", skill: "cooking", level: 1, seconds: 5, xp: 7, station: "Kitchen", inputs: [{ item: "riverMinnow", qty: 1 }], outputs: [{ item: "cookedMinnow", qty: 1 }], description: "Food used by combat." }
  },

  enemies: {
    cityRat: { name: "City Rat", icon: "🐀", family: "vermin", hp: 10, attack: 2, defense: 1, accuracy: 55, damage: [1, 3], masteryXp: 2 },
    mountainRat: { name: "Mountain Rat", icon: "🐀", family: "vermin", hp: 15, attack: 3, defense: 2, accuracy: 58, damage: [1, 4], masteryXp: 3 },
    goblinScout: { name: "Goblin Scout", icon: "👺", family: "goblin", hp: 22, attack: 5, defense: 3, accuracy: 62, damage: [2, 6], masteryXp: 4 },
    ashBandit: { name: "Ash Bandit", icon: "🥷", family: "bandit", hp: 30, attack: 7, defense: 5, accuracy: 65, damage: [3, 8], masteryXp: 5 },
    scorpionMatriarch: { name: "Scorpion Matriarch", icon: "🦂", family: "beast", hp: 140, attack: 13, defense: 10, accuracy: 68, damage: [5, 14], masteryXp: 25, boss: true },
    griffin: { name: "Griffin", icon: "🦅", family: "griffin", hp: 260, attack: 20, defense: 18, accuracy: 72, damage: [8, 22], masteryXp: 50, boss: true }
  },

  cities: {
    kingswatch: { name: "Kingswatch", icon: "🏰", subtitle: "Capital of Asterra", x: 50, y: 50, description: "Central city. Home to the Grand Market, Expedition Hall, Bank, Workshop, and Kitchen.", services: ["Bank", "Grand Market", "Expedition Hall", "Guild Registry", "Stables", "Workshop", "Kitchen"], activities: ["oakTrees", "wildGathering", "cityRats", "riverMinnows", "copperOutcrop"], recipes: ["fletchOakShortbow", "cookMinnow"] },
    irondeep: { name: "Irondeep", icon: "⛰️", subtitle: "Northern mining city", x: 50, y: 16, description: "Industrial mountain city. Common ore and forges are here. Rare veins are beyond the city.", services: ["Bank", "Forge", "Toolsmith", "Stable"], activities: ["ironVein", "copperOutcrop", "mountainRats"], recipes: ["smeltCopperBar", "craftCopperAxe", "craftCopperPickaxe"] },
    greenhaven: { name: "Greenhaven", icon: "🌲", subtitle: "Eastern forest city", x: 82, y: 50, description: "Wood, gathering, hunting, tailoring fibers, and Elder Woods access.", services: ["Bank", "Hunter Lodge", "Tailor", "Stable"], activities: ["oakTrees", "flaxField", "goblinScouts"], recipes: ["tailorPaddedVest"] },
    saltshore: { name: "Saltshore", icon: "⚓", subtitle: "Southern port city", x: 50, y: 84, description: "Fishing and cooking city. Future island travel starts here.", services: ["Bank", "Kitchen", "Dockmaster", "Stable"], activities: ["riverMinnows", "shoreReeds"], recipes: ["cookMinnow"] },
    emberfall: { name: "Emberfall", icon: "🔥", subtitle: "Western frontier city", x: 18, y: 50, description: "Combat city near old battlefields and monster mastery questlines.", services: ["Bank", "Combat Yard", "Monster Master", "Stable"], activities: ["cityRats", "ashBandits"], recipes: [] },
    frostgate: { name: "Frostgate Pass", icon: "❄️", subtitle: "Quest-locked northern pass", x: 48, y: 4, lockedBy: "ironRoads", description: "Narrow mountain pass. Sprint model for finite rare resources.", services: ["Camp"], activities: ["rareSilverVein"], recipes: [] },
    elderwoods: { name: "Elder Woods", icon: "🦅", subtitle: "Quest-locked ancient forest", x: 96, y: 39, lockedBy: "callOfElders", description: "Ancient trees and Griffin territory.", services: ["Hidden Grove"], activities: ["elderTree", "griffinNest"], recipes: [] },
    scorpionPit: { name: "Scorpion Pit", icon: "🦂", subtitle: "Quest-locked desert hollow", x: 4, y: 62, lockedBy: "stingAndStone", description: "Early boss-component zone.", services: ["Camp"], activities: ["scorpionMatriarch"], recipes: [] }
  },

  roads: [["kingswatch","irondeep"],["kingswatch","greenhaven"],["kingswatch","saltshore"],["kingswatch","emberfall"],["irondeep","frostgate"],["greenhaven","elderwoods"],["emberfall","scorpionPit"]],

  quests: {
    ironRoads: { name: "The Iron Roads", origin: "Irondeep", requirements: { mining: 10 }, unlocks: "Frostgate Pass", description: "Restore the northern mining road." },
    callOfElders: { name: "Call of the Elder Boughs", origin: "Greenhaven", requirements: { woodcutting: 20, gathering: 12 }, unlocks: "Elder Woods", description: "Earn access to the ancient forest." },
    stingAndStone: { name: "Sting and Stone", origin: "Emberfall", requirements: { melee: 12, processing: 5 }, unlocks: "Scorpion Pit", description: "Learn to survive the western hollow." }
  },

  activities: {
    oakTrees: { name: "Cut Oak Trees", icon: "🪓", category: "Gathering", type: "resource", skill: "woodcutting", requiredTool: "crudeAxe", actionSeconds: 6, xp: 8, inputs: [], outputs: [{ item: "oakLog", min: 1, max: 1, chance: 1 }, { item: "forestEgg", min: 1, max: 1, chance: 0.0008 }], description: "Reliable logs." },
    wildGathering: { name: "Gather Wild Materials", icon: "🌿", category: "Gathering", type: "resource", skill: "gathering", actionSeconds: 5, xp: 7, inputs: [], outputs: [{ item: "stickBundle", min: 1, max: 2, chance: .85 }, { item: "flax", min: 1, max: 1, chance: .35 }], description: "General gathering." },
    flaxField: { name: "Harvest Flax", icon: "🌱", category: "Gathering", type: "resource", skill: "gathering", actionSeconds: 7, xp: 10, inputs: [], outputs: [{ item: "flax", min: 1, max: 2, chance: 1 }], description: "Focused fiber gathering." },
    copperOutcrop: { name: "Mine Copper Outcrop", icon: "🟠", category: "Gathering", type: "resource", skill: "mining", requiredTool: "crackedPickaxe", actionSeconds: 7, xp: 9, inputs: [], outputs: [{ item: "copperOre", min: 1, max: 1, chance: 1 }], description: "Early ore." },
    ironVein: { name: "Mine Iron Vein", icon: "⛏️", category: "Gathering", type: "resource", skill: "mining", requiredTool: "crackedPickaxe", actionSeconds: 8, xp: 12, inputs: [], outputs: [{ item: "ironOre", min: 1, max: 1, chance: 1 }], description: "Common iron near Irondeep." },
    rareSilverVein: { name: "Mine Rare Silver Vein", icon: "⛏️", category: "Rare Resource", type: "finite", skill: "mining", requiredTool: "crackedPickaxe", actionSeconds: 16, xp: 30, inputs: [], outputs: [{ item: "ironOre", min: 2, max: 4, chance: 1 }], description: "Finite rare resource model." },
    riverMinnows: { name: "Fish River Minnows", icon: "🎣", category: "Gathering", type: "resource", skill: "fishing", requiredTool: "reedRod", actionSeconds: 7, xp: 9, inputs: [], outputs: [{ item: "riverMinnow", min: 1, max: 2, chance: .9 }], description: "Basic fish." },
    shoreReeds: { name: "Gather Shore Reeds", icon: "🌾", category: "Gathering", type: "resource", skill: "gathering", actionSeconds: 6, xp: 8, inputs: [], outputs: [{ item: "stickBundle", min: 1, max: 3, chance: 1 }], description: "Reeds and shore materials." },

    cityRats: { name: "Fight City Rats", icon: "🐀", category: "Combat", type: "combat", skill: "melee", enemy: "cityRat", actionSeconds: 9, xp: 11, goldMin: 2, goldMax: 5, inputs: [], outputs: [{ item: "ratCarcass", min: 1, max: 1, chance: .7 }], followUp: "processRats", description: "Early melee combat. HP, food, accuracy, and death are now simulated." },
    mountainRats: { name: "Fight Mountain Rats", icon: "🐀", category: "Combat", type: "combat", skill: "melee", enemy: "mountainRat", actionSeconds: 10, xp: 13, goldMin: 3, goldMax: 6, inputs: [], outputs: [{ item: "ratCarcass", min: 1, max: 2, chance: .75 }], followUp: "processRats", description: "Hardier northern rats." },
    goblinScouts: { name: "Fight Goblin Scouts", icon: "👺", category: "Combat", type: "combat", skill: "ranged", enemy: "goblinScout", actionSeconds: 12, xp: 14, goldMin: 5, goldMax: 11, inputs: [], outputs: [{ item: "stickBundle", min: 1, max: 2, chance: .45 }, { item: "goblinEar", min: 1, max: 1, chance: .15 }], description: "Early ranged combat." },
    ashBandits: { name: "Fight Ash Bandits", icon: "🥷", category: "Combat", type: "combat", skill: "melee", enemy: "ashBandit", actionSeconds: 14, xp: 18, goldMin: 8, goldMax: 18, inputs: [], outputs: [{ item: "smallBone", min: 1, max: 2, chance: .2 }, { item: "ashCharm", min: 1, max: 1, chance: .08 }], description: "Western combat target." },

    processRats: { name: "Process Rat Carcasses", icon: "🔪", category: "Processing", type: "processing", skill: "processing", requiredTool: "fieldKnife", actionSeconds: 5, xp: 6, inputs: [{ item: "ratCarcass", qty: 1 }], outputs: [{ item: "ratHide", min: 1, max: 1, chance: .8 }, { item: "smallBone", min: 1, max: 2, chance: .65 }, { item: "ratTooth", min: 1, max: 1, chance: .08 }], description: "Turns combat remains into usable materials." },

    elderTree: { name: "Cut Elder Tree", icon: "🌳", category: "Rare Resource", type: "finite", skill: "woodcutting", requiredTool: "crudeAxe", actionSeconds: 18, xp: 35, inputs: [], outputs: [{ item: "oakLog", min: 4, max: 7, chance: 1 }, { item: "forestEgg", min: 1, max: 1, chance: .004 }], description: "Quest-locked finite tree." },
    griffinNest: { name: "Griffin Nest", icon: "🦅", category: "Boss", type: "boss", skill: "melee", enemy: "griffin", actionSeconds: 300, xp: 300, goldMin: 120, goldMax: 280, inputs: [], outputs: [{ item: "griffinFeather", min: 1, max: 2, chance: .35 }, { item: "forestEgg", min: 1, max: 1, chance: .025 }], mountChance: .001, description: "Quest-locked boss. Rare drops and 1/1000 mount-bond philosophy." },
    scorpionMatriarch: { name: "Scorpion Matriarch", icon: "🦂", category: "Boss", type: "boss", skill: "melee", enemy: "scorpionMatriarch", actionSeconds: 180, xp: 180, goldMin: 80, goldMax: 160, inputs: [], outputs: [{ item: "scorpionTail", min: 1, max: 1, chance: .4 }, { item: "ratTooth", min: 2, max: 5, chance: .35 }], description: "Boss-component drop model." }
  }
};
