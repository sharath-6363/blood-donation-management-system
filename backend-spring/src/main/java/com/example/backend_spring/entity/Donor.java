package com.example.backend_spring.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "donors")
public class Donor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Integer age;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Enumerated(EnumType.STRING)
    @Column(name = "blood_group")
    private BloodGroup bloodGroup;

    private Double weight;
    private Double height;
    private String contactNumber;
    private String email;
    private String address;
    private Integer totalDonations = 0;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate lastDonationDate;
    
    private Integer monthsSinceLast = 0;
    private Double hemoglobinLevel;
    private Integer bloodPressureSystolic;
    private Integer bloodPressureDiastolic;
    private Boolean hasChronicDisease = false;
    private String chronicDiseaseDetails;
    private Boolean onMedication = false;
    private String medicationDetails;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate lastTravelDate;
    
    private String travelHistory;
    private Boolean isSmoker = false;
    private Boolean isAlcoholic = false;

    @Enumerated(EnumType.STRING)
    private FitnessLevel fitnessLevel = FitnessLevel.MEDIUM;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Donor() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public enum Gender {
        MALE, FEMALE, OTHER
    }

    public enum BloodGroup {
        A_POSITIVE, A_NEGATIVE, B_POSITIVE, B_NEGATIVE,
        AB_POSITIVE, AB_NEGATIVE, O_POSITIVE, O_NEGATIVE
    }

    public enum FitnessLevel {
        LOW, MEDIUM, HIGH
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }
    public Gender getGender() { return gender; }
    public void setGender(Gender gender) { this.gender = gender; }
    public BloodGroup getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(BloodGroup bloodGroup) { this.bloodGroup = bloodGroup; }
    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }
    public Double getHeight() { return height; }
    public void setHeight(Double height) { this.height = height; }
    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public Integer getTotalDonations() { return totalDonations; }
    public void setTotalDonations(Integer totalDonations) { this.totalDonations = totalDonations; }
    public LocalDate getLastDonationDate() { return lastDonationDate; }
    public void setLastDonationDate(LocalDate lastDonationDate) { this.lastDonationDate = lastDonationDate; }
    public Integer getMonthsSinceLast() { return monthsSinceLast; }
    public void setMonthsSinceLast(Integer monthsSinceLast) { this.monthsSinceLast = monthsSinceLast; }
    public Double getHemoglobinLevel() { return hemoglobinLevel; }
    public void setHemoglobinLevel(Double hemoglobinLevel) { this.hemoglobinLevel = hemoglobinLevel; }
    public Integer getBloodPressureSystolic() { return bloodPressureSystolic; }
    public void setBloodPressureSystolic(Integer bloodPressureSystolic) { this.bloodPressureSystolic = bloodPressureSystolic; }
    public Integer getBloodPressureDiastolic() { return bloodPressureDiastolic; }
    public void setBloodPressureDiastolic(Integer bloodPressureDiastolic) { this.bloodPressureDiastolic = bloodPressureDiastolic; }
    public Boolean getHasChronicDisease() { return hasChronicDisease; }
    public void setHasChronicDisease(Boolean hasChronicDisease) { this.hasChronicDisease = hasChronicDisease; }
    public String getChronicDiseaseDetails() { return chronicDiseaseDetails; }
    public void setChronicDiseaseDetails(String chronicDiseaseDetails) { this.chronicDiseaseDetails = chronicDiseaseDetails; }
    public Boolean getOnMedication() { return onMedication; }
    public void setOnMedication(Boolean onMedication) { this.onMedication = onMedication; }
    public String getMedicationDetails() { return medicationDetails; }
    public void setMedicationDetails(String medicationDetails) { this.medicationDetails = medicationDetails; }
    public LocalDate getLastTravelDate() { return lastTravelDate; }
    public void setLastTravelDate(LocalDate lastTravelDate) { this.lastTravelDate = lastTravelDate; }
    public String getTravelHistory() { return travelHistory; }
    public void setTravelHistory(String travelHistory) { this.travelHistory = travelHistory; }
    public Boolean getIsSmoker() { return isSmoker; }
    public void setIsSmoker(Boolean isSmoker) { this.isSmoker = isSmoker; }
    public Boolean getIsAlcoholic() { return isAlcoholic; }
    public void setIsAlcoholic(Boolean isAlcoholic) { this.isAlcoholic = isAlcoholic; }
    public FitnessLevel getFitnessLevel() { return fitnessLevel; }
    public void setFitnessLevel(FitnessLevel fitnessLevel) { this.fitnessLevel = fitnessLevel; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
