package com.example.backend_spring.controller;

import com.example.backend_spring.entity.User;
import com.example.backend_spring.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        try {
            String username = credentials.get("username");
            String password = credentials.get("password");
            
            if (username == null || password == null) {
                return ResponseEntity.status(400).body("Username and password are required");
            }
            
            var userOpt = userService.getUserByUsername(username);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(401).body("Invalid credentials");
            }
            
            if (userService.authenticate(username, password)) {
                User user = userOpt.get();
                String role = user.getRole() != null ? user.getRole().toString() : "STAFF";
                return ResponseEntity.ok(Map.of(
                    "token", "dummy-jwt-token-" + user.getId(),
                    "username", user.getUsername(),
                    "role", role
                ));
            }
            return ResponseEntity.status(401).body("Invalid credentials");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Login failed: " + e.getMessage());
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            if (user.getUsername() == null || user.getEmail() == null || user.getPassword() == null) {
                return ResponseEntity.badRequest().body("Username, email and password are required");
            }
            if (userService.getUserByUsername(user.getUsername()).isPresent()) {
                return ResponseEntity.badRequest().body("Username already exists");
            }
            if (userService.getUserByEmail(user.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body("Email already exists");
            }
            if (user.getRole() == null) {
                user.setRole(User.Role.STAFF);
            }
            User created = userService.createUser(user);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Registration successful",
                "userId", created.getId()
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }
}
