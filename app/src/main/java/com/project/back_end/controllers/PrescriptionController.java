package com.project.back_end.controllers;

import com.project.back_end.models.Prescription;
import com.project.back_end.services.PrescriptionService;
import com.project.back_end.services.Service;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/prescription")
public class PrescriptionController {

    private final PrescriptionService prescriptionService;
    private final Service service;

    public PrescriptionController(PrescriptionService prescriptionService, Service service) {
        this.prescriptionService = prescriptionService;
        this.service = service;
    }

    @PostMapping("/save/{token}")
    public ResponseEntity<?> savePrescription(@RequestBody Prescription prescription, @PathVariable String token) {
        if (!service.validateToken(token, "doctor")) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Token");
        prescriptionService.savePrescription(prescription);
        return ResponseEntity.ok("Prescription saved");
    }

    @GetMapping("/view/{appointmentId}/{token}")
    public ResponseEntity<?> getPrescription(@PathVariable Long appointmentId, @PathVariable String token) {
        if (!service.validateToken(token, "doctor") && !service.validateToken(token, "patient")) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Token");
        return ResponseEntity.ok(prescriptionService.getPrescription(appointmentId));
    }
}
