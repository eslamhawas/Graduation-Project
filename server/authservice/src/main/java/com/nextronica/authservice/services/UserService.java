package com.nextronica.authservice.services;


import com.nextronica.authservice.dtos.requests.ChangePasswordRequestDto;
import com.nextronica.authservice.exceptions.customExceptions.PasswordMismatchException;
import com.nextronica.authservice.models.User;
import com.nextronica.authservice.repositories.UserRepository;
import com.nextronica.authservice.utils.PasswordManager;
import org.springframework.stereotype.Service;

import java.security.NoSuchAlgorithmException;
import java.util.Optional;

@Service
public class UserService {

    final private UserRepository _userRepository;

    public UserService(UserRepository userRepository) {
        this._userRepository = userRepository;
    }

    public Optional<User> getById(long id) {
        return _userRepository.findById(id);
    }

    public boolean changePassword(ChangePasswordRequestDto dto, User user) throws NoSuchAlgorithmException {
        boolean passwordsMatch = PasswordManager.verifyPassword(dto.oldPassword(), user.getPasswordHash(), user.getPasswordSalt());
        if (!passwordsMatch){
            throw new PasswordMismatchException("Wrong old Password");
        }
        PasswordManager.HashResult newHashAndSalt = PasswordManager.hashPassword(dto.newPassword());
        user.setPasswordHash(newHashAndSalt.hash());
        user.setPasswordSalt(newHashAndSalt.salt());
        _userRepository.save(user);
        return true;
    }

}
