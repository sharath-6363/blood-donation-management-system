package com.example.backend_spring.controller;

import com.example.backend_spring.service.DonorService;
import com.example.backend_spring.service.EventService;
import com.example.backend_spring.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "http://localhost:3000")
public class TestController {
    
    @Autowired
    private DonorService donorService;
    
    @Autowired
    private EventService eventService;
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/db-status")
    public ResponseEntity<?> testDatabaseConnection() {
        try {
            long donorCount = donorService.getAllDonors().size();
            long eventCount = eventService.getAllEvents().size();
            long userCount = userService.getAllUsers().size();
            
            return ResponseEntity.ok(Map.of(
                "status", "connected",
                "donorCount", donorCount,
                "eventCount", eventCount,
                "userCount", userCount,
                "message", "Database connection successful"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "status", "error",
                "message", "Database connection failed: " + e.getMessage()
            ));
        }
    }
}
