// ===== DATABASE =====
let db = JSON.parse(localStorage.getItem("orgDB")) || {
  users: {
    admin: {
      password: "1234",
      role: "admin",
      xp: 0,
      level: 1,
      nux: 1000,
      loans: [],
      investments: []
    }
  },
  laws: [],
  actions: [],
  chat: []
};

let currentUser = null;

// ===== LOGIN =====
function login() {
  let u = loginUser.value;
  let p = loginPass.value;

  if (db.users[u] && db.users[u].password === p) {
    currentUser = u;
    init();
  } else alert("שגיאה");
}

// ===== INIT =====
function init() {
  loginScreen.classList.add("hidden");
  app.classList.remove("hidden");

  if (user().role === "admin") {
    adminPanel.classList.remove("hidden");
  }

  renderAll();
}

// ===== USER =====
function user() {
  return db.users[currentUser];
}

// ===== PROFILE =====
function renderProfile() {
  let u = user();

  profile.innerHTML = `
  ${currentUser} | דרגה: ${u.role} | רמה: ${u.level} | XP: ${u.xp} | NUX: ${u.nux}
  `;
}

// ===== USER CREATION =====
function createUser() {
  db.users[newUser.value] = {
    password: newPass.value,
    role: newRole.value,
    xp: 0,
    level: 1,
    nux: 100,
    loans: [],
    investments: []
  };

  save();
}

// ===== LEVEL SYSTEM =====
function addXP(amount) {
  let u = user();
  u.xp += amount;
  u.nux += Math.floor(amount / 2);

  while (u.xp >= u.level * 200) {
    u.xp -= u.level * 200;
    u.level++;
  }

  updateRole(u);
  save();
}

function updateRole(u) {
  if (u.level >= 10) u.role = "גנרל";
  else if (u.level >= 6) u.role = "מפקד";
  else if (u.level >= 3) u.role = "רכז";
}

// ===== MISSIONS =====
setInterval(() => {
  let reward = Math.floor(Math.random() * 80) + 20;

  let div = document.createElement("div");
  div.innerHTML = `
    משימה: פעולה מבצעית
    <button onclick="addXP(${reward})">בצע (+${reward})</button>
  `;

  document.body.appendChild(div);
}, 20000);

// ===== BANK =====
function renderBank() {
  let u = user();

  bank.innerHTML = `
    יתרה: ${u.nux}<br>
    <button onclick="loan()">הלוואה</button>
    <button onclick="invest()">השקעה</button>
  `;
}

function loan() {
  let u = user();
  let amount = 300;
  let interest = 1.2;

  u.loans.push({ amount, due: Date.now() + 60000, interest });

  setTimeout(() => {
    u.nux += amount;
    save();
    renderAll();
  }, 60000);
}

function invest() {
  let u = user();

  let risk = Math.random();

  setTimeout(() => {
    if (risk > 0.6) u.nux += 400;
    else if (risk > 0.3) u.nux += 100;
    else u.nux -= 200;

    save();
    renderAll();
  }, 15000);
}

// ===== LAWS =====
function renderLaws() {
  laws.innerHTML = "<h3>ספר חוקים</h3>";

  db.laws.forEach(l => {
    laws.innerHTML += `<p>${l.text} (ע"י ${l.by})</p>`;
  });

  if (["מפקד","גנרל","admin"].includes(user().role)) {
    laws.innerHTML += `<button onclick="createLaw()">חקיקה</button>`;
  }
}

function createLaw() {
  let t = prompt("חוק:");
  db.laws.push({ text: t, by: currentUser });
  save();
  renderLaws();
}

// ===== ACTIONS =====
function renderActions() {
  actions.innerHTML = "<h3>פעולות</h3>";

  db.actions.forEach((a, i) => {
    actions.innerHTML += `
      <div>
        ${a.type} | משתתפים: ${a.members.length}
        <button onclick="joinAction(${i})">הצטרף</button>
      </div>
    `;
  });

  if (["מפקד","גנרל","admin"].includes(user().role)) {
    actions.innerHTML += `<button onclick="createAction()">פעולה חדשה</button>`;
  }
}

function createAction() {
  let t = prompt("התקפה / הגנה");
  db.actions.push({ type: t, members: [] });
  save();
  renderActions();
}

function joinAction(i) {
  db.actions[i].members.push(currentUser);
  save();
  renderActions();
}

// ===== CHAT =====
function renderWar() {
  war.innerHTML = `
    <div class="chatBox">
      ${db.chat.map(m => `<p>${m}</p>`).join("")}
    </div>
    <input id="msg">
    <button onclick="sendMsg()">שלח</button>
  `;
}

function sendMsg() {
  db.chat.push(`${currentUser}: ${msg.value}`);
  save();
  renderWar();
}

// ===== EMERGENCY =====
function sendEmergency() {
  let msg = prompt("הודעה");
  emergencyBanner.innerText = msg;
  emergencyBanner.style.display = "block";

  setTimeout(() => {
    emergencyBanner.style.display = "none";
  }, 5000);
}

// ===== UI =====
function show(id) {
  document.querySelectorAll(".section").forEach(s => s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");

  if (id === "bank") renderBank();
  if (id === "laws") renderLaws();
  if (id === "actions") renderActions();
  if (id === "war") renderWar();
}

function renderAll() {
  renderProfile();
}

// ===== SAVE =====
function save() {
  localStorage.setItem("orgDB", JSON.stringify(db));
}
