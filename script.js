const { useState, useEffect, useCallback, useMemo } = React;

// --- DATABASE ---
const RANKS = ['Sleeper', 'Seeker', 'Awakened', 'Operator', 'Ghost'];
const XP_MAP = { Sleeper: 0, Seeker: 1000, Awakened: 5000, Operator: 20000, Ghost: 100000 };
const MISSIONS = [
{ id: 'M-1', title: 'הפצת פרוטוקול 7', xp: 200, nc: 400, desc: 'הפצה ויראלית של האמת ברשתות חברתיות.' },
{ id: 'M-2', title: 'חשיפת שקר ממשלתי', xp: 600, nc: 1200, desc: 'הפרכת הודעה רשמית בעזרת ראיות מודלפות.' },
{ id: 'M-3', title: 'גיוס סוכן שדה', xp: 1000, nc: 3000, desc: 'אימות והדרכת סוכן חדש דרך קישור מאובטח.' },
{ id: 'M-4', title: 'ניקוי עקבות ביומטרי', xp: 400, nc: 800, desc: 'מחיקת לוגים משרתי המעקב הממשלתיים.' }
];

// --- LOGIN PORTAL ---
const AccessPortal = ({ onLogin }) => {
const [form, setForm] = useState({ code: '', key: '', dept: 'Operational' });
const [status, setStatus] = useState('READY');
const submit = (e) => {
e.preventDefault(); setStatus('AUTHENTICATING...');
setTimeout(() => { if(form.code.length > 3) onLogin(form); else setStatus('ERROR: INVALID CODE'); }, 1500);
};
return (
<div className="min-h-screen flex items-center justify-center p-6">
<div className="w-full max-w-md nexus-card p-10 bg-black/90 border-green-500/20 shadow-2xl">
<div className="scanner-line"></div>
<div className="text-center mb-10">
<div className="glitch text-4xl font-black text-green-500 italic uppercase mb-2">Nexus Portal</div>
<div className="text-[9px] text-gray-600 tracking-[0.4em] uppercase">Security Level: Omega-7</div>
</div>
<form onSubmit={submit} className="space-y-6">
<input type="text" required placeholder="AGENT_CODENAME" className="w-full bg-black border border-white/10 p-4 text-green-500 font-mono text-sm focus:border-green-500 outline-none" onChange={e => setForm({...form, code: e.target.value})} />
<input type="password" required placeholder="NEURAL_KEY" className="w-full bg-black border border-white/10 p-4 text-green-500 font-mono text-sm focus:border-green-500 outline-none" onChange={e => setForm({...form, key: e.target.value})} />
<select className="w-full bg-black border border-white/10 p-4 text-green-500 font-mono text-sm outline-none cursor-pointer" onChange={e => setForm({...form, dept: e.target.value})}>
<option value="Operational">Field Ops (Action)</option>
<option value="Strategy">Strategic Intel (General)</option>
<option value="PsyOp">Psy-Ops (Media)</option>
</select>
<button type="submit" className="w-full py-4 bg-green-600 text-black font-black uppercase text-sm hover:bg-green-500 transition-all">{status}</button>
</form>
</div>
</div>
);
};

// --- CORE SYSTEM ---
const NexusOS = ({ agent }) => {
const [user, setUser] = useState({ ...agent, xp: 0, balance: 2500, rank: 'Sleeper', isBank: false, role: agent.dept === 'Strategy' ? 'General' : 'Agent' });
const [tab, setTab] = useState('Base');
const [tasks, setTasks] = useState([]);
const [proposals, setProposals] = useState([]);
const [logs, setLogs] = useState(["[SYSTEM] Nexus Core 5.0 Online.", "[SEC] Identity Verified."]);
const [loanTimer, setLoanTimer] = useState(0);
const [emergency, setEmergency] = useState(false);
const [chat, setChat] = useState([{ id: 1, s: 'SYSTEM', m: 'Channel secured.' }]);

const log = (msg) => setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 10));

useEffect(() => {
const architect = setInterval(() => {
if (Math.random() > 0.8) {
const t = MISSIONS[Math.floor(Math.random() * MISSIONS.length)];
setTasks(prev => [{ ...t, iid: Math.random().toString(36).substr(2, 5) }, ...prev].slice(0, 5));
}
if (loanTimer > 0) {
if (loanTimer === 1) { setUser(u => ({ ...u, balance: u.balance + 1000 })); log("הלוואה הופקדה: +1000 NC"); }
setLoanTimer(t => t - 1);
}
}, 1000);
return () => clearInterval(architect);
}, [loanTimer]);

