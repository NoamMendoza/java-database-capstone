/*
  adminDashboard.js
  Logic for the admin dashboard: managing doctors (add, delete, filter).
*/

import { getDoctors, deleteDoctor, saveDoctor, filterDoctors } from "./services/doctorServices.js";
import { openModal, closeModal } from "./index.js"; // Or wherever utility modal logic is, if not global. 
// Actually openModal is global in index.js for logins, but admin dashboard has its own "Add Doctor" modal.
// We should check if we can reuse or need a local openModal. 
// Assuming openModal is available globally or we implement a simple one here.

// Helper to check token
function checkAuth() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "../index.html";
    return null;
  }
  return token;
}

// Function to create a doctor card HTML string
function createDoctorCard(doctor) {
  return `
    <div class="doctor-card">
      <div class="doctor-info">
        <h3>${doctor.name}</h3>
        <p><strong>Specialty:</strong> ${doctor.specialty}</p>
        <p><strong>Email:</strong> ${doctor.email}</p>
        <p><strong>Phone:</strong> ${doctor.phone}</p>
      </div>
      <div class="card-actions">
        <!-- Assuming we pass ID and Token to delete -->
        <button onclick="handleDelete(${doctor.id})">Delete</button>
      </div>
    </div>
  `;
}

// Global function to handle delete, attached to window to be callable from HTML string
window.handleDelete = async function (id) {
  const token = checkAuth();
  if (!token) return;

  if (confirm("Are you sure you want to delete this doctor?")) {
    const result = await deleteDoctor(id, token);
    alert(result.message);
    if (result.success) {
      loadDoctorCards(); // Refresh list
    }
  }
};

async function loadDoctorCards() {
  const doctors = await getDoctors();
  const content = document.getElementById("content");
  if (!content) return;

  content.innerHTML = "";

  if (doctors.length === 0) {
    content.innerHTML = "<p>No doctors found.</p>";
    return;
  }

  doctors.forEach(doc => {
    content.innerHTML += createDoctorCard(doc);
  });
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  // Initial Load
  loadDoctorCards();

  // Add Doctor Button
  const addDoctorBtn = document.getElementById("addDocBtn");
  if (addDoctorBtn) {
    addDoctorBtn.addEventListener("click", () => {
      // Logic to open Add Doctor Modal
      const modal = document.getElementById("addDoctorModal");
      if (modal) modal.style.display = "block";
    });
  }

  // Close Modal Button (assuming standard class close)
  const closeBtns = document.querySelectorAll(".close");
  closeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const modal = document.getElementById("addDoctorModal"); // or generic closest modal
      if (modal) modal.style.display = "none";
    });
  });

  // Add Doctor Form Submit
  const addDoctorForm = document.getElementById("addDoctorForm");
  if (addDoctorForm) {
    addDoctorForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const token = checkAuth();
      if (!token) return;

      const name = document.getElementById("docName").value;
      const email = document.getElementById("docEmail").value;
      const phone = document.getElementById("docPhone").value;
      const specialty = document.getElementById("docSpecialty").value;
      const password = document.getElementById("docPassword").value;

      const doctor = { name, email, phone, specialty, password };

      const result = await saveDoctor(doctor, token);
      alert(result.message);

      if (result.success) {
        document.getElementById("addDoctorModal").style.display = "none";
        addDoctorForm.reset();
        loadDoctorCards();
      }
    });
  }

  // Filter Logic
  const searchBar = document.getElementById("searchBar");
  const filterSelects = document.querySelectorAll(".filter-select");

  async function handleFilter() {
    const name = document.getElementById("searchBar").value;
    const specialty = document.getElementById("specialtyFilter") ? document.getElementById("specialtyFilter").value : null;
    // Time filter implementation depends on UI (e.g., input type time or select)
    // Assuming a simple text or null for now based on typical requirements

    const filteredDocs = await filterDoctors(name, null, specialty);
    renderDoctorCards(filteredDocs);
  }

  if (searchBar) searchBar.addEventListener("input", handleFilter);
  filterSelects.forEach(select => select.addEventListener("change", handleFilter));
});

function renderDoctorCards(doctors) {
  const content = document.getElementById("content");
  content.innerHTML = "";
  if (doctors.length === 0) {
    content.innerHTML = "<p>No doctors matching criteria.</p>";
  } else {
    doctors.forEach(doc => {
      content.innerHTML += createDoctorCard(doc);
    });
  }
}
