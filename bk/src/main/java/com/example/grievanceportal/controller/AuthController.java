package com.example.grievanceportal.controller;

import com.example.grievanceportal.entity.User;
import com.example.grievanceportal.service.AuthService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody Map<String, String> req) {
        return ResponseEntity.ok(authService.signup(
                req.get("fullname"),
                req.get("email"),
                req.get("password"),
                req.get("role")
        ));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestBody Map<String, String> req) {
        return ResponseEntity.ok(authService.verifyOtp(req.get("email"), req.get("otp")));
    }

    @PostMapping("/signin")
    public ResponseEntity<?> signin(@RequestBody Map<String, String> req, HttpSession session) {
        User user = authService.signinSession(req.get("email"), req.get("password"));
        if (user == null) {
            return ResponseEntity.status(401).body("Invalid credentials or Account not verified");
        }

        session.setAttribute("user", user);
        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "fullname", user.getFullname(),
                "email", user.getEmail(),
                "role", user.getRole()
        ));
    }

    @GetMapping("/logout")
    public ResponseEntity<String> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok("Logged out successfully");
    }

@GetMapping("/profile")
public ResponseEntity<?> getProfile(HttpSession session) {
    User sessionUser = (User) session.getAttribute("user");
    if (sessionUser == null)
        return ResponseEntity.status(401).body("Not logged in");

    // Reload fresh copy from DB using service
    User user = authService.getById(sessionUser.getId());
    if (user == null)
        return ResponseEntity.status(404).body("User not found");

    Map<String, Object> profile = new HashMap<>();
    profile.put("id", user.getId());
    profile.put("fullname", user.getFullname());
    profile.put("email", user.getEmail());
    profile.put("phone", user.getPhone());
    profile.put("address", user.getAddress());
    profile.put("role", user.getRole());

    return ResponseEntity.ok(profile);
}


    @PutMapping("/profile")
    public ResponseEntity<?> updateOwnProfile(HttpSession session, @RequestBody Map<String, String> req) {
        User user = (User) session.getAttribute("user");
        if (user == null) return ResponseEntity.status(401).body("Not logged in");

        authService.updateOwnProfile(user, req.get("fullname"), req.get("phone"), req.get("address"));
        return ResponseEntity.ok("Profile updated successfully");
    }

    @GetMapping
    public ResponseEntity<?> listAll(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null || !user.getRole().equalsIgnoreCase("ADMIN"))
            return ResponseEntity.status(403).body("Forbidden");

        List<User> list = authService.getAllUsers();
        return ResponseEntity.ok(list);
    }
}
