const { onCall, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const GAME = require("./serverGameData.js");

admin.initializeApp();
const db = admin.firestore();

const now = () => Date.now();
const userRef = (uid) => db.collection("users").doc(uid);
const requireUid = (req) => {
  if (!req.auth) throw new HttpsError("unauthenticated", "Login required.");
  return req.auth.uid;
};
const levelFromXp = (xp=0) => Math.max(1, Math.floor(Math.sqrt(xp / 45)) + 1);
const has = (bag,id,qty=1) => Number(bag?.[id] || 0) >= qty;
const inc = (bag,id,qty) => {
  bag[id] = Number(bag[id] || 0) + qty;
  if (bag[id] <= 0) delete bag[id];
};
const rand = (min,max) => min + Math.floor(Math.random() * (max - min + 1));
const addLog = (state,text) => {
  state.log = [...(state.log || []), { at: now(), text }].slice(-100);
};

function initialSkills(){
  return Object.fromEntries(Object.keys(GAME.skills).map(id => [id, { xp: 0 }]));
}

function validateName(name, min, max, label){
  if (typeof name !== "string") throw new HttpsError("invalid-argument", `${label} is required.`);
  const v = name.trim();
  if (v.length < min || v.length > max) throw new HttpsError("invalid-argument", `${label} must be ${min}-${max} characters.`);
  if (!/^[a-zA-Z0-9 '\-]+$/.test(v)) throw new HttpsError("invalid-argument", `${label} contains invalid characters.`);
  return v;
}

function rollRewards(activity, actions){
  const items = {};
  let gold = 0;
  for (let i = 0; i < actions; i++){
    if (activity.goldMin) gold += rand(activity.goldMin, activity.goldMax);
    for (const o of activity.outputs || []){
      if (Math.random() <= o.chance) inc(items, o.item, rand(o.min, o.max));
    }
  }
  return { items, gold };
}

function resolveActiveAction(state){
  const active = state.activeAction;
  if (!active) return { actions: 0, stopped: false, message: "No active action." };

  const activity = GAME.activities[active.activityId];
  if (!activity) {
    state.activeAction = null;
    addLog(state, "Unknown action removed.");
    return { actions: 0, stopped: true, message: "Unknown action stopped." };
  }

  const effectiveNow = now();
  if (active.startedAt > effectiveNow) return { actions: 0, stopped: false, message: "Traveling." };

  const elapsed = Math.min(effectiveNow - active.startedAt, GAME.maxActionMs);
  let possibleActions = Math.floor(elapsed / (activity.actionSeconds * 1000));
  if (possibleActions <= 0) return { actions: 0, stopped: false, message: "No completed actions yet." };

  state.inventory = state.inventory || {};
  state.bank = state.bank || {};
  state.skills = state.skills || initialSkills();

  let actual = 0;
  for (let i = 0; i < possibleActions; i++){
    if (activity.inputs?.length) {
      const canPay = activity.inputs.every(input => has(state.inventory, input.item, input.qty));
      if (!canPay) break;
      for (const input of activity.inputs) inc(state.inventory, input.item, -input.qty);
    }
    actual++;
  }

  if (actual <= 0) {
    state.activeAction = null;
    addLog(state, `${activity.name} stopped: out of resources.`);
    return { actions: 0, stopped: true, message: "Stopped: out of resources." };
  }

  const rewards = rollRewards(activity, actual);
  for (const [itemId, amount] of Object.entries(rewards.items)) inc(state.inventory, itemId, amount);
  state.gold = Number(state.gold || 0) + rewards.gold;

  state.skills[activity.skill] = state.skills[activity.skill] || { xp: 0 };
  state.skills[activity.skill].xp = Number(state.skills[activity.skill].xp || 0) + activity.xp * actual;

  const hardStop = effectiveNow - active.startedAt >= GAME.maxActionMs;
  if (hardStop) {
    state.activeAction = null;
    addLog(state, `${activity.name} ran for 8 hours and stopped automatically.`);
    return { actions: actual, stopped: true, message: `Resolved ${actual} actions. Action stopped at 8 hours.` };
  }

  state.activeAction.startedAt = active.startedAt + actual * activity.actionSeconds * 1000;
  addLog(state, `${activity.name}: resolved ${actual} actions.`);
  return { actions: actual, stopped: false, message: `Resolved ${actual} actions.` };
}


function takeItems(state, inputs){
  state.inventory = state.inventory || {};
  state.bank = state.bank || {};
  for (const input of inputs) {
    const total = Number(state.inventory[input.item] || 0) + Number(state.bank[input.item] || 0);
    if (total < input.qty) {
      const name = GAME.items[input.item]?.name || input.item;
      throw new HttpsError("failed-precondition", `Requires ${input.qty} ${name}.`);
    }
  }
  for (const input of inputs) {
    let remaining = input.qty;
    const fromInventory = Math.min(remaining, Number(state.inventory[input.item] || 0));
    if (fromInventory) {
      inc(state.inventory, input.item, -fromInventory);
      remaining -= fromInventory;
    }
    if (remaining) inc(state.bank, input.item, -remaining);
  }
}

function giveItems(state, outputs){
  state.inventory = state.inventory || {};
  for (const output of outputs) inc(state.inventory, output.item, output.qty);
}

function validateCanStart(state, cityId, activityId){
  const city = GAME.cities[cityId];
  const activity = GAME.activities[activityId];

  if (!city) throw new HttpsError("invalid-argument", "Unknown city.");
  if (!activity) throw new HttpsError("invalid-argument", "Unknown activity.");
  if (!city.activities.includes(activityId)) throw new HttpsError("failed-precondition", "That activity is not available here.");

  if (city.lockedBy && !(state.completedQuests || []).includes(city.lockedBy)) {
    throw new HttpsError("failed-precondition", "Area is locked by a quest.");
  }

  if (activity.requiredTool && !has(state.inventory, activity.requiredTool) && !has(state.bank, activity.requiredTool)) {
    const tool = GAME.items[activity.requiredTool]?.name || activity.requiredTool;
    throw new HttpsError("failed-precondition", `Requires ${tool}.`);
  }

  if (activity.inputs?.length) {
    for (const input of activity.inputs){
      if (!has(state.inventory, input.item, input.qty)) {
        const item = GAME.items[input.item]?.name || input.item;
        throw new HttpsError("failed-precondition", `Requires ${input.qty} ${item}.`);
      }
    }
  }

  return { city, activity };
}

exports.createExpedition = onCall({ region: "us-central1" }, async (req) => {
  const uid = requireUid(req);
  const expeditionName = validateName(req.data?.expeditionName, 3, 28, "Expedition name");
  const adventurerName = validateName(req.data?.adventurerName, 2, 20, "Adventurer name");

  const ref = userRef(uid);
  await db.runTransaction(async tx => {
    const existing = await tx.get(ref);
    if (existing.exists) throw new HttpsError("already-exists", "Expedition already exists.");

    tx.set(ref, {
      ownerId: uid,
      createdAt: now(),
      updatedAt: now(),
      expedition: {
        name: expeditionName,
        banner: { color: "gold", symbol: "wolf", trim: "bronze" }
      },
      adventurers: [
        { id: "a1", name: adventurerName, location: "kingswatch", travel: null }
      ],
      activeAction: null,
      gold: 50,
      inventory: { ...GAME.starterInventory },
      bank: {},
      equipment: { ...GAME.starterEquipment },
      skills: initialSkills(),
      completedQuests: [],
      hardened: true,
      royalUntil: 0,
      log: [{ at: now(), text: "Expedition founded in Kingswatch." }]
    });
  });

  return { ok: true };
});

exports.startActivity = onCall({ region: "us-central1" }, async (req) => {
  const uid = requireUid(req);
  const { cityId, activityId, adventurerId } = req.data || {};
  if (typeof cityId !== "string" || typeof activityId !== "string") throw new HttpsError("invalid-argument", "Invalid request.");

  const ref = userRef(uid);
  await db.runTransaction(async tx => {
    const snap = await tx.get(ref);
    if (!snap.exists) throw new HttpsError("not-found", "Create expedition first.");
    const state = snap.data();

    resolveActiveAction(state);
    const { city, activity } = validateCanStart(state, cityId, activityId);

    const adv = state.adventurers.find(a => a.id === adventurerId) || state.adventurers[0];
    const from = adv.location || "kingswatch";
    const travelMs = from === cityId ? 0 : 45 * 1000;

    adv.travel = travelMs ? { from, to: cityId, departAt: now(), arriveAt: now() + travelMs } : null;
    adv.location = cityId;

    state.activeAction = {
      activityId,
      cityId,
      adventurerId: adv.id,
      requestedAt: now(),
      startedAt: now() + travelMs
    };

    state.updatedAt = now();
    addLog(state, `${adv.name} started ${activity.name}${travelMs ? ` and is traveling from ${GAME.cities[from].name} to ${city.name}` : ""}.`);
    tx.set(ref, state);
  });

  return { ok: true };
});

exports.collectActivity = onCall({ region: "us-central1" }, async (req) => {
  const uid = requireUid(req);
  const ref = userRef(uid);
  let message = "No active action.";

  await db.runTransaction(async tx => {
    const snap = await tx.get(ref);
    if (!snap.exists) throw new HttpsError("not-found", "Create expedition first.");
    const state = snap.data();
    const result = resolveActiveAction(state);
    message = result.message;
    state.updatedAt = now();
    tx.set(ref, state);
  });

  return { ok: true, message };
});

exports.stopActivity = onCall({ region: "us-central1" }, async (req) => {
  const uid = requireUid(req);
  const ref = userRef(uid);

  await db.runTransaction(async tx => {
    const snap = await tx.get(ref);
    if (!snap.exists) throw new HttpsError("not-found", "Create expedition first.");
    const state = snap.data();
    resolveActiveAction(state);
    state.activeAction = null;
    state.updatedAt = now();
    addLog(state, "Current action stopped manually.");
    tx.set(ref, state);
  });

  return { ok: true };
});

exports.depositAll = onCall({ region: "us-central1" }, async (req) => {
  const uid = requireUid(req);
  const ref = userRef(uid);

  await db.runTransaction(async tx => {
    const snap = await tx.get(ref);
    if (!snap.exists) throw new HttpsError("not-found", "Create expedition first.");
    const state = snap.data();
    resolveActiveAction(state);

    state.inventory = state.inventory || {};
    state.bank = state.bank || {};
    for (const [itemId, amount] of Object.entries(state.inventory)) {
      inc(state.bank, itemId, amount);
    }
    state.inventory = {};
    state.updatedAt = now();
    addLog(state, "Deposited all inventory items.");
    tx.set(ref, state);
  });

  return { ok: true };
});

exports.completeQuest = onCall({ region: "us-central1" }, async (req) => {
  const uid = requireUid(req);
  const questId = req.data?.questId;
  const quest = GAME.quests[questId];
  if (!quest) throw new HttpsError("invalid-argument", "Unknown quest.");

  const ref = userRef(uid);
  await db.runTransaction(async tx => {
    const snap = await tx.get(ref);
    if (!snap.exists) throw new HttpsError("not-found", "Create expedition first.");
    const state = snap.data();
    resolveActiveAction(state);

    state.completedQuests = state.completedQuests || [];
    if (state.completedQuests.includes(questId)) return;

    for (const [skillId, reqLevel] of Object.entries(quest.requirements)) {
      const actual = levelFromXp(state.skills?.[skillId]?.xp || 0);
      if (actual < reqLevel) {
        const name = GAME.skills[skillId]?.name || skillId;
        throw new HttpsError("failed-precondition", `Requires ${name} ${reqLevel}.`);
      }
    }

    state.completedQuests.push(questId);
    state.updatedAt = now();
    addLog(state, `Completed quest: ${quest.name}.`);
    tx.set(ref, state);
  });

  return { ok: true };
});

exports.activateKingsSeal = onCall({ region: "us-central1" }, async (req) => {
  const uid = requireUid(req);
  const ref = userRef(uid);

  await db.runTransaction(async tx => {
    const snap = await tx.get(ref);
    if (!snap.exists) throw new HttpsError("not-found", "Create expedition first.");
    const state = snap.data();
    resolveActiveAction(state);

    state.inventory = state.inventory || {};
    state.bank = state.bank || {};

    if (has(state.inventory, "kingsSeal")) inc(state.inventory, "kingsSeal", -1);
    else if (has(state.bank, "kingsSeal")) inc(state.bank, "kingsSeal", -1);
    else throw new HttpsError("failed-precondition", "No King's Seal available.");

    const base = Math.max(now(), Number(state.royalUntil || 0));
    state.royalUntil = Math.min(base + 30 * 24 * 60 * 60 * 1000, now() + GAME.charterMaxMs);
    state.updatedAt = now();
    addLog(state, "Opened a King's Seal. Royal Charter extended.");
    tx.set(ref, state);
  });

  return { ok: true };
});


exports.craftRecipe = onCall({ region: "us-central1" }, async (req) => {
  const uid = requireUid(req);
  const { recipeId, cityId } = req.data || {};
  const recipe = GAME.recipes[recipeId];
  const city = GAME.cities[cityId];

  if (!recipe) throw new HttpsError("invalid-argument", "Unknown recipe.");
  if (!city) throw new HttpsError("invalid-argument", "Unknown city.");
  if (!(city.recipes || []).includes(recipeId)) throw new HttpsError("failed-precondition", "That recipe is not available here.");

  const ref = userRef(uid);
  await db.runTransaction(async tx => {
    const snap = await tx.get(ref);
    if (!snap.exists) throw new HttpsError("not-found", "Create expedition first.");
    const state = snap.data();
    resolveActiveAction(state);

    const lvl = levelFromXp(state.skills?.[recipe.skill]?.xp || 0);
    if (lvl < recipe.level) {
      const name = GAME.skills[recipe.skill]?.name || recipe.skill;
      throw new HttpsError("failed-precondition", `Requires ${name} ${recipe.level}.`);
    }

    takeItems(state, recipe.inputs);
    giveItems(state, recipe.outputs);

    state.skills[recipe.skill] = state.skills[recipe.skill] || { xp: 0 };
    state.skills[recipe.skill].xp = Number(state.skills[recipe.skill].xp || 0) + recipe.xp;

    state.updatedAt = now();
    addLog(state, `Crafted: ${recipe.name}.`);
    tx.set(ref, state);
  });

  return { ok: true };
});

exports.equipItem = onCall({ region: "us-central1" }, async (req) => {
  const uid = requireUid(req);
  const itemId = req.data?.itemId;
  const item = GAME.items[itemId];
  if (!item || !item.slot) throw new HttpsError("invalid-argument", "Item cannot be equipped.");

  const ref = userRef(uid);
  await db.runTransaction(async tx => {
    const snap = await tx.get(ref);
    if (!snap.exists) throw new HttpsError("not-found", "Create expedition first.");
    const state = snap.data();
    resolveActiveAction(state);

    state.inventory = state.inventory || {};
    state.bank = state.bank || {};
    state.equipment = state.equipment || {};

    if (has(state.inventory, itemId)) inc(state.inventory, itemId, -1);
    else if (has(state.bank, itemId)) inc(state.bank, itemId, -1);
    else throw new HttpsError("failed-precondition", "You do not own that item.");

    const old = state.equipment[item.slot];
    if (old) inc(state.inventory, old, 1);
    state.equipment[item.slot] = itemId;

    state.updatedAt = now();
    addLog(state, `Equipped: ${item.name}.`);
    tx.set(ref, state);
  });

  return { ok: true };
});

exports.unequipItem = onCall({ region: "us-central1" }, async (req) => {
  const uid = requireUid(req);
  const slot = req.data?.slot;
  if (!["weapon","body","tool"].includes(slot)) throw new HttpsError("invalid-argument", "Invalid slot.");

  const ref = userRef(uid);
  await db.runTransaction(async tx => {
    const snap = await tx.get(ref);
    if (!snap.exists) throw new HttpsError("not-found", "Create expedition first.");
    const state = snap.data();
    resolveActiveAction(state);

    state.inventory = state.inventory || {};
    state.equipment = state.equipment || {};
    const old = state.equipment[slot];
    if (!old) throw new HttpsError("failed-precondition", "Nothing equipped there.");

    inc(state.inventory, old, 1);
    state.equipment[slot] = null;

    state.updatedAt = now();
    addLog(state, `Unequipped: ${GAME.items[old]?.name || old}.`);
    tx.set(ref, state);
  });

  return { ok: true };
});
