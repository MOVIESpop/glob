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
  actions: []
};

let currentUser = null;

// ===== LOGIN =====
function login() {
  let u = loginUser.value;
  let p = loginPass.value;

  if (db.users[u] && db.users[u].password === p) {
    currentUser = u;
    initApp();
  } else {
    alert("שגיאה");
  }
}

// ===== INIT =====
function initApp() {
  loginScreen.classList.add("hidden");
  mainApp.classList.remove("hidden");

  if (getUser().role === "admin") {
    adminPanel.classList.remove("hidden");
  }

  renderProfile();
  startAI();
}

// ===== USER =====
function getUser() {
  return db.users[currentUser];
}

function renderProfile() {
  let u = getUser();

  profile.innerHTML = `
    ${currentUser} | דרגה: ${u.role} | רמה: ${u.level} | XP: ${u.xp} | NUX: ${u.nux}
  `;
}

// ===== USER CREATION =====
function createUser() {
  db.users[newName.value] = {
    password: newPass.value,
    role: newRole.value,
    xp: 0,
    level: 1,
    nux: 100
  };

  save();
  alert("נוצר");
}

// ===== AI MISSIONS =====
function startAI() {
  setInterval(() => {
    generateMission();
  }, 15000);
}

function generateMission() {
  let reward = Math.floor(Math.random() * 100);

  let mission = document.createElement("div");
  mission.innerHTML = `
    משימה: מבצע סודי
    תגמול: ${reward}
    <button onclick="completeMission(${reward})">בצע</button>
  `;

  document.body.appendChild(mission);
}

function completeMission(r) {
  let u = getUser();

  u.xp += r;
  u.nux += r;

  if (u.xp > u.level * 200) {
    u.level++;
  }

  save();
  renderProfile();
}

// ===== BANK =====
function renderBank() {
  let u = getUser();

  bank.innerHTML = `
    יתרה: ${u.nux}<br>
    <button onclick="loan()">הלוואה</button>
    <button onclick="invest()">השקעה</button>
  `;
}

function loan() {
  let u = getUser();
  let amount = 200;

  setTimeout(() => {
    u.nux += amount;
    save();
    renderProfile();
  }, 60000);
}

function invest() {
  let u = getUser();

  let outcome = Math.random();

  setTimeout(() => {
    if (outcome > 0.5) {
      u.nux += 300;
    } else {
      u.nux -= 150;
    }
    save();
    renderProfile();
  }, 15000);
}

// ===== LAWS =====
function createLaw() {
  let text = prompt("חוק חדש:");

  db.laws.push({
    text,
    by: currentUser
  });

  save();
}

// ===== ACTIONS =====
function createAction() {
  let type = prompt("התקפה/הגנה");

  db.actions.push({
    type,
    creator: currentUser,
    members: []
  });

  save();
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

// ===== SAVE =====
function save() {
  localStorage.setItem("orgDB", JSON.stringify(db));
}
