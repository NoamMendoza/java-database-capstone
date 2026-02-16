package com.project.back_end.services;

import com.project.back_end.DTO.AppointmentDTO;
import com.project.back_end.models.Appointment;
import com.project.back_end.repo.AppointmentRepository;
import com.project.back_end.repo.DoctorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;

    public AppointmentService(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    @Transactional
    public int bookAppointment(Appointment appointment) {
        try {
            appointmentRepository.save(appointment);
            return 1;
        } catch (Exception e) {
            return 0;
        }
    }

    @Transactional
    public int updateAppointment(Appointment appointment) {
        if (!appointmentRepository.existsById(appointment.getId())) return -1;
        appointmentRepository.save(appointment);
        return 1;
    }

    @Transactional
    public int cancelAppointment(Long id) {
        if (!appointmentRepository.existsById(id)) return -1;
        appointmentRepository.deleteById(id);
        return 1;
    }
    
    public List<AppointmentDTO> getAppointments(Long doctorId, LocalDate date) {
         LocalDateTime start = date.atStartOfDay();
         LocalDateTime end = date.atTime(LocalTime.MAX);
         return appointmentRepository.findByDoctorIdAndAppointmentTimeBetween(doctorId, start, end)
                 .stream()
                 .map(AppointmentDTO::new)
                 .collect(Collectors.toList());
    }

    @Transactional
    public int changeStatus(Long id, int status) {
        if (!appointmentRepository.existsById(id)) return 0;
        appointmentRepository.updateStatus(status, id);
        return 1;
    }
}
