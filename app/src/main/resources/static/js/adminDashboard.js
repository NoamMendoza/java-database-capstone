/*
  adminDashboard.js
  Logic for the admin dashboard: managing doctors (add, delete, filter).
*/

import { getDoctors, deleteDoctor, saveDoctor, filterDoctors } from "./services/doctorServices.js";
import { createDoctorCard } from "./components/doctorCard.js";

// Helper to check token
function checkAuth() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "../index.html";
    return null;
  }
  return token;
}

// Global function to handle delete, attached to window to be callable from HTML string if needed, 
// but createDoctorCard component handles it internally now. 
// Keeping it just in case, but unexpected if component does the job.
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
  try {
    const doctors = await getDoctors();
    const content = document.getElementById("content");
    if (!content) return;

    content.innerHTML = "";

    if (!doctors || doctors.length === 0) {
      content.innerHTML = "<p>No doctors found.</p>";
      return;
    }

    doctors.forEach(doc => {
      const card = createDoctorCard(doc); // Returns DOM element
      content.appendChild(card);
    });
  } catch (err) {
    console.error("Error loading cards:", err);
  }
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  console.log("adminDashboard.js loaded");

  // Initial Load
  loadDoctorCards();

  // Add Doctor Button
  const addDoctorBtn = document.getElementById("addDocBtn");
  if (addDoctorBtn) {
    addDoctorBtn.addEventListener("click", () => {
      console.log("Add Doctor Clicked");
      const modal = document.getElementById("addDoctorModal");
      if (modal) {
        modal.style.display = "flex";
        modal.classList.remove('hidden'); // Ensure no hidden class conflicts
      }
    });
  } else {
    console.error("addDocBtn not found");
  }

  // Close Modal Button
  const closeBtns = document.querySelectorAll(".close");
  closeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const modal = document.getElementById("addDoctorModal");
      if (modal) {
        modal.style.display = "none";
        modal.classList.add('hidden');
      }
    });
  });

  // Windows click to close
  window.addEventListener('click', (e) => {
    const modal = document.getElementById("addDoctorModal");
    if (e.target === modal) {
      modal.style.display = "none";
      modal.classList.add('hidden');
    }
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
        const modal = document.getElementById("addDoctorModal");
        if (modal) {
          modal.style.display = "none";
          modal.classList.add('hidden');
        }
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

    // Check if filterDoctors expects null or strings
    const filteredDocs = await filterDoctors(name, null, specialty);

    // content ref
    const content = document.getElementById("content");
    content.innerHTML = "";

    if (filteredDocs.length === 0) {
      content.innerHTML = "<p>No doctors matching criteria.</p>";
    } else {
      filteredDocs.forEach(doc => {
        content.appendChild(createDoctorCard(doc));
      });
    }
  }

  if (searchBar) searchBar.addEventListener("input", handleFilter);
  filterSelects.forEach(select => select.addEventListener("change", handleFilter));
});
