// bookingModal.js
import { bookAppointment } from "../services/appointmentRecordService.js";

export function showBookingOverlay(e, doctor, patient) {
    const button = e.target;
    // const rect = button.getBoundingClientRect(); // Unused but kept if needed for positioning logic later

    /* Ripple Effect */
    const ripple = document.createElement("div");
    ripple.classList.add("ripple-overlay");

    // Position ripple starting from click
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    document.body.appendChild(ripple);

    // Trigger ripple animation
    setTimeout(() => ripple.classList.add("active"), 50);

    /* Modal Construction */
    const modalApp = document.createElement("div");
    modalApp.classList.add("modalApp");

    // Ensure availableTimes is valid array
    const times = Array.isArray(doctor.availableTimes)
        ? doctor.availableTimes
        : (typeof doctor.availableTimes === 'string' ? doctor.availableTimes.split(',') : []);

    modalApp.innerHTML = `
    <h2>Book Appointment</h2>
    <div class="form-group">
        <label>Patient Name</label>
        <input class="input-field" type="text" value="${patient.name}" disabled />
    </div>
    <div class="form-group">
        <label>Doctor Name</label>
        <input class="input-field" type="text" value="${doctor.name}" disabled />
    </div>
    <div class="form-group">
        <label>Specialty</label>
        <input class="input-field" type="text" value="${doctor.specialty}" disabled/>
    </div>
    <div class="form-group">
        <label>Email</label>
        <input class="input-field" type="email" value="${doctor.email}" disabled/>
    </div>
    <div class="form-group">
        <label>Date</label>
        <input class="input-field" type="date" id="appointment-date" />
    </div>
    <div class="form-group">
        <label>Time</label>
        <select class="input-field" id="appointment-time">
          <option value="">Select time</option>
          ${times.map(t => `<option value="${t.trim()}">${t.trim()}</option>`).join('')}
        </select>
    </div>
    <div class="button-group">
        <button class="confirm-booking">Confirm Booking</button>
        <button class="cancel-booking" style="background-color: #d9534f; margin-left: 10px;">Cancel</button>
    </div>
  `;

    document.body.appendChild(modalApp);

    // Animate Modal In
    setTimeout(() => modalApp.classList.add("active"), 600);

    /* Event Listeners */

    // Confirm Booking
    modalApp.querySelector(".confirm-booking").addEventListener("click", async () => {
        const date = modalApp.querySelector("#appointment-date").value;
        const time = modalApp.querySelector("#appointment-time").value;

        if (!date || !time) {
            alert("Please select both date and time.");
            return;
        }

        const token = localStorage.getItem("token");
        const startTime = time.split('-')[0]; // Assuming format "09:00 - 10:00" or similar

        const appointment = {
            doctor: { id: doctor.id },
            patient: { id: patient.id },
            appointmentTime: `${date}T${startTime.trim()}:00`, // Ensure ISO format
            status: 0
        };

        const { success, message } = await bookAppointment(appointment, token);

        if (success) {
            alert("Appointment Booked successfully");
            cleanup();
        } else {
            alert("❌ Failed to book an appointment :: " + message);
        }
    });

    // Cancel Booking
    modalApp.querySelector(".cancel-booking").addEventListener("click", () => {
        cleanup();
    });

    function cleanup() {
        ripple.remove();
        modalApp.remove();
    }
}
