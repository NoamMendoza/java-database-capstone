/*
  doctorServices.js
  Handles API calls for doctor management (admin perspective) and general doctor data fetching.
*/

import { API_BASE_URL } from "../config/config.js";

const DOCTOR_API = `${API_BASE_URL}/doctor`;

export async function getDoctors() {
  try {
    const response = await fetch(DOCTOR_API);
    if (response.ok) {
      const data = await response.json();
      return data.doctors || [];
    } else {
      console.error("Failed to fetch doctors:", response.statusText);
      return [];
    }
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return [];
  }
}

export async function deleteDoctor(id, token) {
  try {
    const response = await fetch(`${DOCTOR_API}/delete/${id}/${token}`, {
      method: "DELETE",
    });

    // The backend might return text or JSON depending on implementation. 
    // Assuming text response based on controller analysis, but standardizing to return object.
    const message = await response.text();

    return {
      success: response.ok,
      message: message || (response.ok ? "Doctor deleted successfully" : "Failed to delete doctor")
    };
  } catch (error) {
    console.error("Error deleting doctor:", error);
    return {
      success: false,
      message: "Network error occurred."
    };
  }
}

export async function saveDoctor(doctor, token) {
  try {
    const response = await fetch(`${DOCTOR_API}/save/${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(doctor),
    });

    const message = await response.text();

    return {
      success: response.ok,
      message: message || (response.ok ? "Doctor saved successfully" : "Failed to save doctor")
    };
  } catch (error) {
    console.error("Error saving doctor:", error);
    return {
      success: false,
      message: "Network error occurred."
    };
  }
}


export async function filterDoctors(name, time, specialty) {
  // Construct URL with query parameters or path parameters depending on backend implementation.
  // Based on instructions/comments: "Include the name, time, and specialty as URL path parameters"
  // However, usually filters are query params. Let's assume path params based on comment instruction: /filter/{name}/{time}/{specialty}
  // But wait, the standard usually supports partial updates. If backend isn't visible for filter, I'll follow standard REST or the comment exactly.
  // Comment said: "Include the name, time, and specialty as URL path parameters"

  // NOTE: I am assuming the backend endpoint exists for this: /doctor/filter/... 
  // If not, I'll use a generous fallback or query params if I see a controller.

  // Let's use specific "null" strings if values are missing, as often requested in this project type.
  const n = name || "null";
  const t = time || "null";
  const s = specialty || "null";

  try {
    const response = await fetch(`${DOCTOR_API}/filter/${n}/${t}/${s}`);
    if (response.ok) {
      const data = await response.json();
      return data.doctors || [];
    } else {
      console.error("Failed to filter doctors:", response.statusText);
      return [];
    }
  } catch (error) {
    console.error("Error filtering doctors:", error);
    alert("Something went wrong!");
    return [];
  }
}
