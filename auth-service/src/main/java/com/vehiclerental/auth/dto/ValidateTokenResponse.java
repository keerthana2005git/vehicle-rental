package com.vehiclerental.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ValidateTokenResponse {
    private boolean valid;
    private Long userId;
    private String username;
    private String email;
    private String role;
    private String message;
}
