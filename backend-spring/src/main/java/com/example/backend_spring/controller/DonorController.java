package com.example.backend_spring.controller;

import com.example.backend_spring.entity.Donor;
import com.example.backend_spring.service.DonorService;
import com.example.backend_spring.service.MlClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/donors")
@CrossOrigin(origins = "http://localhost:3000")
public class DonorController {

    @Autowired
    private DonorService donorService;

    @Autowired
    private MlClientService mlClientService;

    @GetMapping
    public List<Donor> getAllDonors() {
        return donorService.getAllDonors();
    }

    @PostMapping
    public Donor createDonor(@RequestBody Donor donor) {
        Donor savedDonor = donorService.saveDonor(donor);
        
        if ((savedDonor.getIsSmoker() || savedDonor.getIsAlcoholic()) && savedDonor.getEmail() != null) {
            try {
                String advice = "";
                if (savedDonor.getIsSmoker() && savedDonor.getIsAlcoholic()) {
                    advice = "We noticed you are a smoker and consume alcohol. For better blood donation eligibility and your health:\n\n🚭 Please avoid smoking at least 24 hours before donation\n🍺 Please avoid alcohol at least 24 hours before donation\n\nThese habits can affect blood quality and your eligibility. Consider reducing or quitting for better health!";
                } else if (savedDonor.getIsSmoker()) {
                    advice = "We noticed you are a smoker. For better blood donation eligibility and your health:\n\n🚭 Please avoid smoking at least 24 hours before donation\n\nSmoking can affect blood quality and oxygen levels. Consider quitting for better health!";
                } else if (savedDonor.getIsAlcoholic()) {
                    advice = "We noticed you consume alcohol. For better blood donation eligibility and your health:\n\n🍺 Please avoid alcohol at least 24 hours before donation\n\nAlcohol can affect blood quality. Consider reducing consumption for better health!";
                }
                mlClientService.sendHealthAdvisory(savedDonor.getEmail(), savedDonor.getName(), advice);
            } catch (Exception e) {
                System.err.println("Failed to send health advisory: " + e.getMessage());
            }
        }
        return savedDonor;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Donor> getDonorById(@PathVariable Long id) {
        return donorService.getDonorById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Donor> updateDonor(@PathVariable Long id, @RequestBody Donor donor) {
        donor.setId(id);
        Donor savedDonor = donorService.saveDonor(donor);
        
        if ((savedDonor.getIsSmoker() || savedDonor.getIsAlcoholic()) && savedDonor.getEmail() != null) {
            try {
                String advice = "";
                if (savedDonor.getIsSmoker() && savedDonor.getIsAlcoholic()) {
                    advice = "We noticed you are a smoker and consume alcohol. For better blood donation eligibility and your health:\n\n🚭 Please avoid smoking at least 24 hours before donation\n🍺 Please avoid alcohol at least 24 hours before donation\n\nThese habits can affect blood quality and your eligibility. Consider reducing or quitting for better health!";
                } else if (savedDonor.getIsSmoker()) {
                    advice = "We noticed you are a smoker. For better blood donation eligibility and your health:\n\n🚭 Please avoid smoking at least 24 hours before donation\n\nSmoking can affect blood quality and oxygen levels. Consider quitting for better health!";
                } else if (savedDonor.getIsAlcoholic()) {
                    advice = "We noticed you consume alcohol. For better blood donation eligibility and your health:\n\n🍺 Please avoid alcohol at least 24 hours before donation\n\nAlcohol can affect blood quality. Consider reducing consumption for better health!";
                }
                mlClientService.sendHealthAdvisory(savedDonor.getEmail(), savedDonor.getName(), advice);
            } catch (Exception e) {
                System.err.println("Failed to send health advisory: " + e.getMessage());
            }
        }
        return ResponseEntity.ok(savedDonor);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDonor(@PathVariable Long id) {
        donorService.deleteDonor(id);
        return ResponseEntity.ok(Map.of("message", "Donor deleted successfully"));
    }

    @PostMapping("/{id}/predict")
    public ResponseEntity<?> predictDonation(@PathVariable Long id) {
        try {
            Donor donor = donorService.getDonorById(id)
                    .orElseThrow(() -> new RuntimeException("Donor not found"));
            Map<String, Object> prediction = mlClientService.predictDonationProbability(donor);
            return ResponseEntity.ok(prediction);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "ML Service Error: " + e.getMessage()));
        }
    }

    @GetMapping("/eligible")
    public List<Donor> getEligibleDonors() {
        return donorService.getEligibleDonors();
    }

    @GetMapping("/check-phone/{phone}")
    public ResponseEntity<?> checkDonorByPhone(@PathVariable String phone) {
        return donorService.findByContactNumber(phone)
                .map(donor -> {
                    boolean eligible = donor.getMonthsSinceLast() >= 3;
                    return ResponseEntity.ok(Map.of(
                        "exists", true,
                        "donor", donor,
                        "eligible", eligible,
                        "message", eligible ? "Donor is eligible for donation" : "Donor must wait " + (3 - donor.getMonthsSinceLast()) + " more months"
                    ));
                })
                .orElse(ResponseEntity.ok(Map.of(
                    "exists", false,
                    "message", "New donor - Please register"
                )));
    }

    @GetMapping("/eligible-by-location")
    public ResponseEntity<?> getEligibleDonorsByLocation(@RequestParam String location) {
        try {
            List<Donor> allDonors = donorService.getAllDonors();
            List<Donor> eligibleDonors = allDonors.stream()
                    .filter(d -> {
                        boolean eligible = d.getMonthsSinceLast() != null && d.getMonthsSinceLast() >= 3 && d.getAge() >= 18 && d.getAge() <= 65;
                        boolean locationMatch = d.getAddress() != null && d.getAddress().toLowerCase().contains(location.toLowerCase());
                        return eligible && locationMatch;
                    })
                    .toList();
            
            return ResponseEntity.ok(Map.of(
                "location", location,
                "count", eligibleDonors.size(),
                "donors", eligibleDonors
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/predict-for-event/{eventId}")
    public ResponseEntity<?> predictDonorsForEvent(@PathVariable Long eventId) {
        try {
            var eventOpt = donorService.getEventById(eventId);
            if (eventOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Event not found"));
            }
            var event = eventOpt.get();
            
            List<Donor> allDonors = donorService.getAllDonors();
            List<Map<String, Object>> predictions = allDonors.stream()
                    .map(donor -> {
                        try {
                            boolean isNewDonor = donor.getTotalDonations() == null || donor.getTotalDonations() == 0;
                            
                            Map<String, Object> mlPred;
                            if (isNewDonor) {
                                boolean basicEligible = 
                                    donor.getAge() != null && donor.getAge() >= 18 && donor.getAge() <= 65 &&
                                    donor.getWeight() != null && donor.getWeight() >= 50 &&
                                    donor.getHeight() != null && donor.getHeight() >= 150;
                                mlPred = new HashMap<>();
                                mlPred.put("probability", basicEligible ? 0.85 : 0.2);
                                mlPred.put("label", basicEligible);
                            } else {
                                mlPred = mlClientService.predictDonationProbability(donor);
                            }
                            
                            int locationPriority = 0;
                            if (donor.getAddress() != null && event.getLocation() != null) {
                                String donorAddr = donor.getAddress().toLowerCase().trim();
                                String eventLoc = event.getLocation().toLowerCase().trim();
                                String[] eventTokens = eventLoc.split(",");
                                String[] donorTokens = donorAddr.split(",");
                                
                                for (String eventToken : eventTokens) {
                                    String cleanEvent = eventToken.trim();
                                    if (cleanEvent.length() > 2) {
                                        for (String donorToken : donorTokens) {
                                            String cleanDonor = donorToken.trim();
                                            if (cleanDonor.equals(cleanEvent)) {
                                                locationPriority = 2;
                                                break;
                                            } else if (cleanDonor.contains(cleanEvent) || cleanEvent.contains(cleanDonor)) {
                                                locationPriority = Math.max(locationPriority, 1);
                                            }
                                        }
                                        if (locationPriority == 2) break;
                                    }
                                }
                            }
                            
                            Integer monthsSinceLast = donor.getMonthsSinceLast();
                            if (monthsSinceLast == null) monthsSinceLast = 0;
                            
                            Map<String, Object> prediction = new HashMap<>();
                            prediction.put("donorId", donor.getId());
                            prediction.put("donorName", donor.getName());
                            prediction.put("bloodGroup", donor.getBloodGroup());
                            prediction.put("location", donor.getAddress());
                            prediction.put("email", donor.getEmail());
                            prediction.put("contactNumber", donor.getContactNumber());
                            prediction.put("monthsSinceLast", monthsSinceLast);
                            prediction.put("daysSinceLast", monthsSinceLast * 30);
                            prediction.put("probability", mlPred.get("probability"));
                            prediction.put("label", mlPred.get("label"));
                            prediction.put("locationMatch", locationPriority > 0);
                            prediction.put("locationPriority", locationPriority);
                            prediction.put("isSmoker", donor.getIsSmoker() != null ? donor.getIsSmoker() : false);
                            prediction.put("isAlcoholic", donor.getIsAlcoholic() != null ? donor.getIsAlcoholic() : false);
                            prediction.put("isNewDonor", isNewDonor);
                            
                            return prediction;
                        } catch (Exception e) {
                            System.err.println("Error predicting for donor " + donor.getId() + ": " + e.getMessage());
                            return null;
                        }
                    })
                    .filter(p -> {
                        if (p == null) return false;
                        Integer monthsSinceLast = (Integer) p.get("monthsSinceLast");
                        Boolean label = (Boolean) p.get("label");
                        Boolean isNewDonor = (Boolean) p.get("isNewDonor");
                        return isNewDonor || monthsSinceLast >= 3 || label;
                    })
                    .sorted((p1, p2) -> {
                        int loc1 = (Integer) p1.get("locationPriority");
                        int loc2 = (Integer) p2.get("locationPriority");
                        if (loc1 != loc2) return Integer.compare(loc2, loc1);
                        double prob1 = (Double) p1.get("probability");
                        double prob2 = (Double) p2.get("probability");
                        if (Math.abs(prob1 - prob2) > 0.05) return Double.compare(prob2, prob1);
                        int months1 = (Integer) p1.get("monthsSinceLast");
                        int months2 = (Integer) p2.get("monthsSinceLast");
                        return Integer.compare(months2, months1);
                    })
                    .toList();
            
            return ResponseEntity.ok(Map.of(
                "eventId", eventId,
                "eventName", event.getName(),
                "eventLocation", event.getLocation(),
                "eventDate", event.getEventDate(),
                "eligibleCount", predictions.size(),
                "predictions", predictions
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
