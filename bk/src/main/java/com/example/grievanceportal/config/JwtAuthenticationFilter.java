// package com.example.grievanceportal.config;

// import com.example.grievanceportal.service.JwtService;
// import io.jsonwebtoken.JwtException;
// import jakarta.servlet.FilterChain;
// import jakarta.servlet.ServletException;
// import jakarta.servlet.http.HttpServletRequest;
// import jakarta.servlet.http.HttpServletResponse;
// import org.springframework.lang.Nullable;
// import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// import org.springframework.security.core.authority.SimpleGrantedAuthority;
// import org.springframework.security.core.context.SecurityContextHolder;
// import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
// import org.springframework.util.StringUtils;
// import org.springframework.web.filter.OncePerRequestFilter;

// import java.io.IOException;
// import java.util.List;
// import java.util.Map;

// public class JwtAuthenticationFilter extends OncePerRequestFilter {

//     private final JwtService jwtService;

//     public JwtAuthenticationFilter(JwtService jwtService) {
//         this.jwtService = jwtService;
//     }

//     @Override
//     protected boolean shouldNotFilter(HttpServletRequest request) {
//         // Skip JWT authentication for these endpoints
//         return new AntPathRequestMatcher("/users/signup").matches(request)
//                 || new AntPathRequestMatcher("/users/signin").matches(request)
//                 || new AntPathRequestMatcher("/users/verify-otp").matches(request)
//                 || new AntPathRequestMatcher("/users/forgetpassword/**").matches(request)
//                 || new AntPathRequestMatcher("/actuator/**").matches(request); // optional
//     }

//     @Override
//     protected void doFilterInternal(HttpServletRequest request,
//                                     HttpServletResponse response,
//                                     FilterChain filterChain)
//             throws ServletException, IOException {

//         String token = resolveToken(request);

//         if (StringUtils.hasText(token)) {
//             try {
//                 Map<String, Object> claims = jwtService.parseClaims(token);
//                 String email = (String) claims.get("email");
//                 String role = (String) claims.get("role");

//                 if (email != null) {
//                     UsernamePasswordAuthenticationToken authentication =
//                             new UsernamePasswordAuthenticationToken(
//                                     email,
//                                     null,
//                                     List.of(new SimpleGrantedAuthority("ROLE_" + (role == null ? "USER" : role.toUpperCase())))
//                             );
//                     SecurityContextHolder.getContext().setAuthentication(authentication);
//                 }
//             } catch (JwtException e) {
//                 SecurityContextHolder.clearContext();
//             }
//         }

//         filterChain.doFilter(request, response);
//     }

//     @Nullable
//     private String resolveToken(HttpServletRequest request) {
//         String bearer = request.getHeader("Authorization");
//         if (StringUtils.hasText(bearer) && bearer.startsWith("Bearer ")) {
//             return bearer.substring(7);
//         }
//         // fallback: accept alternate headers
//         String csrid = request.getHeader("csrid");
//         if (StringUtils.hasText(csrid)) return csrid;

//         // fallback: token in URL param
//         String tokenParam = request.getParameter("token");
//         if (StringUtils.hasText(tokenParam)) return tokenParam;

//         return null;
//     }
// }
