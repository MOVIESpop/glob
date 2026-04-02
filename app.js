// --- THE NEXUS: OMNISCIENCE PROTOCOL v6.0 [ULTIMATE EDITION] ---
// מערכת הפעלה ריבונית לארגון צללים - קוד מקור מלא

const { useState, useEffect, useCallback, useRef, useMemo } = React;

// --- DATABASE & CONFIG ---
const RANKS = ['Sleeper', 'Seeker', 'Awakened', 'Operator', 'Ghost'];
const DEPARTMENTS = {
Operational: { label: 'Field Operations', color: '#ff4d4d', icon: 'Sword' },
Strategy: { label: 'Strategic Intelligence', color: '#00d4ff', icon: 'Cpu' },
Communication: { label: 'Psy-Ops & Media', color: '#bd00ff', icon: 'Radio' }
};

const MISSION_POOL = [
{ id: 'M-101', title: "הפצת פרוטוקול 7", baseXP: 150, baseNC: 300, rank: 'Sleeper', type: 'Intel', desc: "הפצה ויראלית של מסמכי הליבה בקבוצות תקשורת ממשלתיות." },
{ id: 'M-204', title: "ניקוי עקבות בשרתי הממשלה", baseXP: 500, baseNC: 1200, rank: 'Seeker', type: 'Cyber', desc: "חדירה לשרתים ממשלתיים ומחיקת לוגים של סוכני Nexus." },
{ id: 'M-505', title: "חדירה לשידור חי", baseXP: 1500, baseNC: 4000, rank: 'Awakened', type: 'PsyOp', desc: "שידור מסר 'התעוררות' בפריים טיים דרך פריצת תדרים." },
{ id: 'M-909', title: "פירוק תא סוכני מערכת", baseXP: 5000, baseNC: 12000, rank: 'Operator', type: 'Tactical', desc: "זיהוי ונטרול של סוכני מטריקס המנסים לחדור לארגון." },
{ id: 'M-000', title: "משימת רפאים: חיסול נרטיב", baseXP: 10000, baseNC: 30000, rank: 'Ghost', type: 'Singularity', desc: "מחיקה מוחלטת של אירוע חדשותי מכל רחבי הרשת." }
];

const PROTOCOLS_DB = [
{ id: 'P-07', title: 'פרוטוקול 7: התעוררות', content: 'האמת מוסתרת מאחורי מסכי השליטה. המטריקס קורס. הפיצו את הקוד 777 בכל קבוצה ממשלתית.' },
{ id: 'E-12', title: 'ראיות שחיתות משרד הבריאות', content: 'דוח סודי: תקציבים הועברו לחברות קש לצורך שליטה באוכלוסייה. הוכחה מצורפת בלינק מוצפן.' },
{ id: 'M-33', title: 'מדריך הגנה לסוכן', content: 'לעולם אל תתחבר ללא VPN. השתמש במכשיר "נקי" לכל משימת הפצה בשטח.' },
{ id: 'X-99', title: 'פרוטוקול השמדה עצמית', content: 'במקרה של מעצר: הקלד "WIPE" בטרמינל האישי. כל הנתונים יימחקו לצמיתות.' }
];

// --- UI COMPONENTS ---

// מסך טעינה ביומטרי
const LoadingShader = ({ msg, onDone }) => {
const [percent, setPercent] = useState(0);
useEffect(() => {
const int = setInterval(() => {
setPercent(p => {
if (p >= 100) { clearInterval(int); setTimeout(onDone, 500); return 100; }
return p + 1;
});
}, 20);
return () => clearInterval(int);
}, []);
return (
<div className="fixed inset-0 z-[999] bg-black flex flex-col items-center justify-center font-mono">
<div className="w-64 h-1 border border-green-900 mb-4 relative overflow-hidden">
<div className="h-full bg-green-500 transition-all duration-100" style={{ width: `${percent}%` }}></div>
</div>
<div className="text-[10px] text-green-500 uppercase tracking-[0.4em] animate-pulse">{msg} [{percent}%]</div>
</div>
);
};

