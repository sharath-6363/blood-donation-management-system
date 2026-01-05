package com.example.backend_spring.service;

import com.example.backend_spring.entity.Donor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class MlClientService {

    @Value("${app.ml-service-url}")
    private String mlServiceUrl;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    public Map<String, Object> predictDonationProbability(Donor donor) {
        try {
            String url = mlServiceUrl + "/predict";

            // Prepare request payload with defaults for null values
            Map<String, Object> requestPayload = new HashMap<>();
            requestPayload.put("months_since_last", donor.getMonthsSinceLast() != null ? donor.getMonthsSinceLast() : 0);
            requestPayload.put("total_donations", donor.getTotalDonations() != null ? donor.getTotalDonations() : 0);
            requestPayload.put("age", donor.getAge() != null ? donor.getAge() : 25);
            requestPayload.put("hemoglobin_level", donor.getHemoglobinLevel() != null ? donor.getHemoglobinLevel() : 13.5);
            requestPayload.put("weight", donor.getWeight() != null ? donor.getWeight() : 60.0);
            requestPayload.put("height", donor.getHeight() != null ? donor.getHeight() : 165.0);
            requestPayload.put("has_chronic_disease", donor.getHasChronicDisease() != null ? donor.getHasChronicDisease() : false);
            requestPayload.put("on_medication", donor.getOnMedication() != null ? donor.getOnMedication() : false);
            requestPayload.put("is_smoker", donor.getIsSmoker() != null ? donor.getIsSmoker() : false);
            requestPayload.put("is_alcoholic", donor.getIsAlcoholic() != null ? donor.getIsAlcoholic() : false);
            requestPayload.put("fitness_level", donor.getFitnessLevel() != null ? donor.getFitnessLevel().toString() : "MEDIUM");
            requestPayload.put("gender", donor.getGender() != null ? donor.getGender().toString() : "MALE");
            requestPayload.put("blood_pressure_systolic", donor.getBloodPressureSystolic() != null ? donor.getBloodPressureSystolic() : 120);
            requestPayload.put("blood_pressure_diastolic", donor.getBloodPressureDiastolic() != null ? donor.getBloodPressureDiastolic() : 80);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestPayload, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

            JsonNode responseJson = objectMapper.readTree(response.getBody());
            Map<String, Object> result = new HashMap<>();
            result.put("probability", responseJson.get("probability").asDouble());
            result.put("label", responseJson.get("label").asBoolean());

            return result;

        } catch (Exception e) {
            throw new RuntimeException("Error calling ML service: " + e.getMessage());
        }
    }

    public Map<String, Object> predictBatch(List<Map<String, Object>> donors) {
        try {
            String url = mlServiceUrl + "/predict-batch";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<List<Map<String, Object>>> request = new HttpEntity<>(donors, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            return objectMapper.readValue(response.getBody(), Map.class);

        } catch (Exception e) {
            throw new RuntimeException("Error calling ML batch service: " + e.getMessage());
        }
    }

    public void sendHealthAdvisory(String email, String name, String advice) {
        System.out.println("\n========== HEALTH ADVISORY EMAIL ==========");
        System.out.println("To: " + email + " (" + name + ")");
        System.out.println("Subject: 🍿 Health Advisory for Blood Donation");
        System.out.println("Message:\n" + advice);
        System.out.println("==========================================\n");
    }
}
