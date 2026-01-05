package com.example.backend_spring.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "events")
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String location;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate eventDate;
    
    private Integer targetDonors = 0;
    
    @Enumerated(EnumType.STRING)
    private Status status = Status.SCHEDULED;
    
    private LocalDateTime createdAt;

    public Event() {
        this.createdAt = LocalDateTime.now();
    }

    public enum Status {
        SCHEDULED, ONGOING, COMPLETED, CANCELLED
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public LocalDate getEventDate() { return eventDate; }
    public void setEventDate(LocalDate eventDate) { this.eventDate = eventDate; }
    public Integer getTargetDonors() { return targetDonors; }
    public void setTargetDonors(Integer targetDonors) { this.targetDonors = targetDonors; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
