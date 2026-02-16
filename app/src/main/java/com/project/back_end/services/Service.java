package com.project.back_end.services;

import com.project.back_end.DTO.Login;
import com.project.back_end.models.Admin;
import com.project.back_end.models.Appointment;
import com.project.back_end.models.Doctor;
import com.project.back_end.models.Patient;
import com.project.back_end.repo.AdminRepository;
import com.project.back_end.repo.AppointmentRepository;
import com.project.back_end.repo.DoctorRepository;
import com.project.back_end.repo.PatientRepository;

import java.util.ArrayList;
import java.util.List;

@org.springframework.stereotype.Service
public class Service {

    private final TokenService tokenService;
    private final AdminRepository adminRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;

    public Service(TokenService tokenService, AdminRepository adminRepository, DoctorRepository doctorRepository, PatientRepository patientRepository, AppointmentRepository appointmentRepository) {
        this.tokenService = tokenService;
        this.adminRepository = adminRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.appointmentRepository = appointmentRepository;
    }

    public boolean validateToken(String token, String role) {
        return tokenService.validateToken(token, role);
    }

    public String validateAdmin(Admin admin) {
        Admin existing = adminRepository.findByUsername(admin.getUsername());
        if (existing != null && existing.getPassword().equals(admin.getPassword())) {
            return tokenService.generateToken(existing.getUsername());
        }
        return null;
    }

    public List<Doctor> filterDoctor(String name, String specialty) {
        if (name != null && !name.isEmpty() && specialty != null && !specialty.isEmpty()) {
            return doctorRepository.findByNameContainingIgnoreCaseAndSpecialtyIgnoreCase(name, specialty);
        } else if (name != null && !name.isEmpty()) {
            return doctorRepository.findByNameLike("%" + name + "%");
        } else if (specialty != null && !specialty.isEmpty()) {
            return doctorRepository.findBySpecialtyIgnoreCase(specialty);
        } else {
            return doctorRepository.findAll();
        }
    }

    public boolean validateAppointment(Appointment appointment) {
        return appointment.getDoctor() != null && appointment.getPatient() != null && appointment.getAppointmentTime() != null;
    }

    public Patient validatePatient(Patient patient) {
        if (patientRepository.findByEmailOrPhone(patient.getEmail(), patient.getPhone()) == null) {
            return patientRepository.save(patient);
        }
        return null;
    }

    public String validatePatientLogin(Login login) {
        Patient existing = patientRepository.findByEmail(login.getEmail());
        if (existing != null && existing.getPassword().equals(login.getPassword())) {
             return tokenService.generateToken(existing.getEmail());
        }
        return null; 
    }

    public List<Appointment> filterPatient(String token, String condition, String doctorName) {
         String email = tokenService.extractEmail(token);
         if (email == null) return new ArrayList<>();
         
         Patient patient = patientRepository.findByEmail(email);
         if (patient == null) return new ArrayList<>();

         if (condition != null && doctorName != null) {
             int status = condition.equalsIgnoreCase("completed") ? 1 : 0;
             return appointmentRepository.filterByDoctorNameAndPatientIdAndStatus(doctorName, patient.getId(), status);
         } else if (doctorName != null) {
             return appointmentRepository.filterByDoctorNameAndPatientId(doctorName, patient.getId());
         } else if (condition != null) {
             int status = condition.equalsIgnoreCase("completed") ? 1 : 0;
             return appointmentRepository.findByPatient_IdAndStatusOrderByAppointmentTimeAsc(patient.getId(), status);
         } else {
             return appointmentRepository.findByPatientId(patient.getId());
         }
    }
}
