package com.example.grievanceportal.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired private JavaMailSender mailSender;

    public void sendOtp(String to, String otp) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(to);
        msg.setSubject("Verify Your Email - OTP");
        msg.setText("Your OTP: " + otp + "\nValid for 10 minutes.");
        mailSender.send(msg);
    }

    public void sendPasswordReset(String to, String tempPass) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(to);
        msg.setSubject("Password Reset");
        msg.setText("New password: " + tempPass + "\nChange after login.");
        mailSender.send(msg);
    }
}
