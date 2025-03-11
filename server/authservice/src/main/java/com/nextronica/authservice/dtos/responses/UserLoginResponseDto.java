package com.nextronica.authservice.dtos.responses;

import com.nextronica.authservice.dtos.UserDto;

public record UserLoginResponseDto(
        String token,
        UserDto user) {
}