// פורטל כניסה
const AccessPortal = ({ onLogin }) => {
const [formData, setFormData] = useState({ codename: '', key: '', dept: 'Operational' });
const [isBooting, setIsBooting] = useState(false);

if (isBooting) return <LoadingShader msg="מבצע אימות ביומטרי..." onDone={() => onLogin(formData)} />;

return (
<div className="min-h-screen flex items-center justify-center p-6 relative">
<div className="w-full max-w-md p-10 border border-green-500/20 bg-black/95 backdrop-blur-xl z-10 shadow-2xl relative">
<div className="scanner-line"></div>
<div className="text-center mb-10">
<div className="glitch text-4xl font-black text-green-500 italic tracking-tighter uppercase mb-2">Nexus Portal</div>
<p className="text-[9px] text-gray-600 tracking-[0.4em] uppercase">Security Level: Omega-Prime</p>
</div>
<div className="space-y-6">
<div className="space-y-1">
<label className="text-[9px] text-gray-500 uppercase font-bold ml-1">Agent Codename</label>
<input type="text" placeholder="IDENT_ID" className="w-full bg-black border border-white/10 p-4 text-green-500 font-mono text-sm focus:border-green-500 outline-none" onChange={e => setFormData({...formData, codename: e.target.value})} />
</div>
<div className="space-y-1">
<label className="text-[9px] text-gray-500 uppercase font-bold ml-1">Neural Key</label>
<input type="password" placeholder="••••••••" className="w-full bg-black border border-white/10 p-4 text-green-500 font-mono text-sm focus:border-green-500 outline-none" onChange={e => setFormData({...formData, key: e.target.value})} />
</div>
<div className="space-y-1">
<label className="text-[9px] text-gray-500 uppercase font-bold ml-1">Tactical Assignment</label>
<select className="w-full bg-black border border-white/10 p-4 text-green-500 font-mono text-sm outline-none cursor-pointer" onChange={e => setFormData({...formData, dept: e.target.value})}>
<option value="Operational">Field Operations (The Fist)</option>
<option value="Strategy">Strategic Intelligence (The Brain)</option>
<option value="Communication">Psy-Ops & Influence (The Echo)</option>
</select>
</div>
<button onClick={() => formData.codename && setIsBooting(true)} className="w-full py-5 bg-green-600 text-black font-black uppercase text-sm hover:bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all active:scale-95">
ACCESS TERMINAL
</button>
</div>
</div>
</div>
);
};

// --- CORE SYSTEM (THE ARCHITECT) ---
const NexusOS = ({ agentData }) => {
const [user, setUser] = useState({
...agentData,
xp: 0,
balance: 2000,
rank: 'Sleeper',
role: agentData.dept === 'Strategy' ? 'General' : 'ActiveAgent',
bankActive: false,
stats: { missions: 0, leaks: 0, influence: 42 }
});

const [activeTab, setActiveTab] = useState('Base');
const [isLoading, setIsLoading] = useState(false);
const [tasks, setTasks] = useState([]);
const [logs, setLogs] = useState(["[SYSTEM] Nexus Core v6.0 Initialized.", "[SEC] Neural Link Stable."]);
const [loanTimer, setLoanTimer] = useState(0);
const [emergency, setEmergency] = useState(false);
const [chat, setChat] = useState([{ id: 1, s: 'SYSTEM', m: 'Channel encrypted. Welcome, ' + agentData.codename }]);
const [proposals, setProposals] = useState([]);
const [notifications, setNotifications] = useState([]);

// אפקט מעבר חלק בין דפים
const navTo = (tab) => {
setIsLoading(true);
setTimeout(() => { setActiveTab(tab); setIsLoading(false); }, 600);
};

const addLog = (msg) => setLogs(p => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...p].slice(0, 15));
const addNotify = (msg) => {
const id = Date.now();
setNotifications(p => [...p, { id, msg }]);
setTimeout(() => setNotifications(p => p.filter(n => n.id !== id)), 5000);
};

