// --- THE NEXUS: UNIFIED OPERATIONAL CORE v1.0 ---
// קובץ מאוחד: בנק, דרגות, משימות, חדר מלחמה ומשתמשים

const { useState, useEffect, useCallback } = React;

// --- נתוני תשתית (Database) ---
const MISSION_DATA = [
{ id: 'M1', title: 'הפצת פרוטוקול 7', xp: 150, money: 300, desc: 'הפצת האמת בקבוצות מדיה ממשלתיות.' },
{ id: 'M2', title: 'חשיפת שקר ממסדי', xp: 450, money: 900, desc: 'הפרכת הודעה רשמית בעזרת ראיות ה-Nexus.' },
{ id: 'M3', title: 'גיוס סוכן שטח', xp: 600, money: 1500, desc: 'אימות והדרכת סוכן חדש לארגון.' },
{ id: 'M4', title: 'ניקוי עקבות דיגיטליים', xp: 250, money: 500, desc: 'מחיקת לוגים משרתי הממשלה.' }
];

const RANKS = ['Sleeper', 'Seeker', 'Awakened', 'Operator', 'Ghost'];

// --- רכיב כניסה (Login System) ---
const AccessPortal = ({ onLogin }) => {
const [form, setForm] = useState({ codename: '', key: '', dept: 'Operational' });
return (
<div className="min-h-screen flex items-center justify-center bg-black p-6">
<div className="w-full max-w-md p-10 border border-green-500/20 bg-zinc-950 shadow-2xl relative">
<div className="text-center mb-10">
<div className="text-3xl font-black text-green-500 italic uppercase mb-2">Nexus Access</div>
<p className="text-[10px] text-gray-600 tracking-widest uppercase">Security Level: Omega-7</p>
</div>
<div className="space-y-6">
<input type="text" placeholder="AGENT_CODENAME" className="w-full bg-black border border-white/10 p-4 text-green-500 font-mono focus:border-green-500 outline-none" onChange={e => setForm({...form, codename: e.target.value})} />
<input type="password" placeholder="NEURAL_KEY" className="w-full bg-black border border-white/10 p-4 text-green-500 font-mono focus:border-green-500 outline-none" onChange={e => setForm({...form, key: e.target.value})} />
<select className="w-full bg-black border border-white/10 p-4 text-green-500 font-mono outline-none" onChange={e => setForm({...form, dept: e.target.value})}>
<option value="Operational">Field Ops</option>
<option value="Strategy">Strategic Intel</option>
<option value="Communication">Psy-Ops</option>
</select>
<button onClick={() => form.codename && onLogin(form)} className="w-full py-4 bg-green-600 text-black font-black uppercase hover:bg-green-500 transition-all">התחבר למערכת</button>
</div>
</div>
</div>
);
};

// --- המערכת המרכזית (Main Core) ---
const NexusOS = ({ agentData }) => {
const [user, setUser] = useState({ ...agentData, xp: 0, balance: 1000, rank: 'Sleeper', bankApproved: false });
const [activeTab, setActiveTab] = useState('Base');
const [tasks, setTasks] = useState([]);
const [proposals, setProposals] = useState([]);
const [loanTimer, setLoanTimer] = useState(0);
const [logs, setLogs] = useState(["[SYSTEM] Core v1.0 Online."]);
const [emergency, setEmergency] = useState(false);

const addLog = (msg) => setLogs(p => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...p].slice(0, 8));

// מנוע האדריכל (Auto-Generator)
useEffect(() => {
const heartbeat = setInterval(() => {
if (Math.random() > 0.8) {
const t = MISSION_DATA[Math.floor(Math.random() * MISSION_DATA.length)];
setTasks(prev => [{ ...t, iid: Math.random().toString(36).substr(2, 5) }, ...prev].slice(0, 4));
}
if (loanTimer > 0) {
if (loanTimer === 1) { setUser(u => ({ ...u, balance: u.balance + 500 })); addLog("הלוואה הופקדה."); }
setLoanTimer(t => t - 1);
}
}, 1000);
return () => clearInterval(heartbeat);
}, [loanTimer]);

