package com.example.grievanceportal.service;

import com.example.grievanceportal.entity.User;
import com.example.grievanceportal.repository.UserRepository;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired private UserRepository userRepo;
    @Autowired private EmailService emailService;
    @Autowired private JwtService jwtService;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    private static final SecureRandom random = new SecureRandom();

    // Signup (creates user, stores OTP, sends email)
    public String signup(String fullname, String email, String password, String role) {
        if (email == null || password == null) return "400::Missing required fields";
        if (userRepo.existsByEmail(email)) {
            return "409::Email already exists";
        }

        String otp = generateOtp();
        User user = new User();
        user.setEmail(email);
        user.setFullname(fullname);
        user.setPassword(encoder.encode(password));
        user.setRole(role == null ? "USER" : role);
        user.setEnabled(false);
        user.setVerificationOtp(otp);
        user.setOtpExpiry(Instant.now().plusSeconds(600).toEpochMilli());
        userRepo.save(user);
        emailService.sendOtp(email, otp);
        return "200::OTP sent to email";
    }

    public String verifyOtp(String email, String otp) {
        Optional<User> optUser = userRepo.findByEmail(email);
        if (optUser.isEmpty()) return "404::User not found";

        User user = optUser.get();
        if (user.isEnabled()) return "200::Already verified";
        if (user.getVerificationOtp() == null) return "400::No OTP for user";
        if (!user.getVerificationOtp().equals(otp)) return "400::Invalid OTP";
        if (user.getOtpExpiry() == null || Instant.now().toEpochMilli() > user.getOtpExpiry()) return "400::OTP expired";

        user.setEnabled(true);
        user.setVerificationOtp(null);
        user.setOtpExpiry(null);
        userRepo.save(user);
        return "200::Email verified";
    }

    public String signin(String email, String password) {
        Optional<User> optUser = userRepo.findByEmail(email);
        if (optUser.isEmpty() || !encoder.matches(password, optUser.get().getPassword())) {
            return "401::Invalid credentials";
        }

        User user = optUser.get();
        if (!user.isEnabled()) {
            return "403::Verify email first";
        }

        String token = jwtService.generateToken(user.getEmail(), user.getRole());
        // Return a JSON-like string for backward compatibility
        return "200::" + token + "::" + user.getFullname() + "::" + user.getRole();
    }

    public String forgetPassword(String email) {
        Optional<User> optUser = userRepo.findByEmail(email);
        if (optUser.isEmpty()) return "404::Email not found";

        User user = optUser.get();
        String tempPass = generateRandomPassword();
        user.setPassword(encoder.encode(tempPass));
        userRepo.save(user);
        emailService.sendPasswordReset(email, tempPass);
        return "200::Temporary password sent";
    }

    public User getProfileByToken(String token) {
        if (token == null) return null;
        try {
            String email = jwtService.getEmail(token);
            return userRepo.findByEmail(email).orElse(null);
        } catch (Exception ex) {
            return null;
        }
    }

    public User getById(Long id) {
        return userRepo.findById(id).orElse(null);
    }

    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    public String changePassword(String token, String oldPass, String newPass) {
        if (token == null) return "401::Invalid token";
        String email = jwtService.getEmail(token);
        Optional<User> optUser = userRepo.findByEmail(email);
        if (optUser.isEmpty() || !encoder.matches(oldPass, optUser.get().getPassword())) {
            return "400::Invalid current password";
        }

        User user = optUser.get();
        user.setPassword(encoder.encode(newPass));
        userRepo.save(user);
        return "200::Password changed";
    }

    public String updateProfile(Long id, String token, String fullname, String role) {
        User requester = getProfileByToken(token);
        if (requester == null) return "401::Invalid token";

        User target = getById(id);
        if (target == null) return "404::User not found";

        // only admin or owner can update
        if (!requester.getRole().equalsIgnoreCase("ADMIN") && !requester.getEmail().equalsIgnoreCase(target.getEmail())) {
            return "403::Forbidden";
        }

        if (fullname != null) target.setFullname(fullname);
        if (role != null && requester.getRole().equalsIgnoreCase("ADMIN")) target.setRole(role); // only admin can change role

        userRepo.save(target);
        return "200::Profile updated";
    }

    public String deleteUserById(Long id, String token) {
        User requester = getProfileByToken(token);
        if (requester == null) return "401::Invalid token";

        User target = getById(id);
        if (target == null) return "404::User not found";

        // only admin or owner
        if (!requester.getRole().equalsIgnoreCase("ADMIN") && !requester.getEmail().equalsIgnoreCase(target.getEmail())) {
            return "403::Forbidden";
        }

        userRepo.delete(target);
        return "200::User deleted";
    }

    // helpers
    private String generateOtp() {
        return String.format("%06d", random.nextInt(1000000));
    }

    private String generateRandomPassword() {
        byte[] bytes = new byte[16];
        random.nextBytes(bytes);
        String s = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        return s.substring(0, Math.min(12, s.length()));
    }
}
