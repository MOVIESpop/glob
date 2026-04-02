import React, { useState, useEffect, useCallback } from 'react';
import {
Shield, AlertTriangle, Landmark, Users, Zap, Scroll,
Sword, TrendingUp, Lock, Terminal, Eye, Briefcase,
ChevronRight, Database, Wifi, Globe, Activity
} from 'lucide-react';

// --- הגדרות יסוד ומערכי נתונים ---
const RANKS = ['Sleeper', 'Seeker', 'Awakened', 'Operator', 'Ghost'];
const DEPARTMENTS = ['Strategy', 'Communication', 'Operational'];
const XP_MAP = { Sleeper: 0, Seeker: 500, Awakened: 2500, Operator: 10000, Ghost: 50000 };

const MISSION_TYPES = [
{ title: "הפצת פרוטוקול האמת", baseXP: 120, baseNC: 250, desc: "הפצה ויראלית של מסמכי הליבה בקבוצות תקשורת ממשלתיות." },
{ title: "חשיפת שקר ממסדי", baseXP: 450, baseNC: 900, desc: "שימוש בראיות ה-Nexus להפרכת הודעה רשמית של דובר הממשלה." },
{ title: "גיוס סוכן שטח", baseXP: 600, baseNC: 1500, desc: "אימות הצטרפות של סוכן חדש דרך קישור אישי והדרכתו." },
{ title: "פריצת תודעה דיגיטלית", baseXP: 300, baseNC: 550, desc: "השתלטות נרטיבית על האשטאגים מובילים ברשתות החברתיות." }
];

const INVESTMENT_PLANS = [
{ id: 1, name: 'מסלול מהיר', risk: 'High', yield: '15-25%', time: 120 },
{ id: 2, name: 'מסלול יציב', risk: 'Medium', yield: '5-10%', time: 300 },
{ id: 3, name: 'מסלול בטוח', risk: 'Low', yield: '2-4%', time: 600 }
];

// --- רכיב המערכת הראשי ---
const NexusSingularity = () => {
// 1. משתני מדינה (State) - משתמש
const [user, setUser] = useState({
codename: "Agent_Zero",
xp: 0,
balance: 1500,
rank: 'Sleeper',
dept: 'Operational',
isBankApproved: false,
bankStatus: 'Inactive' // Inactive, Pending, Active
});

// 2. משתני מדינה - מערכת
const [activeTab, setActiveTab] = useState('Base');
const [tasks, setTasks] = useState([]);
const [proposals, setProposals] = useState([]);
const [emergency, setEmergency] = useState(false);
const [loanTimer, setLoanTimer] = useState(0);
const [investments, setInvestments] = useState([]);
const [logs, setLogs] = useState(["[SYSTEM] Nexus Core Online...", "[SEC] Encryption Layer Active."]);

// --- לוגיקת "האדריכל" (Automated World Engine) ---
const addLog = (msg) => setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 10));

const generateNewTask = useCallback(() => {
const type = MISSION_TYPES[Math.floor(Math.random() * MISSION_TYPES.length)];
const newTask = {
id: Math.random().toString(36).substr(2, 9),
...type,
status: 'Available',
timestamp: Date.now()
};
setTasks(prev => [newTask, ...prev].slice(0, 6));
addLog(`משימה חדשה זוהתה: ${type.title}`);
}, []);

// ניהול דרגות אוטומטי
useEffect(() => {
let newRank = 'Sleeper';
if (user.xp >= 50000) newRank = 'Ghost';
else if (user.xp >= 10000) newRank = 'Operator';
else if (user.xp >= 2500) newRank = 'Awakened';
else if (user.xp >= 500) newRank = 'Seeker';

if (newRank !== user.rank) {
setUser(prev => ({ ...prev, rank: newRank }));
addLog(`עלייה בדרגה! סטטוס חדש: ${newRank}`);
}
}, [user.xp]);

// טיימרים והתרחשויות (Heartbeat)
useEffect(() => {
const interval = setInterval(() => {
if (Math.random() > 0.85) generateNewTask();
// עדכון הלוואות
setLoanTimer(t => {
if (t === 1) {
setUser(prev => ({ ...prev, balance: prev.balance + 500 }));
addLog("הפקדת הלוואה: +500 NC לחשבון.");
return 0;
}
return t > 0 ? t - 1 : 0;
});

// עדכון השקעות
setInvestments(prev => prev.map(inv => {
if (inv.time > 0) return { ...inv, time: inv.time - 1 };
if (!inv.completed) {
const profitFactor = inv.risk === 'High' ? (Math.random() * 0.4 - 0.1) : (Math.random() * 0.1);
const finalAmount = Math.floor(inv.amount * (1 + profitFactor));
setUser(u => ({ ...u, balance: u.balance + finalAmount }));
addLog(`השקעה הסתיימה: ${finalAmount} NC הופקדו.`);
return { ...inv, completed: true };
}
return inv;
}).filter(inv => !inv.completed));

}, 1000);
return () => clearInterval(interval);
}, [generateNewTask]);

