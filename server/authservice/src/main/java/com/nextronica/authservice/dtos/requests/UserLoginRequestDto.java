package com.nextronica.authservice.dtos.requests;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.io.Serializable;

/**
 * DTO for {@link com.nextronica.authservice.models.User}
 */
public record UserLoginRequestDto(
        @Size(message = "Username must be between 3 and 50 characters", min = 3, max = 50)
        @Pattern(message = "Username can only contain letters, numbers, dots, underscores, and hyphens", regexp = "^[a-zA-Z0-9._-]+$")
        @NotBlank(message = "Username cannot be blank")
        String username,
        @Email(message = "Must be a valid email address")
        @NotBlank(message = "Email cannot be blank")
        String email,
        @NotBlank(message = "Password Cannot be Blank")
        String password) implements Serializable {
}