// מנוע האדריכל (The Architect Engine)
useEffect(() => {
const heartbeat = setInterval(() => {
// ייצור משימות אוטומטי
if (Math.random() > 0.85) {
const eligible = MISSION_POOL.filter(m => RANKS.indexOf(m.rank) <= RANKS.indexOf(user.rank));
const t = eligible[Math.floor(Math.random() * eligible.length)];
setTasks(p => [{ ...t, iid: Math.random().toString(36).substr(2, 5) }, ...p].slice(0, 5));
addNotify(`משימה חדשה זוהתה: ${t.title}`);
}

// טיפול בהלוואות בנק
if (loanTimer > 0) {
if (loanTimer === 1) {
setUser(u => ({ ...u, balance: u.balance + 1000 }));
addLog("הפקדת הלוואה אושרה: +1000 NC");
addNotify("הלוואה הופקדה לחשבון");
}
setLoanTimer(t => t - 1);
}
}, 1000);
return () => clearInterval(heartbeat);
}, [user.rank, loanTimer]);

// עדכון דרגות אוטומטי לפי XP
useEffect(() => {
const xpIndex = Math.min(Math.floor(user.xp / 1000), 4);
const newRank = RANKS[xpIndex];
if (newRank !== user.rank) {
setUser(u => ({ ...u, rank: newRank }));
addLog(`עלייה בדרגה! סטטוס נוכחי: ${newRank}`);
addNotify(`דרגה עודכנה ל-${newRank}`);
}
}, [user.xp]);

