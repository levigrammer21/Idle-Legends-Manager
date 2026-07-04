(() => {
"use strict";

const VERSION = "0.5.1";
const BUILD_ID = "ILM-A0.5.1-FIXED-CONTENT";
const SAVE_KEY = "ilm.alpha.0.5.1.save";

const DATA = {
  skills: {
    woodcutting:["🪓","Gathering","Trees, logs, rare nests, high-tier handles."],
    mining:["⛏️","Gathering","Ore, stone, gems, finite rare veins."],
    fishing:["🎣","Gathering","Fish, bait, oils, cooking chains."],
    gathering:["🌿","Gathering","Flax, cotton, reeds, herbs, berries, mushrooms, sticks."],
    hunting:["🏹","Gathering","Tracks, traps, feathers, nests, field trophies."],
    processing:["🔪","Production","Carcasses into hides, bones, glands, teeth, scales."],
    smithing:["⚒️","Production","Bars, tools, weapons, armor."],
    fletching:["🏹","Production","Bows, arrows, handles, staffs."],
    cooking:["🍳","Production","Food, combat meals, pet feed."],
    tailoring:["🧵","Production","Armor, robes, bags, cloth goods."],
    crafting:["💎","Production","Jewelry, charms, utility items, mount gear."],
    melee:["⚔️","Combat","Close combat: crit, speed, bleed, defense."],
    ranged:["🏹","Combat","Projectile combat: precision, speed, poison, multi-shot."],
    magic:["✨","Combat","Spells, rune work, alchemy-style transmutation."],
    monsterMastery:["🐲","Combat","Monster families, boss access, improved processing."],
    leadership:["📜","Expedition","Queue depth, adventurer management, routes, contracts."]
  },
  items: {
    kingsSeal:{n:"King's Seal",i:"👑",t:"premium",p:25000,d:"Tradable token. Opening gives 30 days Royal Charter. Hardened-safe."},
    crudeAxe:{n:"Crude Axe",i:"🪓",t:"tool",slot:"tool",tool:"woodcutting",p:25,d:"Starter woodcutting tool."},
    copperAxe:{n:"Copper Axe",i:"🪓",t:"tool",slot:"tool",tool:"woodcutting",p:180,d:"Improved axe."},
    ironAxe:{n:"Iron Axe",i:"🪓",t:"tool",slot:"tool",tool:"woodcutting",p:620,d:"Iron axe."},
    crackedPickaxe:{n:"Cracked Pickaxe",i:"⛏️",t:"tool",slot:"tool",tool:"mining",p:25,d:"Starter mining tool."},
    copperPickaxe:{n:"Copper Pickaxe",i:"⛏️",t:"tool",slot:"tool",tool:"mining",p:180,d:"Improved pickaxe."},
    ironPickaxe:{n:"Iron Pickaxe",i:"⛏️",t:"tool",slot:"tool",tool:"mining",p:620,d:"Iron pickaxe."},
    reedRod:{n:"Reed Rod",i:"🎣",t:"tool",slot:"tool",tool:"fishing",p:25,d:"Starter fishing rod."},
    fieldKnife:{n:"Field Knife",i:"🔪",t:"tool",slot:"tool",tool:"processing",p:25,d:"Starter processing knife."},
    trainingSword:{n:"Training Sword",i:"🗡️",t:"weapon",slot:"weapon",style:"melee",pow:2,acc:4,p:40,d:"Starter melee weapon."},
    oakShortbow:{n:"Oak Shortbow",i:"🏹",t:"weapon",slot:"weapon",style:"ranged",pow:3,acc:3,p:120,d:"Basic bow."},
    noviceStaff:{n:"Novice Staff",i:"🪄",t:"weapon",slot:"weapon",style:"magic",pow:3,acc:5,p:140,d:"Starter magic weapon."},
    emberDagger:{n:"Ember Dagger",i:"🗡️",t:"weapon",slot:"weapon",style:"melee",pow:7,acc:7,p:900,d:"Scorpion-tail dagger."},
    griffinLance:{n:"Griffin Lance",i:"🪶",t:"weapon",slot:"weapon",style:"melee",pow:14,acc:10,p:6000,d:"Boss-component weapon."},
    paddedVest:{n:"Padded Vest",i:"🥋",t:"armor",slot:"body",def:3,p:100,d:"Beginner armor."},
    scorpionMail:{n:"Scorpion Mail",i:"🦂",t:"armor",slot:"body",def:9,p:1100,d:"Boss-component armor."},
    griffinCloak:{n:"Griffin Cloak",i:"🪶",t:"armor",slot:"body",def:15,p:6500,d:"Prestige cloak."},
    donkey:{n:"Donkey",i:"🐴",t:"mount",slot:"mount",speed:.95,p:350,d:"Early mount."},
    camel:{n:"Camel",i:"🐪",t:"mount",slot:"mount",speed:.85,p:1100,d:"Desert mount."},
    bondedGriffin:{n:"Bonded Griffin",i:"🦅",t:"mount",slot:"mount",speed:.55,bound:true,p:0,d:"Rare bound boss mount."},
    oakLog:{n:"Oak Log",i:"🪵",t:"resource",p:6,d:"Basic wood."},
    elderLog:{n:"Elder Log",i:"🌳",t:"resource",p:80,d:"Rare ancient wood."},
    stickBundle:{n:"Stick Bundle",i:"🌾",t:"resource",p:3,d:"Sticks/reeds."},
    flax:{n:"Flax",i:"🌱",t:"resource",p:5,d:"Fiber."},
    cotton:{n:"Cotton",i:"☁️",t:"resource",p:18,d:"Soft fiber."},
    copperOre:{n:"Copper Ore",i:"🟠",t:"resource",p:8,d:"Early ore."},
    copperBar:{n:"Copper Bar",i:"🟧",t:"bar",p:22,d:"Copper bar."},
    ironOre:{n:"Iron Ore",i:"🪨",t:"resource",p:14,d:"Iron ore."},
    ironBar:{n:"Iron Bar",i:"⬛",t:"bar",p:44,d:"Iron bar."},
    silverOre:{n:"Silver Ore",i:"⚪",t:"resource",p:95,d:"Rare finite ore."},
    riverMinnow:{n:"River Minnow",i:"🐟",t:"fish",p:4,d:"Basic fish."},
    cookedMinnow:{n:"Cooked Minnow",i:"🍢",t:"food",heal:8,p:9,d:"Basic combat food."},
    shoreBass:{n:"Shore Bass",i:"🐠",t:"fish",p:22,d:"Better fish."},
    grilledBass:{n:"Grilled Bass",i:"🍣",t:"food",heal:18,p:44,d:"Better combat food."},
    ratCarcass:{n:"Rat Carcass",i:"🐀",t:"carcass",p:2,d:"Processable remains."},
    ratHide:{n:"Rat Hide",i:"🟫",t:"processed",p:5,d:"Low hide."},
    smallBone:{n:"Small Bone",i:"🦴",t:"processed",p:4,d:"Small bone."},
    ratTooth:{n:"Rat Tooth",i:"🦷",t:"component",p:35,d:"Uncommon tooth."},
    goblinEar:{n:"Goblin Ear",i:"👂",t:"component",p:45,d:"Goblin component."},
    ashCharm:{n:"Ash Charm",i:"🧿",t:"component",p:90,d:"Bandit charm."},
    scorpionTail:{n:"Scorpion Tail",i:"🦂",t:"boss",p:550,d:"Scorpion boss component."},
    venomGland:{n:"Venom Gland",i:"🧪",t:"component",p:240,d:"Poison component."},
    griffinFeather:{n:"Griffin Feather",i:"🪶",t:"boss",p:900,d:"Griffin component."},
    griffinBeak:{n:"Griffin Beak",i:"🦅",t:"boss",p:2400,d:"Rare Griffin component."},
    forestEgg:{n:"Mysterious Forest Egg",i:"🥚",t:"egg",p:1500,d:"Hatchable pet egg."}
  },
  enemies: {
    cityRat:{n:"City Rat",i:"🐀",hp:10,def:1,acc:55,dmg:[1,3],mxp:2},
    mountainRat:{n:"Mountain Rat",i:"🐀",hp:15,def:2,acc:58,dmg:[1,4],mxp:3},
    goblinScout:{n:"Goblin Scout",i:"👺",hp:22,def:3,acc:62,dmg:[2,6],mxp:4},
    ashBandit:{n:"Ash Bandit",i:"🥷",hp:30,def:5,acc:65,dmg:[3,8],mxp:5},
    reefSerpent:{n:"Reef Serpent",i:"🐍",hp:80,def:8,acc:66,dmg:[4,12],mxp:14,boss:true},
    scorpionMatriarch:{n:"Scorpion Matriarch",i:"🦂",hp:140,def:10,acc:68,dmg:[5,14],mxp:25,boss:true},
    frostWarden:{n:"Frost Warden",i:"❄️",hp:170,def:16,acc:70,dmg:[6,18],mxp:35,boss:true},
    griffin:{n:"Griffin",i:"🦅",hp:260,def:18,acc:72,dmg:[8,22],mxp:50,boss:true}
  },
  recipes: {
    smeltCopperBar:{n:"Smelt Copper Bar",i:"🔥",s:"smithing",lvl:1,xp:8,loc:"Forge",in:[["copperOre",2]],out:[["copperBar",1]],d:"Copper ore into bars."},
    smeltIronBar:{n:"Smelt Iron Bar",i:"🔥",s:"smithing",lvl:4,xp:18,loc:"Forge",in:[["ironOre",2],["copperBar",1]],out:[["ironBar",1]],d:"Iron bar uses lower copper too."},
    craftCopperAxe:{n:"Craft Copper Axe",i:"🪓",s:"smithing",lvl:2,xp:20,loc:"Forge",in:[["copperBar",2],["oakLog",1],["crudeAxe",1]],out:[["copperAxe",1]],d:"Consumes old axe."},
    craftCopperPickaxe:{n:"Craft Copper Pickaxe",i:"⛏️",s:"smithing",lvl:2,xp:20,loc:"Forge",in:[["copperBar",2],["oakLog",1],["crackedPickaxe",1]],out:[["copperPickaxe",1]],d:"Consumes old pickaxe."},
    craftIronAxe:{n:"Craft Iron Axe",i:"🪓",s:"smithing",lvl:5,xp:45,loc:"Forge",in:[["ironBar",2],["oakLog",2],["copperAxe",1]],out:[["ironAxe",1]],d:"Consumes copper axe."},
    craftIronPickaxe:{n:"Craft Iron Pickaxe",i:"⛏️",s:"smithing",lvl:5,xp:45,loc:"Forge",in:[["ironBar",2],["oakLog",2],["copperPickaxe",1]],out:[["ironPickaxe",1]],d:"Consumes copper pickaxe."},
    fletchOakShortbow:{n:"Fletch Oak Shortbow",i:"🏹",s:"fletching",lvl:1,xp:14,loc:"Workshop",in:[["oakLog",2],["flax",1]],out:[["oakShortbow",1]],d:"Basic bow."},
    tailorPaddedVest:{n:"Tailor Padded Vest",i:"🥋",s:"tailoring",lvl:1,xp:16,loc:"Tailor",in:[["ratHide",3],["flax",2]],out:[["paddedVest",1]],d:"Beginner armor."},
    cookMinnow:{n:"Cook Minnow",i:"🍢",s:"cooking",lvl:1,xp:7,loc:"Kitchen",in:[["riverMinnow",1]],out:[["cookedMinnow",1]],d:"Combat food."},
    grillBass:{n:"Grill Bass",i:"🍣",s:"cooking",lvl:5,xp:18,loc:"Kitchen",in:[["shoreBass",1],["stickBundle",1]],out:[["grilledBass",1]],d:"Better food."},
    emberDagger:{n:"Craft Ember Dagger",i:"🗡️",s:"crafting",lvl:4,xp:45,loc:"Monster Forge",in:[["scorpionTail",1],["copperBar",2],["ratTooth",2]],out:[["emberDagger",1]],d:"Boss component weapon."},
    scorpionMail:{n:"Craft Scorpion Mail",i:"🦂",s:"smithing",lvl:5,xp:60,loc:"Monster Forge",in:[["scorpionTail",2],["copperBar",3],["ratHide",6]],out:[["scorpionMail",1]],d:"Boss component armor."},
    griffinLance:{n:"Craft Griffin Lance",i:"🪶",s:"crafting",lvl:10,xp:160,loc:"Monster Forge",in:[["griffinBeak",1],["griffinFeather",4],["ironBar",4],["elderLog",2]],out:[["griffinLance",1]],d:"Prestige weapon."},
    griffinCloak:{n:"Craft Griffin Cloak",i:"🪶",s:"tailoring",lvl:10,xp:160,loc:"Tailor",in:[["griffinFeather",6],["cotton",8],["elderLog",1]],out:[["griffinCloak",1]],d:"Prestige armor."}
  },
  quests: {
    ironRoads:{n:"The Iron Roads",origin:"Irondeep",req:{mining:10},unlock:"Frostgate Pass",d:"Restore the northern mining road."},
    callOfElders:{n:"Call of the Elder Boughs",origin:"Greenhaven",req:{woodcutting:20,gathering:12},unlock:"Elder Woods",d:"Earn access to ancient forest paths."},
    stingAndStone:{n:"Sting and Stone",origin:"Emberfall",req:{melee:12,processing:5},unlock:"Scorpion Pit",d:"Survive the western hollow."},
    reefPass:{n:"Reef Passage",origin:"Saltshore",req:{fishing:10,cooking:5},unlock:"Reefwatch",d:"Earn the dockmaster's trust."}
  },
  cities: {
    kingswatch:{n:"Kingswatch",i:"🏰",sub:"Capital of Asterra",x:50,y:50,d:"Central hub. Roads, market, bank, expedition hall, workshop, kitchen, stables.",a:["oakTrees","wildGathering","cityRats","riverMinnows","copperOutcrop"],r:["fletchOakShortbow","cookMinnow"],shop:["donkey","crudeAxe","crackedPickaxe","reedRod","fieldKnife","trainingSword","noviceStaff"]},
    irondeep:{n:"Irondeep",i:"⛰️",sub:"Northern mining city",x:50,y:16,d:"Forge city with ore, smithing, and northern route content.",a:["ironVein","copperOutcrop","mountainRats"],r:["smeltCopperBar","smeltIronBar","craftCopperAxe","craftCopperPickaxe","craftIronAxe","craftIronPickaxe"],shop:[]},
    greenhaven:{n:"Greenhaven",i:"🌲",sub:"Eastern forest city",x:82,y:50,d:"Wood, gathering, hunting, fibers, tailoring, Elder Woods quest.",a:["oakTrees","flaxField","cottonPatch","goblinScouts"],r:["tailorPaddedVest","griffinCloak"],shop:[]},
    saltshore:{n:"Saltshore",i:"⚓",sub:"Southern port city",x:50,y:84,d:"Fishing, cooking, ports, reef routes, camel trader.",a:["riverMinnows","shoreBass","shoreReeds"],r:["cookMinnow","grillBass"],shop:["camel"]},
    emberfall:{n:"Emberfall",i:"🔥",sub:"Western frontier city",x:18,y:50,d:"Combat, monster mastery, bandits, monster forge.",a:["cityRats","ashBandits"],r:["emberDagger","scorpionMail","griffinLance"],shop:[]},
    frostgate:{n:"Frostgate Pass",i:"❄️",sub:"Locked northern pass",x:48,y:4,lock:"ironRoads",d:"Rare finite ore and Frost Warden.",a:["rareSilverVein","frostWarden"],r:[],shop:[]},
    elderwoods:{n:"Elder Woods",i:"🦅",sub:"Locked ancient forest",x:96,y:39,lock:"callOfElders",d:"Elder trees and Griffin boss.",a:["elderTree","griffinNest"],r:[],shop:[]},
    scorpionPit:{n:"Scorpion Pit",i:"🦂",sub:"Locked western hollow",x:4,y:62,lock:"stingAndStone",d:"Scorpion boss component zone.",a:["scorpionMatriarch"],r:["emberDagger","scorpionMail"],shop:[]},
    reefwatch:{n:"Reefwatch",i:"🐚",sub:"Locked reef outpost",x:69,y:94,lock:"reefPass",d:"Reef boss and advanced fishing.",a:["reefSerpent","shoreBass"],r:[],shop:[]}
  },
  roads: [["kingswatch","irondeep"],["kingswatch","greenhaven"],["kingswatch","saltshore"],["kingswatch","emberfall"],["irondeep","frostgate"],["greenhaven","elderwoods"],["emberfall","scorpionPit"],["saltshore","reefwatch"]],
  activities: {
    oakTrees:{n:"Cut Oak Trees",i:"🪓",cat:"Gathering",type:"resource",s:"woodcutting",tool:"crudeAxe",sec:6,xp:8,out:[["oakLog",1,1,1],["forestEgg",1,1,.0008]],d:"Reliable logs."},
    elderTree:{n:"Cut Elder Tree",i:"🌳",cat:"Rare Resource",type:"finite",s:"woodcutting",tool:"copperAxe",sec:18,xp:35,out:[["elderLog",1,2,1],["forestEgg",1,1,.004]],d:"Finite rare tree."},
    wildGathering:{n:"Gather Wild Materials",i:"🌿",cat:"Gathering",type:"resource",s:"gathering",sec:5,xp:7,out:[["stickBundle",1,2,.85],["flax",1,1,.35]],d:"General gathering."},
    flaxField:{n:"Harvest Flax",i:"🌱",cat:"Gathering",type:"resource",s:"gathering",sec:7,xp:10,out:[["flax",1,2,1]],d:"Fiber gathering."},
    cottonPatch:{n:"Pick Cotton",i:"☁️",cat:"Gathering",type:"resource",s:"gathering",sec:12,xp:18,out:[["cotton",1,2,1]],d:"Higher fiber."},
    shoreReeds:{n:"Gather Shore Reeds",i:"🌾",cat:"Gathering",type:"resource",s:"gathering",sec:6,xp:8,out:[["stickBundle",1,3,1]],d:"Reeds."},
    copperOutcrop:{n:"Mine Copper Outcrop",i:"🟠",cat:"Gathering",type:"resource",s:"mining",tool:"crackedPickaxe",sec:7,xp:9,out:[["copperOre",1,1,1]],d:"Copper ore."},
    ironVein:{n:"Mine Iron Vein",i:"⛏️",cat:"Gathering",type:"resource",s:"mining",tool:"crackedPickaxe",sec:8,xp:12,out:[["ironOre",1,1,1]],d:"Iron ore."},
    rareSilverVein:{n:"Mine Silver Vein",i:"⚪",cat:"Rare Resource",type:"finite",s:"mining",tool:"copperPickaxe",sec:16,xp:30,out:[["silverOre",1,1,1]],d:"Finite rare ore."},
    riverMinnows:{n:"Fish River Minnows",i:"🎣",cat:"Gathering",type:"resource",s:"fishing",tool:"reedRod",sec:7,xp:9,out:[["riverMinnow",1,2,.9]],d:"Basic fish."},
    shoreBass:{n:"Fish Shore Bass",i:"🐠",cat:"Gathering",type:"resource",s:"fishing",tool:"reedRod",sec:12,xp:20,out:[["shoreBass",1,1,.85]],d:"Better fish."},
    cityRats:{n:"Fight City Rats",i:"🐀",cat:"Combat",type:"combat",s:"melee",enemy:"cityRat",sec:9,xp:11,gold:[2,5],out:[["ratCarcass",1,1,.7]],follow:"processRats",d:"Starter combat."},
    mountainRats:{n:"Fight Mountain Rats",i:"🐀",cat:"Combat",type:"combat",s:"melee",enemy:"mountainRat",sec:10,xp:13,gold:[3,6],out:[["ratCarcass",1,2,.75]],follow:"processRats",d:"Hardier rats."},
    goblinScouts:{n:"Fight Goblin Scouts",i:"👺",cat:"Combat",type:"combat",s:"ranged",enemy:"goblinScout",sec:12,xp:14,gold:[5,11],out:[["stickBundle",1,2,.45],["goblinEar",1,1,.15]],d:"Ranged target."},
    ashBandits:{n:"Fight Ash Bandits",i:"🥷",cat:"Combat",type:"combat",s:"melee",enemy:"ashBandit",sec:14,xp:18,gold:[8,18],out:[["smallBone",1,2,.2],["ashCharm",1,1,.08]],d:"Western combat."},
    reefSerpent:{n:"Slay Reef Serpent",i:"🐍",cat:"Boss",type:"boss",s:"ranged",enemy:"reefSerpent",sec:140,xp:120,gold:[70,150],out:[["venomGland",1,2,.4],["shoreBass",2,6,.8]],d:"Reef boss."},
    scorpionMatriarch:{n:"Scorpion Matriarch",i:"🦂",cat:"Boss",type:"boss",s:"melee",enemy:"scorpionMatriarch",sec:180,xp:180,gold:[80,160],out:[["scorpionTail",1,1,.4],["venomGland",1,2,.35]],d:"Boss component source."},
    frostWarden:{n:"Frost Warden",i:"❄️",cat:"Boss",type:"boss",s:"magic",enemy:"frostWarden",sec:220,xp:220,gold:[100,220],out:[["silverOre",2,6,.8],["ashCharm",1,2,.25]],d:"Magic boss."},
    griffinNest:{n:"Griffin Nest",i:"🦅",cat:"Boss",type:"boss",s:"melee",enemy:"griffin",sec:300,xp:300,gold:[120,280],out:[["griffinFeather",1,2,.35],["griffinBeak",1,1,.08],["forestEgg",1,1,.025]],mount:.001,d:"1/1000 bonded Griffin chance."},
    processRats:{n:"Process Rat Carcasses",i:"🔪",cat:"Processing",type:"processing",s:"processing",tool:"fieldKnife",sec:5,xp:6,in:[["ratCarcass",1]],out:[["ratHide",1,1,.8],["smallBone",1,2,.65],["ratTooth",1,1,.08]],d:"Carcass processing."}
  }
};

let S = load();
let tab = "map";
let selectedCity = "kingswatch";
let tick = null;

const app = document.getElementById("app");
const now = () => Date.now();
const I = id => DATA.items[id] || {n:id,i:"◼️",p:0,d:"Unknown."};
const A = id => DATA.activities[id];
const C = id => DATA.cities[id];
const E = id => DATA.enemies[id];
const R = id => DATA.recipes[id];
const q = (bag,id) => Number((bag || {})[id] || 0);
const inc = (bag,id,n) => { bag[id] = Number(bag[id] || 0) + n; if (bag[id] <= 0) delete bag[id]; };
const rand = (a,b) => a + Math.floor(Math.random() * (b - a + 1));
const lvl = xp => Math.max(1, Math.floor(Math.sqrt((xp || 0) / 45)) + 1);
const nextXp = l => l*l*45;
const fmt = ms => { ms=Math.max(0,Math.floor(ms)); const s=Math.floor(ms/1000),h=Math.floor(s/3600),m=Math.floor((s%3600)/60),sec=s%60; return h?`${h}h ${m}m`:m?`${m}m ${sec}s`:`${sec}s`; };
const skillName = id => DATA.skills[id] ? `${DATA.skills[id][0]} ${title(id)}` : id;
const title = s => String(s).replace(/([A-Z])/g," $1").replace(/^./,c=>c.toUpperCase());

function load(){ try { return JSON.parse(localStorage.getItem(SAVE_KEY)); } catch { return null; } }
function save(){ S.updatedAt = now(); localStorage.setItem(SAVE_KEY, JSON.stringify(S)); }
function log(text){ S.log = [...(S.log||[]), {at:now(), text}].slice(-160); }
function toast(msg){ document.querySelector(".toast")?.remove(); const d=document.createElement("div"); d.className="toast"; d.textContent=msg; document.body.appendChild(d); setTimeout(()=>d.remove(),2300); }
function stamp(){ return `<div class="build"><b>Alpha ${VERSION}</b><span>Fixed content renderer · ${BUILD_ID}</span></div>`; }
function esc(str){ return String(str).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c])); }

