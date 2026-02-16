// index.js

import { API_BASE_URL } from './config/config.js';

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('login-modal');
    const closeBtn = document.querySelector('.close-btn');
    const loginForm = document.getElementById('login-form');
    const modalTitle = document.getElementById('modal-title');
    const errorMessage = document.getElementById('error-message');
    const registerLinkContainer = document.getElementById('register-link-container');
    let currentRole = '';

    console.log("Index.js loaded");

    // Role Buttons
    document.querySelectorAll('.role-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentRole = btn.dataset.role;
            console.log("Role selected:", currentRole);
            openModal(currentRole);
        });
    });

    // Close Modal
    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    function openModal(role) {
        modal.classList.remove('hidden');
        modalTitle.textContent = `${role.charAt(0).toUpperCase() + role.slice(1)} Login`;
        errorMessage.textContent = '';
        loginForm.reset();

        if (role === 'patient') {
            registerLinkContainer.classList.remove('hidden');
        } else {
            registerLinkContainer.classList.add('hidden');
        }
    }

    function closeModal() {
        modal.classList.add('hidden');
        currentRole = '';
    }

    // Login Form Submit
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log("Login form submitted");
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        errorMessage.textContent = 'Logging in...';

        try {
            let endpoint = '';
            let body = {};

            if (currentRole === 'admin') {
                endpoint = '/admin/login';
                body = { username: email, password: password };
            } else if (currentRole === 'doctor') {
                endpoint = '/doctor/login';
                body = { email: email, password: password };
            } else if (currentRole === 'patient') {
                endpoint = '/patient/login';
                body = { email: email, password: password };
            }

            console.log(`Attempting login to: ${API_BASE_URL}${endpoint}`);

            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            console.log("Response status:", response.status);

            if (response.ok) {
                const data = await response.json();
                console.log("Login successful", data);
                localStorage.setItem('token', data.token);
                localStorage.setItem('userRole', currentRole);

                // Redirect based on role
                if (currentRole === 'admin') {
                    window.location.href = 'pages/adminDashboard.html';
                } else if (currentRole === 'doctor') {
                    window.location.href = 'pages/doctorDashboard.html';
                } else if (currentRole === 'patient') {
                    window.location.href = 'pages/patientDashboard.html';
                }
            } else {
                const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
                console.error("Login failed:", errorData);
                errorMessage.textContent = errorData.message || 'Login failed';
            }
        } catch (error) {
            console.error("Login error:", error);
            errorMessage.textContent = 'An error occurred. Please try again.';
        }
    });
});

