import { auth, db, functions, googleProvider, fb } from "./firebase.js";
import { GAME } from "./gameData.js";

const app = document.getElementById("app");
let user = null;
let save = null;
let unsub = null;
let tab = "map";
let selectedCity = "kingswatch";
let tick = null;

const call = (name) => fb.httpsCallable(functions, name);
const now = () => Date.now();
const item = (id) => GAME.items[id] || { name:id, icon:"◼️", description:"Unknown item." };
const skill = (id) => GAME.skills[id] || { name:id, icon:"•", purpose:"" };
const level = (xp=0) => Math.max(1, Math.floor(Math.sqrt(xp / 45)) + 1);
const nextXp = (lvl) => lvl * lvl * 45;
const fmt = (ms) => {
  ms = Math.max(0, ms|0);
  const s = Math.floor(ms/1000), h = Math.floor(s/3600), m = Math.floor((s%3600)/60), sec = s%60;
  if (h) return `${h}h ${m}m`;
  if (m) return `${m}m ${sec}s`;
  return `${sec}s`;
};
const qty = (bag,id) => Number(bag?.[id] || 0);

function toast(text){
  document.querySelector(".toast")?.remove();
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = text;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2600);
}

fb.onAuthStateChanged(auth, (u) => {
  user = u;
  if (unsub) unsub();
  if (!u) {
    save = null;
    renderLogin();
    return;
  }

  const ref = fb.doc(db, "users", u.uid);
  unsub = fb.onSnapshot(ref, (snap) => {
    save = snap.exists() ? snap.data() : null;
    render();
  }, (err) => {
    console.error(err);
    renderError("Could not load save. Check Firestore rules and Functions deployment.");
  });
});

function renderLogin(){
  if (tick) clearInterval(tick);
  app.innerHTML = `
    <section class="login">
      <div class="loginCard">
        <div class="bootMark">👑</div>
        <h1>Idle Legends Manager</h1>
        <p>A fantasy management MMO. Build an expedition, send adventurers across a living map, train skills, and grow from one nobody into a legendary company.</p>
        <button id="google" class="primary">Continue with Google</button>
        <div class="panel">
          <input id="email" class="field" type="email" placeholder="Email"/>
          <input id="pass" class="field" type="password" placeholder="Password"/>
          <div class="split">
            <button id="login" class="secondary">Login</button>
            <button id="create" class="secondary">Create</button>
          </div>
        </div>
      </div>
    </section>
  `;
  document.getElementById("google").onclick = async () => {
    try { await fb.signInWithPopup(auth, googleProvider); }
    catch { await fb.signInWithRedirect(auth, googleProvider); }
  };
  document.getElementById("login").onclick = () => fb.signInWithEmailAndPassword(auth, email.value, pass.value).catch(e => toast(e.message));
  document.getElementById("create").onclick = () => fb.createUserWithEmailAndPassword(auth, email.value, pass.value).catch(e => toast(e.message));
}

function renderError(message){
  app.innerHTML = `<section class="login"><div class="loginCard"><h1>Something went wrong</h1><p>${message}</p><button class="secondary" onclick="location.reload()">Reload</button></div></section>`;
}

function render(){
  if (!user) return renderLogin();
  if (!save) return renderCreateExpedition();
  renderShell();
  if (tick) clearInterval(tick);
  tick = setInterval(updateLiveAction, 1000);
  updateLiveAction();
}

