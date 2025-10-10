package com.nextronica.server.dtos.responses;

import com.nextronica.server.dtos.UserDto;

public record LoginResponseDto(
        String token,
        UserDto user) {
}
