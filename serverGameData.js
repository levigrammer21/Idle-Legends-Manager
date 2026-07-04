module.exports = {
  maxActionMs: 8 * 60 * 60 * 1000,
  charterMaxMs: 300 * 24 * 60 * 60 * 1000,
  skills: { woodcutting:{name:"Woodcutting"}, mining:{name:"Mining"}, fishing:{name:"Fishing"}, gathering:{name:"Gathering"}, hunting:{name:"Hunting"}, processing:{name:"Processing"}, melee:{name:"Melee"}, ranged:{name:"Ranged"}, magic:{name:"Magic"}, monsterMastery:{name:"Monster Mastery"}, leadership:{name:"Leadership"}, smithing:{name:"Smithing"}, fletching:{name:"Fletching"}, cooking:{name:"Cooking"}, tailoring:{name:"Tailoring"}, crafting:{name:"Crafting"} },
  starterInventory: { crudeAxe:1, crackedPickaxe:1, reedRod:1, fieldKnife:1, trainingSword:1 },
  starterEquipment: { weapon:null, body:null, tool:null },
  items: {
    kingsSeal:{name:"King's Seal"}, crudeAxe:{name:"Crude Axe",slot:"tool"}, copperAxe:{name:"Copper Axe",slot:"tool"}, crackedPickaxe:{name:"Cracked Pickaxe",slot:"tool"}, copperPickaxe:{name:"Copper Pickaxe",slot:"tool"}, reedRod:{name:"Reed Fishing Rod",slot:"tool"}, fieldKnife:{name:"Field Knife",slot:"tool"}, trainingSword:{name:"Training Sword",slot:"weapon"}, oakShortbow:{name:"Oak Shortbow",slot:"weapon"}, paddedVest:{name:"Padded Vest",slot:"body"}, oakLog:{name:"Oak Log"}, stickBundle:{name:"Stick Bundle"}, flax:{name:"Flax"}, copperOre:{name:"Copper Ore"}, copperBar:{name:"Copper Bar"}, ironOre:{name:"Iron Ore"}, riverMinnow:{name:"River Minnow"}, cookedMinnow:{name:"Cooked Minnow"}, ratCarcass:{name:"Rat Carcass"}, ratHide:{name:"Rat Hide"}, smallBone:{name:"Small Bone"}, ratTooth:{name:"Rat Tooth"}, forestEgg:{name:"Mysterious Forest Egg"}
  },
  recipes: {
    smeltCopperBar:{name:"Smelt Copper Bar",skill:"smithing",level:1,xp:8,inputs:[{item:"copperOre",qty:2}],outputs:[{item:"copperBar",qty:1}]},
    craftCopperAxe:{name:"Craft Copper Axe",skill:"smithing",level:2,xp:20,inputs:[{item:"copperBar",qty:2},{item:"oakLog",qty:1},{item:"crudeAxe",qty:1}],outputs:[{item:"copperAxe",qty:1}]},
    craftCopperPickaxe:{name:"Craft Copper Pickaxe",skill:"smithing",level:2,xp:20,inputs:[{item:"copperBar",qty:2},{item:"oakLog",qty:1},{item:"crackedPickaxe",qty:1}],outputs:[{item:"copperPickaxe",qty:1}]},
    fletchOakShortbow:{name:"Fletch Oak Shortbow",skill:"fletching",level:1,xp:14,inputs:[{item:"oakLog",qty:2},{item:"flax",qty:1}],outputs:[{item:"oakShortbow",qty:1}]},
    tailorPaddedVest:{name:"Tailor Padded Vest",skill:"tailoring",level:1,xp:16,inputs:[{item:"ratHide",qty:3},{item:"flax",qty:2}],outputs:[{item:"paddedVest",qty:1}]},
    cookMinnow:{name:"Cook Minnow",skill:"cooking",level:1,xp:7,inputs:[{item:"riverMinnow",qty:1}],outputs:[{item:"cookedMinnow",qty:1}]}
  },
  cities: {
    kingswatch:{name:"Kingswatch",activities:["oakTrees","wildGathering","cityRats","riverMinnows","copperOutcrop"],recipes:["fletchOakShortbow","cookMinnow"]},
    irondeep:{name:"Irondeep",activities:["ironVein","copperOutcrop","mountainRats"],recipes:["smeltCopperBar","craftCopperAxe","craftCopperPickaxe"]},
    greenhaven:{name:"Greenhaven",activities:["oakTrees","flaxField","goblinScouts"],recipes:["tailorPaddedVest"]},
    saltshore:{name:"Saltshore",activities:["riverMinnows","shoreReeds"],recipes:["cookMinnow"]},
    emberfall:{name:"Emberfall",activities:["cityRats","ashBandits"],recipes:[]},
    frostgate:{name:"Frostgate Pass",lockedBy:"ironRoads",activities:["rareSilverVein"],recipes:[]},
    elderwoods:{name:"Elder Woods",lockedBy:"callOfElders",activities:["elderTree","griffinNest"],recipes:[]},
    scorpionPit:{name:"Scorpion Pit",lockedBy:"stingAndStone",activities:["scorpionMatriarch"],recipes:[]}
  },
  quests: { ironRoads:{name:"The Iron Roads",requirements:{mining:10}}, callOfElders:{name:"Call of the Elder Boughs",requirements:{woodcutting:20,gathering:12}}, stingAndStone:{name:"Sting and Stone",requirements:{melee:12,processing:5}} },
  activities: {
    oakTrees:{name:"Cut Oak Trees",skill:"woodcutting",requiredTool:"crudeAxe",actionSeconds:6,xp:8,inputs:[],outputs:[{item:"oakLog",min:1,max:1,chance:1},{item:"forestEgg",min:1,max:1,chance:.0008}]},
    wildGathering:{name:"Gather Wild Materials",skill:"gathering",actionSeconds:5,xp:7,inputs:[],outputs:[{item:"stickBundle",min:1,max:2,chance:.85},{item:"flax",min:1,max:1,chance:.35}]},
    flaxField:{name:"Harvest Flax",skill:"gathering",actionSeconds:7,xp:10,inputs:[],outputs:[{item:"flax",min:1,max:2,chance:1}]},
    copperOutcrop:{name:"Mine Copper Outcrop",skill:"mining",requiredTool:"crackedPickaxe",actionSeconds:7,xp:9,inputs:[],outputs:[{item:"copperOre",min:1,max:1,chance:1}]},
    ironVein:{name:"Mine Iron Vein",skill:"mining",requiredTool:"crackedPickaxe",actionSeconds:8,xp:12,inputs:[],outputs:[{item:"ironOre",min:1,max:1,chance:1}]},
    rareSilverVein:{name:"Mine Rare Silver Vein",skill:"mining",requiredTool:"crackedPickaxe",actionSeconds:16,xp:30,inputs:[],outputs:[{item:"ironOre",min:2,max:4,chance:1}]},
    riverMinnows:{name:"Fish River Minnows",skill:"fishing",requiredTool:"reedRod",actionSeconds:7,xp:9,inputs:[],outputs:[{item:"riverMinnow",min:1,max:2,chance:.9}]},
    shoreReeds:{name:"Gather Shore Reeds",skill:"gathering",actionSeconds:6,xp:8,inputs:[],outputs:[{item:"stickBundle",min:1,max:3,chance:1}]},
    cityRats:{name:"Fight City Rats",skill:"melee",actionSeconds:9,xp:11,goldMin:2,goldMax:5,inputs:[],outputs:[{item:"ratCarcass",min:1,max:1,chance:.7}],followUp:"processRats"},
    mountainRats:{name:"Fight Mountain Rats",skill:"melee",actionSeconds:10,xp:13,goldMin:3,goldMax:6,inputs:[],outputs:[{item:"ratCarcass",min:1,max:2,chance:.75}],followUp:"processRats"},
    goblinScouts:{name:"Fight Goblin Scouts",skill:"ranged",actionSeconds:12,xp:14,goldMin:5,goldMax:11,inputs:[],outputs:[{item:"stickBundle",min:1,max:2,chance:.45}]},
    ashBandits:{name:"Fight Ash Bandits",skill:"melee",actionSeconds:14,xp:18,goldMin:8,goldMax:18,inputs:[],outputs:[{item:"smallBone",min:1,max:2,chance:.2}]},
    processRats:{name:"Process Rat Carcasses",skill:"processing",requiredTool:"fieldKnife",actionSeconds:5,xp:6,inputs:[{item:"ratCarcass",qty:1}],outputs:[{item:"ratHide",min:1,max:1,chance:.8},{item:"smallBone",min:1,max:2,chance:.65},{item:"ratTooth",min:1,max:1,chance:.08}]},
    elderTree:{name:"Cut Elder Tree",skill:"woodcutting",requiredTool:"crudeAxe",actionSeconds:18,xp:35,inputs:[],outputs:[{item:"oakLog",min:4,max:7,chance:1},{item:"forestEgg",min:1,max:1,chance:.004}]},
    griffinNest:{name:"Griffin Nest",skill:"melee",actionSeconds:300,xp:300,goldMin:120,goldMax:280,inputs:[],outputs:[{item:"forestEgg",min:1,max:1,chance:.025}],mountChance:.001},
    scorpionMatriarch:{name:"Scorpion Matriarch",skill:"melee",actionSeconds:180,xp:180,goldMin:80,goldMax:160,inputs:[],outputs:[{item:"ratTooth",min:2,max:5,chance:.35}]}
  }
};