function renderCreateExpedition(){
  app.innerHTML = `
    <section class="login">
      <div class="loginCard">
        <div class="bootMark">📜</div>
        <h1>Create Expedition</h1>
        <p>This is your account identity. Adventurers, bank, pets, achievements, Hardened status, and Royal Charter all belong to the expedition.</p>
        <input id="expeditionName" class="field" maxlength="28" value="The Iron Wolves" placeholder="Expedition name"/>
        <input id="adventurerName" class="field" maxlength="20" value="Rowan" placeholder="First adventurer"/>
        <button id="begin" class="primary">Begin Journey</button>
        <button id="logout" class="secondary">Logout</button>
      </div>
    </section>
  `;
  begin.onclick = async () => {
    const expeditionName = expeditionNameInput().trim();
    const adventurerName = adventurerNameInput().trim();
    if (!expeditionName || !adventurerName) return toast("Name your expedition and first adventurer.");
    try {
      await call("createExpedition")({ expeditionName, adventurerName });
      toast("Expedition created.");
    } catch(e) { toast(e.message); }
  };
  logout.onclick = () => fb.signOut(auth);

  function expeditionNameInput(){ return document.getElementById("expeditionName").value; }
  function adventurerNameInput(){ return document.getElementById("adventurerName").value; }
}

function renderShell(){
  app.innerHTML = `
    <div class="shell">
      <header class="top">
        <div class="crest">👑</div>
        <div class="title">
          <b>${escapeHtml(save.expedition.name)}</b>
          <span>${save.hardened ? "🛡️ Hardened" : "Market Expedition"}${isRoyal() ? " · 👑 Royal Charter" : ""}</span>
        </div>
        <div class="topRight">
          <span class="pill">🪙 ${save.gold || 0}</span>
          <span class="pill">👥 ${save.adventurers.length}/4</span>
        </div>
      </header>

      <main class="screen" id="screen"></main>

      <nav class="nav">
        ${nav("map","🗺️","Map")}
        ${nav("skills","📈","Skills")}
        ${nav("items","🎒","Items")}
        ${nav("quests","📜","Quests")}
        ${nav("more","☰","More")}
      </nav>

      <div id="actionDock"></div>
    </div>
  `;
  document.querySelectorAll(".nav button").forEach(btn => {
    btn.onclick = () => {
      tab = btn.dataset.tab;
      renderShell();
    };
  });
  renderTab();
  renderActionDock();
}

function nav(id,icon,label){
  return `<button data-tab="${id}" class="${tab===id?"active":""}"><i>${icon}</i><span>${label}</span></button>`;
}

function renderTab(){
  if (tab === "map") renderMap();
  if (tab === "skills") renderSkills();
  if (tab === "items") renderItems();
  if (tab === "quests") renderQuests();
  if (tab === "more") renderMore();
}

function renderMap(){
  const screen = document.getElementById("screen");
  screen.innerHTML = `
    <div class="mapFrame">
      <div class="map">
        ${renderRoads()}
        ${Object.entries(GAME.cities).map(([id,c]) => `
          <button class="city ${isLockedCity(id) ? "locked" : ""}" data-city="${id}" style="left:${c.x}%;top:${c.y}%">
            <div class="ico">${c.icon}</div>
            <b>${c.name}</b>
            <span>${c.subtitle}</span>
          </button>
        `).join("")}
        ${renderAdventurers()}
        ${renderOtherExpeditions()}
      </div>
    </div>
    ${renderCityPanel(selectedCity)}
  `;

  document.querySelectorAll(".city").forEach(btn => {
    btn.onclick = () => {
      selectedCity = btn.dataset.city;
      renderMap();
    };
  });
  bindActivityButtons();
}

function renderRoads(){
  return GAME.roads.map(([a,b]) => {
    const ca = GAME.cities[a], cb = GAME.cities[b];
    const dx = cb.x - ca.x, dy = cb.y - ca.y;
    const len = Math.sqrt(dx*dx + dy*dy);
    const ang = Math.atan2(dy, dx) * 180 / Math.PI;
    return `<div class="road" style="left:${ca.x}%;top:${ca.y}%;width:${len}%;transform:rotate(${ang}deg)"></div>`;
  }).join("");
}

function renderAdventurers(){
  return save.adventurers.map((a,i) => {
    const pos = adventurerPosition(a);
    return `<div class="marker" style="left:${pos.x}%;top:${pos.y}%">${["🧔","🧝","🧙","🛡️"][i] || "🙂"}</div>`;
  }).join("");
}

