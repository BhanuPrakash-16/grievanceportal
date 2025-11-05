package com.example.grievanceportal.service;

import com.example.grievanceportal.entity.Complaint;
import com.example.grievanceportal.entity.User;
import com.example.grievanceportal.repository.ComplaintRepository;
import com.example.grievanceportal.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ComplaintService {

    @Autowired private ComplaintRepository repo;
    @Autowired private UserRepository userRepo;

    public Complaint submit(HttpSession session, Complaint c) {
        User user = (User) session.getAttribute("user");
        if (user == null) throw new RuntimeException("Not logged in");

        c.setUser(user);
        c.setStatus("Submitted");
        c.getTimeline().add("Submitted on: " + LocalDateTime.now());

        return repo.save(c);
    }

    public List<Complaint> myComplaints(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) throw new RuntimeException("Not logged in");
        return repo.findByUser(user);
    }

    public List<Complaint> all(HttpSession session) {
        User admin = (User) session.getAttribute("user");
        if (admin == null || !admin.getRole().equals("ADMIN"))
            throw new RuntimeException("Forbidden");
        return repo.findAll();
    }

    public Complaint assign(HttpSession session, Long id, Long officerId) {
        User admin = (User) session.getAttribute("user");
        if (admin == null || !admin.getRole().equals("ADMIN"))
            throw new RuntimeException("Forbidden");

        Complaint c = repo.findById(id).orElseThrow();
        User officer = userRepo.findById(officerId).orElseThrow();

        c.setAssignedOfficer(officer);
        c.setStatus("Assigned to Officer");
        c.getTimeline().add("Assigned to " + officer.getFullname() + " on: " + LocalDateTime.now());

        return repo.save(c);
    }

    public List<Complaint> assignedToOfficer(HttpSession session) {
        User officer = (User) session.getAttribute("user");
        if (officer == null || !officer.getRole().equals("OFFICER"))
            throw new RuntimeException("Not officer");
        return repo.findByAssignedOfficer(officer);
    }

    public Complaint updateStatus(HttpSession session, Long id, String status, String remark) {
        User officer = (User) session.getAttribute("user");
        if (officer == null || !officer.getRole().equals("OFFICER"))
            throw new RuntimeException("Not officer");

        Complaint c = repo.findById(id).orElseThrow();
        c.setStatus(status);
        c.getTimeline().add(remark + " (" + LocalDateTime.now() + ")");

        return repo.save(c);
    }
}
