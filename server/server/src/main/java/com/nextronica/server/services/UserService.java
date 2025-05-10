package com.nextronica.server.services;


import com.nextronica.server.dtos.UserDto;
import com.nextronica.server.dtos.requests.ChangePasswordRequestDto;
import com.nextronica.server.exceptions.customExceptions.NoSuchUserException;
import com.nextronica.server.exceptions.customExceptions.PasswordMismatchException;
import com.nextronica.server.models.User;
import com.nextronica.server.models.enums.Roles;
import com.nextronica.server.models.enums.Status;
import com.nextronica.server.repositories.UserRepository;
import com.nextronica.server.utils.Helpers;
import com.nextronica.server.utils.PasswordManager;
import org.springframework.stereotype.Service;

import java.security.NoSuchAlgorithmException;
import java.util.*;

@Service
public class UserService {

    final private UserRepository _userRepository;
    final private Helpers _helper;

    public UserService(UserRepository userRepository, Helpers helper) {
        this._userRepository = userRepository;
        _helper = helper;
    }

    public Optional<User> getById(long id) {
        return _userRepository.findById(id);
    }

    public boolean changePassword(ChangePasswordRequestDto dto, User user) throws NoSuchAlgorithmException {
        if (!dto.newPassword().equals(dto.confirmPassword())){
            throw new PasswordMismatchException("Passwords do not match");
        }

        boolean passwordsMatch = PasswordManager.verifyPassword(dto.oldPassword(), user.getPasswordHash(), user.getPasswordSalt());
        if (!passwordsMatch) {
            throw new PasswordMismatchException("Wrong old Password");
        }
        PasswordManager.HashResult newHashAndSalt = PasswordManager.hashPassword(dto.newPassword());
        user.setPasswordHash(newHashAndSalt.hash());
        user.setPasswordSalt(newHashAndSalt.salt());
        _userRepository.save(user);
        return true;
    }

    public List<UserDto> getAllUsers(Status status, Roles role) {
        Collection<Roles> roles = role != null ? Collections.singleton(role) : null;
        List<User> users = _userRepository.findByStatusAndRolesIn(status, roles);
        return users.stream().map(_helper::toUserDto).toList();
    }

    public boolean banById(long id, int code) {
        User user = _userRepository.findById(id).orElseThrow(
                () -> new NoSuchUserException("There is no user with the given ID"));
       switch (code) {
           case 0:
               user.setStatus(Status.SUSPENDED);
               break;
           case 1:
               user.setStatus(Status.ACTIVE);
               break;
       }
        _userRepository.save(user);
        return true;
    }

    public void promoteToAdmin(User user) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }

        if (user.hasRole(Roles.ADMIN)) {
            throw new IllegalArgumentException("The user is already an admin");
        }

        if (user.isBanned()) {
            throw new IllegalArgumentException("Banned users cannot be promoted");
        }

        Set<Roles> roles = user.getRoles();
        if (roles == null) {
            roles = new HashSet<>();
            user.setRoles(roles);
        }

        roles.add(Roles.ADMIN);
        _userRepository.save(user);
    }

    public void demoteFromAdmin(User user) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }

        if (!user.hasRole(Roles.ADMIN)) {
            throw new IllegalArgumentException("The user is not an admin");
        }

        if (user.isBanned()) {
            throw new IllegalArgumentException("Banned users cannot be demoted");
        }

        Set<Roles> roles = user.getRoles();
        if (roles == null) {
            roles = new HashSet<>();
            user.setRoles(roles);
        }
        roles.remove(Roles.ADMIN);
        _userRepository.save(user);
    }


}
