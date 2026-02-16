package com.project.back_end.controllers;

import com.project.back_end.models.Appointment;
import com.project.back_end.services.AppointmentService;
import com.project.back_end.services.Service;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final Service service;

    public AppointmentController(AppointmentService appointmentService, Service service) {
        this.appointmentService = appointmentService;
        this.service = service;
    }

    @PostMapping("/book/{token}")
    public ResponseEntity<?> bookAppointment(@RequestBody Appointment appointment, @PathVariable String token) {
        if (!service.validateToken(token, "patient")) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Token");
        int result = appointmentService.bookAppointment(appointment);
        if (result == 0) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error booking appointment");
        return ResponseEntity.ok("Appointment booked successfully");
    }

    @DeleteMapping("/cancel/{id}/{token}")
    public ResponseEntity<?> cancelAppointment(@PathVariable Long id, @PathVariable String token) {
        if (!service.validateToken(token, "patient") && !service.validateToken(token, "admin")) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Token");
        int result = appointmentService.cancelAppointment(id);
        if (result == -1) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Appointment not found");
        return ResponseEntity.ok("Appointment canceled");
    }
}
