package com.nextronica.authservice.config;


import com.nextronica.authservice.dtos.UserDto;
import com.nextronica.authservice.models.User;
import org.modelmapper.ModelMapper;
import org.modelmapper.record.RecordModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AuthConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper().registerModule(new RecordModule());
        modelMapper.createTypeMap(User.class, UserDto.class)
                .setConverter(context -> {
                    User source = context.getSource();
                    return new UserDto(
                            source.getUsername(),
                            source.getEmail(),
                            source.getFullName(),
                            source.getPhoneNumber(),
                            source.getRoles(),
                            source.getStatus(),
                            source.getProfileImageUrl(),
                            source.getBio(),
                            source.getId(),
                            source.getBirthday()
                    );
                });
        modelMapper.validate();
        return modelMapper;
    }
}
