import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, signOut, User } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { Axe, Banknote, Castle, Crown, Hammer, Map, Pickaxe, Shield, Swords, Trees, Users, Waves, Wheat, Mountain, PawPrint, ScrollText, Sparkles, LogOut } from 'lucide-react';
import { ACTIVITIES, ITEMS, LOCATIONS, SKILLS, travelSeconds, xpForLevel } from './content';
import { auth, db, functions, googleProvider } from './firebase';
import type { ActivityDef, Character, Expedition, ItemId, LocationNode, SkillId } from './types';
import './styles.css';

const createExpeditionFn = httpsCallable(functions, 'createExpedition');
const startActivityFn = httpsCallable(functions, 'startActivity');
const completeActivityFn = httpsCallable(functions, 'completeActivity');
const depositAllFn = httpsCallable(functions, 'depositAll');
const activateKingsSealFn = httpsCallable(functions, 'activateKingsSeal');

function iconForLocation(type: LocationNode['type']) {
  if (type === 'capital') return <Castle size={18}/>;
  if (type === 'city') return <Shield size={18}/>;
  if (type === 'wild') return <Trees size={18}/>;
  if (type === 'outpost') return <Mountain size={18}/>;
  if (type === 'boss') return <Swords size={18}/>;
  return <Map size={18}/>;
}
function iconForSkill(skill: SkillId) {
  const m: Partial<Record<SkillId, React.ReactNode>> = {
    woodcutting:<Axe size={16}/>, mining:<Pickaxe size={16}/>, fishing:<Waves size={16}/>, gathering:<Wheat size={16}/>, hunting:<PawPrint size={16}/>, processing:<Hammer size={16}/>, melee:<Swords size={16}/>, smithing:<Hammer size={16}/>
  };
  return m[skill] ?? <Sparkles size={16}/>;
}
function fmtTime(ms?: number) {
  if (!ms) return 'Ready';
  const s = Math.max(0, Math.ceil((ms-Date.now())/1000));
  const m = Math.floor(s/60); const r = s%60;
  return m ? `${m}m ${r}s` : `${r}s`;
}
function levelPct(xp: number, level: number) {
  const prev = level <= 1 ? 0 : xpForLevel(level-1);
  const next = xpForLevel(level);
  return Math.max(0, Math.min(100, ((xp-prev)/(next-prev))*100));
}

function useAuth() {
  const [user,setUser] = useState<User|null|undefined>(undefined);
  useEffect(()=>onAuthStateChanged(auth,setUser),[]);
  return user;
}
function useExpedition(user: User|null|undefined) {
  const [expedition,setExpedition]=useState<Expedition|null|undefined>(undefined);
  useEffect(()=>{
    if (!user) { setExpedition(null); return; }
    const unsubUser = onSnapshot(doc(db,'users',user.uid), async snap=>{
      if (!snap.exists()) {
        await setDoc(doc(db,'users',user.uid), { createdAt: serverTimestamp(), lastLoginAt: serverTimestamp(), displayName:user.displayName ?? '', email:user.email ?? '', expeditionId:null });
        setExpedition(null); return;
      }
      const expeditionId = snap.data().expeditionId as string|null;
      if (!expeditionId) { setExpedition(null); return; }
      onSnapshot(doc(db,'expeditions',expeditionId), eSnap=> setExpedition(eSnap.exists() ? eSnap.data() as Expedition : null));
    });
    return ()=>unsubUser();
  },[user]);
  return expedition;
}

