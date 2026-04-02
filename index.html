import React, { useState, useEffect, useMemo } from 'react';
import { Shield, AlertTriangle, Landmark, Users, Zap, Scroll, Sword, TrendingUp, Lock, Terminal } from 'lucide-react';

// --- סוגי נתונים והגדרות יסוד ---
type Rank = 'Sleeper' | 'Seeker' | 'Awakened' | 'Operator' | 'Ghost';
type Dept = 'Strategy' | 'Communication' | 'Operational';

interface Task {
id: string;
title: string;
description: string;
xpReward: number;
moneyReward: number;
minRank: Rank;
}

interface Proposal {
id: string;
type: 'Law' | 'Operation';
title: string;
proposer: string;
votesFor: number;
votesAgainst: number;
status: 'Pending' | 'Approved' | 'Rejected';
timestamp: number;
}

// --- פונקציות עזר ללוגיקה ---
const RANKS_ORDER: Rank[] = ['Sleeper', 'Seeker', 'Awakened', 'Operator', 'Ghost'];
const XP_REQUIREMENTS: Record<Rank, number> = {
Sleeper: 0,
Seeker: 500,
Awakened: 2500,
Operator: 10000,
Ghost: 50000
};

const getRank = (xp: number): Rank => {
let currentRank: Rank = 'Sleeper';
for (const rank of RANKS_ORDER) {
if (xp >= XP_REQUIREMENTS[rank]) currentRank = rank;
}
return currentRank;
};

