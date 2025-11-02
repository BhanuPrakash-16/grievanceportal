package com.example.grievanceportal.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;

@Service
public class JwtService {

    private final SecretKey key;
    private final long expiration;

    public JwtService(@Value("${jwt.secret:S29iN5KeixyPeEN661YYWCjqqOfd7B+ANe/1U89bjo8=}") String secret,
                      @Value("${jwt.expiration-ms:86400000}") long expiration_ms) {
        SecretKey k;
        try {
            byte[] decoded = Decoders.BASE64.decode(secret);
            if (decoded.length >= 16) {
                k = Keys.hmacShaKeyFor(decoded);
            } else {
                k = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
            }
        } catch (Exception ex) {
            k = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        }
        this.key = k;
        this.expiration = expiration_ms;
    }

    public String generateToken(String email, String role) {
        long now = System.currentTimeMillis();
        return Jwts.builder()
                .setClaims(Map.of("email", email, "role", role))
                .setIssuedAt(new Date(now))
                .setExpiration(new Date(now + expiration))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public Claims parseClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
    }

    public String getEmail(String token) {
        return parseClaims(token).get("email", String.class);
    }

    public String getRole(String token) {
        return parseClaims(token).get("role", String.class);
    }
}