function blankSkills(){ return Object.fromEntries(Object.keys(DATA.skills).map(id => [id, {xp:0, tree:[]}])) }
function createSave(expedition, adventurer){
  S = {
    expedition:{name:expedition.trim() || "The Iron Wolves"},
    adventurers:[{id:"a1", name:adventurer.trim() || "Rowan", location:"kingswatch", travel:null}],
    activeAction:null,
    queue:[],
    inventory:{crudeAxe:1, crackedPickaxe:1, reedRod:1, fieldKnife:1, trainingSword:1},
    bank:{},
    equipment:{weapon:null, body:null, tool:null, mount:null, pet:null},
    gold:50,
    hp:30,
    hardened:true,
    marketUsed:false,
    royalUntil:0,
    completedQuests:[],
    skills:blankSkills(),
    pets:[],
    mounts:{},
    log:[{at:now(), text:"Expedition founded in Kingswatch."}]
  };
  save();
}

function maxHp(){ return 30 + Math.floor((lvl(S.skills.melee.xp)+lvl(S.skills.ranged.xp)+lvl(S.skills.magic.xp))/3)*3; }
function royal(){ return S.royalUntil && S.royalUntil > now(); }
function owned(id){ return q(S.inventory,id)+q(S.bank,id)+Object.values(S.equipment).filter(v=>v===id).length; }