// עדכון דרגות אוטומטי
useEffect(() => {
const xpIndex = Math.min(Math.floor(user.xp / 1000), 4);
const newRank = RANKS[xpIndex];
if (newRank !== user.rank) { setUser(u => ({ ...u, rank: newRank })); addLog(`דרגה עודכנה: ${newRank}`); }
}, [user.xp]);

return (
<div className={`min-h-screen bg-black text-green-500 font-mono flex flex-col ${emergency ? 'animate-pulse bg-red-950/20' : ''}`}>
{/* Header HUD */}
<header className="h-20 border-b border-white/10 bg-black flex items-center justify-between px-8">
<div className="text-2xl font-black italic text-white uppercase tracking-tighter">Nexus_Core</div>
<div className="flex gap-8 text-right">
<div><div className="text-[10px] text-gray-500 uppercase">יתרה</div><div className="text-xl text-white font-bold">{user.balance} NC</div></div>
<div><div className="text-[10px] text-gray-500 uppercase">דרגה</div><div className="text-xl text-green-500 uppercase italic font-bold">{user.rank}</div></div>
</div>
</header>

<div className="flex flex-1 overflow-hidden">
{/* Sidebar Nav */}
<aside className="w-64 border-r border-white/10 flex flex-col bg-zinc-950/50">
<nav className="p-4 flex flex-col gap-2 mt-4">
<button onClick={() => setActiveTab('Base')} className={`p-4 text-xs font-black uppercase text-left ${activeTab === 'Base' ? 'bg-green-500 text-black' : 'text-gray-500'}`}>הבסיס</button>
<button onClick={() => setActiveTab('WarRoom')} className={`p-4 text-xs font-black uppercase text-left ${activeTab === 'WarRoom' ? 'bg-green-500 text-black' : 'text-gray-500'}`}>חדר מלחמה</button>
<button onClick={() => setActiveTab('Bank')} className={`p-4 text-xs font-black uppercase text-left ${activeTab === 'Bank' ? 'bg-green-500 text-black' : 'text-gray-500'}`}>בנק המרכזי</button>
</nav>
<div className="mt-auto p-4 space-y-4">
<button onClick={() => setEmergency(!emergency)} className="w-full py-4 bg-red-600 text-white font-black uppercase text-[10px]">כינוס חירום</button>
</div>
</aside>

{/* Main Display */}
<main className="flex-1 p-8 overflow-y-auto relative">
{activeTab === 'Base' && (
<div className="grid grid-cols-12 gap-8">
<div className="col-span-8 space-y-6">
<h2 className="text-xl font-black uppercase border-b border-white/10 pb-4">משימות שטח פתוחות</h2>
{tasks.map(t => (
<div key={t.iid} className="p-6 border border-white/5 bg-zinc-950/40 shadow-xl">
<div className="flex justify-between mb-4"><span className="text-[10px] text-green-500 font-bold uppercase">Target_ID: {t.id}</span><span className="text-white">+{t.money} NC</span></div>
<h3 className="text-lg font-black text-white uppercase italic"># {t.title}</h3>
<p className="text-xs text-gray-500 mt-2 mb-4">{t.desc}</p>
<button onClick={() => { setUser(u => ({ ...u, xp: u.xp + t.xp, balance: u.balance + t.money })); setTasks(p => p.filter(x => x.iid !== t.iid)); addLog("משימה הושלמה."); }} className="w-full py-2 border border-green-500/40 text-[10px] font-black uppercase hover:bg-green-500 hover:text-black">אשר ביצוע</button>
</div>
))}
</div>
<div className="col-span-4 p-5 bg-green-500/5 border border-green-500/10 h-fit">
<h3 className="text-xs font-black uppercase mb-4 text-green-500">יומן מערכת</h3>
<div className="space-y-2 text-[10px] text-gray-500 font-mono">
{logs.map((l, i) => <div key={i} className="border-l border-green-900 pl-2 leading-relaxed">{l}</div>)}
</div>
</div>
</div>
)}

{activeTab === 'WarRoom' && (
<div className="max-w-4xl mx-auto space-y-8">
<div className="p-8 border border-red-500/20 bg-red-500/5">
<h2 className="text-2xl font-black text-red-500 uppercase italic mb-6">שידור הצעת מבצע</h2>
<div className="flex gap-4">
<input id="opIn" placeholder="הזן שם למבצע..." className="flex-1 bg-black border border-white/10 p-4 text-sm font-mono text-green-500 outline-none" />
<button onClick={() => { const v = document.getElementById('opIn').value; if(v){ setProposals([{ id: Date.now(), title: v, votes: 0, status: 'Active' }, ...proposals]); document.getElementById('opIn').value=''; addLog("הצעה נשלחה."); } }} className="px-10 bg-red-600 text-white font-black uppercase hover:bg-red-500">שדר</button>
</div>
</div>
<div className="grid grid-cols-2 gap-6">
{proposals.map(p => (
<div key={p.id} className="p-6 border border-gray-800 bg-zinc-950/40">
<div className="text-[9px] text-gray-500 uppercase mb-2">Ref: {p.id.toString().slice(-4)}</div>
<h3 className="text-white text-lg font-black mb-6 italic uppercase">"{p.title}"</h3>
<button onClick={() => setProposals(prev => prev.map(x => x.id === p.id ? {...x, votes: x.votes + 1} : x))} className="w-full py-2 border border-green-500 text-green-500 text-[10px] font-bold uppercase hover:bg-green-500 hover:text-black">בעד ({p.votes})</button>
</div>
))}
</div>
</div>
)}

{activeTab === 'Bank' && (
<div className="max-w-4xl mx-auto space-y-8">
{!user.bankApproved ? (
<div className="p-12 text-center border border-yellow-600/30 bg-yellow-600/5">
<h2 className="text-3xl font-black text-white uppercase italic mb-4">Central Bank</h2>
<p className="text-gray-500 text-xs mb-8">יש להצהיר נאמנות רשמית כדי לפתוח חשבון ריבוני.</p>
<button onClick={() => { setUser(u => ({ ...u, bankApproved: true })); addLog("חשבון בנק נפתח."); }} className="px-12 py-5 bg-yellow-600 text-black font-black uppercase hover:bg-yellow-500">פתח חשבון בנק</button>
</div>
) : (
<div className="grid grid-cols-2 gap-8">
<div className="p-8 border border-yellow-600/20 bg-yellow-600/5">
<h3 className="text-xl font-black mb-6 text-yellow-600 italic uppercase">הלוואת חירום</h3>
<p className="text-[10px] text-gray-500 mb-8">קבלת 500 NC ליתרה שלך. זמן הפקדה: 60 שניות.</p>
{loanTimer > 0 ? (
<div className="text-center font-mono text-3xl text-white">00:{loanTimer < 10 ? `0${loanTimer}` : loanTimer}</div>
) : (
<button onClick={() => setLoanTimer(60)} className="w-full py-4 border-2 border-yellow-600 text-yellow-600 font-black uppercase hover:bg-yellow-600 hover:text-black">בקש 500 NC</button>
)}
</div>
<div className="p-8 bg-zinc-950/40 border border-white/5">
<h3 className="text-xl font-black text-green-500 italic mb-6 uppercase">השקעות</h3>
<div className="space-y-4">
{['מהיר (15%)', 'מאוזן (8%)', 'שמרני (3%)'].map((p, i) => (
<div key={i} className="flex justify-between items-center p-4 border border-white/5 hover:border-green-500/30">
<span className="text-xs font-bold uppercase text-white">{p}</span>
<button disabled={user.balance < 500} onClick={() => { setUser(u => ({ ...u, balance: u.balance - 500 })); addLog("השקעה בוצעה."); }} className="px-6 py-2 border border-gray-700 text-[10px] font-black uppercase hover:border-green-500">השקע 500</button>
</div>
))}
</div>
</div>
</div>
)}
</div>
)}
</main>
</div>
<footer className="h-10 border-t border-white/5 bg-black px-8 flex items-center justify-between text-[9px] text-gray-600 font-mono uppercase tracking-[0.2em]">
<span>STATUS: ONLINE // PEERS: 1,402 // NODE: HQ_ISR</span>
<div>NEXUS_OS &copy; 2026</div>
</footer>
</div>
);
};

// --- האפליקציה המאוחדת ---
const App = () => {
const [session, setSession] = useState(null);
if (!session) return <AccessPortal onLogin={(data) => setSession(data)} />;
return <NexusOS agentData={session} />;
};

// רינדור המערכת
const rootElement = document.getElementById('root');
if (rootElement) {
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
}
