package com.nextronica.server.dtos.responses;

import com.nextronica.server.dtos.UserDto;

public record UserLoginResponseDto(
        String token,
        UserDto user) {
}
