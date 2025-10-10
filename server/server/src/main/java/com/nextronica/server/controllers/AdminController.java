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
@RequestMapping("/api/v1/admins")
public class AdminController {

    final private UserService _userService;
    final private JwtUtil _jwtUtil;
    final private AdminService _adminService;

    public AdminController(UserService userService, JwtUtil jwtUtil, AdminService adminService) {
        _userService = userService;
        _jwtUtil = jwtUtil;
        _adminService = adminService;
    }

    @PatchMapping("/users/{id}/ban")
    @Auth(roles = {"ADMIN"})
    public ResponseEntity<Map<String, String>> banUser(@PathVariable long id, HttpServletRequest request) {
        String token = _jwtUtil.extractToken(request);
        long adminId = _jwtUtil.extractId(token);

        if (id <= 0) {
            throw new IllegalArgumentException("Please enter a valid user ID");
        }
        if (id == adminId) {
            throw new IllegalArgumentException("You are not allowed to ban yourself");
        }
        boolean banResult = _userService.banById(id, 0);
        if (!banResult) {
            throw new IllegalArgumentException("Couldn't Ban User");
        }
        return ResponseEntity.ok(Map.of("message", "User " + id + " has been banned successfully"));
    }

    @PatchMapping("/users/{id}/unban")
    @Auth(roles = {"ADMIN"})
    public ResponseEntity<Map<String, String>> unbanUser(@PathVariable long id) {
        if (id <= 0) {
            throw new IllegalArgumentException("Please enter a valid user ID");
        }
        boolean unbanResult = _userService.banById(id, 1);
        if (!unbanResult) {
            throw new IllegalArgumentException("Couldn't Unban User");
        }
        return ResponseEntity.ok(Map.of("message", "User " + id + " has been unbanned successfully"));
    }

    @PatchMapping("/users/{id}/role/admin")
    @Auth(roles = {"ADMIN"})
    public ResponseEntity<Map<String, String>> addAdminRole(@PathVariable long id) {
        User user = _userService.getById(id).orElseThrow(() -> new NoSuchUserException("There is no user with id: " + id));
        _userService.promoteToAdmin(user);
        return ResponseEntity.ok(Map.of("message", "Admin role added successfully"));
    }

    @DeleteMapping("/users/{id}/role/admin")
    @Auth(roles = {"ADMIN"})
    public ResponseEntity<Map<String, String>> removeAdminRole(@PathVariable long id, HttpServletRequest request) {
        String token = _jwtUtil.extractToken(request);
        long adminId = _jwtUtil.extractId(token);
        if (id <= 0) {
            throw new IllegalArgumentException("Please enter a valid user ID");
        }
        if (id == adminId) {
            throw new IllegalArgumentException("You are not allowed to remove your own admin role");
        }
        User user = _userService.getById(id).orElseThrow(() -> new NoSuchUserException("There is no user with id: " + id));
        _userService.demoteFromAdmin(user);
        return ResponseEntity.ok(Map.of("message", "Admin role removed successfully"));
    }

    @PatchMapping("/vendors/{id}/status")
    @Auth(roles = {"ADMIN"})
    public ResponseEntity<Map<String, String>> updateVendorStatus(@PathVariable long id, @RequestParam Status status) {
        if (id <= 0) {
            throw new IllegalArgumentException("Please enter a valid user ID");
        }
        User user = _userService.getById(id).orElseThrow(() -> new NoSuchUserException("There is no user with id: " + id));
        if (!user.getRoles().contains(Roles.VENDOR)) {
            throw new IllegalArgumentException("User is not a vendor");
        }
        if (user.getStatus().equals(status)) {
            throw new IllegalArgumentException("User status is already " + status);
        }
        _adminService.handleVendorStatus(user, status);
        return ResponseEntity.ok(Map.of("message", String.format("Vendor %d status updated to %s", id, status)));
    }
}
