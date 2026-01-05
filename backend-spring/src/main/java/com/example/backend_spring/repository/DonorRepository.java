package com.example.backend_spring.repository;

import com.example.backend_spring.entity.Donor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DonorRepository extends JpaRepository<Donor, Long> {
    
    Optional<Donor> findByContactNumber(String contactNumber);
    
    List<Donor> findByBloodGroup(Donor.BloodGroup bloodGroup);
    
    @Query("SELECT d FROM Donor d WHERE d.monthsSinceLast >= 3 AND d.age >= 18 AND d.age <= 65")
    List<Donor> findEligibleDonors();
}
