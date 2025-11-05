package com.example.grievanceportal.repository;

import com.example.grievanceportal.entity.Complaint;
import com.example.grievanceportal.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByUser(User user);
    List<Complaint> findByAssignedOfficer(User officer);
}
