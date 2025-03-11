package com.nextronica.authservice.controllers;


import com.nextronica.authservice.dtos.UserDto;
import com.nextronica.authservice.dtos.requests.UserLoginRequestDto;
import com.nextronica.authservice.dtos.requests.UserSignupRequestDto;
import com.nextronica.authservice.dtos.responses.UserLoginResponseDto;
import com.nextronica.authservice.exceptions.customExceptions.IllegalAgeException;
import com.nextronica.authservice.exceptions.customExceptions.NoSuchUserException;
import com.nextronica.authservice.exceptions.customExceptions.PasswordMismatchException;
import com.nextronica.authservice.exceptions.customExceptions.UserAlreadyExistsException;
import com.nextronica.authservice.models.User;
import com.nextronica.authservice.services.AuthService;
import com.nextronica.authservice.utils.JwtUtil;
import com.nextronica.authservice.utils.PasswordManager;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;


@RestController
@RequestMapping("api/v1/users")
public class AuthController {
    private final AuthService authService;
    private final JwtUtil jwtUtil;

    public AuthController(AuthService authService, JwtUtil jwtUtil) {
        this.authService = authService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/signup")
    public ResponseEntity<UserDto> signup(@Valid @RequestBody UserSignupRequestDto signupDto) throws NoSuchAlgorithmException {
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
        User savedUser = authService.save(mappedUser);
        UserDto userDto = authService.toUserDto(savedUser);
        return ResponseEntity.ok(userDto);
    }

    @GetMapping("/check-username")
    public ResponseEntity<Map<String, Boolean>> checkUsername(@RequestParam String username) {
        boolean usernameExists = !authService.doesUserExistByUsername(username);
        Map<String, Boolean> response = new HashMap<>();
        response.put("available", usernameExists);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<UserLoginResponseDto> login(@Valid @RequestBody UserLoginRequestDto loginDto) throws NoSuchAlgorithmException {
        Optional<User> userOptional = authService.getUserByEmailOrUsername(loginDto.email(), loginDto.username());
        if (userOptional.isEmpty()) {
            throw new NoSuchUserException("Wrong Credentials, Please try again");
        }
        User user = userOptional.get();
        boolean correctPassword = PasswordManager.verifyPassword(loginDto.password(), user.getPasswordHash(), user.getPasswordSalt());
        if (!correctPassword) {
            throw new PasswordMismatchException("Wrong Credentials, Please try again");
        }
        UserDto userDto = authService.toUserDto(user);
        Map<String, Object> claims = authService.getUserClaims(user);
        String token = jwtUtil.generateToken(claims, user.getUsername());
        UserLoginResponseDto responseDto = new UserLoginResponseDto(token, userDto);
        return ResponseEntity.ok(responseDto);
    }

}
