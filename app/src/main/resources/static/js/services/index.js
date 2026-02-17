/*
  This script handles the login logic for Admin and Doctor, replacing the old index.js functionality.
*/

import { API_BASE_URL } from "../config/config.js";

const ADMIN_API = `${API_BASE_URL}/admin/login`;
const DOCTOR_API = `${API_BASE_URL}/doctor/login`;

window.onload = () => {
  const adminLoginBtn = document.getElementById("adminLogin");
  const doctorLoginBtn = document.getElementById("doctorLogin");

  if (adminLoginBtn) {
    adminLoginBtn.addEventListener("click", () => openModal("adminLogin"));
  }

  if (doctorLoginBtn) {
    doctorLoginBtn.addEventListener("click", () => openModal("doctorLogin"));
  }
};

window.adminLoginHandler = async function () {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const admin = {
    username: username,
    password: password,
  };

  try {
    const response = await fetch(ADMIN_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(admin),
    });

    if (response.ok) {
      const data = await response.json();
      const token = data.token;
      localStorage.setItem("token", token);
      selectRole("admin");
    } else {
      alert("Invalid credentials / Login failed");
    }
  } catch (error) {
    console.error("Error logging in:", error);
    alert("Something went wrong. Please try again.");
  }
};

window.doctorLoginHandler = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const doctor = {
    email: email,
    password: password,
  };

  try {
    const response = await fetch(DOCTOR_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(doctor),
    });

    if (response.ok) {
      const data = await response.json();
      const token = data.token;
      localStorage.setItem("token", token);
      selectRole("doctor");
    } else {
      alert("Invalid credentials / Login failed");
    }
  } catch (error) {
    console.error("Error logging in:", error);
    alert("Something went wrong. Please try again.");
  }
};
