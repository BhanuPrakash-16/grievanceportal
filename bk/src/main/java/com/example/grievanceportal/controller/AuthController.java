package com.example.grievanceportal.controller;

import com.example.grievanceportal.entity.User;
import com.example.grievanceportal.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class AuthController {

    @Autowired
    private AuthService authService;

    // Signup (same)
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
    public ResponseEntity<String> signin(@RequestBody Map<String, String> req) {
        return ResponseEntity.ok(authService.signin(req.get("email"), req.get("password")));
    }

    @GetMapping("/forgetpassword/{email}")
    public ResponseEntity<String> forgetPassword(@PathVariable String email) {
        return ResponseEntity.ok(authService.forgetPassword(email));
    }

    // LIST all users (admin or for testing) - protected
    @GetMapping
    public ResponseEntity<?> listAll(@RequestHeader(value = "Authorization", required = false) String authHeader,
                                     @RequestHeader(value = "csrid", required = false) String csrid) {
        String token = extractToken(authHeader, csrid);
        User requester = authService.getProfileByToken(token);
        if (requester == null) return ResponseEntity.status(401).body("401::Invalid token");
        // only admin can list everyone (adjust if you want otherwise)
        if (!requester.getRole().equalsIgnoreCase("ADMIN")) return ResponseEntity.status(403).body("403::Forbidden");
        List<User> users = authService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    // Get by id (owner or admin)
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id,
                                     @RequestHeader(value = "Authorization", required = false) String authHeader,
                                     @RequestHeader(value = "csrid", required = false) String csrid) {
        String token = extractToken(authHeader, csrid);
        User requester = authService.getProfileByToken(token);
        if (requester == null) return ResponseEntity.status(401).body("401::Invalid token");

        User target = authService.getById(id);
        if (target == null) return ResponseEntity.status(404).body("404::User not found");

        if (!requester.getRole().equalsIgnoreCase("ADMIN") && !requester.getEmail().equalsIgnoreCase(target.getEmail())) {
            return ResponseEntity.status(403).body("403::Forbidden");
        }

        return ResponseEntity.ok(Map.of(
                "id", target.getId(),
                "fullname", target.getFullname(),
                "email", target.getEmail(),
                "role", target.getRole(),
                "enabled", target.isEnabled()
        ));
    }

    
    // Get profile (by token) - returns the caller's profile
    @GetMapping("/profile")
public ResponseEntity<?> getProfile(@RequestHeader(value = "Authorization", required = false) String authHeader) {
    try {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Missing token"));
        }

        String token = authHeader.substring(7);
        User user = authService.getProfileByToken(token);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid token"));
        }

        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "fullname", user.getFullname(),
                "email", user.getEmail(),
                "role", user.getRole(),
                "enabled", user.isEnabled()
        ));
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Server error"));
    }
}


    // Update profile (partial) - only owner or admin (admin can change role)
    @PutMapping("/{id}")
    public ResponseEntity<String> updateProfile(@PathVariable Long id,
                                                @RequestHeader(value = "Authorization", required = false) String authHeader,
                                                @RequestHeader(value = "csrid", required = false) String csrid,
                                                @RequestBody Map<String, String> req) {
        String token = extractToken(authHeader, csrid);
        String fullname = req.get("fullname");
        String role = req.get("role");
        String result = authService.updateProfile(id, token, fullname, role);
        if (result.startsWith("200::")) return ResponseEntity.ok(result);
        if (result.startsWith("401::")) return ResponseEntity.status(401).body(result);
        if (result.startsWith("403::")) return ResponseEntity.status(403).body(result);
        return ResponseEntity.status(404).body(result);
    }

    // Change password (owner)
    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestHeader(value = "Authorization", required = false) String authHeader,
                                                 @RequestHeader(value = "csrid", required = false) String csrid,
                                                 @RequestBody Map<String, String> req) {
        String token = extractToken(authHeader, csrid);
        String oldPass = req.get("oldPassword");
        String newPass = req.get("newPassword");
        String result = authService.changePassword(token, oldPass, newPass);
        if (result.startsWith("200::")) return ResponseEntity.ok(result);
        if (result.startsWith("400::")) return ResponseEntity.badRequest().body(result);
        return ResponseEntity.status(401).body(result);
    }

    // Delete by id - owner or admin
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteById(@PathVariable Long id,
                                             @RequestHeader(value = "Authorization", required = false) String authHeader,
                                             @RequestHeader(value = "csrid", required = false) String csrid) {
        String token = extractToken(authHeader, csrid);
        String result = authService.deleteUserById(id, token);
        if (result.startsWith("200::")) return ResponseEntity.ok(result);
        if (result.startsWith("401::")) return ResponseEntity.status(401).body(result);
        if (result.startsWith("403::")) return ResponseEntity.status(403).body(result);
        return ResponseEntity.status(404).body(result);
    }

    // helper
    private String extractToken(String authHeader, String csrid) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) return authHeader.substring(7);
        if (csrid != null) return csrid;
        return null;
    }
}
