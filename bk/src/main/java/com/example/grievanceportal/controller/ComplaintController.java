package com.example.grievanceportal.controller;

import com.example.grievanceportal.entity.Complaint;
import com.example.grievanceportal.service.ComplaintService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/complaints")
@CrossOrigin(origins="http://localhost:5173", allowCredentials="true")
public class ComplaintController {

    @Autowired private ComplaintService service;

    @PostMapping
    public Complaint submit(HttpSession session, @RequestBody Complaint c) {
        return service.submit(session, c);
    }

    @GetMapping("/my")
    public Object my(HttpSession session) {
        return service.myComplaints(session);
    }

    @GetMapping
    public Object all(HttpSession session) {
        return service.all(session);
    }

    @PutMapping("/{id}/assign/{officerId}")
    public Object assign(HttpSession session, @PathVariable Long id, @PathVariable Long officerId) {
        return service.assign(session, id, officerId);
    }

    @GetMapping("/assigned")
    public Object assignedToOfficer(HttpSession session) {
        return service.assignedToOfficer(session);
    }

    @PutMapping("/{id}/status")
    public Object updateStatus(HttpSession session, @PathVariable Long id, @RequestBody Map<String, String> req) {
        return service.updateStatus(session, id, req.get("status"), req.get("remark"));
    }
}
