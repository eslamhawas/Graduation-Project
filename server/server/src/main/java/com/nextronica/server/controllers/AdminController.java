package com.nextronica.server.controllers;

import com.nextronica.server.exceptions.customExceptions.NoSuchUserException;
import com.nextronica.server.models.User;
import com.nextronica.server.providers.Auth.Auth;
import com.nextronica.server.services.UserService;
import com.nextronica.server.utils.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    final private UserService _userService;
    final private JwtUtil _jwtUtil;

    public AdminController(UserService userService, JwtUtil jwtUtil) {
        _userService = userService;
        _jwtUtil = jwtUtil;
    }

    @PutMapping("banuser")
    @Auth(roles = {"ADMIN"})
    public ResponseEntity<Map<String, String>> banUser(@RequestBody Map<String, Long> user, HttpServletRequest request) {
        String token = _jwtUtil.extractToken(request);
        long adminId = _jwtUtil.extractId(token);
        long userId = user.getOrDefault("userId", 0L);
        if (userId <= 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "Please enter a valid user ID"));
        }
        if (userId == adminId) {
            return ResponseEntity.badRequest().body(Map.of("error", "You are not allowed to ban yourself"));
        }
        boolean banResult = _userService.banById(userId);
        if (!banResult) {
            return ResponseEntity.badRequest().body(Map.of("error", "Couldn't Ban User"));
        }
        return ResponseEntity.ok(Map.of("message", "User " + userId + " has been banned successfully"));
    }

    @PutMapping("promote/{id}")
    @Auth(roles = {"ADMIN"})
    public ResponseEntity<Map<String, String>> promote(@PathVariable long id) {
        User user = _userService.getById(id).orElseThrow(() -> new NoSuchUserException("There is no user with id: " + id));
        _userService.promoteToAdmin(user);
        return ResponseEntity.ok(Map.of("message", "User promoted to admin successfully"));
    }
}
