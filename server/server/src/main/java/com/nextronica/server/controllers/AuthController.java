package com.nextronica.server.controllers;


import com.nextronica.server.dtos.UserDto;
import com.nextronica.server.dtos.requests.LoginRequestDto;
import com.nextronica.server.dtos.requests.SignupRequestDto;
import com.nextronica.server.dtos.responses.UserLoginResponseDto;
import com.nextronica.server.exceptions.customExceptions.IllegalAgeException;
import com.nextronica.server.exceptions.customExceptions.NoSuchUserException;
import com.nextronica.server.exceptions.customExceptions.PasswordMismatchException;
import com.nextronica.server.exceptions.customExceptions.UserAlreadyExistsException;
import com.nextronica.server.models.User;
import com.nextronica.server.models.enums.Status;
import com.nextronica.server.services.AuthService;
import com.nextronica.server.utils.JwtUtil;
import com.nextronica.server.utils.PasswordManager;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;


@RestController
@RequestMapping("api/v1/auth")
public class AuthController {
    private final AuthService authService;
    private final JwtUtil jwtUtil;

    public AuthController(AuthService authService, JwtUtil jwtUtil) {
        this.authService = authService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/signup")
    public ResponseEntity<UserLoginResponseDto> signup(@Valid @RequestBody SignupRequestDto signupDto, @RequestParam(required = false) String role) throws NoSuchAlgorithmException {
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
        String token = jwtUtil.generateToken(authService.getUserClaims(savedUser), savedUser.getUsername());
        UserLoginResponseDto responseDto = new UserLoginResponseDto(token, userDto);
        return ResponseEntity.ok(responseDto);
    }

    @GetMapping("/check-username")
    public ResponseEntity<Map<String, Boolean>> checkUsername(@RequestBody Map<String,String> user) {
        boolean usernameExists = !authService.doesUserExistByUsername(user.get("username"));
        Map<String, Boolean> response = new HashMap<>();
        response.put("available", usernameExists);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<UserLoginResponseDto> userLogin(@Valid @RequestBody LoginRequestDto loginDto) throws NoSuchAlgorithmException {
        Optional<User> userOptional = authService.getUserByEmail(loginDto.email());
        User user = userOptional.orElseThrow(() -> new NoSuchUserException("Wrong Credentials, Please try again"));
        boolean correctPassword = PasswordManager.verifyPassword(loginDto.password(), user.getPasswordHash(), user.getPasswordSalt());
        if (!correctPassword) {
            throw new PasswordMismatchException("Wrong Credentials, Please try again");
        }

        if (user.getStatus().equals(Status.PENDING_VERIFICATION)){
            throw new NoSuchUserException("User is not active yet");
        }

        if (user.getStatus().equals(Status.SUSPENDED)) {
            throw new UserAlreadyExistsException("User is suspended");
        }

        UserDto userDto = authService.toUserDto(user);
        Map<String, Object> claims = authService.getUserClaims(user);
        String token = jwtUtil.generateToken(claims, user.getUsername());
        UserLoginResponseDto responseDto = new UserLoginResponseDto(token, userDto);
        return ResponseEntity.ok(responseDto);
    }

}
