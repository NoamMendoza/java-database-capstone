# User Story Template

**Title:**
_As a [user role], I want [feature/goal], so that [reason]._

**Acceptance Criteria:**
1. [Criteria 1]
2. [Criteria 2]
3. [Criteria 3]

**Priority:** [High/Medium/Low]
**Story Points:** [Estimated Effort in Points]
**Notes:**
- [Additional information or edge cases]

---

## Admin User Stories

**Title:** Admin Login
_As an admin, I want to log into the portal with my username and password, so that I can manage the platform securely._

**Acceptance Criteria:**
1. Admin can access the login page.
2. Admin enters valid credentials and is redirected to the admin dashboard.
3. Invalid credentials display an error message.

**Priority:** High
**Story Points:** 3
**Notes:**
- Password should be encrypted.

**Title:** Admin Logout
_As an admin, I want to log out of the portal, so that I can protect system access._

**Acceptance Criteria:**
1. Admin clicks logout button.
2. System invalidates the session.
3. Admin is redirected to the login page.

**Priority:** Medium
**Story Points:** 1
**Notes:**
- Ensure session token is cleared.

**Title:** Add Doctor
_As an admin, I want to add doctors to the portal, so that they can manage their appointments._

**Acceptance Criteria:**
1. Admin can access the "Add Doctor" form.
2. Admin enters doctor details (name, specialization, etc.).
3. System saves the new doctor profile.

**Priority:** High
**Story Points:** 5
**Notes:**
- Validate required fields.

**Title:** Delete Doctor Profile
_As an admin, I want to delete a doctor's profile from the portal, so that I can remove invalid or inactive accounts._

**Acceptance Criteria:**
1. Admin can view a list of doctors.
2. Admin selects a doctor to delete.
3. System removes the doctor profile and confirms deletion.

**Priority:** Medium
**Story Points:** 3
**Notes:**
- Consider soft delete vs hard delete.

**Title:** Appointment Statistics
_As an admin, I want to run a stored procedure in MySQL CLI to get the number of appointments per month, so that I can track usage statistics._

**Acceptance Criteria:**
1. Admin has access to MySQL CLI.
2. Stored procedure `get_appointments_per_month` exists.
3. Executing the procedure returns correct appointment counts grouped by month.

**Priority:** Low
**Story Points:** 5
**Notes:**
- Requires database access permissions.

---

## Patient User Stories

**Title:** View Doctors (Public)
_As a patient, I want to view a list of doctors without logging in, so that I can explore options before registering._

**Acceptance Criteria:**
1. Publicly accessible page displays list of doctors.
2. List shows doctor names and specializations.
3. No login required to view.

**Priority:** Medium
**Story Points:** 3
**Notes:**
- Ensure sensitive info is not displayed publicly.

**Title:** Patient Sign Up
_As a patient, I want to sign up using my email and password, so that I can book appointments._

**Acceptance Criteria:**
1. Patient enters email, password, and details.
2. System creates a new patient account.
3. Patient receives confirmation (e.g., email or on-screen).

**Priority:** High
**Story Points:** 5
**Notes:**
- Validate email format.

**Title:** Patient Login
_As a patient, I want to log into the portal, so that I can manage my bookings._

**Acceptance Criteria:**
1. Patient enters valid credentials.
2. System authenticates and redirects to patient dashboard.
3. Invalid login shows error.

**Priority:** High
**Story Points:** 3
**Notes:**
- Standard authentication flow.

**Title:** Patient Logout
_As a patient, I want to log out of the portal, so that I can secure my account._

**Acceptance Criteria:**
1. Patient clicks logout.
2. Session is terminated.
3. Redirect to home/login page.

**Priority:** Low
**Story Points:** 1
**Notes:**
- Clear local storage/cookies if applicable.

**Title:** Book Appointment
_As a patient, I want to log in and book an hour-long appointment, so that I can consult with a doctor._

**Acceptance Criteria:**
1. Authenticated patient selects a doctor and available slot.
2. System books the appointment for 1 hour.
3. Appointment appears in patient's schedule.

**Priority:** High
**Story Points:** 8
**Notes:**
- Handle concurrent booking attempts.

**Title:** View Upcoming Appointments
_As a patient, I want to view my upcoming appointments, so that I can prepare accordingly._

**Acceptance Criteria:**
1. Patient dashboard displays list of future appointments.
2. Details include doctor, time, and date.
3. List is sorted by date.

**Priority:** Medium
**Story Points:** 3
**Notes:**
- Filtering by past/future.

---

## Doctor User Stories

**Title:** Doctor Login
_As a doctor, I want to log into the portal, so that I can manage my appointments._

**Acceptance Criteria:**
1. Doctor enters valid credentials.
2. System authenticates and redirects to doctor dashboard.

**Priority:** High
**Story Points:** 3
**Notes:**
- Distinct role from Admin/Patient.

**Title:** Doctor Logout
_As a doctor, I want to log out of the portal, so that I can protect my data._

**Acceptance Criteria:**
1. Doctor clicks logout.
2. Session ends.

**Priority:** Low
**Story Points:** 1
**Notes:**
- Security best practice.

**Title:** View Appointment Calendar
_As a doctor, I want to view my appointment calendar, so that I can stay organized._

**Acceptance Criteria:**
1. Doctor dashboard shows a calendar view.
2. Appointments are visible on the calendar.
3. Clicking an appointment shows details.

**Priority:** High
**Story Points:** 8
**Notes:**
- Monthly/Weekly views.

**Title:** Mark Unavailability
_As a doctor, I want to mark my unavailability, so that patients only the available slots._

**Acceptance Criteria:**
1. Doctor selects dates/times to mark as unavailable.
2. System updates schedule.
3. Patients cannot book these slots.

**Priority:** Medium
**Story Points:** 5
**Notes:**
- Integration with booking system logic.

**Title:** Update Profile
_As a doctor, I want to update my profile with specialization and contact information, so that patients have up-to-date information._

**Acceptance Criteria:**
1. Doctor can edit their profile fields.
2. Changes are saved to database.
3. Updated info is visible to patients.

**Priority:** Low
**Story Points:** 3
**Notes:**
- Validation on contact info.

**Title:** View Patient Details
_As a doctor, I want to view the patient details for upcoming appointments, so that I can be prepared._

**Acceptance Criteria:**
1. Doctor selects an appointment.
2. Patient details (name, history, etc.) are displayed.
3. Access is restricted to assigned doctor.

**Priority:** Medium
**Story Points:** 5
**Notes:**
- HIPAA/Privacy compliance.