function renderOtherExpeditions(){
  const fake = [
    {x:36,y:50,e:"🪓"},{x:63,y:50,e:"🌿"},{x:50,y:68,e:"🎣"},{x:29,y:50,e:"⚔️"},{x:70,y:44,e:"🐺"},{x:46,y:29,e:"⛏️"}
  ];
  return fake.map(f => `<div class="marker other" style="left:${f.x}%;top:${f.y}%">${f.e}</div>`).join("");
}

function adventurerPosition(a){
  if (a.travel && a.travel.arriveAt > now()) {
    const from = GAME.cities[a.travel.from];
    const to = GAME.cities[a.travel.to];
    const pct = Math.max(0, Math.min(1, (now() - a.travel.departAt) / (a.travel.arriveAt - a.travel.departAt)));
    return { x: from.x + (to.x-from.x)*pct, y: from.y + (to.y-from.y)*pct };
  }
  const c = GAME.cities[a.location || "kingswatch"];
  return { x: c.x, y: c.y };
}

function isLockedCity(id){
  const lock = GAME.cities[id].lockedBy;
  return !!lock && !(save.completedQuests || []).includes(lock);
}

function renderCityPanel(id){
  const city = GAME.cities[id];
  const locked = isLockedCity(id);
  const q = city.lockedBy ? GAME.quests[city.lockedBy] : null;
  return `
    <section class="panel">
      <h2>${city.icon} ${city.name}</h2>
      <p class="muted">${city.subtitle}</p>
      <p>${city.description}</p>
      ${locked ? `
        <div class="card">
          <h3>🔒 Locked Area</h3>
          <p>Requires quest: <b>${q.name}</b></p>
          <p class="muted">Starts at ${q.origin}. Requires ${Object.entries(q.requirements).map(([s,l]) => `${skill(s).name} ${l}`).join(", ")}.</p>
        </div>
      ` : `
        <div class="tabs"><button class="tab active">Activities</button><button class="tab">Services</button></div>
        <div class="list">
          ${city.activities.map(aid => activityRow(aid, id)).join("")}
        </div>
      `}
    </section>
  `;
}

function activityRow(aid, cityId){
  const a = GAME.activities[aid];
  const toolText = a.requiredTool ? ` · Needs ${item(a.requiredTool).name}` : "";
  const inputText = a.inputs?.length ? ` · Uses ${a.inputs.map(i => `${i.qty} ${item(i.item).name}`).join(", ")}` : "";
  return `
    <div class="row">
      <div class="rowMain">
        <b>${a.icon} ${a.name}</b>
        <span>${a.description}</span>
        <span>${a.category} · ${skill(a.skill).name} · ${a.actionSeconds}s/action${toolText}${inputText}</span>
      </div>
      <button class="small start" data-city="${cityId}" data-activity="${aid}">Start</button>
    </div>
  `;
}

function bindActivityButtons(){
  document.querySelectorAll(".start").forEach(btn => {
    btn.onclick = async () => {
      try {
        await call("startActivity")({
          cityId: btn.dataset.city,
          activityId: btn.dataset.activity,
          adventurerId: save.adventurers[0].id
        });
        toast("Action started.");
      } catch(e) { toast(e.message); }
    };
  });
}

