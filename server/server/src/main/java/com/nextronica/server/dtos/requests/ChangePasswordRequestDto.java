package com.nextronica.server.dtos.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChangePasswordRequestDto(
        @NotBlank(message = "Old password is required")
        @Size(min = 8, message = "Password must be at least 8 characters long")
        String oldPassword,

        @NotBlank(message = "New password is required")
        @Size(min = 8, message = "Password must be at least 8 characters long")
        String newPassword,

        @NotBlank(message = "Confirm password is required")
        @Size(min = 8, message = "Password must be at least 8 characters long")
        String confirmPassword
) {
}
