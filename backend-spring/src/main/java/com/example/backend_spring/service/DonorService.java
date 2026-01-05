package com.example.backend_spring.service;

import com.example.backend_spring.entity.Donor;
import com.example.backend_spring.entity.Event;
import com.example.backend_spring.repository.DonorRepository;
import com.example.backend_spring.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class DonorService {

    @Autowired
    private DonorRepository donorRepository;

    @Autowired
    private EventRepository eventRepository;

    public List<Donor> getAllDonors() {
        return donorRepository.findAll();
    }

    public Optional<Donor> getDonorById(Long id) {
        return donorRepository.findById(id);
    }

    public Donor saveDonor(Donor donor) {
        return donorRepository.save(donor);
    }

    public void deleteDonor(Long id) {
        donorRepository.deleteById(id);
    }

    public List<Donor> getEligibleDonors() {
        return donorRepository.findEligibleDonors();
    }

    public List<Donor> getDonorsByBloodGroup(Donor.BloodGroup bloodGroup) {
        return donorRepository.findByBloodGroup(bloodGroup);
    }

    public Optional<Donor> findByContactNumber(String contactNumber) {
        return donorRepository.findByContactNumber(contactNumber);
    }

    public Optional<Event> getEventById(Long id) {
        return eventRepository.findById(id);
    }
}