function renderActionDock(){
  const host = document.getElementById("actionDock");
  if (!save.activeAction) {
    host.innerHTML = "";
    return;
  }
  const a = GAME.activities[save.activeAction.activityId];
  host.innerHTML = `
    <section class="actionDock">
      <div class="actionHead">
        <div>
          <b>${a.icon} ${a.name}</b>
          <div class="muted" id="actionSub">Updating...</div>
        </div>
        <button id="stopAction" class="small">Stop</button>
      </div>
      <div class="progress"><div class="bar" id="actionBar"></div></div>
      <div class="kv">
        <div><b>Runtime</b><span id="runtime">-</span></div>
        <div><b>Hard Stop</b><span>8 real hours</span></div>
        <div><b>XP/action</b><span>${a.xp} ${skill(a.skill).name}</span></div>
        <div><b>Outputs</b><span>${describeOutputs(a)}</span></div>
      </div>
      <button id="collectAction" class="primary">Collect / Resolve Progress</button>
      ${a.followUp ? `<button id="followUpAction" class="secondary">Queue Processing: ${GAME.activities[a.followUp].name}</button>` : ""}
    </section>
  `;

  document.getElementById("stopAction").onclick = async () => {
    try { await call("stopActivity")({}); toast("Action stopped."); }
    catch(e) { toast(e.message); }
  };
  document.getElementById("collectAction").onclick = async () => {
    try {
      const res = await call("collectActivity")({});
      toast(res.data?.message || "Progress resolved.");
    } catch(e) { toast(e.message); }
  };
  const f = document.getElementById("followUpAction");
  if (f) f.onclick = async () => {
    try {
      await call("startActivity")({
        cityId: save.activeAction.cityId,
        activityId: a.followUp,
        adventurerId: save.activeAction.adventurerId
      });
      toast("Processing started.");
    } catch(e) { toast(e.message); }
  };
}

function updateLiveAction(){
  if (!save?.activeAction) return;
  const act = GAME.activities[save.activeAction.activityId];
  const started = save.activeAction.startedAt;
  const waiting = Math.max(0, started - now());
  const elapsed = Math.max(0, now() - started);
  const actionMs = act.actionSeconds * 1000;
  const runtime = document.getElementById("runtime");
  const sub = document.getElementById("actionSub");
  const bar = document.getElementById("actionBar");
  if (waiting > 0) {
    if (runtime) runtime.textContent = "Traveling";
    if (sub) sub.textContent = `Arrives in ${fmt(waiting)}`;
    if (bar) bar.style.width = "0%";
    return;
  }
  if (runtime) runtime.textContent = fmt(elapsed);
  if (sub) sub.textContent = `Next action in ${fmt(actionMs - (elapsed % actionMs))}`;
  if (bar) bar.style.width = `${((elapsed % actionMs) / actionMs) * 100}%`;
}

function describeOutputs(a){
  const out = [];
  if (a.goldMin) out.push("Gold");
  (a.outputs || []).forEach(o => out.push(item(o.item).name));
  return out.slice(0,3).join(", ") || "None";
}

function renderSkills(){
  const entries = Object.entries(GAME.skills);
  screen.innerHTML = `
    <section class="panel">
      <h2>Skills</h2>
      <p class="muted">Sprint 1 includes skill XP, levels, and future tree descriptions. Full trees come after the activity foundation is stable.</p>
    </section>
    <section class="grid">
      ${entries.map(([id,s]) => {
        const xp = save.skills?.[id]?.xp || 0;
        const lvl = level(xp);
        const next = nextXp(lvl);
        return `
          <button class="card" data-skill="${id}">
            <h3>${s.icon} ${s.name}</h3>
            <p class="muted">Level ${lvl} · ${xp}/${next} XP</p>
            <div class="progress"><div class="bar" style="width:${Math.min(100, xp/next*100)}%"></div></div>
            <p>${s.purpose}</p>
          </button>
        `;
      }).join("")}
    </section>
  `;
}

function renderItems(){
  screen.innerHTML = `
    <section class="panel">
      <h2>Inventory</h2>
      <p class="muted">Tools stay useful. Combat remains can be processed. Future gear and crafting will build on this item system.</p>
      <div class="grid">${itemGrid(save.inventory)}</div>
      <button id="depositAll" class="primary">Deposit All</button>
    </section>
    <section class="panel">
      <h2>Bank</h2>
      <div class="grid">${itemGrid(save.bank)}</div>
    </section>
  `;
  document.querySelectorAll("[data-item]").forEach(btn => btn.onclick = () => showItem(btn.dataset.item));
  document.getElementById("depositAll").onclick = async () => {
    try { await call("depositAll")({}); toast("Deposited all."); }
    catch(e) { toast(e.message); }
  };
}

