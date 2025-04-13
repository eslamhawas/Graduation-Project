package com.nextronica.server.utils;

import com.nextronica.server.dtos.UserDto;
import com.nextronica.server.models.User;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class Helpers {
    private final ModelMapper modelMapper;

    public Helpers(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    public UserDto toUserDto(User user) {
        return modelMapper.map(user, UserDto.class);
    }
}
