package com.nextronica.server.controllers;

import com.nextronica.server.exceptions.customExceptions.NoSuchUserException;
import com.nextronica.server.models.User;
import com.nextronica.server.models.enums.Roles;
import com.nextronica.server.models.enums.Status;
import com.nextronica.server.providers.Auth.Auth;
import com.nextronica.server.services.AdminService;
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
    final private AdminService _adminService;

    public AdminController(UserService userService, JwtUtil jwtUtil, AdminService adminService) {
        _userService = userService;
        _jwtUtil = jwtUtil;
        _adminService = adminService;
    }

    @PutMapping("banuser")
    @Auth(roles = {"ADMIN"})
    public ResponseEntity<Map<String, String>> suspendUser(@RequestBody Map<String, Long> user, HttpServletRequest request) {
        String token = _jwtUtil.extractToken(request);
        long adminId = _jwtUtil.extractId(token);
        long userId = user.getOrDefault("userId", 0L);
        if (userId <= 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "Please enter a valid user ID"));
        }
        if (userId == adminId) {
            return ResponseEntity.badRequest().body(Map.of("error", "You are not allowed to ban yourself"));
        }
        boolean banResult = _userService.banById(userId, (byte) 0);
        if (!banResult) {
            return ResponseEntity.badRequest().body(Map.of("error", "Couldn't Ban User"));
        }
        return ResponseEntity.ok(Map.of("message", "User " + userId + " has been banned successfully"));
    }

    @PatchMapping("unbanuser")
    @Auth(roles = {"ADMIN"})
    public ResponseEntity<Map<String, String>> unsuspendUser(@RequestBody Map<String, Long> user) {
        long userId = user.getOrDefault("userId", 0L);
        if (userId <= 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "Please enter a valid user ID"));
        }
        boolean unbanResult = _userService.banById(userId, (byte) 1);
        if (!unbanResult) {
            return ResponseEntity.badRequest().body(Map.of("error", "Couldn't Unban User"));
        }
        return ResponseEntity.ok(Map.of("message", "User " + userId + " has been unbanned successfully"));
    }

    @PatchMapping("promote/{id}")
    @Auth(roles = {"ADMIN"})
    public ResponseEntity<Map<String, String>> promoteToAdmin(@PathVariable long id) {
        User user = _userService.getById(id).orElseThrow(() -> new NoSuchUserException("There is no user with id: " + id));
        _userService.promoteToAdmin(user);
        return ResponseEntity.ok(Map.of("message", "User promoted to admin successfully"));
    }

    @PatchMapping("demote/{id}")
    @Auth(roles = {"ADMIN"})
    public ResponseEntity<Map<String, String>> demoteFromAdmin(@PathVariable long id) {
        User user = _userService.getById(id).orElseThrow(() -> new NoSuchUserException("There is no user with id: " + id));
        _userService.demoteFromAdmin(user);
        return ResponseEntity.ok(Map.of("message", "User demoted from admin successfully"));
    }

    @PatchMapping("/accept/vendor/{id}")
    @Auth(roles = {"ADMIN"})
    public ResponseEntity<Map<String, String>> acceptVendor(@PathVariable Long id) {
        if (id == null || id <= 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "Please enter a valid user ID"));
        }
        User user = _userService.getById(id).orElseThrow(() -> new NoSuchUserException("There is no user with id: " + id));
        if (!user.getRoles().contains(Roles.VENDOR)) {
            return ResponseEntity.badRequest().body(Map.of("error", "User is not a vendor"));
        }
        if (user.getStatus().equals(Status.ACTIVE)) {
            return ResponseEntity.badRequest().body(Map.of("error", "User is already active"));
        }
        _adminService.handleVendorStatus(user);
        return ResponseEntity.ok(Map.of("message", String.format("User %d has been accepted as a vendor", id)));
    }
}
