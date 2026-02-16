// index.js

const API_BASE_URL = "";

document.addEventListener('DOMContentLoaded', () => {
    console.log("Index.js loaded - DOMContentLoaded fired");
    // alert("Index.js loaded!"); // Uncomment if needed for extreme debugging

    const modal = document.getElementById('login-modal');
    const closeBtn = document.querySelector('.close-btn');
    const loginForm = document.getElementById('login-form');
    const modalTitle = document.getElementById('modal-title');
    const errorMessage = document.getElementById('error-message');
    const registerLinkContainer = document.getElementById('register-link-container');
    let currentRole = '';

    // Role Buttons
    const roleBtns = document.querySelectorAll('.role-btn');
    console.log("Found role buttons:", roleBtns.length);

    roleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentRole = btn.dataset.role;
            console.log("Role button clicked:", currentRole);
            openModal(currentRole);
        });
    });

    // Close Modal
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    function openModal(role) {
        console.log("Opening modal for role:", role);
        if (!modal) {
            console.error("Modal element not found!");
            return;
        }
        modal.classList.remove('hidden');
        // Force display block if classList remove hidden isn't enough (though CSS should handle it)
        modal.style.display = 'flex';

        if (modalTitle) modalTitle.textContent = `${role.charAt(0).toUpperCase() + role.slice(1)} Login`;
        if (errorMessage) errorMessage.textContent = '';
        if (loginForm) loginForm.reset();

        if (registerLinkContainer) {
            if (role === 'patient') {
                registerLinkContainer.classList.remove('hidden');
                registerLinkContainer.style.display = 'block';
            } else {
                registerLinkContainer.classList.add('hidden');
                registerLinkContainer.style.display = 'none';
            }
        }
    }

    function closeModal() {
        console.log("Closing modal");
        if (modal) {
            modal.classList.add('hidden');
            modal.style.display = 'none';
        }
        currentRole = '';
    }

    // Login Form Submit
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log("Login form submitted");
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            if (errorMessage) errorMessage.textContent = 'Logging in...';

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
                    if (errorMessage) errorMessage.textContent = errorData.message || 'Login failed';
                }
            } catch (error) {
                console.error("Login error:", error);
                if (errorMessage) errorMessage.textContent = 'An error occurred. Please try again.';
            }
        });
    } else {
        console.error("Login form not found!");
    }
});

