import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
Shield, AlertTriangle, Landmark, Users, Zap, Scroll, Sword, TrendingUp,
Lock, Terminal, Eye, Briefcase, ChevronRight, Database, Wifi, Globe,
Activity, UserCheck, ShieldAlert, Cpu, Settings, Trash2, Edit3, UserPlus,
Search, Target, Satellite, Radio, HardDrive, Key, Fingerprint, Map
} from 'lucide-react';

// --- קבועי מערכת (Global Config) ---
const RANKS = ['Sleeper', 'Seeker', 'Awakened', 'Operator', 'Ghost'];
const DEPARTMENTS = {
Operational: { icon: Target, color: 'text-red-500', desc: 'ביצוע בשטח וחיסול נרטיבים' },
Strategy: { icon: Cpu, color: 'text-blue-500', desc: 'ניתוח נתונים ותכנון עתידי' },
Communication: { icon: Radio, color: 'text-purple-500', desc: 'לוחמה פסיכולוגית והפצה' }
};

const MISSION_DB = [
{ id: 'M-101', title: "הפצת פרוטוקול 7", baseXP: 150, baseNC: 300, rank: 'Sleeper', type: 'Intel' },
{ id: 'M-204', title: "ניקוי עקבות בשרתי הממשלה", baseXP: 500, baseNC: 1200, rank: 'Seeker', type: 'Cyber' },
{ id: 'M-505', title: "חדירה לשידור חי", baseXP: 1500, baseNC: 4000, rank: 'Awakened', type: 'PsyOp' },
{ id: 'M-909', title: "פירוק תא סוכני מערכת", baseXP: 5000, baseNC: 12000, rank: 'Operator', type: 'Tactical' }
];

// --- רכיב טעינה (Cyber Loading Shader) ---
const LoadingScreen = ({ msg = "מפענח נתונים...", duration = 1500, onDone }) => {
const [progress, setProgress] = useState(0);
useEffect(() => {
const step = duration / 100;
const interval = setInterval(() => {
setProgress(p => {
if (p >= 100) { clearInterval(interval); onDone && onDone(); return 100; }
return p + 1;
});
}, step);
return () => clearInterval(interval);
}, [duration, onDone]);

return (
<div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center font-mono">
<div className="w-64 h-1 border border-green-900 mb-4 relative overflow-hidden">
<div className="h-full bg-green-500 transition-all duration-100" style={{ width: `${progress}%` }}></div>
</div>
<div className="text-[10px] text-green-500 uppercase tracking-[0.3em] animate-pulse">
{msg} [{progress}%]
</div>
<div className="mt-8 text-[8px] text-gray-800 max-w-xs text-center uppercase leading-tight">
Warning: Unauthorized access to Nexus Core will result in immediate neural wipe.
</div>
</div>
);
};

// --- רכיב כניסה (Access Portal) ---
const AccessPortal = ({ onLogin }) => {
const [form, setForm] = useState({ codename: '', key: '', dept: 'Operational' });
const [isAuthenticating, setIsAuthenticating] = useState(false);

if (isAuthenticating) return <LoadingScreen msg="מבצע אימות ביומטרי..." duration={2500} onDone={() => onLogin(form)} />;

return (
<div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
<div className="absolute inset-0 opacity-10 pointer-events-none">
<div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-900/20 via-transparent to-transparent"></div>
</div>
<div className="w-full max-w-md p-10 border border-green-500/20 bg-black/90 backdrop-blur-xl z-10 relative">
<div className="scanner-line"></div>
<div className="text-center mb-10">
<Fingerprint size={48} className="mx-auto mb-4 text-green-500 animate-pulse" />
<h1 className="glitch text-3xl font-black text-green-500 italic tracking-tighter uppercase">Nexus Sovereignty</h1>
<p className="text-[9px] text-gray-600 mt-2 tracking-[0.4em] uppercase">Security Level: Omega-7</p>
</div>
<div className="space-y-6">
<div>
<label className="text-[9px] text-gray-500 uppercase font-bold mb-2 block">Agent Codename</label>
<input type="text" className="w-full bg-black border border-white/10 p-3 text-green-500 font-mono focus:border-green-500 outline-none" onChange={e => setForm({...form, codename: e.target.value})} />
</div>
<div>
<label className="text-[9px] text-gray-500 uppercase font-bold mb-2 block">Neural Key</label>
<input type="password" placeholder="••••••••" className="w-full bg-black border border-white/10 p-3 text-green-500 font-mono focus:border-green-500 outline-none" onChange={e => setForm({...form, key: e.target.value})} />
</div>
<div>
<label className="text-[9px] text-gray-500 uppercase font-bold mb-2 block">Tactical Unit</label>
<select className="w-full bg-black border border-white/10 p-3 text-green-500 font-mono outline-none" onChange={e => setForm({...form, dept: e.target.value})}>
<option value="Operational">Field Operations</option>
<option value="Strategy">Strategic Intelligence</option>
<option value="Communication">Psy-Ops & Media</option>
</select>
</div>
<button onClick={() => setIsAuthenticating(true)} className="w-full py-4 bg-green-600 text-black font-black uppercase text-sm hover:bg-green-500 transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)]">
התחבר למסד הנתונים
</button>
</div>
</div>
</div>
);
};