function resolve(){
  if(!S || !S.activeAction) return {actions:0,msg:"No active action."};
  const active = S.activeAction;
  const act = A(active.actId);
  if(!act){ S.activeAction=null; save(); return {actions:0,msg:"Unknown action removed."}; }
  if(active.startedAt > now()) return {actions:0,msg:"Traveling."};
  const possible = Math.floor(Math.min(now()-active.startedAt, 8*60*60*1000) / (act.sec*1000));
  if(possible <= 0) return {actions:0,msg:"No completed actions yet."};

  let actual=0, defeated=false, food=0, bonded=false;
  S.hp = S.hp || maxHp();

  for(let i=0;i<possible;i++){
    if(act.in){
      if(act.in.some(([id,n]) => q(S.inventory,id) < n)) break;
      act.in.forEach(([id,n]) => inc(S.inventory,id,-n));
    }

    if(act.type === "combat" || act.type === "boss"){
      const f = fight(act);
      food += f.food;
      if(!f.win){ defeated=true; break; }
      const enemy = E(act.enemy);
      if(enemy) S.skills.monsterMastery.xp += enemy.mxp || 1;
      if(act.mount && Math.random() < act.mount){
        inc(S.inventory,"bondedGriffin",1);
        S.mounts.bondedGriffin = {at:now(), bound:true};
        bonded=true;
      }
    }

    actual++;
  }

  if(actual <= 0){
    S.activeAction = null;
    log(defeated ? `${act.n} stopped: defeated.` : `${act.n} stopped: out of resources.`);
    save();
    return {actions:0,msg:defeated ? "Stopped: defeated." : "Stopped: out of resources."};
  }

  for(let i=0;i<actual;i++){
    if(act.gold) S.gold += rand(act.gold[0], act.gold[1]);
    (act.out || []).forEach(([id,min,max,ch]) => { if(Math.random() <= ch) inc(S.inventory,id,rand(min,max)); });
  }
  S.skills[act.s].xp += act.xp * actual;
  if(bonded) log("LEGENDARY: A Griffin bonded as your mount.");

  const hardStop = now() - active.startedAt >= 8*60*60*1000;
  if(defeated || hardStop){
    S.activeAction = null;
    log(`${act.n}: resolved ${actual} actions${food ? `, consumed ${food} food` : ""}${defeated ? ", stopped after defeat" : ", stopped at 8 hours"}.`);
    save();
    return {actions:actual,msg:`Resolved ${actual}. ${defeated ? "Defeated." : "8-hour stop."}`};
  }

  S.activeAction.startedAt = active.startedAt + actual * act.sec * 1000;
  log(`${act.n}: resolved ${actual} actions${food ? `, consumed ${food} food` : ""}.`);
  save();
  return {actions:actual,msg:`Resolved ${actual} actions.`};
}