function itemGrid(bag){
  const entries = Object.entries(bag || {}).filter(([,n]) => n > 0);
  if (!entries.length) return `<p class="muted">Empty</p>`;
  return entries.map(([id,n]) => `
    <button class="card" data-item="${id}">
      <h3>${item(id).icon} ${item(id).name}</h3>
      <p class="muted">x${n}</p>
    </button>
  `).join("");
}

function showItem(id){
  const it = item(id);
  modal(`<h2>${it.icon} ${it.name}</h2><p class="muted">${it.type}</p><p>${it.description}</p>`);
}

function renderQuests(){
  screen.innerHTML = `
    <section class="panel">
      <h2>Quests</h2>
      <p class="muted">Sprint 1 uses quests to gate special map locations and bosses.</p>
    </section>
    <div class="list">
      ${Object.entries(GAME.quests).map(([id,q]) => {
        const done = (save.completedQuests || []).includes(id);
        const can = Object.entries(q.requirements).every(([s,l]) => level(save.skills?.[s]?.xp || 0) >= l);
        return `
          <div class="row">
            <div class="rowMain">
              <b>${done ? "✅" : "📜"} ${q.name}</b>
              <span>${q.description}</span>
              <span>Origin: ${q.origin} · Unlocks ${q.unlocks} · Requires ${Object.entries(q.requirements).map(([s,l]) => `${skill(s).name} ${l}`).join(", ")}</span>
            </div>
            <button class="small quest" data-quest="${id}" ${done || !can ? "disabled" : ""}>${done ? "Done" : can ? "Complete" : "Locked"}</button>
          </div>
        `;
      }).join("")}
    </div>
  `;
  document.querySelectorAll(".quest").forEach(btn => btn.onclick = async () => {
    try { await call("completeQuest")({ questId: btn.dataset.quest }); toast("Quest completed."); }
    catch(e) { toast(e.message); }
  });
}

function renderMore(){
  screen.innerHTML = `
    <section class="panel">
      <h2>Expedition</h2>
      <p><b>${escapeHtml(save.expedition.name)}</b></p>
      <p class="muted">${save.hardened ? "🛡️ Hardened. No gameplay market trades used." : "Market Expedition."}</p>
      <p class="muted">Royal Charter: ${isRoyal() ? fmt(save.royalUntil - now()) + " remaining" : "Inactive"}</p>
      <button id="openSeal" class="secondary">Open King's Seal</button>
      <button id="logout" class="danger">Logout</button>
    </section>
    <section class="panel">
      <h2>Grand Market</h2>
      <p>All trading will go through the Grand Market. Direct player trading is intentionally rejected. King's Seals are the only trade that preserves Hardened.</p>
      <button class="secondary" id="marketInfo">View Market Rules</button>
    </section>
    <section class="panel">
      <h2>Expedition Log</h2>
      <div class="list">${(save.log || []).slice(-16).reverse().map(l => `<div class="card"><b>${new Date(l.at).toLocaleString()}</b><p>${escapeHtml(l.text)}</p></div>`).join("") || `<p class="muted">No logs yet.</p>`}</div>
    </section>
  `;
  document.getElementById("logout").onclick = () => fb.signOut(auth);
  document.getElementById("marketInfo").onclick = () => modal(`<h2>Grand Market Rules</h2><p>No direct player trading. Gameplay item trades remove Hardened. King's Seals are exempt because they do not grant power.</p>`);
  document.getElementById("openSeal").onclick = async () => {
    try { await call("activateKingsSeal")({}); toast("Royal Charter extended."); }
    catch(e) { toast(e.message); }
  };
}

function isRoyal(){
  return save.royalUntil && save.royalUntil > now();
}

function modal(html){
  const shade = document.createElement("div");
  shade.className = "modalShade";
  shade.innerHTML = `<div class="modal">${html}<button class="primary" id="closeModal">Close</button></div>`;
  document.body.appendChild(shade);
  document.getElementById("closeModal").onclick = () => shade.remove();
}

function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}
