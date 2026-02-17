// doctorCard.js

import { overlay } from '../loggedPatient.js';
import { deleteDoctor } from '../services/doctorServices.js';
import { getPatientData } from '../services/patientServices.js';

export function createDoctorCard(doctor) {
  // Main Container
  const card = document.createElement('div');
  card.className = 'doctor-card';
  card.style.border = '1px solid #ddd';
  card.style.borderRadius = '8px';
  card.style.padding = '16px';
  card.style.margin = '10px';
  card.style.width = '300px';
  card.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';

  // User Role
  const userRole = localStorage.getItem('userRole');

  // Doctor Info
  const infoDiv = document.createElement('div');
  infoDiv.className = 'doctor-info';

  const name = document.createElement('h3');
  name.textContent = doctor.name;
  name.style.color = '#003e3e';
  infoDiv.appendChild(name);

  const specialty = document.createElement('p');
  specialty.innerHTML = `<strong>Specialty:</strong> ${doctor.specialty}`;
  infoDiv.appendChild(specialty);

  const email = document.createElement('p');
  email.innerHTML = `<strong>Email:</strong> ${doctor.email}`;
  infoDiv.appendChild(email);

  // Available Times (Assuming doctor.availableTimes is an array or string)
  if (doctor.availableTimes) {
    const schedule = document.createElement('p');
    schedule.innerHTML = `<strong>Available:</strong> ${Array.isArray(doctor.availableTimes) ? doctor.availableTimes.join(', ') : doctor.availableTimes}`;
    infoDiv.appendChild(schedule);
  }

  card.appendChild(infoDiv);

  // Actions Container
  const actionsDiv = document.createElement('div');
  actionsDiv.className = 'card-actions';
  actionsDiv.style.marginTop = '15px';

  // Role-based Actions
  if (userRole === 'admin') {
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'btn delete-btn'; // Generic btn class
    deleteBtn.style.backgroundColor = '#d9534f';
    deleteBtn.onclick = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        if (confirm(`Are you sure you want to delete Dr. ${doctor.name}?`)) {
          const result = await deleteDoctor(doctor.id, token);
          alert(result.message);
          if (result.success) {
            card.remove();
          }
        }
      } else {
        alert("Unauthorized action.");
      }
    };
    actionsDiv.appendChild(deleteBtn);
  } else {
    // Patient Actions (Logged in or not)
    const bookBtn = document.createElement('button');
    bookBtn.textContent = 'Book Appointment';
    bookBtn.className = 'btn book-btn';

    bookBtn.onclick = async () => {
      const token = localStorage.getItem('token');

      if (!token || userRole !== 'patient') {
        alert("Please log in as a patient to book an appointment.");
        // Optionally redirect to login
        return;
      }

      try {
        const patient = await getPatientData(token);
        if (patient) {
          // Show overlay
          if (typeof overlay === 'function') {
            overlay(doctor, patient);
          } else {
            console.error("Overlay function not found");
            alert("Booking feature is currently unavailable.");
          }
        } else {
          alert("Could not retrieve patient details. Please log in again.");
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);
        alert("An error occurred. Please try again.");
      }
    };
    actionsDiv.appendChild(bookBtn);
  }

  card.appendChild(actionsDiv);
  return card;
}