function fight(act){
  const enemy = E(act.enemy);
  if(!enemy) return {win:true,food:0};
  const weapon = I(S.equipment.weapon);
  const armor = I(S.equipment.body);
  const skillLevel = lvl(S.skills[act.s].xp);
  let hp = S.hp || maxHp();
  let enemyHp = enemy.hp;
  let food = 0;
  for(let r=0;r<90 && hp>0 && enemyHp>0;r++){
    const hitChance = Math.min(92, 55 + skillLevel*1.2 + (weapon.acc||0) - enemy.def*.8);
    if(Math.random()*100 < hitChance) enemyHp -= rand(1, Math.max(2, Math.floor((skillLevel+(weapon.pow||1))*1.5)));
    if(enemyHp <= 0) break;
    if(Math.random()*100 < Math.max(15, enemy.acc - ((armor.def||0) + skillLevel*.5))){
      hp -= Math.max(1, rand(enemy.dmg[0],enemy.dmg[1]) - Math.floor((armor.def||0)/6));
    }
    const foodId = q(S.inventory,"grilledBass") ? "grilledBass" : q(S.inventory,"cookedMinnow") ? "cookedMinnow" : null;
    if(hp > 0 && hp <= Math.floor(maxHp()*.35) && foodId){
      inc(S.inventory,foodId,-1);
      hp = Math.min(maxHp(), hp + (I(foodId).heal || 8));
      food++;
    }
  }
  if(hp <= 0){ S.hp = Math.ceil(maxHp()*.35); return {win:false,food}; }
  S.hp = Math.min(maxHp(), hp+1);
  return {win:true,food};
}

