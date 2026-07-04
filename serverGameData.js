module.exports = {
  maxActionMs: 8 * 60 * 60 * 1000,
  charterMaxMs: 300 * 24 * 60 * 60 * 1000,

  skills: {
    woodcutting:{name:"Woodcutting"}, mining:{name:"Mining"}, fishing:{name:"Fishing"}, gathering:{name:"Gathering"}, hunting:{name:"Hunting"}, processing:{name:"Processing"},
    melee:{name:"Melee"}, ranged:{name:"Ranged"}, magic:{name:"Magic"}, monsterMastery:{name:"Monster Mastery"}, leadership:{name:"Leadership"},
    smithing:{name:"Smithing"}, fletching:{name:"Fletching"}, cooking:{name:"Cooking"}, tailoring:{name:"Tailoring"}, crafting:{name:"Crafting"}
  },

  starterInventory: {
    crudeAxe: 1,
    crackedPickaxe: 1,
    reedRod: 1,
    fieldKnife: 1
  },

  items: {
    kingsSeal:{name:"King's Seal"}, crudeAxe:{name:"Crude Axe"}, crackedPickaxe:{name:"Cracked Pickaxe"}, reedRod:{name:"Reed Fishing Rod"}, fieldKnife:{name:"Field Knife"},
    oakLog:{name:"Oak Log"}, stickBundle:{name:"Stick Bundle"}, flax:{name:"Flax"}, ironOre:{name:"Iron Ore"}, riverMinnow:{name:"River Minnow"},
    ratCarcass:{name:"Rat Carcass"}, ratHide:{name:"Rat Hide"}, smallBone:{name:"Small Bone"}, ratTooth:{name:"Rat Tooth"}, forestEgg:{name:"Mysterious Forest Egg"}
  },

  cities: {
    kingswatch:{name:"Kingswatch",activities:["oakTrees","wildGathering","cityRats","riverMinnows"]},
    irondeep:{name:"Irondeep",activities:["ironVein","mountainRats"]},
    greenhaven:{name:"Greenhaven",activities:["oakTrees","flaxField","goblinScouts"]},
    saltshore:{name:"Saltshore",activities:["riverMinnows","shoreReeds"]},
    emberfall:{name:"Emberfall",activities:["cityRats","ashBandits"]},
    frostgate:{name:"Frostgate Pass",lockedBy:"ironRoads",activities:["rareSilverVein"]},
    elderwoods:{name:"Elder Woods",lockedBy:"callOfElders",activities:["elderTree","griffinNest"]},
    scorpionPit:{name:"Scorpion Pit",lockedBy:"stingAndStone",activities:["scorpionMatriarch"]}
  },

  quests: {
    ironRoads:{name:"The Iron Roads",requirements:{mining:10}},
    callOfElders:{name:"Call of the Elder Boughs",requirements:{woodcutting:20,gathering:12}},
    stingAndStone:{name:"Sting and Stone",requirements:{melee:12,processing:5}}
  },

  activities: {
    oakTrees:{name:"Cut Oak Trees",skill:"woodcutting",requiredTool:"crudeAxe",actionSeconds:6,xp:8,inputs:[],outputs:[{item:"oakLog",min:1,max:1,chance:1},{item:"forestEgg",min:1,max:1,chance:.0008}]},
    wildGathering:{name:"Gather Wild Materials",skill:"gathering",actionSeconds:5,xp:7,inputs:[],outputs:[{item:"stickBundle",min:1,max:2,chance:.85},{item:"flax",min:1,max:1,chance:.35}]},
    flaxField:{name:"Harvest Flax",skill:"gathering",actionSeconds:7,xp:10,inputs:[],outputs:[{item:"flax",min:1,max:2,chance:1}]},
    ironVein:{name:"Mine Iron Vein",skill:"mining",requiredTool:"crackedPickaxe",actionSeconds:8,xp:12,inputs:[],outputs:[{item:"ironOre",min:1,max:1,chance:1}]},
    rareSilverVein:{name:"Mine Rare Silver Vein",skill:"mining",requiredTool:"crackedPickaxe",actionSeconds:16,xp:30,finiteCharges:16,respawnMinutes:30,inputs:[],outputs:[{item:"ironOre",min:2,max:4,chance:1}]},
    riverMinnows:{name:"Fish River Minnows",skill:"fishing",requiredTool:"reedRod",actionSeconds:7,xp:9,inputs:[],outputs:[{item:"riverMinnow",min:1,max:2,chance:.9}]},
    shoreReeds:{name:"Gather Shore Reeds",skill:"gathering",actionSeconds:6,xp:8,inputs:[],outputs:[{item:"stickBundle",min:1,max:3,chance:1}]},
    cityRats:{name:"Fight City Rats",skill:"melee",actionSeconds:9,xp:11,goldMin:2,goldMax:5,inputs:[],outputs:[{item:"ratCarcass",min:1,max:1,chance:.7}],followUp:"processRats"},
    mountainRats:{name:"Fight Mountain Rats",skill:"melee",actionSeconds:10,xp:13,goldMin:3,goldMax:6,inputs:[],outputs:[{item:"ratCarcass",min:1,max:2,chance:.75}],followUp:"processRats"},
    goblinScouts:{name:"Fight Goblin Scouts",skill:"ranged",actionSeconds:12,xp:14,goldMin:5,goldMax:11,inputs:[],outputs:[{item:"stickBundle",min:1,max:2,chance:.45}]},
    ashBandits:{name:"Fight Ash Bandits",skill:"melee",actionSeconds:14,xp:18,goldMin:8,goldMax:18,inputs:[],outputs:[{item:"smallBone",min:1,max:2,chance:.2}]},
    processRats:{name:"Process Rat Carcasses",skill:"processing",requiredTool:"fieldKnife",actionSeconds:5,xp:6,inputs:[{item:"ratCarcass",qty:1}],outputs:[{item:"ratHide",min:1,max:1,chance:.8},{item:"smallBone",min:1,max:2,chance:.65},{item:"ratTooth",min:1,max:1,chance:.08}]},
    elderTree:{name:"Cut Elder Tree",skill:"woodcutting",requiredTool:"crudeAxe",actionSeconds:18,xp:35,finiteCharges:12,respawnMinutes:30,inputs:[],outputs:[{item:"oakLog",min:4,max:7,chance:1},{item:"forestEgg",min:1,max:1,chance:.004}]},
    griffinNest:{name:"Griffin Nest",skill:"melee",actionSeconds:300,xp:300,goldMin:120,goldMax:280,inputs:[],outputs:[{item:"forestEgg",min:1,max:1,chance:.025}],mountChance:.001},
    scorpionMatriarch:{name:"Scorpion Matriarch",skill:"melee",actionSeconds:180,xp:180,goldMin:80,goldMax:160,inputs:[],outputs:[{item:"ratTooth",min:2,max:5,chance:.35}]}
  }
};
