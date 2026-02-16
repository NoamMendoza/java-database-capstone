package com.project.back_end.controllers;

import com.project.back_end.DTO.Login;
import com.project.back_end.models.Patient;
import com.project.back_end.services.PatientService;
import com.project.back_end.services.Service;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/patient")
public class PatientController {

    private final PatientService patientService;
    private final Service service;

    public PatientController(PatientService patientService, Service service) {
        this.patientService = patientService;
        this.service = service;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Login login) {
        String token = service.validatePatientLogin(login);
        if (token == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> createPatient(@RequestBody Patient patient) {
        int result = patientService.createPatient(patient);
        if (result == 0) return ResponseEntity.status(HttpStatus.CONFLICT).body("Patient already exists");
        return ResponseEntity.ok("Patient created successfully");
    }

    @GetMapping("/details/{token}")
    public ResponseEntity<?> getPatient(@PathVariable String token) {
        Patient patient = patientService.getPatientDetails(token);
        if (patient == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Token");
        return ResponseEntity.ok(patient);
    }

    @GetMapping("/appointments/{patientId}/{token}")
    public ResponseEntity<?> getPatientAppointment(@PathVariable Long patientId, @PathVariable String token) {
        if (!service.validateToken(token, "patient")) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Token");
        return ResponseEntity.ok(patientService.getPatientAppointment(patientId));
    }
}