function validateStart(cityId, actId){
  const city = C(cityId), act = A(actId);
  if(!city || !act || !city.a.includes(actId)) return "Invalid activity.";
  if(city.lock && !S.completedQuests.includes(city.lock)) return "Area locked by quest.";
  if(act.tool && !owned(act.tool)) return `Requires ${I(act.tool).n}.`;
  if((act.type === "combat" || act.type === "boss") && !S.equipment.weapon) return "Equip a weapon before combat.";
  if(act.in && act.in.some(([id,n]) => q(S.inventory,id) < n)) return "Missing input resources.";
  return null;
}

function startAction(cityId, actId){
  resolve();
  const err = validateStart(cityId, actId);
  if(err){ toast(err); return; }
  if(S.activeAction){
    if(!royal()){ toast("Royal Charter required to queue next action."); return; }
    S.queue = [{cityId, actId}];
    save(); toast("Queued next action."); render(); return;
  }
  const adv = S.adventurers[0];
  const from = adv.location || "kingswatch";
  const mount = I(S.equipment.mount);
  const mult = mount.speed || 1;
  const travel = from === cityId ? 0 : Math.floor(45000 * mult);
  adv.travel = travel ? {from, to:cityId, departAt:now(), arriveAt:now()+travel} : null;
  adv.location = cityId;
  S.activeAction = {cityId, actId, adventurerId:adv.id, requestedAt:now(), startedAt:now()+travel};
  log(`${adv.name} started ${A(actId).n}${travel ? ` and is traveling to ${C(cityId).n}` : ""}.`);
  save();
  toast("Action started.");
  render();
}

function craft(recipeId){
  resolve();
  const recipe = R(recipeId);
  const city = C(selectedCity);
  if(!recipe || !city.r.includes(recipeId)){ toast("Recipe not available here."); return; }
  if(lvl(S.skills[recipe.s].xp) < recipe.lvl){ toast(`Requires ${skillName(recipe.s)} ${recipe.lvl}.`); return; }
  for(const [id,n] of recipe.in){
    if(q(S.inventory,id)+q(S.bank,id) < n){ toast(`Need ${n} ${I(id).n}.`); return; }
  }
  for(const [id,n] of recipe.in){
    let left = n;
    const fromInv = Math.min(left, q(S.inventory,id));
    if(fromInv){ inc(S.inventory,id,-fromInv); left -= fromInv; }
    if(left) inc(S.bank,id,-left);
  }
  recipe.out.forEach(([id,n]) => inc(S.inventory,id,n));
  S.skills[recipe.s].xp += recipe.xp;
  log(`Crafted ${recipe.n}.`);
  save(); toast("Crafted."); render();
}

function equip(id){
  const it = I(id);
  if(!it.slot){ toast("Cannot equip."); return; }
  if(q(S.inventory,id)>0) inc(S.inventory,id,-1);
  else if(q(S.bank,id)>0) inc(S.bank,id,-1);
  else { toast("Not owned."); return; }
  const old = S.equipment[it.slot];
  if(old) inc(S.inventory,old,1);
  S.equipment[it.slot] = id;
  log(`Equipped ${it.n}.`);
  save(); toast("Equipped."); render();
}

function unequip(slot){
  const old = S.equipment[slot];
  if(!old) return;
  inc(S.inventory,old,1);
  S.equipment[slot] = null;
  log(`Unequipped ${I(old).n}.`);
  save(); render();
}

function depositAll(){
  resolve();
  Object.entries(S.inventory).forEach(([id,n]) => inc(S.bank,id,n));
  S.inventory = {};
  log("Deposited all inventory items.");
  save(); render();
}

function buy(id, source="shop"){
  const it = I(id);
  if(source==="market" && S.hardened && id!=="kingsSeal"){
    S.hardened = false;
    S.marketUsed = true;
    log("Hardened lost by buying gameplay item from market.");
  }
  if(S.gold < (it.p||0)){ toast("Not enough gold."); return; }
  S.gold -= it.p || 0;
  inc(S.inventory,id,1);
  log(`Bought ${it.n}.`);
  save(); toast("Bought."); render();
}

