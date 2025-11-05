package com.example.grievanceportal.service;

import com.example.grievanceportal.entity.User;
import com.example.grievanceportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired private UserRepository userRepo;
    @Autowired private EmailService emailService;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    private static final SecureRandom random = new SecureRandom();

    public String signup(String fullname, String email, String password, String role) {
        if (email == null || password == null || fullname == null)
            return "Missing fields";

        if (userRepo.existsByEmail(email))
            return "Email already exists";

        String otp = String.format("%06d", random.nextInt(1000000));

        User user = new User();
        user.setFullname(fullname);
        user.setEmail(email);
        user.setPassword(encoder.encode(password));
        user.setRole(role == null ? "USER" : role.toUpperCase());
        user.setEnabled(false);
        user.setVerificationOtp(otp);
        user.setOtpExpiry(Instant.now().plusSeconds(600).toEpochMilli());
        userRepo.save(user);

        emailService.sendOtp(email, otp);

        return "OTP sent to your email";
    }

    public String verifyOtp(String email, String otp) {
        Optional<User> opt = userRepo.findByEmail(email);
        if (opt.isEmpty()) return "User not found";
        User user = opt.get();

        if (user.isEnabled()) return "Already verified";
        if (!otp.equals(user.getVerificationOtp())) return "Invalid OTP";
        if (Instant.now().toEpochMilli() > user.getOtpExpiry()) return "OTP expired";

        user.setEnabled(true);
        user.setVerificationOtp(null);
        user.setOtpExpiry(null);
        userRepo.save(user);

        return "Verified successfully";
    }

    public User signinSession(String email, String password) {
        Optional<User> opt = userRepo.findByEmail(email);
        if (opt.isEmpty()) return null;

        User user = opt.get();
        if (!user.isEnabled()) return null;

        if (!encoder.matches(password, user.getPassword()))
            return null;

        return user;
    }

    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    public void updateOwnProfile(User user, String fullname, String phone, String address) {
        if (fullname != null && !fullname.isBlank()) user.setFullname(fullname);
        if (phone != null && !phone.isBlank()) user.setPhone(phone);
        if (address != null && !address.isBlank()) user.setAddress(address);

        userRepo.save(user);
    }

    public User getById(Long id) {
    return userRepo.findById(id).orElse(null);
}

}
