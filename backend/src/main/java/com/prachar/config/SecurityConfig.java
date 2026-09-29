package com.prachar.config;

import com.prachar.auth.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final CorsConfigurationSource corsConfigurationSource;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(CorsConfigurationSource corsConfigurationSource,
                          JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.corsConfigurationSource = corsConfigurationSource;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public Health and Actuator checks
                .requestMatchers("/api/health", "/actuator/health", "/actuator/info").permitAll()
                // Public Auth endpoints (OTP request, OTP verify, Token refresh)
                .requestMatchers("/api/auth/otp/**", "/api/auth/refresh").permitAll()
                // Public dynamic QR resolution and image rendering
                .requestMatchers("/qr/**", "/api/qr/image/**").permitAll()
                // Public Profile read and claim checks
                .requestMatchers("/api/profiles/public/**", "/api/profiles/claim/**").permitAll()
                // Protected Profile operations
                .requestMatchers("/api/profiles/me/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/profiles").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/profiles/me").authenticated()
                // Protected Card & QR management
                .requestMatchers("/api/card/**", "/api/qr/me/**").authenticated()
                // Protected Auth endpoints
                .requestMatchers("/api/auth/logout", "/api/auth/me").authenticated()
                // All other paths require authentication
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