function sell(id){
  const it = I(id);
  if(it.bound){ toast("Bound item cannot be sold."); return; }
  if(q(S.inventory,id)<=0){ toast("Item must be in inventory."); return; }
  inc(S.inventory,id,-1);
  const price = Math.max(1, Math.floor((it.p||1) * (royal() ? .97 : .94)));
  S.gold += price;
  log(`Sold ${it.n} for ${price} gold.`);
  save(); toast("Sold."); render();
}

function completeQuest(id){
  const quest = DATA.quests[id];
  if(!quest || S.completedQuests.includes(id)) return;
  for(const [sid,req] of Object.entries(quest.req)){
    if(lvl(S.skills[sid].xp) < req){ toast(`Requires ${skillName(sid)} ${req}.`); return; }
  }
  S.completedQuests.push(id);
  log(`Completed quest: ${quest.n}.`);
  save(); toast("Quest complete."); render();
}

function openSeal(){
  if(q(S.inventory,"kingsSeal")>0) inc(S.inventory,"kingsSeal",-1);
  else if(q(S.bank,"kingsSeal")>0) inc(S.bank,"kingsSeal",-1);
  else { toast("No King's Seal."); return; }
  S.royalUntil = Math.min(Math.max(now(), S.royalUntil || 0) + 30*86400000, now()+300*86400000);
  log("Opened King's Seal. Royal Charter extended.");
  save(); render();
}

function hatchEgg(){
  if(q(S.inventory,"forestEgg")<=0){ toast("No forest egg."); return; }
  inc(S.inventory,"forestEgg",-1);
  const species = ["Fox","Owl","Wolf Pup","Mossling"][rand(0,3)];
  const albino = Math.random() < .01;
  const pet = {id:"pet_"+now(), species, albino, ability:["Forager","Scrapper","Lucky","Guardian"][rand(0,3)], stats:{vigor:rand(30,85), luck:rand(30,85), bond:rand(30,85)}, at:now()};
  S.pets.push(pet);
  log(`Hatched ${albino ? "ALBINO " : ""}${species} with ${pet.ability}.`);
  save(); toast("Egg hatched."); render();
}

function render(){
  try {
    if(!S){ renderLogin(); return; }
    resolve();
    renderShell();
    clearInterval(tick);
    tick = setInterval(live,1000);
    live();
  } catch(err) {
    console.error(err);
    app.innerHTML = `<section class="login"><div class="loginCard"><h1>Render Error</h1><p>${esc(err.message)}</p>${stamp()}<button class="danger" id="wipe">Reset local save</button></div></section>`;
    document.getElementById("wipe").onclick = () => { localStorage.removeItem(SAVE_KEY); S=null; render(); };
  }
}

function renderLogin(){
  app.innerHTML = `<section class="login"><div class="loginCard"><div class="bootMark">👑</div><h1>Idle Legends Manager</h1><p>Fixed local content build. Core gameplay is playable now; custom art assets are the main missing visual layer.</p>${stamp()}<input id="exp" class="field" value="The Iron Wolves" placeholder="Expedition name"/><input id="adv" class="field" value="Rowan" placeholder="First adventurer"/><button id="begin" class="primary">Create Expedition</button></div></section>`;
  document.getElementById("begin").onclick = () => { createSave(document.getElementById("exp").value, document.getElementById("adv").value); render(); };
}

function renderShell(){
  app.innerHTML = `<div class="shell"><header class="top"><div class="crest">👑</div><div class="title"><b>${esc(S.expedition.name)}</b><span>${S.hardened ? "🛡️ Hardened" : "Market Expedition"}${royal() ? " · 👑 Royal" : ""} · v${VERSION}</span></div><div class="topRight"><span class="pill">🪙 ${S.gold}</span><span class="pill">❤️ ${S.hp||maxHp()}/${maxHp()}</span></div></header><main class="screen" id="screen"></main>${renderNav()}<div id="dock"></div></div>`;
  document.querySelectorAll(".nav button").forEach(btn => btn.onclick = () => { tab = btn.dataset.tab; renderShell(); });
  renderTab();
  renderDock();
}

function renderNav(){
  const tabs = [["map","🗺️","Map"],["skills","📈","Skills"],["gear","🧰","Gear"],["craft","⚒️","Craft"],["more","☰","More"]];
  return `<nav class="nav">${tabs.map(([id,icon,label]) => `<button data-tab="${id}" class="${tab===id?"active":""}"><i>${icon}</i><span>${label}</span></button>`).join("")}</nav>`;
}

function renderTab(){
  if(tab==="map") return renderMap();
  if(tab==="skills") return renderSkills();
  if(tab==="gear") return renderGear();
  if(tab==="craft") return renderCraft();
  if(tab==="more") return renderMore();
}

function renderMap(){
  const screen = document.getElementById("screen");
  screen.innerHTML = `<div class="mapFrame"><div class="map">${roadsHtml()}${citiesHtml()}${markersHtml()}<div class="marker other" style="left:36%;top:49%">🪓</div><div class="marker other" style="left:64%;top:51%">🌿</div><div class="marker other" style="left:51%;top:70%">🎣</div></div></div>${cityPanel(selectedCity)}`;
  document.querySelectorAll(".city").forEach(btn => btn.onclick = () => { selectedCity = btn.dataset.city; renderMap(); });
  bindMapButtons();
}

