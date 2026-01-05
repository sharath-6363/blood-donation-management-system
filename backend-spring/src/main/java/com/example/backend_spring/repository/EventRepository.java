package com.example.backend_spring.repository;

import com.example.backend_spring.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    
    @Query("SELECT e FROM Event e WHERE e.eventDate >= :currentDate ORDER BY e.eventDate ASC")
    List<Event> findUpcomingEvents(LocalDate currentDate);
    
    List<Event> findByStatus(String status);
}
