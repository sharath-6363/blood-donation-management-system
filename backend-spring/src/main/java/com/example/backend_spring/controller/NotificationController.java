package com.example.backend_spring.controller;

import com.example.backend_spring.entity.Donor;
import com.example.backend_spring.service.DonorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:3000")
public class NotificationController {

    @Autowired
    private DonorService donorService;

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.email.from}")
    private String fromEmail;

    @Value("${app.email.enabled}")
    private boolean emailEnabled;

    @PostMapping("/send-email")
    public ResponseEntity<?> sendEmail(@RequestBody Map<String, Object> request) {
        try {
            Object donorIdsObj = request.get("donorIds");
            String subject = (String) request.get("subject");
            String message = (String) request.get("message");
            
            List<Long> donorIds = new ArrayList<>();
            if (donorIdsObj instanceof List) {
                for (Object id : (List<?>) donorIdsObj) {
                    if (id instanceof Number) {
                        donorIds.add(((Number) id).longValue());
                    }
                }
            }
            
            List<String> emailsSent = new ArrayList<>();
            List<String> emailsFailed = new ArrayList<>();
            
            for (Long donorId : donorIds) {
                var donorOpt = donorService.getDonorById(donorId);
                if (donorOpt.isPresent()) {
                    Donor donor = donorOpt.get();
                    
                    try {
                        String healthInstructions = "";
                        if (donor.getIsSmoker() != null && donor.getIsSmoker()) {
                            healthInstructions += "\n⚠️ IMPORTANT: Please avoid smoking at least 24 hours before donation.\n";
                        }
                        if (donor.getIsAlcoholic() != null && donor.getIsAlcoholic()) {
                            healthInstructions += "\n⚠️ IMPORTANT: Please avoid alcohol at least 24 hours before donation.\n";
                        }
                        
                        String fullMessage = "Dear " + donor.getName() + ",\n\n" + message + healthInstructions + "\n\nBest regards,\nBlood Donation Team";
                        
                        if (emailEnabled && donor.getEmail() != null && !donor.getEmail().isEmpty()) {
                            SimpleMailMessage mailMessage = new SimpleMailMessage();
                            mailMessage.setFrom(fromEmail);
                            mailMessage.setTo(donor.getEmail());
                            mailMessage.setSubject(subject);
                            mailMessage.setText(fullMessage);
                            
                            mailSender.send(mailMessage);
                            emailsSent.add(donor.getEmail());
                            System.out.println("✅ Email sent to: " + donor.getEmail() + " (" + donor.getName() + ")");
                        } else {
                            emailsSent.add(donor.getEmail());
                            System.out.println("\n========== EMAIL SIMULATION ==========");
                            System.out.println("From: " + fromEmail);
                            System.out.println("To: " + donor.getEmail() + " (" + donor.getName() + ")");
                            System.out.println("Subject: " + subject);
                            System.out.println("Message: " + fullMessage);
                            System.out.println("======================================\n");
                        }
                    } catch (Exception e) {
                        emailsFailed.add(donor.getEmail());
                        String errorMsg = e.getMessage();
                        if (errorMsg != null && errorMsg.contains("UnknownHostException")) {
                            System.err.println("❌ Failed to send email to: " + donor.getEmail() + " - No internet connection");
                        } else if (errorMsg != null && errorMsg.contains("Authentication")) {
                            System.err.println("❌ Failed to send email to: " + donor.getEmail() + " - Gmail authentication failed");
                        } else {
                            System.err.println("❌ Failed to send email to: " + donor.getEmail() + " - " + errorMsg);
                        }
                    }
                }
            }
            
            String statusMessage = emailEnabled ? 
                "Real emails sent to " + emailsSent.size() + " donors!" :
                "Email simulation completed for " + emailsSent.size() + " donors (check console)";
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", statusMessage,
                "count", emailsSent.size(),
                "failed", emailsFailed.size(),
                "emailsSent", emailsSent,
                "emailsFailed", emailsFailed,
                "mode", emailEnabled ? "REAL" : "SIMULATION"
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", "Failed to send emails: " + e.getMessage()
            ));
        }
    }
}