function roadsHtml(){
  return DATA.roads.map(([a,b]) => {
    const A=C(a), B=C(b);
    const dx=B.x-A.x, dy=B.y-A.y, len=Math.sqrt(dx*dx+dy*dy), ang=Math.atan2(dy,dx)*180/Math.PI;
    return `<div class="road" style="left:${A.x}%;top:${A.y}%;width:${len}%;transform:rotate(${ang}deg)"></div>`;
  }).join("");
}
function isLocked(id){ return !!(C(id).lock && !S.completedQuests.includes(C(id).lock)); }
function citiesHtml(){
  return Object.entries(DATA.cities).map(([id,c]) => `<button class="city ${isLocked(id)?"locked":""}" data-city="${id}" style="left:${c.x}%;top:${c.y}%"><div class="ico">${c.i}</div><b>${c.n}</b><span>${c.sub}</span></button>`).join("");
}
function pos(adv){
  if(adv.travel && adv.travel.arriveAt > now()){
    const A=C(adv.travel.from), B=C(adv.travel.to);
    const p=Math.max(0,Math.min(1,(now()-adv.travel.departAt)/(adv.travel.arriveAt-adv.travel.departAt)));
    return {x:A.x+(B.x-A.x)*p, y:A.y+(B.y-A.y)*p};
  }
  const city=C(adv.location || "kingswatch");
  return {x:city.x,y:city.y};
}
function markersHtml(){
  return S.adventurers.map(adv => { const p=pos(adv); return `<div class="marker" style="left:${p.x}%;top:${p.y}%">🧔</div>`; }).join("");
}
function cityPanel(id){
  const city=C(id);
  if(isLocked(id)){
    const quest=DATA.quests[city.lock];
    return `<section class="panel"><h2>${city.i} ${city.n}</h2><p>${city.d}</p><div class="card"><h3>🔒 Locked</h3><p>Requires quest: <b>${quest.n}</b></p><p class="muted">Origin: ${quest.origin}. Requires ${Object.entries(quest.req).map(([s,l])=>`${skillName(s)} ${l}`).join(", ")}</p></div></section>`;
  }
  return `<section class="panel"><h2>${city.i} ${city.n}</h2><p class="muted">${city.sub}</p><p>${city.d}</p><h3>Activities</h3><div class="list">${city.a.map(aid=>activityRow(aid,id)).join("")}</div>${city.r.length?`<div class="panel"><h3>Local Recipes</h3>${city.r.map(rid=>`<div class="card"><b>${R(rid).i} ${R(rid).n}</b><p class="muted">${R(rid).d}</p></div>`).join("")}</div>`:""}${city.shop.length?`<div class="panel"><h3>Local Shop</h3>${city.shop.map(shopRow).join("")}</div>`:""}</section>`;
}
function activityRow(aid,cid){
  const act=A(aid), enemy=act.enemy ? E(act.enemy) : null;
  return `<div class="row"><div class="rowMain"><b>${act.i} ${act.n}</b><span>${act.d}</span><span>${act.cat} · ${skillName(act.s)} · ${act.sec}s/action${act.tool ? ` · Needs ${I(act.tool).n}` : ""}</span>${enemy?`<span>Enemy: ${enemy.i} ${enemy.n} · HP ${enemy.hp} · Max hit ${enemy.dmg[1]}</span>`:""}</div><button class="small start" data-city="${cid}" data-act="${aid}">Start</button></div>`;
}
function shopRow(id){
  const it=I(id);
  return `<div class="row"><div class="rowMain"><b>${it.i} ${it.n}</b><span>${it.d}</span><span>${it.p} gold</span></div><button class="small shopBuy" data-item="${id}">Buy</button></div>`;
}
function bindMapButtons(){
  document.querySelectorAll(".start").forEach(btn => btn.onclick = () => startAction(btn.dataset.city, btn.dataset.act));
  document.querySelectorAll(".shopBuy").forEach(btn => btn.onclick = () => buy(btn.dataset.item,"shop"));
}

function renderDock(){
  const dock = document.getElementById("dock");
  if(!S.activeAction){ dock.innerHTML = ""; return; }
  const act=A(S.activeAction.actId);
  dock.innerHTML = `<section class="actionDock"><div class="actionHead"><div><b>${act.i} ${act.n}</b><div class="muted" id="asub">Updating...</div></div><button id="stop" class="small">Stop</button></div><div class="progress"><div class="bar" id="abar"></div></div><div class="kv"><div><b>Runtime</b><span id="runtime">-</span></div><div><b>Hard Stop</b><span>8 hours</span></div><div><b>XP/action</b><span>${act.xp} ${skillName(act.s)}</span></div><div><b>Queue</b><span>${S.queue.length ? A(S.queue[0].actId).n : "Empty"}</span></div></div><button id="collect" class="primary">Collect / Resolve</button>${act.follow ? `<button id="process" class="secondary">Process Remains Next</button>` : ""}</section>`;
  document.getElementById("stop").onclick = () => { resolve(); S.activeAction=null; log("Action stopped manually."); save(); render(); };
  document.getElementById("collect").onclick = () => { const r=resolve(); toast(r.msg); render(); };
  const p = document.getElementById("process");
  if(p) p.onclick = () => startAction(S.activeAction.cityId, act.follow);
}
function live(){
  if(!S || !S.activeAction) return;
  const act=A(S.activeAction.actId);
  const start=S.activeAction.startedAt;
  const wait=Math.max(0,start-now());
  const elapsed=Math.max(0,now()-start);
  const cycle=act.sec*1000;
  const runtime=document.getElementById("runtime"), sub=document.getElementById("asub"), bar=document.getElementById("abar");
  if(!runtime || !sub || !bar) return;
  if(wait){ runtime.textContent="Traveling"; sub.textContent=`Arrives in ${fmt(wait)}`; bar.style.width="0%"; return; }
  runtime.textContent=fmt(elapsed);
  sub.textContent=`Next action in ${fmt(cycle-(elapsed%cycle))}`;
  bar.style.width=`${(elapsed%cycle)/cycle*100}%`;
}

function renderSkills(){
  const groups = {};
  Object.entries(DATA.skills).forEach(([id,s]) => { (groups[s[1]] ||= []).push([id,s]); });
  document.getElementById("screen").innerHTML = `<section class="panel"><h2>Skills</h2><p class="muted">All core skills are present. Skill trees are gameplay identity placeholders for deeper customization.</p></section>${Object.entries(groups).map(([group,arr])=>`<section class="panel"><h2>${group}</h2><div class="grid">${arr.map(([id,s])=>skillCard(id,s)).join("")}</div></section>`).join("")}`;
}
function skillCard(id,s){
  const xp=S.skills[id].xp, l=lvl(xp), nx=nextXp(l);
  return `<div class="card"><h3>${s[0]} ${title(id)}</h3><p class="muted">Level ${l} · ${xp}/${nx} XP</p><div class="progress"><div class="bar" style="width:${Math.min(100,xp/nx*100)}%"></div></div><p>${s[2]}</p></div>`;
}

