const { onCall, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const GAME = require("./serverGameData.js");

admin.initializeApp();
const db = admin.firestore();

const now = () => Date.now();
const userRef = (uid) => db.collection("users").doc(uid);

function requireUid(req) {
  if (!req.auth) throw new HttpsError("unauthenticated", "Login required.");
  return req.auth.uid;
}
function levelFromXp(xp = 0) { return Math.max(1, Math.floor(Math.sqrt(xp / 45)) + 1); }
function maxHp(state) {
  const melee = levelFromXp(state.skills?.melee?.xp || 0);
  const ranged = levelFromXp(state.skills?.ranged?.xp || 0);
  const magic = levelFromXp(state.skills?.magic?.xp || 0);
  return 30 + Math.floor((melee + ranged + magic) / 3) * 3;
}
function has(bag, id, qty = 1) { return Number(bag?.[id] || 0) >= qty; }
function inc(bag, id, qty) {
  bag[id] = Number(bag[id] || 0) + qty;
  if (bag[id] <= 0) delete bag[id];
}
function rand(min, max) { return min + Math.floor(Math.random() * (max - min + 1)); }
function chance(pct) { return Math.random() * 100 < pct; }
function addLog(state, text) {
  state.log = [...(state.log || []), { at: now(), text }].slice(-120);
}
function initialSkills() {
  return Object.fromEntries(Object.keys(GAME.skills).map(id => [id, { xp: 0 }]));
}
function validateName(name, min, max, label) {
  if (typeof name !== "string") throw new HttpsError("invalid-argument", `${label} is required.`);
  const v = name.trim();
  if (v.length < min || v.length > max) throw new HttpsError("invalid-argument", `${label} must be ${min}-${max} characters.`);
  if (!/^[a-zA-Z0-9 '\-]+$/.test(v)) throw new HttpsError("invalid-argument", `${label} contains invalid characters.`);
  return v;
}
function rollRewards(activity, actions) {
  const items = {};
  let gold = 0;
  for (let i = 0; i < actions; i++) {
    if (activity.goldMin) gold += rand(activity.goldMin, activity.goldMax);
    for (const o of activity.outputs || []) {
      if (Math.random() <= o.chance) inc(items, o.item, rand(o.min, o.max));
    }
  }
  return { items, gold };
}
function combatStats(state, skillId) {
  const equipment = state.equipment || {};
  const weapon = GAME.items[equipment.weapon] || {};
  const body = GAME.items[equipment.body] || {};
  const lvl = levelFromXp(state.skills?.[skillId]?.xp || 0);
  const mastery = levelFromXp(state.skills?.monsterMastery?.xp || 0);
  return {
    hpMax: maxHp(state),
    power: lvl + Number(weapon.power || 1),
    accuracy: 55 + lvl * 1.2 + Number(weapon.accuracy || 0) + mastery * 0.2,
    defense: lvl * 0.5 + Number(body.defense || 0),
    foodHeal: 8
  };
}
function simulateFight(state, activity) {
  const enemy = GAME.enemies[activity.enemy];
  if (!enemy) return { won: true, hp: state.hp ?? maxHp(state), foodUsed: 0, rounds: 0 };

  let hp = Number(state.hp || maxHp(state));
  let enemyHp = enemy.hp;
  let foodUsed = 0;
  let rounds = 0;
  const stats = combatStats(state, activity.skill);

  while (hp > 0 && enemyHp > 0 && rounds < 80) {
    rounds++;

    if (chance(Math.min(92, stats.accuracy - enemy.defense * 0.8))) {
      const hit = rand(1, Math.max(2, Math.floor(stats.power * 1.5)));
      enemyHp -= hit;
    }

    if (enemyHp <= 0) break;

    if (chance(Math.max(15, enemy.accuracy - stats.defense))) {
      const dmg = Math.max(1, rand(enemy.damage[0], enemy.damage[1]) - Math.floor(stats.defense / 6));
      hp -= dmg;
    }

    if (hp > 0 && hp <= Math.floor(stats.hpMax * 0.35) && has(state.inventory, "cookedMinnow", 1)) {
      inc(state.inventory, "cookedMinnow", -1);
      hp = Math.min(stats.hpMax, hp + stats.foodHeal);
      foodUsed++;
    }
  }

  if (hp <= 0) {
    state.hp = Math.ceil(stats.hpMax * 0.35);
    return { won: false, hp: state.hp, foodUsed, rounds };
  }

  state.hp = Math.min(stats.hpMax, hp + 1);
  return { won: true, hp: state.hp, foodUsed, rounds };
}
function takeItems(state, inputs) {
  state.inventory = state.inventory || {};
  state.bank = state.bank || {};
  for (const input of inputs || []) {
    const total = Number(state.inventory[input.item] || 0) + Number(state.bank[input.item] || 0);
    if (total < input.qty) throw new HttpsError("failed-precondition", `Requires ${input.qty} ${GAME.items[input.item]?.name || input.item}.`);
  }
  for (const input of inputs || []) {
    let remaining = input.qty;
    const fromInv = Math.min(remaining, Number(state.inventory[input.item] || 0));
    if (fromInv) { inc(state.inventory, input.item, -fromInv); remaining -= fromInv; }
    if (remaining) inc(state.bank, input.item, -remaining);
  }
}
function giveItems(state, outputs) {
  state.inventory = state.inventory || {};
  for (const output of outputs || []) inc(state.inventory, output.item, output.qty);
}
function resolveActiveAction(state) {
  const active = state.activeAction;
  if (!active) return { actions: 0, message: "No active action." };

  const activity = GAME.activities[active.activityId];
  if (!activity) {
    state.activeAction = null;
    addLog(state, "Unknown action removed.");
    return { actions: 0, message: "Unknown action stopped." };
  }

  const effectiveNow = now();
  if (active.startedAt > effectiveNow) return { actions: 0, message: "Traveling." };

  const elapsed = Math.min(effectiveNow - active.startedAt, GAME.maxActionMs);
  const possible = Math.floor(elapsed / (activity.actionSeconds * 1000));
  if (possible <= 0) return { actions: 0, message: "No completed actions yet." };

  state.inventory = state.inventory || {};
  state.bank = state.bank || {};
  state.skills = state.skills || initialSkills();
  state.hp = Number(state.hp || maxHp(state));

  let actual = 0;
  let deaths = 0;
  let foodUsed = 0;

  for (let i = 0; i < possible; i++) {
    if (activity.inputs?.length) {
      const canPay = activity.inputs.every(input => has(state.inventory, input.item, input.qty));
      if (!canPay) break;
      for (const input of activity.inputs) inc(state.inventory, input.item, -input.qty);
    }

    if (activity.type === "combat" || activity.type === "boss") {
      const fight = simulateFight(state, activity);
      foodUsed += fight.foodUsed;
      if (!fight.won) {
        deaths++;
        break;
      }

      const enemy = GAME.enemies[activity.enemy];
      if (enemy) {
        state.skills.monsterMastery = state.skills.monsterMastery || { xp: 0 };
        state.skills.monsterMastery.xp += enemy.masteryXp || 1;
      }
    }

    actual++;
  }

  if (actual <= 0) {
    state.activeAction = null;
    addLog(state, deaths ? `${activity.name} stopped: adventurer was defeated.` : `${activity.name} stopped: out of resources.`);
    return { actions: 0, message: deaths ? "Stopped: defeated." : "Stopped: out of resources." };
  }

  const rewards = rollRewards(activity, actual);
  for (const [itemId, amount] of Object.entries(rewards.items)) inc(state.inventory, itemId, amount);
  state.gold = Number(state.gold || 0) + rewards.gold;

  state.skills[activity.skill] = state.skills[activity.skill] || { xp: 0 };
  state.skills[activity.skill].xp = Number(state.skills[activity.skill].xp || 0) + activity.xp * actual;

  if (activity.mountChance && Math.random() < activity.mountChance * actual) {
    state.mounts = state.mounts || {};
    state.mounts.griffin = { id: "griffin", name: "Bonded Griffin", acquiredAt: now(), bound: true };
    addLog(state, "LEGENDARY: A Griffin submitted after battle and bonded as your mount.");
  }

  const hardStop = effectiveNow - active.startedAt >= GAME.maxActionMs;
  if (hardStop || deaths) {
    state.activeAction = null;
    addLog(state, `${activity.name}: resolved ${actual} actions${foodUsed ? `, consumed ${foodUsed} food` : ""}${deaths ? ", stopped after defeat" : ", stopped at 8 hours"}.`);
    return { actions: actual, message: `Resolved ${actual} actions. ${deaths ? "Stopped after defeat." : "Stopped at 8 hours."}` };
  }

  state.activeAction.startedAt = active.startedAt + actual * activity.actionSeconds * 1000;
  addLog(state, `${activity.name}: resolved ${actual} actions${foodUsed ? `, consumed ${foodUsed} food` : ""}.`);
  return { actions: actual, message: `Resolved ${actual} actions.` };
}
function validateCanStart(state, cityId, activityId) {
  const city = GAME.cities[cityId];
  const activity = GAME.activities[activityId];
  if (!city) throw new HttpsError("invalid-argument", "Unknown city.");
  if (!activity) throw new HttpsError("invalid-argument", "Unknown activity.");
  if (!city.activities.includes(activityId)) throw new HttpsError("failed-precondition", "That activity is not available here.");
  if (city.lockedBy && !(state.completedQuests || []).includes(city.lockedBy)) throw new HttpsError("failed-precondition", "Area is locked by a quest.");
  if (activity.requiredTool && !has(state.inventory, activity.requiredTool) && !has(state.bank, activity.requiredTool) && state.equipment?.tool !== activity.requiredTool) {
    throw new HttpsError("failed-precondition", `Requires ${GAME.items[activity.requiredTool].name}.`);
  }
  if ((activity.type === "combat" || activity.type === "boss") && !state.equipment?.weapon) {
    throw new HttpsError("failed-precondition", "Equip a weapon before combat.");
  }
  if (activity.inputs?.length) {
    for (const input of activity.inputs) if (!has(state.inventory, input.item, input.qty)) throw new HttpsError("failed-precondition", `Requires ${input.qty} ${GAME.items[input.item]?.name || input.item}.`);
  }
  return { city, activity };
}

exports.createExpedition = onCall({ region: "us-central1" }, async (req) => {
  const uid = requireUid(req);
  const expeditionName = validateName(req.data?.expeditionName, 3, 28, "Expedition name");
  const adventurerName = validateName(req.data?.adventurerName, 2, 20, "Adventurer name");
  await db.runTransaction(async tx => {
    const ref = userRef(uid);
    const existing = await tx.get(ref);
    if (existing.exists) throw new HttpsError("already-exists", "Expedition already exists.");
    tx.set(ref, {
      ownerId: uid, createdAt: now(), updatedAt: now(),
      expedition: { name: expeditionName, banner: { color: "gold", symbol: "wolf", trim: "bronze" } },
      adventurers: [{ id: "a1", name: adventurerName, location: "kingswatch", travel: null }],
      activeAction: null, gold: 50, inventory: { ...GAME.starterInventory }, bank: {}, equipment: { ...GAME.starterEquipment },
      hp: 30, mounts: {}, skills: initialSkills(), completedQuests: [], hardened: true, royalUntil: 0,
      log: [{ at: now(), text: "Expedition founded in Kingswatch." }]
    });
  });
  return { ok: true };
});
exports.startActivity = onCall({ region: "us-central1" }, async (req) => {
  const uid = requireUid(req);
  const { cityId, activityId, adventurerId } = req.data || {};
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
    state.activeAction = { activityId, cityId, adventurerId: adv.id, requestedAt: now(), startedAt: now() + travelMs };
    state.updatedAt = now();
    addLog(state, `${adv.name} started ${activity.name}${travelMs ? ` and is traveling from ${GAME.cities[from].name} to ${city.name}` : ""}.`);
    tx.set(ref, state);
  });
  return { ok: true };
});
exports.collectActivity = onCall({ region: "us-central1" }, async (req) => {
  const uid = requireUid(req);
  let message = "No active action.";
  await db.runTransaction(async tx => {
    const ref = userRef(uid);
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
  await db.runTransaction(async tx => {
    const ref = userRef(uid);
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
  await db.runTransaction(async tx => {
    const ref = userRef(uid);
    const snap = await tx.get(ref);
    if (!snap.exists) throw new HttpsError("not-found", "Create expedition first.");
    const state = snap.data();
    resolveActiveAction(state);
    state.inventory = state.inventory || {}; state.bank = state.bank || {};
    for (const [itemId, amount] of Object.entries(state.inventory)) inc(state.bank, itemId, amount);
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
  await db.runTransaction(async tx => {
    const ref = userRef(uid);
    const snap = await tx.get(ref);
    if (!snap.exists) throw new HttpsError("not-found", "Create expedition first.");
    const state = snap.data();
    resolveActiveAction(state);
    state.completedQuests = state.completedQuests || [];
    if (state.completedQuests.includes(questId)) return;
    for (const [skillId, reqLevel] of Object.entries(quest.requirements)) {
      if (levelFromXp(state.skills?.[skillId]?.xp || 0) < reqLevel) throw new HttpsError("failed-precondition", `Requires ${GAME.skills[skillId]?.name || skillId} ${reqLevel}.`);
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
  await db.runTransaction(async tx => {
    const ref = userRef(uid);
    const snap = await tx.get(ref);
    if (!snap.exists) throw new HttpsError("not-found", "Create expedition first.");
    const state = snap.data();
    resolveActiveAction(state);
    state.inventory = state.inventory || {}; state.bank = state.bank || {};
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
  if (!city || !(city.recipes || []).includes(recipeId)) throw new HttpsError("failed-precondition", "That recipe is not available here.");
  await db.runTransaction(async tx => {
    const ref = userRef(uid);
    const snap = await tx.get(ref);
    if (!snap.exists) throw new HttpsError("not-found", "Create expedition first.");
    const state = snap.data();
    resolveActiveAction(state);
    if (levelFromXp(state.skills?.[recipe.skill]?.xp || 0) < recipe.level) throw new HttpsError("failed-precondition", `Requires ${GAME.skills[recipe.skill]?.name || recipe.skill} ${recipe.level}.`);
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
  await db.runTransaction(async tx => {
    const ref = userRef(uid);
    const snap = await tx.get(ref);
    if (!snap.exists) throw new HttpsError("not-found", "Create expedition first.");
    const state = snap.data();
    resolveActiveAction(state);
    state.inventory = state.inventory || {}; state.bank = state.bank || {}; state.equipment = state.equipment || {};
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
  await db.runTransaction(async tx => {
    const ref = userRef(uid);
    const snap = await tx.get(ref);
    if (!snap.exists) throw new HttpsError("not-found", "Create expedition first.");
    const state = snap.data();
    resolveActiveAction(state);
    state.inventory = state.inventory || {}; state.equipment = state.equipment || {};
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
