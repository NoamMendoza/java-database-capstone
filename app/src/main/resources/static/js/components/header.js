// header.js

function renderHeader() {
  const headerDiv = document.getElementById("header");

  // Check if on root page
  if (window.location.pathname.endsWith("/") || window.location.pathname.endsWith("/index.html")) {
    localStorage.removeItem("userRole");
    headerDiv.innerHTML = `
            <header class="header">
                <div class="logo-link">
                    <img src="../assets/images/logo/logo.png" alt="Hospital CRM Logo" class="logo-img">
                    <span class="logo-title">Hospital CMS</span>
                </div>
            </header>`;
    return;
  }

  const role = localStorage.getItem("userRole");
  const token = localStorage.getItem("token");

  let headerContent = `
        <header class="header">
            <div class="logo-link">
                <img src="../assets/images/logo/logo.png" alt="Hospital CRM Logo" class="logo-img">
                <span class="logo-title">Hospital CMS</span>
            </div>
            <nav>`;

  // Session check for protected roles
  if ((role === "loggedPatient" || role === "admin" || role === "doctor") && !token) {
    localStorage.removeItem("userRole");
    alert("Session expired or invalid login. Please log in again.");
    window.location.href = "/";
    return;
  }

  if (role === "admin") {
    headerContent += `
            <button id="addDocBtn" class="navbar-btn" onclick="openModal('addDoctor')">Add Doctor</button>
            <a href="#" onclick="logout()">Logout</a>`;
  } else if (role === "doctor") {
    headerContent += `
            <button class="navbar-btn" onclick="selectRole('doctor')">Home</button>
            <a href="#" onclick="logout()">Logout</a>`;
  } else if (role === "patient") {
    headerContent += `
            <button id="patientLogin" class="navbar-btn" onclick="window.location.href='../index.html'">Login</button>
            <button id="patientSignup" class="navbar-btn" onclick="window.location.href='register.html'">Sign Up</button>`;
  } else if (role === "loggedPatient") {
    headerContent += `
            <button id="home" class="navbar-btn" onclick="window.location.href='patientDashboard.html'">Home</button>
            <button id="patientAppointments" class="navbar-btn" onclick="window.location.href='patientAppointments.html'">Appointments</button>
            <a href="#" onclick="logoutPatient()">Logout</a>`;
  }

  headerContent += `</nav></header>`;
  headerDiv.innerHTML = headerContent;
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");
  window.location.href = "../index.html";
}

function logoutPatient() {
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");
  window.location.href = "patientDashboard.html"; // Or index
}

// Initialize
document.addEventListener('DOMContentLoaded', renderHeader);
