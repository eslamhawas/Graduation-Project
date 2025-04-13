package com.nextronica.server.dtos.requests;

import com.nextronica.server.models.enums.Roles;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Set;

/**
 * DTO for {@link com.nextronica.server.models.User}
 */
public record SignupRequestDto(
        @Size(message = "Username must be between 3 and 50 characters", min = 3, max = 50)
        @Pattern(message = "Username can only contain letters, numbers, dots, underscores, and hyphens", regexp = "^[a-zA-Z0-9._-]+$")
        @NotBlank(message = "Username cannot be blank")
        String username,
        @Email(message = "Must be a valid email address")
        @NotBlank(message = "Email cannot be blank")
        String email,
        @NotBlank(message = "Password cannot be blank")
        String password,
        @NotBlank(message = "Confirm password cannot be blank")
        String confirmPassword,
        @Size(message = "Full name must be between 2 and 100 characters", min = 2, max = 100)
        @Pattern(message = "Full name can only contain letters, spaces, dots, and hyphens", regexp = "^[\\p{L}\\s.-]+$")
        @NotBlank(message = "Full name cannot be blank")
        String fullName,
        String phoneNumber,
        @Size(message = "Bio cannot exceed 500 characters", max = 500)
        String bio,
        LocalDate birthday) implements Serializable {


        public boolean isAgeValid() {
                return birthday.isBefore(LocalDate.now().minusYears(12));
        }
}