return (
<div className={`min-h-screen bg-black text-green-500 font-mono flex flex-col overflow-hidden selection:bg-green-500 selection:text-black ${emergency ? 'emergency-active' : ''}`}>
{isLoading && <LoadingShader msg="טוען מודול מסווג..." />}

{/* TOP HUD (Dashboard Header) */}
<header className="h-20 border-b border-white/5 bg-black/90 flex items-center justify-between px-8 z-50 shadow-2xl">
<div className="flex items-center gap-8">
<div className="glitch font-black text-2xl italic tracking-widest text-white uppercase select-none">Nexus_OS</div>
<div className="h-8 w-px bg-white/10 hidden md:block"></div>
<div className="hidden md:flex gap-6 items-center text-[10px] text-gray-500 uppercase font-bold">
<div className="flex items-center gap-2"><div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div> SYSTEM: ONLINE</div>
<div>NODE: HQ_ISR_NODE_01</div>
<div>SEC_LEVEL: {user.rank === 'Ghost' ? 'ROOT' : 'LEVEL_4'}</div>
</div>
</div>

<div className="flex gap-10">
<div className="text-right">
<div className="text-[9px] text-gray-500 uppercase font-black">עושר ריבוני</div>
<div className="text-xl font-black text-white tracking-tighter">{user.balance.toLocaleString()} <span className="text-green-500 text-xs">NC</span></div>
</div>
<div className="text-right">
<div className="text-[9px] text-gray-500 uppercase font-black">סיווג סוכן</div>
<div className="text-xl font-black text-green-500 italic uppercase tracking-widest">{user.rank}</div>
</div>
</div>
</header>

<div className="flex flex-1 overflow-hidden">
{/* SIDE NAVIGATION (The Sidebar) */}
<aside className="w-64 border-r border-white/5 flex flex-col bg-zinc-950/50 backdrop-blur-sm">
<div className="p-6">
<div className="text-[10px] text-gray-600 uppercase mb-4 tracking-widest">Main Modules</div>
<nav className="space-y-1">
<NavBtn id="Base" label="הבסיס" icon="Database" active={activeTab === 'Base'} onClick={() => navTo('Base')} />
<NavBtn id="WarRoom" label="חדר מלחמה" icon="Sword" active={activeTab === 'WarRoom'} onClick={() => navTo('WarRoom')} />
<NavBtn id="Command" label="מרכז פיקוד" icon="ShieldAlert" active={activeTab === 'Command'} onClick={() => navTo('Command')} />
<NavBtn id="Protocols" label="פרוטוקולים" icon="Scroll" active={activeTab === 'Protocols'} onClick={() => navTo('Protocols')} />
<NavBtn id="Bank" label="בנק ריבוני" icon="Landmark" active={activeTab === 'Bank'} onClick={() => navTo('Bank')} />
<NavBtn id="Chat" label="צ'אט צללים" icon="Radio" active={activeTab === 'Chat'} onClick={() => navTo('Chat')} />
<NavBtn id="Profile" label="תיק סוכן" icon="UserCheck" active={activeTab === 'Profile'} onClick={() => navTo('Profile')} />
</nav>
</div>

<div className="mt-auto p-6 space-y-4">
{user.role === 'General' && (
<div className="p-4 border border-yellow-600/30 bg-yellow-600/5 rounded-sm">
<div className="text-[9px] text-yellow-600 font-bold mb-2 uppercase">General Authorization</div>
<button onClick={() => { addLog("בוסט XP גלובלי הופעל ע'י הגנרל!"); addNotify("GLOBAL XP BOOST ACTIVE"); }} className="w-full py-2 bg-yellow-600 text-black text-[10px] font-black uppercase hover:bg-yellow-500">ACTIVATE XP BOOST</button>
</div>
)}
<button onClick={() => { setEmergency(!emergency); addLog("!! EMERGENCY TRIGGERED !!"); }} className="w-full py-4 bg-red-600 text-white font-black uppercase text-[11px] hover:bg-red-500 shadow-lg shadow-red-900/30 transition-all">כינוס חירום</button>
</div>
</aside>

{/* MAIN MODULE CONTENT */}
<main className="flex-1 p-8 overflow-y-auto relative custom-scrollbar">
<div className="scanner-line opacity-10"></div>

{/* NOTIFICATION TOASTS */}
<div className="fixed top-24 right-8 z-50 space-y-2 pointer-events-none">
{notifications.map(n => (
<div key={n.id} className="bg-black border-l-4 border-green-500 p-4 shadow-2xl animate-in slide-in-from-right duration-300 w-64">
<div className="text-[10px] text-green-500 font-black uppercase mb-1">מערכת ה-Nexus</div>
<div className="text-xs text-white italic">{n.msg}</div>
</div>
))}
</div>

{/* PAGE: BASE (Intel Feed) */}
{activeTab === 'Base' && (
<div className="grid grid-cols-12 gap-8 animate-in fade-in duration-700">
<div className="col-span-8 space-y-8">
<h2 className="text-2xl font-black uppercase tracking-[0.2em] border-b border-white/10 pb-4 flex items-center gap-4">
<div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div> משימות שטח פעילות
</h2>
<div className="grid gap-6">
{tasks.map(t => (
<div key={t.iid} className="shadow-card p-6 border border-white/5 bg-zinc-950/40 hover:border-green-500/50 transition-all group relative">
<div className="absolute top-0 right-0 p-2 text-[8px] text-gray-800 font-mono uppercase">ID_{t.id}</div>
<div className="flex justify-between items-start mb-4">
<div>
<div className="text-[9px] text-green-500 font-bold uppercase mb-1">Classification: {t.rank}</div>
<h3 className="text-xl font-black text-white group-hover:text-green-400 transition-colors uppercase italic tracking-tight"># {t.title}</h3>
<p className="text-xs text-gray-500 mt-2 max-w-lg leading-relaxed">{t.desc}</p>
</div>
<div className="text-right">
<div className="text-lg font-black text-yellow-600">+{t.baseNC} <span className="text-[10px]">NC</span></div>
<div className="text-xs font-bold text-blue-500">+{t.baseXP} XP</div>
</div>
</div>
<button onClick={() => {
setUser(u => ({ ...u, xp: u.xp + t.baseXP, balance: u.balance + t.baseNC, stats: {...u.stats, missions: u.stats.missions + 1} }));
setTasks(p => p.filter(x => x.iid !== t.iid));
addLog(`משימה הושלמה בהצלחה: ${t.title}`);
addNotify("משימה הושלמה: נתונים הועלו");
}} className="w-full mt-4 py-3 border border-green-500/30 text-[11px] font-black uppercase hover:bg-green-500 hover:text-black transition-all">
בצע משימה והעלה הוכחות (Verification Required)
</button>
</div>
))}
{tasks.length === 0 && <div className="py-32 flex flex-col items-center opacity-20"><div className="w-12 h-12 border-4 border-t-green-500 rounded-full animate-spin mb-4"></div><div className="italic uppercase text-sm tracking-widest">Scanning Matrix for Targets...</div></div>}
</div>
</div>
<div className="col-span-4 space-y-8">
<div className="shadow-card p-6 border-green-500/20 bg-green-500/5">
<h3 className="text-xs font-black uppercase mb-6 flex items-center gap-2"><div className="h-2 w-2 bg-green-500"></div> יומן אירועים (System Log)</h3>
<div className="space-y-3 font-mono text-[10px]">
{logs.map((l, i) => <div key={i} className="text-gray-500 leading-relaxed border-l-2 border-green-900/50 pl-3 py-1 hover:text-green-400 transition-colors">{l}</div>)}
</div>
</div>
<div className="shadow-card p-6 bg-zinc-950/80 border-white/5">
<h3 className="text-xs font-black uppercase mb-4 text-white">Active Node Peers</h3>
<div className="space-y-3">
{[1,2,3,4].map(i => (
<div key={i} className="flex justify-between items-center p-2 border-b border-white/5">
<span className="text-[10px] text-gray-400">Agent_Shadow_{i*27}</span>
<div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse"></div>
</div>
))}
</div>
</div>
</div>
</div>
)}

{/* PAGE: WAR ROOM (Operation Planning) */}
{activeTab === 'WarRoom' && (
<div className="max-w-5xl mx-auto space-y-12 animate-in slide-in-from-bottom-8 duration-700">
<div className="shadow-card p-10 border-red-500/30 bg-red-500/5 relative overflow-hidden">
<div className="absolute top-0 right-0 p-4 opacity-10"><Sword size={80} /></div>
<h2 className="text-3xl font-black text-red-500 uppercase italic mb-8 tracking-tighter">שידור הצעת מבצע / תקיפה תודעתית</h2>
<div className="flex gap-4">
<input id="opInput" placeholder="הזן שם קוד למבצע או הצעת חוק חדשה..." className="flex-1 bg-black border border-white/10 p-5 text-sm font-mono text-red-500 focus:border-red-500 outline-none transition-all uppercase" />
<button onClick={() => {
const v = document.getElementById('opInput').value;
if(v){
setProposals([{ id: Date.now(), title: v, votes: 0, status: 'Active', proposer: user.codename }, ...proposals]);
document.getElementById('opInput').value='';
addLog("הצעה חדשה נשלחה להצבעת מפקדים.");
addNotify("הצעה שודרה לחדר המלחמה");
}
}} className="px-12 bg-red-600 text-white font-black uppercase text-xs hover:bg-red-500 shadow-xl shadow-red-900/30">שדר הצעה</button>
</div>
</div>

<div className="grid grid-cols-2 gap-8">
{proposals.map(p => (
<div key={p.id} className="shadow-card p-8 border-gray-800 bg-zinc-950/40 relative">
<div className="flex justify-between items-center mb-6">
<div className="text-[10px] text-gray-500 uppercase font-bold">Proposer: {p.proposer}</div>
<div className="px-3 py-1 bg-red-600/20 text-red-500 text-[9px] font-black uppercase animate-pulse border border-red-500/30">{p.status}</div>
</div>
<h3 className="text-white text-xl font-black italic mb-8 uppercase tracking-tight">"{p.title}"</h3>
<div className="grid grid-cols-2 gap-4">
<button onClick={() => {
setProposals(prev => prev.map(x => x.id === p.id ? {...x, votes: x.votes + 1} : x));
addNotify("הצבעה נקלטה במערכת");
}} className="py-4 border border-green-500 text-green-500 font-black text-[11px] uppercase hover:bg-green-500 hover:text-black transition-all">
בעד ({p.votes})
</button>
<button className="py-4 border border-red-500 text-red-500 font-black text-[11px] uppercase opacity-30 cursor-not-allowed">נגד</button>
</div>
<div className="mt-6 text-[8px] text-center text-gray-700 uppercase">Requires 5 votes to authorize</div>
</div>
))}
</div>
</div>
)}

{/* PAGE: COMMAND (General Access) */}
{activeTab === 'Command' && (
<div className="max-w-6xl mx-auto space-y-10 animate-in zoom-in-95 duration-500">
<h2 className="text-3xl font-black italic text-white uppercase border-b-2 border-red-600 pb-6 tracking-widest">מרכז שליטה ובקרה (C2 Center)</h2>
<div className="grid grid-cols-12 gap-8">
<div className="col-span-4 space-y-6">
<div className="shadow-card p-6 border-red-500/40 bg-red-950/10">
<h3 className="text-sm font-black mb-6 uppercase text-red-500 flex items-center gap-2"><ShieldAlert size={18} /> פקודות על כפופים</h3>
<div className="space-y-4">
<CmdBtn label="הפעל עוצר יציאה גלובלי" color="red" onClick={() => addLog("פקודת עוצר יציאה הופעלה.")} />
<CmdBtn label="שידור משימות המוני" color="green" onClick={() => addLog("משימות חדשות נשלחו לכל הסוכנים.")} />
<CmdBtn label="נעילת מסד נתונים" color="blue" onClick={() => addLog("מסד הנתונים ננעל למשתמשים זוטרים.")} />
</div>
</div>
<div className="shadow-card p-6 border-white/5 bg-zinc-900/40">
<h3 className="text-xs font-black mb-4 uppercase text-gray-400">System Integrity</h3>
<div className="h-2 w-full bg-gray-800 rounded-full mb-2"><div className="h-full bg-green-500 w-[94%]"></div></div>
<div className="text-[9px] text-gray-500 uppercase">Neural Link: 94% Stability</div>
</div>
</div>
<div className="col-span-8 shadow-card p-8 border-white/10 bg-black/40">
<h3 className="text-sm font-black mb-6 uppercase text-white flex items-center gap-2"><Users size={18} /> ניטור סוכנים פעילים בזמן אמת</h3>
<div className="space-y-3">
{[1,2,3,4,5,6].map(i => (
<div key={i} className="flex justify-between items-center p-4 border border-white/5 hover:bg-white/5 transition-all group">
<div className="flex items-center gap-4">
<div className={`h-2 w-2 rounded-full ${i % 3 === 0 ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
<span className="text-[11px] font-bold text-gray-300 uppercase">Agent_{300 + i*14}</span>
</div>
<div className="flex items-center gap-6">
<span className="text-[9px] text-gray-600 uppercase italic">Loc: Area_{i*2}</span>
<button className="text-[10px] text-red-500 font-bold uppercase opacity-0 group-hover:opacity-100 hover:underline">Terminate Link</button>
</div>
</div>
))}
</div>
</div>
</div>
</div>
)}

{/* PAGE: PROTOCOLS (Knowledge Assets) */}
{activeTab === 'Protocols' && (
<div className="max-w-4xl mx-auto space-y-10 animate-in slide-in-from-right-8 duration-700">
<h2 className="text-2xl font-black uppercase italic border-b border-white/10 pb-6 flex items-center gap-4"><Scroll /> ספריית פרוטוקולים להפצה המונית</h2>
<div className="grid gap-8">
{PROTOCOLS_DB.map(p => (
<div key={p.id} className="shadow-card p-8 border-white/10 bg-white/5 relative group">
<div className="absolute top-0 right-0 p-4 text-[10px] text-gray-700 font-mono uppercase font-black">{p.id}</div>
<h3 className="text-xl font-black text-white italic mb-4 uppercase">{p.title}</h3>
<div className="bg-black p-6 border border-white/5 text-xs text-gray-400 font-mono leading-relaxed mb-6 select-all">
{p.content}
</div>
<button onClick={() => {
navigator.clipboard.writeText(p.content);
addLog(`פרוטוקול ${p.id} הועתק ללוח העריכה.`);
addNotify("פרוטוקול הועתק: מוכן להפצה");
}} className="px-8 py-3 border border-green-500 text-green-500 text-[11px] font-black uppercase hover:bg-green-500 hover:text-black transition-all">
העתק טקסט להפצה (Copy to Clipboard)
</button>
</div>
))}
</div>
</div>
)}

{/* PAGE: BANK (Economic Sovereignty) */}
{activeTab === 'Bank' && (
<div className="max-w-5xl mx-auto space-y-12 animate-in zoom-in-95 duration-500">
{!user.bankActive ? (
<div className
