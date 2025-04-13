package com.nextronica.server.dtos;

import com.nextronica.server.models.enums.Roles;
import com.nextronica.server.models.enums.Status;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Set;

/**
 * DTO for {@link com.nextronica.server.models.User}
 */
public record UserDto(
        String username,
        String email,
        String fullName,
        String phoneNumber, Set<Roles> roles, Status status,
        String profileImageUrl,
        String bio, Long id,
        LocalDate birthday) implements Serializable {
}