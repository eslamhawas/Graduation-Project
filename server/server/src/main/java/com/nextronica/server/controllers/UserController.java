package com.nextronica.server.controllers;


import com.nextronica.server.dtos.UserDto;
import com.nextronica.server.dtos.requests.ChangePasswordRequestDto;
import com.nextronica.server.exceptions.customExceptions.NoSuchUserException;
import com.nextronica.server.models.User;
import com.nextronica.server.models.enums.Status;
import com.nextronica.server.providers.Auth.Auth;
import com.nextronica.server.services.UserService;
import com.nextronica.server.utils.Helpers;
import com.nextronica.server.utils.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("api/v1/user")
public class UserController {

    final private UserService _userService;
    final private JwtUtil jwtUtil;
    final private Helpers _helper;


    public UserController(UserService userService, JwtUtil jwtUtil, Helpers helper) {
        this._userService = userService;
        this.jwtUtil = jwtUtil;
        this._helper = helper;
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

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUser(@PathVariable long id) {
        Optional<User> user = _userService.getById(id);
        if (user.isEmpty()) {
            throw new NoSuchUserException("There is no user with the given ID");
        }
        UserDto userDto = _helper.toUserDto(user.get());
        return ResponseEntity.ok(userDto);
    }

    @GetMapping("/all/{status}")
    @Auth(roles = {"ADMIN"})
    public ResponseEntity<List<UserDto>> getAllUsersByStatus(@PathVariable Status status) {
        List<UserDto> users = _userService.getAllUsers(status);
        return ResponseEntity.ok(users);
    }

    
}