function AuthScreen() {
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [mode,setMode]=useState<'signIn'|'create'>('signIn'); const [err,setErr]=useState('');
  async function submit(){ setErr(''); try { mode==='signIn' ? await signInWithEmailAndPassword(auth,email,password) : await createUserWithEmailAndPassword(auth,email,password); } catch(e:any){ setErr(e.message); } }
  async function google(){ setErr(''); try { await signInWithPopup(auth, googleProvider); } catch(e:any){ setErr(e.message); } }
  return <main className="authShell">
    <section className="heroCard">
      <div className="crest"><Crown size={42}/></div>
      <h1>Idle Legends Manager</h1>
      <p className="tagline">You plan. They live.</p>
      <p className="intro">Build an expedition, command autonomous adventurers, forge a player economy, and watch the roads of Asterra come alive.</p>
      <div className="authBox">
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" inputMode="email" />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" />
        {err && <p className="error">{err}</p>}
        <button className="primary" onClick={submit}>{mode==='signIn'?'Sign In':'Create Account'}</button>
        <button className="secondary" onClick={google}>Continue with Google</button>
        <button className="linkBtn" onClick={()=>setMode(mode==='signIn'?'create':'signIn')}>{mode==='signIn'?'Need an account? Create one':'Have an account? Sign in'}</button>
      </div>
    </section>
  </main>;
}

function Onboarding({user}:{user:User}) {
  const [name,setName]=useState(''); const [char,setChar]=useState('Rowan'); const [banner,setBanner]=useState('Iron Wolves'); const [busy,setBusy]=useState(false); const [err,setErr]=useState('');
  async function create(){ setBusy(true); setErr(''); try { await createExpeditionFn({ expeditionName:name || 'The First Charter', adventurerName: char || 'Rowan', banner: banner || 'Iron Wolves' }); } catch(e:any){ setErr(e.message); } finally{ setBusy(false); } }
  return <main className="authShell">
    <section className="heroCard createCard">
      <h1>Create Expedition</h1>
      <p className="intro">You are not creating one hero. You are founding the organization players will recognize on roads, markets, leaderboards, and raids.</p>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Expedition name" />
      <input value={banner} onChange={e=>setBanner(e.target.value)} placeholder="Banner name" />
      <input value={char} onChange={e=>setChar(e.target.value)} placeholder="First adventurer" />
      {err && <p className="error">{err}</p>}
      <button className="primary" disabled={busy} onClick={create}>{busy?'Founding...':'Begin Journey'}</button>
      <button className="linkBtn" onClick={()=>signOut(auth)}>Sign out {user.email}</button>
    </section>
  </main>
}

function WorldMapView({expedition, selected, setSelected}:{expedition:Expedition; selected:string; setSelected:(id:string)=>void}) {
  const active = expedition.characters[0];
  return <section className="mapPanel">
    <div className="roads">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M50 50 L50 17"/><path d="M50 50 L82 50"/><path d="M50 50 L50 83"/><path d="M50 50 L18 50"/><path d="M82 50 L86 23 L93 15"/><path d="M50 17 L62 10"/>
      </svg>
    </div>
    {LOCATIONS.map(loc => <button key={loc.id} className={`loc ${selected===loc.id?'active':''} ${loc.unlock && !expedition.unlockedLocations.includes(loc.id)?'locked':''}`} style={{left:`${loc.x}%`, top:`${loc.y}%`}} onClick={()=>setSelected(loc.id)}>
      {iconForLocation(loc.type)}<span>{loc.name}</span><small>Lv {loc.level}</small>
    </button>)}
    <div className={`avatar ${active.status}`} style={{ left:`${LOCATIONS.find(l=>l.id===active.locationId)?.x ?? 50}%`, top:`${LOCATIONS.find(l=>l.id===active.locationId)?.y ?? 50}%` }}><span>{active.name[0]}</span></div>
    <div className="worldTicker"><Sparkles size={14}/> Ashen Company defeated the Ancient Colossus · Riverwatch hatched an Albino Ember Lynx · Roads are alive</div>
  </section>;
}