// --- המערכת המרכזית (Main Engine) ---
const NexusOS = ({ agentData }) => {
const [user, setUser] = useState({ ...agentData, xp: 0, balance: 1500, rank: 'Sleeper', bankActive: false, unlockedArchives: false });
const [activeTab, setActiveTab] = useState('Base');
const [isChangingTab, setIsChangingTab] = useState(false);
const [tasks, setTasks] = useState([]);
const [logs, setLogs] = useState(["[SYSTEM] OS Initialized.", "[SEC] Identity Verified."]);
const [loanTimer, setLoanTimer] = useState(0);
const [emergency, setEmergency] = useState(false);
const [proposals, setProposals] = useState([]);

// אפקט מעבר בין דפים
const changeTab = (tab) => {
setIsChangingTab(true);
setTimeout(() => { setActiveTab(tab); setIsChangingTab(false); }, 800);
};

const addLog = (msg) => setLogs(p => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...p].slice(0, 15));

// בוט האדריכל (The Architect)
useEffect(() => {
const heartbeat = setInterval(() => {
// יצירת משימות רלוונטיות לדרגה
if (Math.random() > 0.8) {
const eligibleTasks = MISSION_DB.filter(t => RANKS.indexOf(t.rank) <= RANKS.indexOf(user.rank));
const picked = eligibleTasks[Math.floor(Math.random() * eligibleTasks.length)];
setTasks(p => [ { ...picked, instanceId: Math.random().toString(36).substr(2, 5) }, ...p ].slice(0, 5));
}

// טיפול בהלוואות
if (loanTimer > 0) {
if (loanTimer === 1) { setUser(u => ({ ...u, balance: u.balance + 500 })); addLog("הפקדת חירום הושלמה."); }
setLoanTimer(t => t - 1);
}
}, 1000);
return () => clearInterval(heartbeat);
}, [user.rank, loanTimer]);

// עדכון דרגות
useEffect(() => {
const newRank = RANKS.findLast(r => user.xp >= (MISSION_DB.find(m => m.rank === r)?.baseXP * 2 || 0)) || 'Sleeper';
if (newRank !== user.rank) { setUser(u => ({ ...u, rank: newRank })); addLog(`סטטוס סוכן עודכן ל: ${newRank}`); }
}, [user.xp]);

