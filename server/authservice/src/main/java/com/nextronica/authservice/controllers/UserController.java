package com.nextronica.authservice.controllers;


import com.nextronica.authservice.dtos.requests.ChangePasswordRequestDto;
import com.nextronica.authservice.exceptions.customExceptions.NoSuchUserException;
import com.nextronica.authservice.models.User;
import com.nextronica.authservice.providers.Auth.Auth;
import com.nextronica.authservice.services.UserService;
import com.nextronica.authservice.utils.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.NoSuchAlgorithmException;
import java.util.Map;

@RestController
@RequestMapping("api/v1/user")
public class UserController {

    final private UserService _userService;
    final private JwtUtil jwtUtil;


    public UserController(UserService userService, JwtUtil jwtUtil) {
        this._userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PutMapping("/change-password")
    @Auth
    public ResponseEntity<Map<String, String>> changePassword(@Valid @RequestBody ChangePasswordRequestDto dto, HttpServletRequest request) throws NoSuchAlgorithmException {
        String token = jwtUtil.extractToken(request);
        long id = jwtUtil.extractId(token);
        User user = _userService.getById(id).orElseThrow(
                () -> new NoSuchUserException("There is no user with the given ID"));
        _userService.changePassword(dto, user);
        return ResponseEntity.ok(Map.of("message", "Password Changed Successfully"));
    }
}
