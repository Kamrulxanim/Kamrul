// Demo user data
const users = [
  { email: "admin@ark.com", password: "admin123", role: "admin" },
  { email: "kamrul@ark.com", password: "123456", role: "user" },
  { email: "member1@ark.com", password: "123456", role: "user" }
];

// Attendance data (local, for demo)
let attendance = JSON.parse(localStorage.getItem("attendance") || "[]");

function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    localStorage.setItem("ark_user", JSON.stringify(user));
    document.getElementById("login-msg").innerText = "";
    showPanel(user.role);
  } else {
    document.getElementById("login-msg").innerText = "Invalid credentials!";
  }
}

function showPanel(role) {
  document.getElementById("login-box").style.display = "none";
  document.getElementById("attendance-box").style.display = "none";
  document.getElementById("admin-box").style.display = "none";
  if (role === "admin") {
    document.getElementById("admin-box").style.display = "block";
    loadAttendance();
  } else {
    document.getElementById("attendance-box").style.display = "block";
    const user = JSON.parse(localStorage.getItem("ark_user"));
    document.getElementById("user-email").innerText = user.email;
  }
}

function markAttendance() {
  const user = JSON.parse(localStorage.getItem("ark_user"));
  const now = new Date();
  // Time restriction: Only allow between 11AM-2PM, 5PM-10PM, 11PM-1AM
  const hour = now.getHours();
  const min = now.getMinutes();
  let allowed = false;
  if ((hour >= 11 && hour < 14) || (hour >= 17 && hour < 22) || (hour === 23 || hour < 1)) {
    allowed = true;
  }
  if (!allowed) {
    document.getElementById("att-msg").innerText = "Attendance not allowed at this time!";
    return;
  }
  attendance.push({ email: user.email, time: now.toLocaleString() });
  localStorage.setItem("attendance", JSON.stringify(attendance));
  document.getElementById("att-msg").innerText = "Attendance marked!";
}

function loadAttendance() {
  const table = document.getElementById("att-table");
  // Remove old rows
  while (table.rows.length > 1) table.deleteRow(1);
  attendance.forEach(a => {
    const row = table.insertRow();
    row.insertCell(0).innerText = a.email;
    row.insertCell(1).innerText = a.time;
  });
}

function logout() {
  localStorage.removeItem("ark_user");
  document.getElementById("attendance-box").style.display = "none";
  document.getElementById("admin-box").style.display = "none";
  document.getElementById("login-box").style.display = "block";
}

window.onload = function() {
  const user = JSON.parse(localStorage.getItem("ark_user") || "null");
  if (user) showPanel(user.role);
};