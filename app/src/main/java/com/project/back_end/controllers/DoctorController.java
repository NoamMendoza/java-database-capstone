package com.project.back_end.controllers;

import com.project.back_end.DTO.Login;
import com.project.back_end.models.Doctor;
import com.project.back_end.services.DoctorService;
import com.project.back_end.services.Service;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/doctor")
public class DoctorController {

    private final DoctorService doctorService;
    private final Service service;

    public DoctorController(DoctorService doctorService, Service service) {
        this.doctorService = doctorService;
        this.service = service;
    }

    @GetMapping("/availability/{doctorId}/{date}/{token}")
    public ResponseEntity<?> getDoctorAvailability(@PathVariable Long doctorId, @PathVariable String date, @PathVariable String token) {
        if (!service.validateToken(token, "patient") && !service.validateToken(token, "doctor") && !service.validateToken(token, "admin")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Token");
        }
        return ResponseEntity.ok(doctorService.getDoctorAvailability(doctorId, LocalDate.parse(date)));
    }

    @GetMapping
    public ResponseEntity<Map<String, List<Doctor>>> getDoctors() {
        Map<String, List<Doctor>> response = new HashMap<>();
        response.put("doctors", doctorService.getDoctors());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/save/{token}")
    public ResponseEntity<?> saveDoctor(@RequestBody Doctor doctor, @PathVariable String token) {
        if (!service.validateToken(token, "admin")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }
        int result = doctorService.saveDoctor(doctor);
        if (result == -1) return ResponseEntity.status(HttpStatus.CONFLICT).body("Doctor already exists");
        if (result == 0) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving doctor");
        return ResponseEntity.ok("Doctor saved successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> doctorLogin(@RequestBody Login login) {
        String token = doctorService.validateDoctor(login);
        if (token == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/update/{token}")
    public ResponseEntity<?> updateDoctor(@RequestBody Doctor doctor, @PathVariable String token) {
        if (!service.validateToken(token, "admin")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }
        int result = doctorService.updateDoctor(doctor);
        if (result == -1) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Doctor not found");
        return ResponseEntity.ok("Doctor updated successfully");
    }

    @DeleteMapping("/delete/{id}/{token}")
    public ResponseEntity<?> deleteDoctor(@PathVariable Long id, @PathVariable String token) {
        if (!service.validateToken(token, "admin")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }
        int result = doctorService.deleteDoctor(id);
        if (result == -1) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Doctor not found");
        return ResponseEntity.ok("Doctor deleted successfully");
    }
}
