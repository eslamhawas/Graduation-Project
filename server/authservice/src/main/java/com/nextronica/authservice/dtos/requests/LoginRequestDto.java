package com.nextronica.authservice.dtos.requests;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.io.Serializable;

/**
 * DTO for {@link com.nextronica.authservice.models.User}
 */
public record LoginRequestDto(
        @Email(message = "Must be a valid email address")
        @NotBlank(message = "Email cannot be blank")
        String email,
        @NotBlank(message = "Password Cannot be Blank")
        String password) implements Serializable {
}