function LocationSheet({expedition, loc}:{expedition:Expedition; loc:LocationNode}) {
  const locked = loc.unlock && !expedition.unlockedLocations.includes(loc.id);
  const [busy,setBusy]=useState(''); const char = expedition.characters[0];
  async function start(activityId:string){ setBusy(activityId); try{ await startActivityFn({ characterId:char.id, activityId }); } catch(e:any){ alert(e.message); } finally{ setBusy(''); } }
  return <section className="sheet">
    <div className="sheetHead"><div>{iconForLocation(loc.type)}</div><div><h2>{loc.name}</h2><p>{loc.description}</p></div></div>
    {locked && <div className="lockedBox"><ScrollText size={18}/><b>Locked Area</b><p>{loc.unlock}</p></div>}
    {!locked && <div className="activityList">{loc.activities.map(id=>ACTIVITIES[id]).filter(Boolean).map(a=><ActivityCard key={a.id} activity={a} character={char} start={start} busy={busy===a.id}/>)}</div>}
  </section>
}
function ActivityCard({activity, character, start, busy}:{activity:ActivityDef; character:Character; start:(id:string)=>void; busy:boolean}) {
  const hasTool = !activity.tool || (character.inventory[activity.tool] ?? 0) > 0;
  const inputsOk = !activity.input || Object.entries(activity.input).every(([id,n]) => (character.inventory[id as ItemId] ?? 0) >= (n ?? 0));
  return <article className="activityCard">
    <div className="activityTop"><div>{iconForSkill(activity.skill)}<b>{activity.name}</b></div><small>{activity.seconds}s/action</small></div>
    <p>{activity.description}</p>
    <div className="chips"><span>{activity.skill}</span><span>Lv {activity.level}</span><span>+{activity.xp} XP</span></div>
    {activity.tool && <p className={hasTool?'ok':'warn'}>Requires {ITEMS[activity.tool].name}</p>}
    {activity.input && <p className={inputsOk?'ok':'warn'}>Consumes {Object.entries(activity.input).map(([id,n])=>`${n} ${ITEMS[id as ItemId].name}`).join(', ')}</p>}
    <p className="outputs">Outputs: {Object.keys(activity.output).length ? Object.entries(activity.output).map(([id,n])=>`${n} ${ITEMS[id as ItemId].name}`).join(', ') : 'XP / progress'}</p>
    <button className="primary small" disabled={busy || character.status !== 'idle' || !hasTool || !inputsOk} onClick={()=>start(activity.id)}>{character.status==='idle' ? (busy?'Starting...':'Start') : 'Adventurer Busy'}</button>
  </article>
}

function ExpeditionPanel({expedition}:{expedition:Expedition}) {
  const char = expedition.characters[0]; const activeMs = char.endsAt;
  async function complete(){ try{ await completeActivityFn({ characterId: char.id }); } catch(e:any){ alert(e.message); } }
  async function deposit(){ try{ await depositAllFn({ characterId: char.id }); } catch(e:any){ alert(e.message); } }
  async function activate(){ try{ await activateKingsSealFn({}); } catch(e:any){ alert(e.message); } }
  return <section className="sidePanel">
    <div className="profile"><div className="crest mini"><Crown size={22}/></div><div><h2>{expedition.name}</h2><p>{expedition.hardened?'🛡 Hardened':'Market Expedition'} · {expedition.royalCharterEndsAt && expedition.royalCharterEndsAt>Date.now()?'👑 Royal Charter':'No Charter'}</p></div></div>
    <div className="resources"><span><Banknote size={16}/>{expedition.gold}g</span><span>Queue {expedition.royalCharterEndsAt && expedition.royalCharterEndsAt>Date.now()?2:1}</span></div>
    <article className="charCard"><div><b>{char.name}</b><p>{char.status} · {char.locationId}</p></div><span>{fmtTime(activeMs)}</span></article>
    {char.status !== 'idle' && <button className="primary" onClick={complete}>Resolve Ready Action</button>}
    <button className="secondary" onClick={deposit}>Deposit Inventory</button>
    <button className="secondary" onClick={activate}>Activate King's Seal</button>
    <h3>Inventory</h3><InventoryGrid items={char.inventory}/>
    <h3>Bank</h3><InventoryGrid items={expedition.bank}/>
  </section>
}
function InventoryGrid({items}:{items:Partial<Record<ItemId,number>>}) {
  const entries=Object.entries(items).filter(([,n])=>(n??0)>0) as [ItemId,number][];
  if (!entries.length) return <p className="muted">Empty</p>;
  return <div className="invGrid">{entries.map(([id,n])=><div key={id} className="item"><b>{ITEMS[id].name}</b><span>{n}</span><small>{ITEMS[id].type}</small></div>)}</div>
}
function SkillsPanel({expedition}:{expedition:Expedition}) {
  const skills=expedition.characters[0].skills;
  return <section className="sheet skillsSheet"><h2>Skills & Trees</h2><p>Two max melee players can still be different: one crit-focused, one speed/on-hit focused. Trees are seeded now and expanded system-by-system.</p>
    <div className="skillList">{SKILLS.map(s=>{ const st=skills[s.id]; return <article key={s.id} className="skillRow"><div>{iconForSkill(s.id)}<div><b>{s.name}</b><p>{s.purpose}</p></div></div><aside><b>Lv {st?.level ?? 1}</b><span>{st?.build ?? 'Balanced'}</span></aside><div className="bar"><i style={{width:`${levelPct(st?.xp??0, st?.level??1)}%`}}/></div></article>})}</div>
  </section>
}