// --- המערכת המרכזית ---
const NexusOS = () => {
// 1. ניהול משתמש
const [user, setUser] = useState({
name: "Agent_Zero",
xp: 0,
balance: 1000,
isBankApproved: false,
dept: 'Operational' as Dept,
notifications: [] as string[]
});

// 2. ניהול עולם (משימות, הצבעות, בנק)
const [tasks, setTasks] = useState<Task[]>([]);
const [proposals, setProposals] = useState<Proposal[]>([]);
const [activeInvestments, setActiveInvestments] = useState<any[]>([]);
const [emergencyStatus, setEmergencyStatus] = useState(false);
const [loanCooldown, setLoanCooldown] = useState(0);
const [activeTab, setActiveTab] = useState('Base');

// --- לוגיקת "האדריכל" (בוט אוטונומי) ---
useEffect(() => {
const architectHeartbeat = setInterval(() => {
// יצירת משימה רנדומלית
if (Math.random() > 0.7) {
const newTask: Task = {
id: Math.random().toString(36).substr(2, 9),
title: `מבצע ${['מראה', 'צל', 'ברק', 'שקט'][Math.floor(Math.random() * 4)]}`,
description: "חשיפת נרטיב שקרי במדיה הממסדית והפצת ראיות נגד.",
xpReward: Math.floor(Math.random() * 200) + 50,
moneyReward: Math.floor(Math.random() * 500) + 100,
minRank: RANKS_ORDER[Math.floor(Math.random() * 2)]
};
setTasks(prev => [newTask, ...prev].slice(0, 6));
}

// עדכון השקעות
setActiveInvestments(prev => prev.map(inv => {
if (inv.remainingTime > 0) {
return { ...inv, remainingTime: inv.remainingTime - 1 };
} else if (!inv.collected) {
const profit = inv.amount * (1 + (Math.random() * 0.2 - 0.05)); // רווח/הפסד רנדומלי
setUser(u => ({ ...u, balance: u.balance + profit }));
return { ...inv, collected: true };
}
return inv;
}).filter(inv => !inv.collected));
}, 1000);

return () => clearInterval(architectHeartbeat);
}, []);

// --- לוגיקת בנקאות ---
const requestLoan = () => {
if (loanCooldown > 0) return;
setLoanCooldown(60);
const timer = setInterval(() => {
setLoanCooldown(c => {
if (c <= 1) {
setUser(u => ({ ...u, balance: u.balance + 500 }));
clearInterval(timer);
return 0;
}
return c - 1;
});
}, 1000);
};

// --- לוגיקת חדר מלחמה והצבעות ---
const createProposal = (type: 'Law' | 'Operation', title: string) => {
const newProp: Proposal = {
id: Date.now().toString(),
type,
title,
proposer: user.name,
votesFor: 1,
votesAgainst: 0,
status: 'Pending',
timestamp: Date.now()
};
setProposals(p => [newProp, ...p]);
};

const vote = (id: string, approve: boolean) => {
setProposals(prev => prev.map(p => {
if (p.id === id) {
const newVotesFor = approve ? p.votesFor + 1 : p.votesFor;
const newVotesAgainst = !approve ? p.votesAgainst + 1 : p.votesAgainst;
let newStatus = p.status;
if (newVotesFor >= 5) newStatus = 'Approved';
if (newVotesAgainst >= 5) newStatus = 'Rejected';
return { ...p, votesFor: newVotesFor, votesAgainst: newVotesAgainst, status: newStatus };
}
return p;
}));
};

// --- רכיבי ממשק (UI Components) ---
const StatCard = ({ icon: Icon, label, value, color }: any) => (
<div className="bg-black border border-gray-800 p-4 rounded-none flex items-center gap-4 hover:border-green-500 transition-all">
<div className={`p-3 rounded-full bg-opacity-10 ${color}`}>
<Icon size={24} className={color.replace('bg-', 'text-')} />
</div>
<div>
<p className="text-xs text-gray-500 uppercase tracking-tighter">{label}</p>
<p className="text-xl font-mono font-bold text-white">{value}</p>
</div>
</div>
);

return (
<div className={`min-h-screen bg-neutral-950 text-green-500 font-mono p-4 lg:p-8 transition-colors ${emergencyStatus ? 'animate-pulse bg-red-950/20' : ''}`}>

{/* Header & HUD */}
<header className="max-w-7xl mx-auto mb-8 border-b border-green-900/50 pb-6 flex flex-col md:flex-row justify-between items-center gap-6">
<div>
<h1 className="text-4xl font-black italic tracking-tighter flex items-center gap-3">
THE NEXUS <span className="text-xs bg-green-500 text-black px-2 py-1 not-italic">v3.0_SINGULARITY</span>
</h1>
<p className="text-xs text-gray-400 mt-1 uppercase">מערכת הפעלה ריבונית ליציאה מהמטריקס</p>
</div>

<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full md:w-auto">
<StatCard icon={Zap} label="נסיון (XP)" value={user.xp} color="bg-blue-500" />
<StatCard icon={Shield} label="דרגה" value={getRank(user.xp)} color="bg-green-500" />
<StatCard icon={Landmark} label="יתרה" value={`${user.balance} NC`} color="bg-yellow-500" />
<StatCard icon={Users} label="מחלקה" value={user.dept} color="bg-purple-500" />
</div>
</header>

<div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

{/* Navigation Sidebar */}
<nav className="lg:col-span-2 flex flex-col gap-2">
{['Base', 'WarRoom', 'Bank', 'Archives'].map(tab => (
<button
key={tab}
onClick={() => setActiveTab(tab)}
className={`text-left px-4 py-3 border transition-all uppercase text-sm font-bold ${activeTab === tab ? 'bg-green-500 text-black border-green-500' : 'border-gray-800 hover:border-green-500 text-gray-400'}`}
>
{tab === 'Base' && 'ממשק הבסיס'}
{tab === 'WarRoom' && 'חדר מלחמה'}
{tab === 'Bank' && 'בנק המרכזי'}
{tab === 'Archives' && 'הארכיון האסור'}
</button>
))}
<button
onClick={() => setEmergencyStatus(!emergencyStatus)}
className="mt-8 bg-red-600 text-white p-4 font-black hover:bg-red-500 animate-pulse border-none shadow-[0_0_20px_rgba(220,38,38,0.5)]"
>
כינוס חירום
</button>
</nav>

{/* Main Content Area */}
<main className="lg:col-span-10 space-y-8">

{activeTab === 'Base' && (
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
{/* Mission Feed */}
<section className="border border-gray-800 p-6 bg-black/40">
<h2 className="text-xl font-black mb-6 flex items-center gap-2 uppercase tracking-widest border-b border-green-900 pb-2">
<Terminal size={20} /> עדכונים מבצעיים
</h2>
<div className="space-y-4">
{tasks.map(task => (
<div key={task.id} className="border border-gray-800 p-4 hover:bg-green-500/5 group">
<div className="flex justify-between items-start mb-2">
<h3 className="font-bold text-white group-hover:text-green-400"># {task.title}</h3>
<span className="text-[10px] px-2 py-1 bg-gray-800 text-gray-400">{task.minRank}</span>
</div>
<p className="text-xs text-gray-500 mb-4">{task.description}</p>
<div className="flex justify-between items-center">
<span className="text-xs font-bold text-yellow-600">+{task.moneyReward} NC | +{task.xpReward} XP</span>
<button
onClick={() => {
setUser(u => ({ ...u, xp: u.xp + task.xpReward, balance: u.balance + task.moneyReward }));
setTasks(t => t.filter(x => x.id !== task.id));
}}
className="text-[10px] border border-green-500 px-3 py-1 hover:bg-green-500 hover:text-black transition-colors uppercase"
>
בצע משימה
</button>
</div>
</div>
))}
</div>
</section>

{/* Stats & Global Pulse */}
<section className="space-y-8">
<div className="border border-gray-800 p-6 bg-black/40">
<h2 className="text-xl font-black mb-6 uppercase tracking-widest flex items-center gap-2">
<TrendingUp size={20} /> מדד קריסת המטריקס
</h2>
<div className="h-32 flex items-end gap-1">
{[40, 60, 30, 80, 95, 70, 85, 90, 60, 100].map((h, i) => (
<div key={i} className="flex-1 bg-green-500/20 border-t border-green-500 animate-pulse" style={{ height: `${h}%` }}></div>
))}
</div>
<p className="text-[10px] text-center mt-4 text-gray-600">סנכרון נתונים גלובלי בתהליך...</p>
</div>

<div className="border border-red-900/30 p-6 bg-red-950/5">
<h3 className="text-red-500 font-bold mb-2 flex items-center gap-2 italic">
<AlertTriangle size={16} /> אזהרת אבטחה
</h3>
<p className="text-[10px] text-gray-500">זוהתה פעילות חריגה בשרתי הממשלה. כל הסוכנים מתבקשים להצפין תקשורת בדרגה 4.</p>
</div>
</section>
</div>
)}

{activeTab === 'WarRoom' && (
<div className="space-y-8">
{/* Proposal Input */}
<div className="border border-green-500/30 p-6 bg-black">
<h2 className="text-xl font-black mb-6 uppercase">הגשת הצעה לדרג הפיקודי</h2>
<div className="flex gap-4">
<input
id="propTitle"
placeholder="תיאור המבצע או החוק החדש..."
className="flex-1 bg-transparent border border-gray-800 p-3 text-sm focus:border-green-500 outline-none"
/>
<button
onClick={() => {
const el = document.getElementById('propTitle') as HTMLInputElement;
if (el.value) createProposal('Operation', el.value);
el.value = '';
}}
className="bg-green-500 text-black px-6 py-3 font-bold hover:bg-green-400"
>
שדר הצעה
</button>
</div>
</div>

{/* Proposals List */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
{proposals.map(prop => (
<div key={prop.id} className={`border p-4 bg-black/40 ${prop.status === 'Approved' ? 'border-green-500' : 'border-gray-800'}`}>
<div className="flex justify-between items-center mb-4">
<span className={`text-[10px] px-2 py-1 ${prop.type === 'Law' ? 'bg-blue-900 text-blue-200' : 'bg-orange-900 text-orange-200'}`}>
{prop.type === 'Law' ? 'חוק' : 'מבצע'}
</span>
<span className="text-[10px] text-gray-500">{new Date(prop.timestamp).toLocaleTimeString()}</span>
</div>
<h3 className="text-white font-bold mb-6 italic">"{prop.title}"</h3>
<div className="flex items-center gap-4">
<button onClick={() => vote(prop.id, true)} className="flex-1 border border-green-500 text-green-500 py-2 hover:bg-green-500 hover:text-black text-xs font-bold">
בעד ({prop.votesFor})
</button>
<button onClick={() => vote(prop.id, false)} className="flex-1 border border-red-500 text-red-500 py-2 hover:bg-red-500 hover:text-white text-xs font-bold">
נגד ({prop.votesAgainst})
</button>
</div>
{prop.status !== 'Pending' && (
<div className={`mt-4 text-center text-[10px] font-black uppercase p-1 ${prop.status === 'Approved' ? 'bg-green-500 text-black' : 'bg-red-600 text-white'}`}>
סטטוס: {prop.status === 'Approved' ? 'מאושר ומיושם' : 'נדחה'}
</div>
)}
</div>
))}
</div>
</div>
)}

{activeTab === 'Bank' && (
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
{/* Bank Onboarding */}
{!user.isBankApproved ? (
<div className="md:col-span-3 border border-yellow-600/50 p-12 text-center bg-black">
<Landmark size={64} className="mx-auto mb-6 text-yellow-600" />
<h2 className="text-3xl font-black text-white mb-4 italic uppercase">אימות ריבונות כספית</h2>
<p className="text-gray-500 max-w-md mx-auto mb-8 text-sm">כדי להצטרף למערכת הבנקאית של ה-Nexus, עליך להגיש טופס הצהרת נאמנות סופי. האדריכל יאמת את פרטיך.</p>
<button
onClick={() => setUser(u => ({ ...u, isBankApproved: true }))}
className="bg-yellow-600 text-black px-12 py-4 font-black hover:bg-yellow-500 transition-transform hover:scale-105"
>
אשר הצהרת נאמנות (KYC)
</button>
</div>
) : (
<>
{/* Loan System */}
<div className="border border-gray-800 p-6 bg-black">
<h3 className="text-xl font-black mb-6 uppercase flex items-center gap-2 italic">
<Zap size={20} className="text-yellow-500" /> הלוואת בזק
</h3>
<p className="text-xs text-gray-500 mb-8">קבלת 500 NC מיידית ליתרה שלך. זמן הפקדה: 60 שניות בדיוק.</p>
<div className="relative h-2 bg-gray-900 mb-6">
<div className="absolute left-0 top-0 h-full bg-yellow-500 transition-all duration-1000" style={{ width: `${(loanCooldown / 60) * 100}%` }}></div>
</div>
<button
disabled={loanCooldown > 0}
onClick={requestLoan}
className={`w-full py-4 font-black uppercase text-sm ${loanCooldown > 0 ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-yellow-600 text-black hover:bg-yellow-500'}`}
>
{loanCooldown > 0 ? `הפקדה בביצוע: ${loanCooldown}s` : 'בקש 500 NC'}
</button>
</div>

{/* Investment Market */}
<div className="md:col-span-2 border border-gray-800 p-6 bg-black">
<h3 className="text-xl font-black mb-6 uppercase flex items-center gap-2 italic">
<TrendingUp size={20} className="text-green-500" /> מסלולי צמיחה (השקעות)
</h3>
<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
{[
{ name: 'מהיר', risk: 'High', yield: '15%', color: 'border-red-500' },
{ name: 'יציב', risk: 'Mid', yield: '8%', color: 'border-yellow-500' },
{ name: 'סולידי', risk: 'Low', yield: '3%', color: 'border-blue-500' }
].map(track => (
<div key={track.name} className={`p-4 border ${track.color} bg-black/60`}>
<h4 className="font-bold text-white mb-1">{track.name}</h4>
<p className="text-[10px] text-gray-500 mb-4 uppercase">סיכון: {track.risk} | תשואה: ~{track.yield}</p>
<button
onClick={() => {
if (user.balance >= 200) {
setUser(u => ({ ...u, balance: u.balance - 200 }));
setActiveInvestments(prev => [...prev, { name: track.name, amount: 200, remainingTime: 120, collected: false }]);
}
}}
className="w-full py-2 bg-gray-900 hover:bg-gray-800 text-xs font-bold border border-gray-700"
>
השקע 200 NC
</button>
</div>
))}
</div>
</div>
</>
)}
</div>
)}

{activeTab === 'Archives' && (
<div className="border border-purple-900/50 p-12 text-center bg-black relative overflow-hidden">
<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse"></div>
<Lock size={64} className="mx-auto mb-6 text-purple-600 opacity-20" />
<h2 className="text-3xl font-black text-white mb-4 italic uppercase">הארכיון האסור</h2>
<p className="text-gray-500 max-w-md mx-auto mb-8 text-sm">גישה למידע זה מוגבלת לסוכנים בדרגת <span className="text-purple-500">Ghost</span> בלבד. המשך פעילות ינוטר על ידי האדריכל.</p>
<div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
<div className="p-4 bg-gray-900/50 border border-gray-800 select-none blur-sm">פרוטוקול 001</div>
<div className="p-4 bg-gray-900/50 border border-gray-800 select-none blur-sm">דוחות שחיתות</div>
</div>
</div>
)}
</main>
</div>

{/* Terminal Footer */}
<footer className="max-w-7xl mx-auto mt-12 pt-6 border-t border-gray-900 flex justify-between items-center text-[10px] text-gray-600 uppercase font-mono">
<div>STATUS: SYSTEM_ONLINE // CONNECTED_PEERS: 1,402 // ARCHITECT_LOGIC: ACTIVE</div>
<div className="flex gap-4">
<span className="hover:text-green-500 cursor-pointer underline">תנאי שימוש</span>
<span className="hover:text-green-500 cursor-pointer underline">פרוטוקול אבטחה</span>
</div>
</footer>
</div>
);
};

export default NexusOS;