function renderGear(){
  const slots = {weapon:"Weapon",body:"Body",tool:"Active Tool",mount:"Mount",pet:"Pet"};
  const slotHtml = Object.entries(slots).map(([slot,label]) => {
    const id=S.equipment[slot];
    return `<div class="card"><h3>${label}</h3><p>${id ? `${I(id).i} ${I(id).n}` : "Empty"}</p>${id ? `<button class="small unequip" data-slot="${slot}">Unequip</button>` : ""}</div>`;
  }).join("");
  const owned = {};
  [S.inventory,S.bank].forEach(bag => Object.entries(bag).forEach(([id,n]) => owned[id]=(owned[id]||0)+n));
  const gear = Object.entries(owned).filter(([id,n]) => n>0 && I(id).slot).map(([id,n]) => `<div class="row"><div class="rowMain"><b>${I(id).i} ${I(id).n}</b><span>${I(id).d}</span><span>Owned ${n} · Slot ${I(id).slot}</span></div><button class="small equip" data-item="${id}">Equip</button></div>`).join("");
  document.getElementById("screen").innerHTML = `<section class="panel"><h2>Equipment</h2><div class="grid">${slotHtml}</div></section><section class="panel"><h2>Combat Status</h2><div class="kv"><div><b>HP</b><span>${S.hp||maxHp()}/${maxHp()}</span></div><div><b>Food</b><span>${q(S.inventory,"cookedMinnow")+q(S.inventory,"grilledBass")}</span></div><div><b>Pets</b><span>${S.pets.length}</span></div><div><b>Mounts</b><span>${Object.keys(S.mounts).length}</span></div></div></section><section class="panel"><h2>Equip Items</h2><div class="list">${gear || "<p class='muted'>No gear available.</p>"}</div></section><section class="panel"><h2>Inventory</h2><div class="grid">${itemGrid(S.inventory)}</div><button id="deposit" class="primary">Deposit All</button></section><section class="panel"><h2>Bank</h2><div class="grid">${itemGrid(S.bank)}</div></section>`;
  document.querySelectorAll(".equip").forEach(btn => btn.onclick = () => equip(btn.dataset.item));
  document.querySelectorAll(".unequip").forEach(btn => btn.onclick = () => unequip(btn.dataset.slot));
  document.querySelectorAll("[data-view-item]").forEach(btn => btn.onclick = () => showItem(btn.dataset.viewItem));
  document.getElementById("deposit").onclick = depositAll;
}
function itemGrid(bag){
  const entries=Object.entries(bag||{}).filter(([,n])=>n>0);
  return entries.length ? entries.map(([id,n]) => `<button class="card" data-view-item="${id}"><h3>${I(id).i} ${I(id).n}</h3><p class="muted">x${n}</p></button>`).join("") : "<p class='muted'>Empty</p>";
}
function showItem(id){
  const it=I(id);
  modal(`<h2>${it.i} ${it.n}</h2><p class="muted">${it.t || "item"}</p><p>${it.d}</p><p>Value: ${it.p || 0} gold</p>${q(S.inventory,id)>0 ? `<button class="secondary" id="sellOne">Sell one</button>` : ""}`);
  const sellBtn=document.getElementById("sellOne");
  if(sellBtn) sellBtn.onclick = () => { sell(id); document.querySelector(".modalShade")?.remove(); };
}

function renderCraft(){
  const city=C(selectedCity);
  const rows=city.r.map(rid => recipeRow(rid)).join("");
  document.getElementById("screen").innerHTML = `<section class="panel"><h2>Crafting</h2><p class="muted">Crafting is location based. Current city: <b>${city.n}</b>. Select another city on the map to change stations.</p></section><section class="panel"><h2>${city.i} ${city.n} Recipes</h2><div class="list">${rows || "<p class='muted'>No recipes here.</p>"}</div></section>`;
  document.querySelectorAll(".craft").forEach(btn => btn.onclick = () => craft(btn.dataset.recipe));
}
function recipeRow(id){
  const r=R(id);
  const canLevel = lvl(S.skills[r.s].xp) >= r.lvl;
  const hasInputs = r.in.every(([itemId,n]) => q(S.inventory,itemId)+q(S.bank,itemId) >= n);
  return `<div class="row"><div class="rowMain"><b>${r.i} ${r.n}</b><span>${r.d}</span><span>${skillName(r.s)} ${r.lvl} · ${r.xp} XP · ${r.loc}</span><span>Needs ${r.in.map(([i,n])=>`${n} ${I(i).n}`).join(", ")} → ${r.out.map(([i,n])=>`${n} ${I(i).n}`).join(", ")}</span></div><button class="small craft" data-recipe="${id}" ${(!canLevel || !hasInputs) ? "disabled" : ""}>${!canLevel ? "Level" : !hasInputs ? "Items" : "Craft"}</button></div>`;
}

function renderMore(){
  document.getElementById("screen").innerHTML = `<section class="panel"><h2>Expedition</h2>${stamp()}<p><b>${esc(S.expedition.name)}</b></p><p class="muted">${S.hardened ? "🛡️ Hardened" : "Market Expedition"} · Royal: ${royal() ? fmt(S.royalUntil-now()) : "Inactive"}</p><button id="seal" class="secondary">Open King's Seal</button><button id="reset" class="danger">Reset Local Save</button></section><section class="panel"><h2>Area Quests</h2><div class="list">${Object.entries(DATA.quests).map(([id,quest]) => questRow(id,quest)).join("")}</div></section><section class="panel"><h2>Grand Market</h2><p>Direct trading is rejected. All trade goes through the market. Buying gameplay items removes Hardened. King's Seals are exempt.</p><div class="grid">${["kingsSeal","oakLog","copperOre","cookedMinnow","ratHide","scorpionTail","forestEgg"].map(marketCard).join("")}</div></section><section class="panel"><h2>Pets & Eggs</h2><button id="hatch" class="primary">Hatch Forest Egg</button><div class="grid">${S.pets.length ? S.pets.map(petCard).join("") : "<p class='muted'>No pets yet.</p>"}</div></section><section class="panel"><h2>Expedition Log</h2><div class="list">${(S.log||[]).slice(-30).reverse().map(l => `<div class="card"><b>${new Date(l.at).toLocaleString()}</b><p>${esc(l.text)}</p></div>`).join("")}</div></section>`;
  document.getElementById("seal").onclick = openSeal;
  document.getElementById("hatch").onclick = hatchEgg;
  document.getElementById("reset").onclick = () => { if(confirm("Reset local save?")){ localStorage.removeItem(SAVE_KEY); S=null; render(); } };
  document.querySelectorAll(".quest").forEach(btn => btn.onclick = () => completeQuest(btn.dataset.quest));
  document.querySelectorAll(".marketBuy").forEach(btn => btn.onclick = () => buy(btn.dataset.item,"market"));
}
function questRow(id,quest){
  const done=S.completedQuests.includes(id);
  const can=Object.entries(quest.req).every(([sid,req]) => lvl(S.skills[sid].xp) >= req);
  return `<div class="row"><div class="rowMain"><b>${done ? "✅" : "📜"} ${quest.n}</b><span>${quest.d}</span><span>Origin ${quest.origin} · Unlocks ${quest.unlock} · Requires ${Object.entries(quest.req).map(([s,l])=>`${skillName(s)} ${l}`).join(", ")}</span></div><button class="small quest" data-quest="${id}" ${done || !can ? "disabled" : ""}>${done ? "Done" : can ? "Complete" : "Locked"}</button></div>`;
}
function marketCard(id){
  const it=I(id);
  return `<div class="card"><h3>${it.i} ${it.n}</h3><p>${it.d}</p><p class="muted">${it.p} gold</p><button class="small marketBuy" data-item="${id}">Buy</button></div>`;
}
function petCard(p){
  return `<div class="card"><h3>${p.albino ? "✨ " : ""}${p.species}</h3><p>${p.ability}</p><p class="muted">Vigor ${p.stats.vigor} · Luck ${p.stats.luck} · Bond ${p.stats.bond}</p></div>`;
}

function modal(html){
  const d=document.createElement("div");
  d.className="modalShade";
  d.innerHTML=`<div class="modal">${html}<button class="primary close">Close</button></div>`;
  document.body.appendChild(d);
  d.querySelector(".close").onclick=()=>d.remove();
}

render();
})();