// --- ממשק משתמש (UI Components) ---

const SidebarButton = ({ id, label, icon: Icon }) => (
<button
onClick={() => setActiveTab(id)}
className={`flex items-center gap-3 w-full p-4 border-l-4 transition-all duration-200 ${
activeTab === id
? 'bg-green-500/10 border-green-500 text-green-500'
: 'border-transparent text-gray-500 hover:bg-white/5 hover:text-gray-300'
}`}
>
<Icon size={20} />
<span className="font-bold tracking-widest text-sm uppercase">{label}</span>
</button>
);

return (
<div className={`min-h-screen flex flex-col bg-black overflow-hidden select-none ${emergency ? 'emergency-active' : ''}`}>

{/* HUD: Top Bar */}
<div className="h-20 border-b border-white/10 flex items-center justify-between px-8 bg-black/80 backdrop-blur-md z-50">
<div className="flex items-center gap-6">
<div className="glitch font-black text-2xl tracking-tighter italic">NEXUS_CORE</div>
<div className="h-8 w-px bg-white/10"></div>
<div className="flex flex-col">
<span className="text-[10px] text-gray-500 uppercase tracking-widest">סטטוס חיבור</span>
<span className="text-xs text-green-500 flex items-center gap-2">
<Wifi size={12} /> מוצפן ומאובטח
</span>
</div>
</div>

<div className="flex gap-8">
<div className="text-right">
<div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">יתרה בבנק</div>
<div className="text-xl font-mono text-white tracking-widest">{user.balance.toLocaleString()} <span className="text-xs text-green-500">NC</span></div>
</div>
<div className="text-right">
<div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">דרגת נאמנות</div>
<div className="text-xl font-mono text-green-500 tracking-widest uppercase italic">{user.rank}</div>
</div>
</div>
</div>

<div className="flex flex-1 overflow-hidden">

{/* Sidebar Nav */}
<aside className="w-64 border-r border-white/10 flex flex-col bg-black/40">
<div className="p-4 flex flex-col gap-1 mt-4">
<SidebarButton id="Base" label="הבסיס" icon={Database} />
<SidebarButton id="WarRoom" label="חדר מלחמה" icon={Sword} />
<SidebarButton id="Bank" label="בנק ריבוני" icon={Landmark} />
<SidebarButton id="Archives" label="ארכיון צללים" icon={Lock} />
</div>

<div className="mt-auto p-4 space-y-4">
<div className="nexus-card p-3 border border-white/5 bg-white/5">
<div className="text-[10px] text-gray-500 mb-2 uppercase">התקדמות לדרגה הבאה</div>
<div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
<div
className="h-full bg-green-500 transition-all duration-500"
style={{ width: `${Math.min(100, (user.xp / 50000) * 100)}%` }}
></div>
</div>
<div className="flex justify-between mt-1 text-[9px] text-gray-500 uppercase">
<span>{user.xp} XP</span>
<span>50,000 XP</span>
</div>
</div>
<button
onClick={() => { setEmergency(!emergency); addLog("פרוטוקול חירום הופעל!"); }}
className="w-full py-4 bg-red-600 text-white font-black hover:bg-red-500 transition-all uppercase italic shadow-[0_0_15px_rgba(220,38,38,0.4)]"
>
כינוס חירום
</button>
</div>
</aside>

{/* MAIN CONTENT WINDOW */}
<main className="flex-1 overflow-y-auto p-8 relative custom-scrollbar">
<div className="scanner-line"></div>

{activeTab === 'Base' && (
<div className="grid grid-cols-12 gap-8 max-w-6xl mx-auto">
{/* Mission Feed */}
<div className="col-span-8 space-y-6">
<div className="flex items-center justify-between border-b border-white/10 pb-4">
<h2 className="text-xl font-bold flex items-center gap-3 uppercase tracking-widest">
<Activity className="text-green-500" size={24} /> עדכונים מבצעיים
</h2>
<span className="text-[10px] bg-green-500/10 text-green-500 px-3 py-1 border border-green-500/30">מעודכן לזמן אמת</span>
</div>

<div className="grid gap-4">
{tasks.length > 0 ? tasks.map(task => (
<div key={task.id} className="shadow-card p-5 group transition-all">
<div className="flex justify-between items-start mb-3">
<div>
<h3 className="text-white font-bold text-lg group-hover:text-green-500 transition-colors uppercase"># {task.title}</h3>
<p className="text-xs text-gray-500 mt-1">{task.desc}</p>
</div>
<div className="text-right">
<div className="text-xs text-yellow-500 font-mono">+{task.baseNC} NC</div>
<div className="text-xs text-blue-400 font-mono">+{task.baseXP} XP</div>
</div>
</div>
<button
onClick={() => {
setUser(prev => ({ ...prev, xp: prev.xp + task.baseXP, balance: prev.balance + task.baseNC }));
setTasks(prev => prev.filter(t => t.id !== task.id));
addLog(`משימה הושלמה: ${task.title}`);
}}
className="w-full mt-4 py-2 border border-green-500/40 text-[10px] uppercase font-bold hover:bg-green-500 hover:text-black transition-all"
>
אשר ביצוע והעלה הוכחות
</button>
</div>
)) : (
<div className="text-center py-20 border border-dashed border-white/10 opacity-30">
<p className="text-sm italic">האדריכל סורק יעדים חדשים במטריקס...</p>
</div>
)}
</div>
</div>

{/* Sidebar Logs */}
<div className="col-span-4 space-y-6">
<div className="shadow-card p-5 bg-green-500/5">
<h3 className="text-xs font-black uppercase mb-4 text-green-500 flex items-center gap-2">
<Terminal size={14} /> יומן מערכת פנימי
</h3>
<div className="space-y-2 font-mono text-[10px]">
{logs.map((log, i) => (
<div key={i} className="text-gray-400 leading-relaxed border-l border-green-900 pl-2">{log}</div>
))}
</div>
</div>

<div className="shadow-card p-5 border-blue-500/30">
<h3 className="text-xs font-black uppercase mb-3 text-blue-400 flex items-center gap-2">
<Users size={14} /> סוכנים פעילים
</h3>
<div className="flex flex-col gap-2">
{[1,2,3,4].map(i => (
<div key={i} className="flex justify-between items-center text-[10px]">
<span className="text-gray-300 italic">Agent_00{i*7}</span>
<span className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse"></span>
</div>
))}
</div>
</div>
</div>
</div>
)}

{activeTab === 'Bank' && (
<div className="max-w-4xl mx-auto space-y-8">
{!user.isBankApproved ? (
<div className="shadow-card p-12 text-center border-yellow-600/30">
<Landmark size={64} className="mx-auto mb-6 text-yellow-600 opacity-50" />
<h2 className="text-3xl font-black mb-4 uppercase italic">אימות ריבונות כספית</h2>
<p className="text-gray-500 text-sm max-w-md mx-auto mb-8">
כדי להשתמש בבנק ה-Nexus, עליך להצהיר נאמנות רשמית ולספק פרטי קשר מוצפנים. האדריכל יאמת את זהותך תוך דקות.
</p>
<button
onClick={() => { setUser(prev => ({ ...prev, isBankApproved: true })); addLog("חשבון בנק אושר ע'י האדריכל."); }}
className="px-10 py-4 bg-yellow-600 text-black font-black uppercase hover:bg-yellow-500 transition-all hover:scale-105"
>
הגש טופס הרשמה רשמי
</button>
</div>
) : (
<div className="grid grid-cols-12 gap-8">
{/* Loans */}
<div className="col-span-5 shadow-card p-6 border-yellow-600/20">
<h3 className="text-xl font-bold mb-6 flex items-center gap-3 italic">
<Zap className="text-yellow-600" size={24} /> הלוואת בזק
</h3>
<p className="text-xs text-gray-500 mb-8">קבל 500 NC מיידית. החזר ייגבה באופן אוטומטי ממשימות עתידיות.</p>

{loanTimer > 0 ? (
<div className="space-y-4">
<div className="h-2 w-full bg-gray-800">
<div className="h-full bg-yellow-600 timer-bar" style={{ width: `${(loanTimer/60)*100}%` }}></div>
</div>
<div className="text-center font-mono text-2xl animate-pulse">הפקדה בביצוע: {loanTimer}s</div>
</div>
) : (
<button
onClick={() => setLoanTimer(60)}
className="w-full py-4 border-2 border-yellow-600 text-yellow-600 font-black uppercase hover:bg-yellow-600 hover:text-black transition-all"
>
בקש 500 NC עכשיו
</button>
)}
</div>

{/* Investments */}
<div className="col-span-7 shadow-card p-6">
<h3 className="text-xl font-bold mb-6 flex items-center gap-3 italic text-green-500">
<TrendingUp size={24} /> זירת השקעות רנדומלית
</h3>
<div className="grid gap-4">
{INVESTMENT_PLANS.map(plan => (
<div key={plan.id} className="p-4 border border-white/5 bg-white/5 flex justify-between items-center group">
<div>
<div className="font-bold text-white uppercase">{plan.name}</div>
<div className="text-[10px] text-gray-500 mt-1">סיכון: {plan.risk} | זמן: {plan.time/60} דקות</div>
</div>
<div className="text-right">
<div className="text-xs text-green-500 mb-2 font-mono">+{plan.yield}</div>
<button
disabled={user.balance < 500}
onClick={() => {
setUser(u => ({ ...u, balance: u.balance - 500 }));
setInvestments(prev => [...prev, { ...plan, amount: 500, completed: false }]);
addLog(`השקעה הופעלה ב${plan.name}.`);
}}
className="px-4 py-1 border border-gray-700 text-[10px] uppercase font-bold hover:border-green-500 hover:text-green-500 disabled:opacity-30"
>
השקע 500
</button>
</div>
</div>
))}
</div>
</div>
</div>
)}
</div>
)}

{activeTab === 'WarRoom' && (
<div className="max-w-5xl mx-auto space-y-8">
<div className="shadow-card p-8 bg-red-500/5 border-red-500/20">
<h2 className="text-2xl font-black mb-6 uppercase tracking-widest text-red-500 italic">חדר מלחמה - הגשת הצעות</h2>
<div className="flex gap-4">
<input
id="propInput"
placeholder="הכנס שם למבצע או הצעת חוק חדשה..."
className="flex-1 bg-black border border-white/10 p-4 font-mono text-sm focus:border-red-500 outline-none transition-all"
/>
<button
onClick={() => {
const val = document.getElementById('propInput').value;
if (!val) return;
setProposals(prev => [{
id: Date.now(), title: val, votes: 0, status: 'Pending', timestamp: new Date()
}, ...prev]);
document.getElementById('propInput').value = '';
addLog("הצעה חדשה נשלחה להצבעת סוכנים.");
}}
className="px-8 bg-red-600 text-white font-black uppercase hover:bg-red-500"
>
שדר הצעה
</button>
</div>
</div>

<div className="grid grid-cols-2 gap-6">
{proposals.map(p => (
<div key={p.id} className="shadow-card p-5 border-gray-800">
<div className="flex justify-between mb-4">
<span className="text-[10px] text-gray-500 italic uppercase">מבצע מס' {p.id.toString().slice(-4)}</span>
<span className="text-[10px] text-red-500 font-bold uppercase animate-pulse">{p.status}</span>
</div>
<h3 className="text-white font-bold text-lg mb-6 italic">"{p.title}"</h3>
<div className="flex gap-4 items-center">
<button
onClick={() => {
setProposals(prev => prev.map(x => x.id === p.id ? { ...x, votes: x.votes + 1, status: x.votes + 1 >= 5 ? 'Approved' : 'Pending' } : x));
}}
className="flex-1 py-2 border border-green-500 text-green-500 text-[10px] font-bold uppercase hover:bg-green-500 hover:text-black transition-all"
>
הצבע בעד ({p.votes})
</button>
<button className="flex-1 py-2 border border-red-500 text-red-500 text-[10px] font-bold uppercase hover:bg-red-500 hover:text-white transition-all opacity-40">
הצבע נגד
</button>
</div>
</div>
))}
</div>
</div>
)}

{activeTab === 'Archives' && (
<div className="max-w-4xl mx-auto h-[60vh] flex flex-col items-center justify-center border border-dashed border-white/10 relative">
<Lock size={80} className="text-white/5 mb-8" />
<div className="text-center">
<h2 className="text-3xl font-black mb-4 uppercase opacity-50 tracking-[0.3em]">הארכיון האסור</h2>
<p className="text-gray-600 text-sm max-w-sm mx-auto mb-10">
גישה למאגרי המידע המקוריים מוגבלת לסוכנים בדרגת <span className="text-white font-bold uppercase italic underline decoration-red-500">Ghost</span> בלבד.
כל ניסיון פריצה יירשם במערכת.
</p>
<div className="flex gap-4 justify-center">
<div className="h-12 w-32 bg-white/5 border border-white/10 blur-sm"></div>
<div className="h-12 w-32 bg-white/5 border border-white/10 blur-sm"></div>
</div>
</div>
{user.rank !== 'Ghost' && (
<div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
<div className="bg-red-600 text-white px-6 py-2 text-[10px] font-black uppercase tracking-widest">גישה חסומה - דרגה נמוכה מדי</div>
</div>
)}
</div>
)}
</main>
</div>

{/* Terminal Footer */}
<footer className="h-10 border-t border-white/10 px-8 flex items-center justify-between text-[9px] text-gray-600 uppercase font-mono tracking-widest bg-black">
<div className="flex gap-6">
<span>Active_Agents: 1,402</span>
<span>Matrix_Stability: 42%</span>
<span>Architect_Logic: [v4.0.2]</span>
</div>
<div>&copy; {new Date().getFullYear()} The Nexus Singularity - Out of the Matrix</div>
</footer>
</div>
);
};

export default NexusSingularity;