return (
<div className={`min-h-screen bg-black text-green-500 font-mono flex flex-col selection:bg-green-500 selection:text-black ${emergency ? 'emergency-active' : ''}`}>
{isChangingTab && <LoadingScreen msg="טוען מודול..." duration={600} />}

{/* TOP HUD */}
<header className="h-20 border-b border-white/5 bg-black/90 flex items-center justify-between px-8 z-50">
<div className="flex items-center gap-6">
<div className="glitch font-black text-xl italic tracking-widest text-white">NEXUS_OS // {user.dept}</div>
<div className="flex gap-4 items-center border-l border-white/10 pl-6 h-8 text-[10px] text-gray-500 uppercase">
<span className="flex items-center gap-2"><Globe size={12} /> GLOBAL_INTEL: ACTIVE</span>
<span className="flex items-center gap-2"><Cpu size={12} /> CPU_LOAD: 12%</span>
</div>
</div>
<div className="flex gap-10 items-center">
<div className="text-right">
<div className="text-[9px] text-gray-500 uppercase">עושר ריבוני</div>
<div className="text-lg font-black text-white">{user.balance.toLocaleString()} <span className="text-green-500">NC</span></div>
</div>
<div className="h-10 w-[1px] bg-white/10"></div>
<div className="text-right">
<div className="text-[9px] text-gray-500 uppercase">דרגת הרשאה</div>
<div className="text-lg font-black text-green-500 uppercase italic">{user.rank}</div>
</div>
</div>
</header>

<div className="flex-1 flex overflow-hidden">
{/* SIDE NAV */}
<aside className="w-64 border-r border-white/5 flex flex-col bg-zinc-950/50">
<nav className="p-4 flex flex-col gap-2 mt-4">
{[
{ id: 'Base', label: 'מרכז הבסיס', icon: Database },
{ id: 'WarRoom', label: 'חדר מלחמה', icon: Sword },
{ id: 'Bank', label: 'הבנק המרכזי', icon: Landmark },
{ id: 'Archives', label: 'הארכיון האסור', icon: Lock },
{ id: 'Profile', label: 'תיק סוכן', icon: UserCheck }
].map(item => (
<button key={item.id} onClick={() => changeTab(item.id)} className={`flex items-center gap-3 p-4 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === item.id ? 'bg-green-500 text-black shadow-[0_0_15px_rgba(34,197,94,0.4)]' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
<item.icon size={18} /> {item.label}
</button>
))}
</nav>
<div className="mt-auto p-4 space-y-4 border-t border-white/5">
<button onClick={() => { setEmergency(!emergency); addLog("!! EMERGENCY PROTOCOL !!"); }} className="w-full py-4 bg-red-600 text-white font-black uppercase text-[10px] hover:bg-red-500 shadow-lg shadow-red-900/20">כינוס חירום</button>
<div className="text-[8px] text-center text-gray-700 font-mono">ENCRYPTION: AES-256-GCM</div>
</div>
</aside>

{/* MAIN DISPLAY */}
<main className="flex-1 p-8 overflow-y-auto relative custom-scrollbar">
<div className="scanner-line opacity-20"></div>

{/* PAGE: BASE */}
{activeTab === 'Base' && (
<div className="grid grid-cols-12 gap-8 animate-in fade-in duration-500">
<div className="col-span-8 space-y-8">
<div className="flex items-center justify-between border-b border-white/10 pb-4">
<h2 className="text-xl font-black uppercase tracking-[0.2em] flex items-center gap-3"><Activity size={24} /> עדכונים מבצעיים</h2>
<span className="text-[10px] text-gray-500">נמצאו {tasks.length} יעדים</span>
</div>
<div className="grid gap-4">
{tasks.map(t => (
<div key={t.instanceId} className="shadow-card p-6 border border-white/5 hover:border-green-500/50 transition-all group bg-zinc-950/40">
<div className="flex justify-between items-start mb-4">
<div>
<div className="text-[9px] text-green-500 font-bold mb-1 uppercase tracking-widest">[{t.type}] ID: {t.id}</div>
<h3 className="text-lg font-black text-white group-hover:text-green-400 transition-colors uppercase tracking-tight">{t.title}</h3>
</div>
<div className="text-right">
<div className="text-sm font-bold text-yellow-600">+{t.baseNC} NC</div>
<div className="text-[10px] text-blue-500">+{t.baseXP} XP</div>
</div>
</div>
<button onClick={() => { setUser(u => ({ ...u, xp: u.xp + t.baseXP, balance: u.balance + t.baseNC })); setTasks(p => p.filter(x => x.instanceId !== t.instanceId)); addLog(`משימה הושלמה: ${t.title}`); }} className="w-full py-2 border border-green-500/40 text-[10px] font-black uppercase hover:bg-green-500 hover:text-black transition-all">אשר ביצוע והעלה ראיות</button>
</div>
))}
{tasks.length === 0 && <div className="h-40 flex items-center justify-center border border-dashed border-white/5 opacity-20 italic text-sm">האדריכל סורק את המטריקס...</div>}
</div>
</div>
<div className="col-span-4 space-y-8">
<div className="shadow-card p-6 border-blue-500/20 bg-blue-500/5">
<h3 className="text-xs font-black text-blue-500 uppercase mb-4 flex items-center gap-2"><Satellite size={16} /> סטטוס רשת</h3>
<div className="space-y-2 text-[10px] text-gray-400 font-mono">
{logs.map((l, i) => <div key={i} className="border-l border-blue-900/50 pl-2 leading-relaxed">{l}</div>)}
</div>
</div>
<div className="shadow-card p-6 border-purple-500/20 bg-purple-500/5">
<h3 className="text-xs font-black text-purple-500 uppercase mb-4 flex items-center gap-2"><Users size={16} /> סוכנים בקרבת מקום</h3>
<div className="space-y-3">
{[1,2,3].map(i => (
<div key={i} className="flex justify-between items-center text-[10px]">
<span className="text-gray-400">Agent_X-{i*144}</span>
<span className="px-2 py-0.5 bg-green-500/10 text-green-500 rounded-full text-[8px]">ONLINE</span>
</div>
))}
</div>
</div>
</div>
</div>
)}

{/* PAGE: WAR ROOM */}
{activeTab === 'WarRoom' && (
<div className="max-w-5xl mx-auto space-y-10 animate-in slide-in-from-bottom-4 duration-500">
<div className="shadow-card p-8 border-red-500/20 bg-red-500/5">
<h2 className="text-2xl font-black text-red-500 uppercase italic mb-6">שידור הצעת מבצע לתקיפה</h2>
<div className="flex gap-4">
<input id="opInput" placeholder="הזן שם למבצע או הצעת חוק חדשה..." className="flex-1 bg-black border border-white/10 p-4 text-sm font-mono focus:border-red-500 outline-none" />
<button onClick={() => { const v = document.getElementById('opInput').value; if(v){ setProposals([{ id: Date.now(), title: v, votes: 0, status: 'Active' }, ...proposals]); document.getElementById('opInput').value=''; addLog("הצעה נשלחה להצבעה."); } }} className="px-10 bg-red-600 text-white font-black uppercase hover:bg-red-500 shadow-lg shadow-red-900/20">שדר</button>
</div>
</div>
<div className="grid grid-cols-2 gap-6">
{proposals.map(p => (
<div key={p.id} className="shadow-card p-6 border-gray-800 bg-zinc-950/40">
<div className="flex justify-between mb-4 text-[9px] uppercase tracking-widest text-gray-500">
<span>Ref: {p.id.toString().slice(-6)}</span>
<span className="text-red-500 font-black animate-pulse">{p.status}</span>
</div>
<h3 className="text-white text-lg font-black italic mb-6 uppercase">"{p.title}"</h3>
<div className="flex gap-4">
<button onClick={() => setProposals(prev => prev.map(x => x.id === p.id ? {...x, votes: x.votes + 1} : x))} className="flex-1 py-3 border border-green-500 text-green-500 font-black text-[10px] uppercase hover:bg-green-500 hover:text-black">בעד ({p.votes})</button>
<button className="flex-1 py-3 border border-red-500 text-red-500 font-black text-[10px] uppercase opacity-30 cursor-not-allowed">נגד</button>
</div>
</div>
))}
{proposals.length === 0 && <div className="col-span-2 text-center py-20 opacity-20 italic">אין הצעות ממתינות בחדר המלחמה.</div>}
</div>
</div>
)}

{/* PAGE: BANK */}
{activeTab === 'Bank' && (
<div className="max-w-4xl mx-auto space-y-10 animate-in zoom-in-95 duration-500">
{!user.bankActive ? (
<div className="shadow-card p-16 text-center border-yellow-600/30">
<Landmark size={80} className="mx-auto mb-6 text-yellow-600 opacity-40 animate-bounce" />
<h2 className="text-3xl font-black text-white uppercase italic mb-4">Central Sovereign Bank</h2>
<p className="text-gray-500 text-sm max-w-sm mx-auto mb-10 leading-relaxed">כדי לפתוח את הגישה לכלכלה הריבונית, עליך לבצע אימות קשר וביטחון שדה. האדריכל ינהל את חשבונך.</p>
<button onClick={() => { setUser(u => ({ ...u, bankActive: true })); addLog("חשבון בנק נפתח."); }} className="px-12 py-5 bg-yellow-600 text-black font-black uppercase text-sm hover:bg-yellow-500 transition-all hover:scale-105 shadow-xl shadow-yellow-900/20">הצהר נאמנות ופתח חשבון</button>
</div>
) : (
<div className="grid grid-cols-12 gap-8">
<div className="col-span-5 shadow-card p-8 border-yellow-600/20 bg-yellow-600/5">
<h3 className="text-xl font-black mb-6 text-yellow-600 italic flex items-center gap-3"><Zap size={24} /> הלוואת חירום</h3>
<p className="text-[10px] text-gray-500 mb-8 leading-relaxed">קבל 500 NC להזרקה מיידית. החזר יבוצע אוטומטית בהפקדות הבאות.</p>
{loanTimer > 0 ? (
<div className="text-center">
<div className="h-1.5 w-full bg-gray-900 mb-4 overflow-hidden"><div className="h-full bg-yellow-600 transition-all duration-1000" style={{ width: `${(loanTimer/60)*100}%` }}></div></div>
<div className="font-mono text-3xl text-white">00:{loanTimer < 10 ? `0${loanTimer}` : loanTimer}</div>
</div>
) : (
<button onClick={() => setLoanTimer(60)} className="w-full py-4 border-2 border-yellow-600 text-yellow-600 font-black uppercase hover:bg-yellow-600 hover:text-black">בקש הזרקה של 500 NC</button>
)}
</div>
<div className="col-span-7 shadow-card p-8 bg-zinc-950/40">
<h3 className="text-xl font-black text-green-500 italic mb-6 flex items-center gap-3"><TrendingUp size={24} /> זירת השקעות</h3>
<div className="space-y-4">
{['מהיר (15%)', 'מאוזן (8%)', 'שמרני (3%)'].map((p, i) => (
<div key={i} className="flex justify-between items-center p-4 border border-white/5 bg-white/5 hover:border-green-500/30 transition-all">
<div>
<div className="text-sm font-bold text-white uppercase">{p}</div>
<div className="text-[9px] text-gray-500 uppercase mt-1">סיכון: {i === 0 ? 'High' : i === 1 ? 'Mid' : 'Low'}</div>
</div>
<button disabled={user.balance < 500} onClick={() => { setUser(u => ({ ...u, balance: u.balance - 500 })); addLog("השקעה בוצעה."); }} className="px-6 py-2 border border-gray-700 text-[10px] font-black uppercase hover:border-green-500 hover:text-green-500">השקע 500</button>
</div>
))}
</div>
</div>
</div>
)}
</div>
)}

{/* PAGE: ARCHIVES */}
{activeTab === 'Archives' && (
<div className="h-[60vh] flex flex-col items-center justify-center border border-dashed border-white/10 relative overflow-hidden">
<Lock size={100} className="text-white/5 mb-8 animate-pulse" />
<div className="text-center z-10">
<h2 className="text-4xl font-black uppercase opacity-20 tracking-[0.5em] mb-4">The Vault</h2>
<p className="text-gray-600 text-xs max-w-sm mx-auto mb-10 leading-relaxed uppercase italic">גישה למסמכי המקור מותרת לסוכני Ghost בלבד. כל פעולה מנוטרת בביומטריה.</p>
<div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
<div className="p-4 bg-white/5 border border-white/10 blur-md select-none font-mono text-[10px]">PROTOCOL_001</div>
<div className="p-4 bg-white/5 border border-white/10 blur-md select-none font-mono text-[10px]">GOVT_CORRUPTION_V4</div>
</div>
</div>
{user.rank !== 'Ghost' && (
<div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-md">
<div className="bg-red-600 text-white px-8 py-3 text-xs font-black uppercase tracking-widest shadow-2xl shadow-red-950">Access Denied // Level Insufficient</div>
</div>
)}
</div>
)}

{/* PAGE: PROFILE */}
{activeTab === 'Profile' && (
<div className="max-w-4xl mx-auto grid grid-cols-12 gap-8 animate-in zoom-in-95 duration-500">
<div className="col-span-4 shadow-card p-8 flex flex-col items-center border-green-500/20 bg-green-500/5">
<div className="w-32 h-32 border-2 border-green-500 p-1 mb-6 relative">
<div className="absolute inset-0 border border-green-500 animate-ping opacity-20"></div>
<img src={`https://dicebear.com{user.codename}`} alt="Avatar" className="w-full h-full bg-black" />
</div>
<h3 className="text-xl font-black text-white italic uppercase tracking-tighter mb-2">{user.codename}</h3>
<span className="px-3 py-1 bg-green-500 text-black text-[10px] font-black uppercase mb-8">{user.rank}</span>
<div className="w-full space-y-4">
<div className="flex justify-between text-[10px] uppercase border-b border-white/5 pb-2"><span className="text-gray-500">נאמנות:</span><span className="text-green-500">100%</span></div>
<div className="flex justify-between text-[10px] uppercase border-b border-white/5 pb-2"><span className="text-gray-500">משימות:</span><span className="text-green-500">14</span></div>
</div>
</div>
<div className="col-span-8 shadow-card p-8 bg-zinc-950/40">
<h3 className="text-xl font-black mb-8 border-b border-white/10 pb-4 flex items-center gap-3 uppercase"><Activity size={20} /> רצף פעילות</h3>
<div className="grid grid-cols-7 gap-2 h-40">
{Array.from({length: 28}).map((_, i) => (
<div key={i} className={`border border-white/5 ${Math.random() > 0.5 ? 'bg-green-500/40' : 'bg-transparent'}`}></div>
))}
</div>
<div className="mt-8 grid grid-cols-3 gap-6">
<div className="text-center p-4 border border-white/5">
<div className="text-2xl font-black text-white">124</div>
<div className="text-[8px] text-gray-500 uppercase mt-1">שעות פעולה</div>
</div>
<div className="text-center p-4 border border-white/5">
<div className="text-2xl font-black text-white">8,402</div>
<div className="text-[8px] text-gray-500 uppercase mt-1">צפיות בנרטיב</div>
</div>
<div className="text-center p-4 border border-white/5">
<div className="text-2xl font-black text-white">2</div>
<div className="text-[8px] text-gray-500 uppercase mt-1">הדלפות הוכחו</div>
</div>
</div>
</div>
</div>
)}
</main>
</div>

{/* TERMINAL FOOTER */}
<footer className="h-10 border-t border-white/5 bg-black px-8 flex items-center justify-between text-[9px] text-gray-600 font-mono uppercase tracking-[0.2em] shrink-0">
<div className="flex gap-8">
<span className="flex items-center gap-2"><div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse"></div> SYSTEM: ONLINE</span>
<span>LATENCY: 24MS</span>
<span>PEERS: 1,402</span>
</div>
<div>NEXUS_CORE v4.0.2_SINGULARITY &copy; 2026</div>
</footer>
</div>
);
};

// --- האפליקציה המאוחדת ---
const App = () => {
const [session, setSession] = useState(null);
const [initLoading, setInitLoading] = useState(true);

useEffect(() => {
setTimeout(() => setInitLoading(false), 2000);
}, []);

if (initLoading) return <LoadingScreen msg="מאתחל פרוטוקול Nexus..." duration={2000} />;

if (!session) return <AccessPortal onLogin={(data) => setSession(data)} />;

return <NexusOS agentData={session} />;
};
const NexusOS = ({ agentData }) => {
const [user, setUser] = useState({
...agentData,
xp: 0,
balance: 1500,
rank: 'Sleeper',
role: agentData.dept === 'Strategy' ? 'General' : 'ActiveAgent', // הגדרת תפקיד לפי מחלקה
bankActive: false
});

const [activeTab, setActiveTab] = useState('Base');
const [isChangingTab, setIsChangingTab] = useState(false);
const [tasks, setTasks] = useState([]);
const [logs, setLogs] = useState(["[SYSTEM] OS Initialized.", "[SEC] Command Layer Active."]);
const [loanTimer, setLoanTimer] = useState(0);
const [emergency, setEmergency] = useState(false);
const [chatMessages, setChatMessages] = useState([{ id: 1, sender: 'SYSTEM', msg: 'Secure channel established.' }]);
const [proposals, setProposals] = useState([]);

// --- פרוטוקולים להפצה (Protocols Library) ---
const PROTOCOLS = [
{ id: 'P7', title: 'פרוטוקול 7: התעוררות', content: 'האמת מוסתרת מאחורי מסכי השליטה. המטריקס קורס. הפיצו את הקוד 777 בכל קבוצה ממשלתית.' },
{ id: 'E1', title: 'ראיות שחיתות משרד הבריאות', content: 'דוח סודי: תקציבים הועברו לחברות קש לצורך שליטה באוכלוסייה. הוכחה מצורפת בלינק מוצפן.' },
{ id: 'M3', title: 'מדריך הגנה לסוכן', content: 'לעולם אל תתחבר ללא VPN. השתמש במכשיר "נקי" לכל משימת הפצה בשטח.' }
];

const changeTab = (tab) => { setIsChangingTab(true); setTimeout(() => { setActiveTab(tab); setIsChangingTab(false); }, 600); };
const addLog = (msg) => setLogs(p => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...p].slice(0, 15));

// --- בוט האדריכל וניהול עולם ---
useEffect(() => {
const heartbeat = setInterval(() => {
if (Math.random() > 0.8) {
const newTask = MISSION_DB[Math.floor(Math.random() * MISSION_DB.length)];
setTasks(p => [ { ...newTask, instanceId: Math.random().toString(36).substr(2, 5) }, ...p ].slice(0, 5));
}
if (loanTimer > 0) {
if (loanTimer === 1) { setUser(u => ({ ...u, balance: u.balance + 500 })); addLog("הפקדת חירום בוצעה."); }
setLoanTimer(t => t - 1);
}
}, 1000);
return () => clearInterval(heartbeat);
}, [loanTimer]);

return (
<div className={`min-h-screen bg-black text-green-500 font-mono flex flex-col ${emergency ? 'emergency-active' : ''}`}>
{isChangingTab && <LoadingScreen msg="טוען מודול מסווג..." duration={500} />}

{/* TOP HUD */}
<header className="h-20 border-b border-white/5 bg-black/90 flex items-center justify-between px-8 z-50">
<div className="flex items-center gap-6">
<div className="glitch font-black text-xl italic tracking-widest text-white uppercase">Nexus_{user.role}</div>
<div className="flex gap-4 items-center border-l border-white/10 pl-6 h-8 text-[10px] text-gray-500 uppercase font-bold">
<span className="flex items-center gap-2"><Globe size={12} /> GLOBAL_INTEL</span>
<span className="flex items-center gap-2"><Target size={12} /> RANK: {user.rank}</span>
</div>
</div>
<div className="flex gap-10 items-center">
<div className="text-right">
<div className="text-[9px] text-gray-500 uppercase font-bold">סוכן: {user.codename}</div>
<div className="text-lg font-black text-white italic tracking-tighter">{user.balance.toLocaleString()} NC</div>
</div>
</div>
</header>

<div className="flex-1 flex overflow-hidden">
{/* SIDE NAV */}
<aside className="w-64 border-r border-white/5 flex flex-col bg-zinc-950/50">
<nav className="p-4 flex flex-col gap-1 mt-4">
<SidebarButton id="Base" label="הבסיס" icon={Database} active={activeTab === 'Base'} onClick={() => changeTab('Base')} />
<SidebarButton id="Command" label="מרכז פיקוד" icon={ShieldAlert} active={activeTab === 'Command'} onClick={() => changeTab('Command')} />
<SidebarButton id="Chat" label="צ'אט צללים" icon={Radio} active={activeTab === 'Chat'} onClick={() => changeTab('Chat')} />
<SidebarButton id="Protocols" label="פרוטוקולים" icon={Scroll} active={activeTab === 'Protocols'} onClick={() => changeTab('Protocols')} />
<SidebarButton id="Bank" label="בנק ריבוני" icon={Landmark} active={activeTab === 'Bank'} onClick={() => changeTab('Bank')} />
</nav>

<div className="mt-auto p-4 space-y-4">
{/* כפתור פקודת גנרל ייחודי */}
{user.role === 'General' && (
<div className="p-3 border border-yellow-600/30 bg-yellow-600/5">
<div className="text-[9px] text-yellow-600 font-bold mb-2 uppercase">פקודת גנרל זמינה</div>
<button onClick={() => addLog("בוסט XP גלובלי הופעל ע'י הגנרל!")} className="w-full py-2 bg-yellow-600 text-black text-[10px] font-black uppercase">הפעל בוסט XP</button>
</div>
)}
<button onClick={() => { setEmergency(!emergency); addLog("!! EMERGENCY TRIGGERED !!"); }} className="w-full py-4 bg-red-600 text-white font-black uppercase text-[10px]">כינוס חירום</button>
</div>
</aside>

{/* MAIN DISPLAY */}
<main className="flex-1 p-8 overflow-y-auto relative custom-scrollbar bg-[url('https://transparenttextures.com')]">

{/* PAGE: BASE (Missions) */}
{activeTab === 'Base' && (
<div className="grid grid-cols-12 gap-8 animate-in fade-in duration-500">
<div className="col-span-8 space-y-6">
<h2 className="text-xl font-black uppercase tracking-widest border-b border-white/10 pb-4 flex items-center gap-3"><Activity /> משימות שטח פתוחות</h2>
<div className="grid gap-4">
{tasks.map(t => (
<div key={t.instanceId} className="shadow-card p-6 border border-white/5 bg-zinc-950/40 hover:border-green-500/50 transition-all">
<div className="flex justify-between mb-4">
<span className="text-[10px] text-green-500 font-bold uppercase">סיווג: {t.rank}</span>
<span className="text-sm font-bold text-white">+{t.baseNC} NC</span>
</div>
<h3 className="text-lg font-black text-white mb-2 uppercase"># {t.title}</h3>
<button onClick={() => { setUser(u => ({ ...u, xp: u.xp + t.baseXP, balance: u.balance + t.baseNC })); setTasks(p => p.filter(x => x.instanceId !== t.instanceId)); addLog("משימה הושלמה."); }} className="w-full py-3 border border-green-500/30 text-[10px] font-black uppercase hover:bg-green-500 hover:text-black">בצע משימה והעלה הוכחה</button>
</div>
))}
</div>
</div>
<div className="col-span-4 shadow-card p-5 bg-green-500/5 h-fit">
<h3 className="text-xs font-black uppercase mb-4 flex items-center gap-2"><Terminal size={14} /> לוג מערכת</h3>
<div className="space-y-2 text-[10px] text-gray-500 font-mono">
{logs.map((l, i) => <div key={i} className="border-l border-green-900 pl-2">{l}</div>)}
</div>
</div>
</div>
)}

{/* PAGE: COMMAND (For Generals/Admins) */}
{activeTab === 'Command' && (
<div className="max-w-5xl mx-auto space-y-8 animate-in zoom-in-95">
<h2 className="text-2xl font-black italic text-white uppercase border-b border-red-500 pb-4">מרכז שליטה פיקודי</h2>
<div className="grid grid-cols-3 gap-6">
<div className="shadow-card p-6 border-red-500/30 bg-red-500/5">
<h3 className="text-sm font-black mb-4 uppercase">פעולות על כפופים</h3>
<div className="space-y-3">
<button onClick={() => addLog("עוצר יציאה הופעל לכל הסוכנים.")} className="w-full py-2 bg-red-600/20 text-red-500 border border-red-500 text-[10px] font-bold">הפעל עוצר יציאה</button>
<button onClick={() => addLog("משימות חדשות נשלחו לכל הרכזים.")} className="w-full py-2 bg-green-600/20 text-green-500 border border-green-500 text-[10px] font-bold">שידור משימות המוני</button>
</div>
</div>
<div className="col-span-2 shadow-card p-6 border-white/10">
<h3 className="text-sm font-black mb-4 uppercase text-white">ניטור סוכנים פעילים</h3>
<div className="space-y-2">
{[1, 2, 3].map(i => (
<div key={i} className="flex justify-between items-center p-3 border border-white/5 text-[10px]">
<span>Agent_ID: {400 + i} | Status: <span className="text-green-500">Active</span></span>
<button className="text-red-500 underline uppercase">נתק גישה</button>
</div>
))}
</div>
</div>
</div>
</div>
)}

{/* PAGE: CHAT (Shadow Comm) */}
{activeTab === 'Chat' && (
<div className="max-w-4xl mx-auto h-[70vh] flex flex-col shadow-card border-green-500/20 bg-zinc-950/80">
<div className="p-4 border-b border-white/10 text-xs font-black uppercase tracking-widest text-green-500">ערוץ מוצפן: SHADOW_NET</div>
<div className="flex-1 p-6 overflow-y-auto space-y-4 font-mono text-[11px]">
{chatMessages.map(m => (
<div key={m.id} className="flex gap-4">
<span className="text-gray-600">[{m.sender}]:</span>
<span className="text-green-400">{m.msg}</span>
</div>
))}
</div>
<div className="p-4 border-t border-white/10 flex gap-4">
<input id="chatIn" placeholder="הקלד הודעה מוצפנת..." className="flex-1 bg-black border border-white/10 p-3 text-xs outline-none" />
<button onClick={() => { const v = document.getElementById('chatIn').value; if(v){ setChatMessages([...chatMessages, { id: Date.now(), sender: user.codename, msg: v }]); document.getElementById('chatIn').value=''; } }} className="bg-green-600 text-black px-6 font-black uppercase text-xs">שלח</button>
</div>
</div>
)}

{/* PAGE: PROTOCOLS (Assets for distribution) */}
{activeTab === 'Protocols' && (
<div className="max-w-4xl mx-auto grid gap-6 animate-in slide-in-from-right">
<h2 className="text-xl font-black uppercase italic border-b border-white/10 pb-4">ספריית פרוטוקולים להפצה</h2>
{PROTOCOLS.map(p => (
<div key={p.id} className="shadow-card p-6 border-white/10 bg-white/5">
<div className="flex justify-between mb-4">
<h3 className="text-lg font-black text-white italic">{p.title}</h3>
<span className="text-[10px] bg-white/10 px-2 py-1 uppercase">{p.id}</span>
</div>
<div className="bg-black p-4 border border-white/5 text-xs text-gray-400 mb-4 font-mono leading-relaxed">
{p.content}
</div>
<button onClick={() => { navigator.clipboard.writeText(p.content); addLog(`פרוטוקול ${p.id} הועתק.`); }} className="px-6 py-2 border border-green-500 text-green-500 text-[10px] font-bold uppercase hover:bg-green-500 hover:text-black transition-all">העתק טקסט להפצה</button>
</div>
))}
</div>
)}

{/* ... שאר הדפים (Bank, Archives, Profile) נשארים כפי שהיו ... */}
</main>
</div>
</div>
);
};

export default App;
