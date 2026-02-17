/*
  doctorDashboard.js
  Logic for the doctor dashboard: managing appointments and availability.
*/

import { getAllAppointments } from "./services/appointmentRecordService.js";

// Helper to check token and redirect if missing
function checkAuth() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "../index.html";
  }
  return token;
}

// Format date to YYYY-MM-DD
function formatDate(date) {
  return date.toISOString().split('T')[0];
}

let selectedDate = formatDate(new Date());

async function loadAppointments(date) {
  const token = checkAuth();
  const tableBody = document.getElementById("appointmentTableBody");
  if (!tableBody) return;

  tableBody.innerHTML = "<tr><td colspan='4'>Loading...</td></tr>";

  try {
    // filter by patientName if search bar has value
    const searchVal = document.getElementById("searchBar") ? document.getElementById("searchBar").value : "null";

    // Ensure "null" string is passed if searchVal is empty string
    const safeSearchVal = searchVal.trim() === "" ? "null" : searchVal;

    const appointments = await getAllAppointments(date, safeSearchVal, token);

    tableBody.innerHTML = "";

    if (!appointments || appointments.length === 0) {
      tableBody.innerHTML = "<tr><td colspan='4'>No Appointments found for today.</td></tr>";
      return;
    }

    appointments.forEach(app => {
      // Handle potential differences in property names (e.g. backend DTO vs expected JS object)
      // debugging: console.log(app);
      const patientName = app.patientName || app.name || "Unknown";
      const time = app.appointmentTime || app.time || "N/A";
      const details = app.patientContent || "No details";

      const row = `
                <tr>
                    <td>${patientName}</td>
                    <td>${time}</td>
                    <td>${details}</td>
                    <td>
                        <button class="btn" style="padding: 5px 10px; font-size: 12px;" onclick="window.location.href='patientRecord.html?id=${app.id || ''}'">View Record</button>
                    </td>
                </tr>
            `;
      tableBody.innerHTML += row;
    });

  } catch (error) {
    console.error("Error loading appointments:", error);
    tableBody.innerHTML = "<tr><td colspan='4'>Error loading appointments.</td></tr>";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Initial Load - Today
  loadAppointments(selectedDate);

  // Date Picker
  const datePicker = document.getElementById("datePicker");
  if (datePicker) {
    datePicker.value = selectedDate;
    datePicker.addEventListener("change", (e) => {
      selectedDate = e.target.value;
      loadAppointments(selectedDate);
    });
  }

  // Search Bar
  const searchBar = document.getElementById("searchBar");
  if (searchBar) {
    searchBar.addEventListener("input", () => {
      loadAppointments(selectedDate); // Re-fetch with new search term (and current date)
    });
  }

  // "Today" Button
  const todayBtn = document.getElementById("todayBtn");
  if (todayBtn) {
    todayBtn.addEventListener("click", () => {
      const today = formatDate(new Date());
      selectedDate = today;
      if (datePicker) datePicker.value = today;
      loadAppointments(today);
    });
  }
});
