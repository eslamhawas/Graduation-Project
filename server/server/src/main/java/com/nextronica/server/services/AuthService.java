package com.nextronica.server.services;


import com.nextronica.server.dtos.requests.SignupRequestDto;
import com.nextronica.server.dtos.UserDto;
import com.nextronica.server.models.User;
import com.nextronica.server.models.enums.Roles;
import com.nextronica.server.models.enums.Status;
import com.nextronica.server.repositories.UserRepository;
import com.nextronica.server.utils.PasswordManager;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;


    public AuthService(UserRepository userRepository, ModelMapper modelMapper) {
        this.userRepository = userRepository;
        this.modelMapper = modelMapper;
    }

    public boolean doesUserExistByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public Boolean doesUserExistByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public User save(User user, String role) {
        if (role != null && role.equals("vendor")) {
            user.setStatus(Status.PENDING_VERIFICATION);
            user.setRoles(Collections.singleton(Roles.VENDOR));
        }
        return userRepository.save(user);
    }

    public Optional<User> getUserByEmail(String email) {
        if (email == null) {
            return Optional.empty();
        }
        return userRepository.findByEmailIgnoreCase(email);
    }



    public User fromSignupDto(SignupRequestDto signupDto) throws NoSuchAlgorithmException {
        User user = modelMapper.map(signupDto, User.class);
        PasswordManager.HashResult hashResult = PasswordManager.hashPassword(signupDto.password());
        user.setPasswordHash(hashResult.hash());
        user.setPasswordSalt(hashResult.salt());
        user.setCreatedAt(LocalDateTime.now());
        return user;
    }

    public UserDto toUserDto(User user) {
        return modelMapper.map(user, UserDto.class);
    }


    public Map<String, Object> getUserClaims(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", user.getId());
        claims.put("username", user.getUsername());
        claims.put("email", user.getEmail());
        claims.put("roles", user.getRoles());
        claims.put("status", user.getStatus());
        return claims;
    }
}
