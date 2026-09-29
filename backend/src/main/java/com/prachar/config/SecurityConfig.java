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
            .headers(headers -> headers
                .contentTypeOptions(org.springframework.security.config.Customizer.withDefaults())
                .frameOptions(org.springframework.security.config.annotation.web.configurers.HeadersConfigurer.FrameOptionsConfig::deny)
                .httpStrictTransportSecurity(hsts -> hsts.includeSubDomains(true).maxAgeInSeconds(31536000))
                .referrerPolicy(referrer -> referrer.policy(org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN))
            )
            .exceptionHandling(exceptions -> exceptions
                .authenticationEntryPoint((request, response, authException) -> {
                    response.setStatus(jakarta.servlet.http.HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType(org.springframework.http.MediaType.APPLICATION_JSON_VALUE);
                    response.getWriter().write("{\"success\":false,\"error\":{\"code\":\"UNAUTHORIZED\",\"message\":\"Full authentication is required to access this resource\"}}");
                })
                .accessDeniedHandler((request, response, accessDeniedException) -> {
                    response.setStatus(jakarta.servlet.http.HttpServletResponse.SC_FORBIDDEN);
                    response.setContentType(org.springframework.http.MediaType.APPLICATION_JSON_VALUE);
                    response.getWriter().write("{\"success\":false,\"error\":{\"code\":\"FORBIDDEN\",\"message\":\"Access is denied for this account.\"}}");
                })
            )
            .authorizeHttpRequests(auth -> auth
                // Public Health and Actuator checks
                .requestMatchers("/api/health", "/actuator/health", "/actuator/info").permitAll()
                // Public Auth endpoints (OTP request, OTP verify, Token refresh, Login/Register aliases)
                .requestMatchers("/api/auth/otp/**", "/api/auth/refresh", "/api/auth/login", "/api/auth/register").permitAll()
                // Public dynamic QR resolution and image rendering
                .requestMatchers("/qr/**", "/api/qr/image/**").permitAll()
                // Public Profile read and claim checks
                .requestMatchers("/api/profiles/public/**", "/api/profiles/claim/**").permitAll()
                // Protected Profile operations
                .requestMatchers("/api/profiles/me/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/profiles").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/profiles/me").authenticated()
                // Protected Card & QR management
                .requestMatchers("/api/card/**", "/api/qr/me/**", "/api/qr/analytics").authenticated()
                // Protected User Account Settings and Merchant Onboarding
                .requestMatchers("/api/user/**", "/api/onboarding/**").authenticated()
                // Protected Auth endpoints
                .requestMatchers("/api/auth/logout", "/api/auth/me").authenticated()
                // All other paths require authentication
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
