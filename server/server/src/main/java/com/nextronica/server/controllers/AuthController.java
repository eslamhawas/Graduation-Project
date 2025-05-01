package com.nextronica.server.controllers;


import com.nextronica.server.dtos.UserDto;
import com.nextronica.server.dtos.requests.LoginRequestDto;
import com.nextronica.server.dtos.requests.SignupRequestDto;
import com.nextronica.server.dtos.responses.LoginResponseDto;
import com.nextronica.server.exceptions.customExceptions.IllegalAgeException;
import com.nextronica.server.exceptions.customExceptions.NoSuchUserException;
import com.nextronica.server.exceptions.customExceptions.PasswordMismatchException;
import com.nextronica.server.exceptions.customExceptions.UserAlreadyExistsException;
import com.nextronica.server.models.User;
import com.nextronica.server.models.enums.Roles;
import com.nextronica.server.services.AuthService;
import com.nextronica.server.utils.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;


@RestController
@RequestMapping("api/v1/auth")
public class AuthController {
    private final AuthService authService;
    private final JwtUtil jwtUtil;

    public AuthController(AuthService authService, JwtUtil jwtUtil) {
        this.authService = authService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping
    public ResponseEntity<LoginResponseDto> signup(@Valid @RequestBody SignupRequestDto signupDto, @RequestParam(required = false) String role) throws NoSuchAlgorithmException {
        if (!signupDto.confirmPassword().equals(signupDto.password())) {
            throw new PasswordMismatchException("Passwords do not match");
        }
        if (!signupDto.isAgeValid()) {
            throw new IllegalAgeException("User age should be at least 12 years");
        }

        boolean usernameExists = authService.doesUserExistByUsername(signupDto.username());
        if (usernameExists) {
            throw new UserAlreadyExistsException("Username already exists");
        }

        boolean emailExists = authService.doesUserExistByEmail(signupDto.email());
        if (emailExists) {
            throw new UserAlreadyExistsException("Email already exists");
        }

        User mappedUser = authService.fromSignupDto(signupDto);
        User savedUser = authService.save(mappedUser, role);
        UserDto userDto = authService.toUserDto(savedUser);
        String token = jwtUtil.generateToken(authService.getUserClaims(savedUser), String.valueOf(savedUser.getId()));
        LoginResponseDto responseDto = new LoginResponseDto(token, userDto);
        return ResponseEntity.ok(responseDto);
    }

    @GetMapping("/username-availability")
    public ResponseEntity<Map<String, Boolean>> checkUsernameAvailability(@RequestParam String username) {
        if (username == null || username.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("available", false));
        }
        boolean usernameAvailable = !authService.doesUserExistByUsername(username);
        Map<String, Boolean> response = new HashMap<>();
        response.put("available", usernameAvailable);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@Valid @RequestBody LoginRequestDto loginDto, @RequestParam Roles role) throws NoSuchAlgorithmException {
        User user = authService.validateLogin(loginDto);
        if (role == null) {role = Roles.USER;}
        // Check if the user has the required role if specified
        if (!user.getRoles().contains(role)) {
            throw new NoSuchUserException("User does not have the required role: " + role);
        }

        LoginResponseDto responseDto = authService.generateLoginResponse(user);
        return ResponseEntity.ok(responseDto);
    }
}
