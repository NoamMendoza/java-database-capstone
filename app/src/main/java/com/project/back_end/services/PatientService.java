package com.project.back_end.services;

import com.project.back_end.DTO.AppointmentDTO;
import com.project.back_end.models.Appointment;
import com.project.back_end.models.Patient;
import com.project.back_end.repo.AppointmentRepository;
import com.project.back_end.repo.PatientRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PatientService {

    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final TokenService tokenService;

    public PatientService(PatientRepository patientRepository, AppointmentRepository appointmentRepository, TokenService tokenService) {
        this.patientRepository = patientRepository;
        this.appointmentRepository = appointmentRepository;
        this.tokenService = tokenService;
    }

    @Transactional
    public int createPatient(Patient patient) {
        if (patientRepository.findByEmailOrPhone(patient.getEmail(), patient.getPhone()) != null) {
            return 0; // Exists
        }
        try {
            patientRepository.save(patient);
            return 1;
        } catch (Exception e) {
            return 0;
        }
    }

    public List<AppointmentDTO> getPatientAppointment(Long patientId) {
        List<Appointment> appointments = appointmentRepository.findByPatientId(patientId);
        return appointments.stream()
                .map(AppointmentDTO::new)
                .collect(Collectors.toList());
    }

    public List<AppointmentDTO> filterByCondition(Long patientId, String condition) {
         int status = condition.equalsIgnoreCase("past") ? 1 : 0; 
         return appointmentRepository.findByPatient_IdAndStatusOrderByAppointmentTimeAsc(patientId, status)
                 .stream()
                 .map(AppointmentDTO::new)
                 .collect(Collectors.toList());
    }

    public List<AppointmentDTO> filterByDoctor(Long patientId, String doctorName) {
        return appointmentRepository.filterByDoctorNameAndPatientId(doctorName, patientId)
                .stream()
                .map(AppointmentDTO::new)
                .collect(Collectors.toList());
    }
    
    public List<AppointmentDTO> filterByDoctorAndCondition(Long patientId, String doctorName, String condition) {
        int status = condition.equalsIgnoreCase("past") ? 1 : 0;
        return appointmentRepository.filterByDoctorNameAndPatientIdAndStatus(doctorName, patientId, status)
                .stream()
                .map(AppointmentDTO::new)
                .collect(Collectors.toList());
    }

    public Patient getPatientDetails(String token) {
        String email = tokenService.extractEmail(token);
        if (email == null) return null;
        return patientRepository.findByEmail(email);
    }
}