useEffect(() => {
const newRank = RANKS.findLast(r => user.xp >= XP_MAP[r]) || 'Sleeper';
if (newRank !== user.rank) { setUser(u => ({ ...u, rank: newRank })); log(`דירוג עודכן: ${newRank}`); }
}, [user.xp]);

const NavItem = ({ id, label, icon: IconName }) => {
const Icon = lucide[IconName];
return (
<button onClick={() => setTab(id)} className={`flex items-center gap-3 w-full p-4 border-l-4 transition-all uppercase text-[10px] font-black tracking-widest ${tab === id ? 'bg-green-500/10 border-green-500 text-green-500' : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}>
<Icon size={18} /> {label}
</button>
);
};

return (
<div className={`min-h-screen flex flex-col bg-black text-green-500 font-mono ${emergency ? 'emergency-active' : ''}`}>
<header className="h-20 border-b border-white/5 bg-black/90 flex items-center justify-between px-8 z-50">
<div className="flex items-center gap-8">
<div className="glitch font-black text-2xl italic tracking-widest text-white uppercase">Nexus_{user.role}</div>
<div className="hidden md:flex gap-6 text-[10px] text-gray-600 uppercase font-bold">
<span>Status: Online</span> | <span>Agent: {user.code}</span> | <span>Rank: {user.rank}</span>
</div>
</div>
<div className="text-right">
<div className="text-[9px] text-gray-500 uppercase font-black">יתרה בבנק</div>
<div className="text-xl font-black text-white tracking-tighter">{user.balance.toLocaleString()} NC</div>
</div>
</header>

<div className="flex flex-1 overflow-hidden">
<aside className="w-64 border-r border-white/5 flex flex-col bg-zinc-950/50 backdrop-blur-sm">
<nav className="p-4 space-y-1 mt-4">
<NavItem id="Base" label="הבסיס" icon="Database" />
<NavItem id="WarRoom" label="חדר מלחמה" icon="Sword" />
<NavItem id="Bank" label="בנק ריבוני" icon="Landmark" />
<NavItem id="Protocols" label="פרוטוקולים" icon="Scroll" />
<NavItem id="Chat" label="צ'אט צללים" icon="Radio" />
</nav>
<div className="mt-auto p-4 space-y-4">
{user.role === 'General' && <button onClick={() => log("!! Global XP Boost Activated !!")} className="w-full py-2 bg-yellow-600 text-black text-[10px] font-black uppercase hover:bg-yellow-500 transition-all">הפעל בוסט XP גלובלי</button>}
<button onClick={() => { setEmergency(!emergency); log("!! EMERGENCY PROTOCOL !!"); }} className="w-full py-4 bg-red-600 text-white font-black uppercase text-[10px] hover:bg-red-500 shadow-lg">כינוס חירום</button>
</div>
</aside>

<main className="flex-1 p-8 overflow-y-auto relative custom-scrollbar">
<div className="scanner-line opacity-10"></div>

{tab === 'Base' && (
<div className="grid grid-cols-12 gap-8 animate-in fade-in duration-700">
<div className="col-span-8 space-y-8">
<h2 className="text-xl font-black uppercase tracking-widest border-b border-white/10 pb-4 flex items-center gap-3">משימות שטח פעילות</h2>
<div className="grid gap-6">
{tasks.map(t => (
<div key={t.iid} className="nexus-card p-6 border border-white/5 bg-zinc-950/40">
<div className="flex justify-between mb-4"><span className="text-[10px] text-green-500 font-bold uppercase">{t.id}</span><span className="text-white font-black">+{t.nc} NC</span></div>
<h3 className="text-lg font-black text-white italic uppercase mb-2"># {t.title}</h3>
<p className="text-xs text-gray-500 mb-6">{t.desc}</p>
<button onClick={() => { setUser(u => ({...u, xp: u.xp + t.xp, balance: u.balance + t.nc})); setTasks(p => p.filter(x => x.iid !== t.iid)); log(`בוצעה משימה: ${t.title}`); }} className="w-full py-3 border border-green-500/30 text-[10px] font-black uppercase hover:bg-green-500 hover:text-black transition-all">אשר ביצוע והעלה ראיות</button>
</div>
))}
{tasks.length === 0 && <div className="py-20 text-center opacity-20 italic">האדריכל סורק יעדים...</div>}
</div>
</div>
<div className="col-span-4 nexus-card p-5 bg-green-500/5 h-fit">
<h3 className="text-xs font-black uppercase mb-4 text-green-500 tracking-widest flex items-center gap-2">יומן מערכת</h3>
<div className="space-y-2 font-mono text-[10px] text-gray-500">{logs.map((l, i) => <div key={i} className="border-l border-green-900/50 pl-3 leading-relaxed">{l}</div>)}</div>
</div>
</div>
)}

{tab === 'WarRoom' && (
<div className="max-w-4xl mx-auto space-y-10 animate-in slide-in-from-bottom-8 duration-700">
<div className="nexus-card p-10 border-red-500/20 bg-red-500/5">
<h2 className="text-2xl font-black text-red-500 uppercase italic mb-8">שידור הצעת מבצע / תקיפה</h2>
<div className="flex gap-4">
<input id="opIn" placeholder="תיאור המבצע..." className="flex-1 bg-black border border-white/10 p-4 text-sm font-mono text-red-500 outline-none focus:border-red-500" />
<button onClick={() => { const v = document.getElementById('opIn').value; if(v){ setProposals([{ id: Date.now(), title: v, votes: 0, status: 'Active' }, ...proposals]); document.getElementById('opIn').value=''; log("הצעה נשלחה."); } }} className="px-12 bg-red-600 text-white font-black uppercase text-xs hover:bg-red-500">שדר</button>
</div>
</div>
<div className="grid grid-cols-2 gap-6">
{proposals.map(p => (
<div key={p.id} className="nexus-card p-6 border-gray-800 bg-zinc-950/40">
<div className="flex justify-between mb-4 text-[9px] uppercase text-gray-600"><span>ID: {p.id.toString().slice(-4)}</span><span className="text-red-500 animate-pulse">{p.status}</span></div>
<h3 className="text-white text-lg font-black italic mb-8 uppercase">"{p.title}"</h3>
<button onClick={() => setProposals(prev => prev.map(x => x.id === p.id ? {...x, votes: x.votes + 1} : x))} className="w-full py-3 border border-green-500 text-green-500 font-black text-[10px] uppercase hover:bg-green-500 hover:text-black transition-all">הצבע בעד ({p.votes})</button>
</div>
))}
</div>
</div>
)}

{tab === 'Bank' && (
<div className="max-w-4xl mx-auto space-y-10 animate-in zoom-in-95 duration-500">
{!user.isBank ? (
<div className="nexus-card p-20 text-center border-yellow-600/30">
<h2 className="text-3xl font-black text-white uppercase italic mb-4">Sovereign Central Bank</h2>
<p className="text-gray-500 text-sm mb-10 max-w-sm mx-auto">יש להצהיר נאמנות ל-Nexus כדי לפתוח חשבון בנק ריבוני.</p>
<button onClick={() => { setUser(u => ({...u, isBank: true})); log("חשבון בנק נפתח."); }} className="px-16 py-6 bg-yellow-600 text-black font-black uppercase text-sm hover:bg-yellow-500 transition-all shadow-xl">הצהר נאמנות ופתח חשבון</button>
</div>
) : (
<div className="grid grid-cols-2 gap-8">
<div className="nexus-card p-10 border-yellow-600/20 bg-yellow-600/5">
<h3 className="text-xl font-black mb-6 text-yellow-600 italic uppercase">הלוואת חירום</h3>
<p className="text-[10px] text-gray-500 mb-8 leading-relaxed">קבל 1000 NC ליתרה. זמן הפקדה: 60 שניות בדיוק.</p>
{loanTimer > 0 ? <div className="text-center font-mono text-4xl text-white py-4 animate-pulse">00:{loanTimer < 10 ? `0${loanTimer}` : loanTimer}</div> : <button onClick={() => setLoanTimer(60)} className="w-full py-5 border-2 border-yellow-600 text-yellow-600 font-black uppercase hover:bg-yellow-600 hover:text-black transition-all">בקש 1000 NC</button>}
</div>
<div className="nexus-card p-10 bg-zinc-950/40 border-white/5">
<h3 className="text-xl font-black text-green-500 italic mb-8 uppercase tracking-widest">השקעות</h3>
{['מהיר (25%)', 'יציב (10%)', 'שמרני (4%)'].map((p, i) => (
<div key={i} className="flex justify-between items-center p-4 border border-white/5 mb-3 bg-white/5 hover:border-green-500/30 transition-all">
<span className="text-[11px] font-black uppercase text-white">{p}</span>
<button disabled={user.balance < 500} onClick={() => { setUser(u => ({...u, balance: u.balance - 500})); log("השקעה בוצעה."); }} className="px-6 py-2 border border-gray-700 text-[10px] font-black uppercase hover:border-green-500 transition-all">השקע 500</button>
</div>
))}
</div>
</div>
)}
</div>
)}

{tab === 'Protocols' && (
<div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-right-8 duration-700">
<h2 className="text-2xl font-black uppercase italic border-b border-white/10 pb-6">ספריית פרוטוקולים להפצה</h2>
{[
{ id: 'P7', t: 'פרוטוקול 7: התעוררות', c: 'האמת מוסתרת מאחורי מסכי השליטה. המטריקס קורס. הפיצו את הקוד 777.' },
{ id: 'E1', t: 'ראיות שחיתות משרד הבריאות', c: 'דוחות פנימיים מוכיחים הסתרה מכוונת של נתוני תמותה כדי לשמר פחד.' },
{ id: 'M3', t: 'מדריך הגנה לסוכן', c: 'לעולם אל תתחבר ללא VPN. השתמש במכשיר "נקי" לכל משימה.' }
].map(p => (
<div key={p.id} className="nexus-card p-8 border-white/10 bg-white/5 relative group">
<div className="absolute top-0 right-0 p-4 text-[10px] text-gray-700 font-mono font-black uppercase">{p.id}</div>
<h3 className="text-xl font-black text-white italic mb-4 uppercase">{p.t}</h3>
<div className="bg-black p-6 border border-white/5 text-xs text-gray-400 font-mono leading-relaxed mb-6 select-all">{p.c}</div>
<button onClick={() => { navigator.clipboard.writeText(p.c); log("פרוטוקול הועתק."); }} className="px-8 py-3 border border-green-500 text-green-500 text-[11px] font-black uppercase hover:bg-green-500 hover:text-black transition-all">העתק להפצה המונית</button>
</div>
))}
</div>
)}

{tab === 'Chat' && (
<div className="max-w-3xl mx-auto h-[60vh] flex flex-col shadow-card nexus-card border-green-500/20 bg-zinc-950/80">
<div className="p-4 border-b border-white/10 text-xs font-black uppercase text-green-500 tracking-widest bg-black/40">Secure Node: SHADOW_NET</div>
<div className="flex-1 p-6 overflow-y-auto space-y-4 font-mono text-[11px] custom-scrollbar">
{chat.map(m => (
<div key={m.id} className="flex gap-4 animate-in fade-in"><span className="text-gray-600">[{m.s}]:</span><span className="text-green-400">{m.m}</span></div>
))}
</div>
<div className="p-4 border-t border-white/10 flex gap-4 bg-black/40">
<input id="chatIn" placeholder="הקלד הודעה מוצפנת..." className="flex-1 bg-black border border-white/10 p-4 text-xs outline-none text-green-500 focus:border-green-500" onKeyPress={e => e.key === 'Enter' && document.getElementById('chatBtn').click()} />
<button id="chatBtn" onClick={() => { const v = document.getElementById('chatIn').value; if(v){ setChat([...chat, { id: Date.now(), s: user.code, m: v }]); document.getElementById('chatIn').value=''; } }} className="bg-green-600 text-black px-10 font-black uppercase text-xs hover:bg-green-500 transition-all">שלח</button>
</div>
</div>
)}
</main>
</div>
<footer className="h-10 border-t border-white/5 bg-black px-8 flex items-center justify-between text-[9px] text-gray-700 uppercase font-mono tracking-[0.4em] bg-black">
<div className="flex gap-8"><span>STATUS: ONLINE</span><span>LATENCY: 22MS</span><span>NODE: HQ_ISR</span></div>
<div>THE NEXUS SINGULARITY &copy; 2026</div>
</footer>
</div>
);
};

// --- APP RENDER ---
const App = () => {
const [session, setSession] = useState(null);
if (!session) return <AccessPortal onLogin={(data) => setSession(data)} />;
return <NexusOS agent={session} />;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