function Game({user, expedition}:{user:User; expedition:Expedition}) {
  const [tab,setTab]=useState<'map'|'skills'|'market'|'guild'>('map'); const [selected,setSelected]=useState('kingswatch'); const loc=LOCATIONS.find(l=>l.id===selected) ?? LOCATIONS[0]; const [,tick]=useState(0);
  useEffect(()=>{ const t=setInterval(()=>tick(x=>x+1),1000); return ()=>clearInterval(t);},[]);
  return <div className="appShell">
    <header className="topbar"><div><h1>Idle Legends Manager</h1><p>You plan. They live.</p></div><button onClick={()=>signOut(auth)}><LogOut size={18}/></button></header>
    <main className="layout">
      <ExpeditionPanel expedition={expedition}/>
      <div className="mainStage">
        {tab==='map' && <><WorldMapView expedition={expedition} selected={selected} setSelected={setSelected}/><LocationSheet expedition={expedition} loc={loc}/></>}
        {tab==='skills' && <SkillsPanel expedition={expedition}/>} 
        {tab==='market' && <section className="sheet"><h2>Grand Market</h2><p>No direct player trading. Everything goes through market systems to reduce scams and preserve manager fantasy.</p><div className="lockedBox"><b>Hardened Warning</b><p>Buying or selling any item except King's Seals permanently removes Hardened status.</p></div></section>}
        {tab==='guild' && <section className="sheet"><h2>Guilds & World Events</h2><p>Guilds, spring harvest events, server-wide goals, world bosses, and raid lobbies have reserved architecture. Early launch keeps them visible but not mandatory.</p></section>}
      </div>
    </main>
    <nav className="bottomNav"><button className={tab==='map'?'on':''} onClick={()=>setTab('map')}><Map/>Map</button><button className={tab==='skills'?'on':''} onClick={()=>setTab('skills')}><Hammer/>Skills</button><button className={tab==='market'?'on':''} onClick={()=>setTab('market')}><Banknote/>Market</button><button className={tab==='guild'?'on':''} onClick={()=>setTab('guild')}><Users/>Guild</button></nav>
  </div>
}
function App(){ const user=useAuth(); const expedition=useExpedition(user); if(user===undefined||expedition===undefined) return <main className="loading">Loading ILM...</main>; if(!user) return <AuthScreen/>; if(!expedition) return <Onboarding user={user}/>; return <Game user={user} expedition={expedition}/>; }

createRoot(document.getElementById('root')!).render(<App/>);
