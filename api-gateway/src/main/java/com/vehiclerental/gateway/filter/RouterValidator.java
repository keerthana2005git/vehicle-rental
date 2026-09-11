package com.vehiclerental.gateway.filter;

import org.springframework.http.HttpMethod;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Predicate;

@Component
public class RouterValidator {

    public static final List<String> OPEN_API_ENDPOINTS = List.of(
            "/api/auth/register",
            "/api/auth/login",
            "/api/auth/validate",
            "/eureka",
            "/actuator"
    );

    public Predicate<ServerHttpRequest> isSecured = request -> {
        String path = request.getURI().getPath();

        // Allow public auth and monitoring paths
        if (OPEN_API_ENDPOINTS.stream().anyMatch(path::startsWith)) {
            return false;
        }

        // Allow unauthenticated GET requests to view vehicles
        if (request.getMethod() == HttpMethod.GET && path.startsWith("/api/vehicles")) {
            return false;
        }

        // All other requests require authentication
        return true;
    };
}
