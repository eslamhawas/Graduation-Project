package com.nextronica.server.services;


import com.nextronica.server.models.User;
import com.nextronica.server.models.enums.Status;
import com.nextronica.server.repositories.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class AdminService {


    private final UserRepository _userRepository;

    AdminService(UserRepository userRepository){

        _userRepository = userRepository;
    }

    public void handleVendorStatus(User user, Status status){
        user.setStatus(status);
        _userRepository.save(user);
    }
}
