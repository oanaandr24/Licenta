package com.example.homespend.service;

import com.example.homespend.exception.UserNotFoundException;
import com.example.homespend.model.Role;
import com.example.homespend.model.User;
import com.example.homespend.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class UserService {
    private final UserRepo userRepo;
     @Autowired
    public UserService(UserRepo userRepo) {
        this.userRepo = userRepo;
    }
    public User addUser(User user) {
         user.setUserCode(UUID.randomUUID().toString());
         try {
            if(user.getRole() == null)
            {
                user.setRole(String.valueOf(Role.LOCATAR));
            }
            return userRepo.save(user);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid enum value: " + user.getRole());
        }
    }
    public User findByEmail(String email) {
        return userRepo.findUserByEmail(email);
    }
    public List<User> findAllUsers() {
         return userRepo.findAll();
    }
    public User updateUser(User user) {
        return userRepo.save(user);
    }
    public User findUserById(Long id) {
         return userRepo.findUserById(id)
                 .orElseThrow(()-> new UserNotFoundException("User by id" + id + "not found"));
    }
    public void deleteUser(Long id) {
         userRepo.deleteUserById(id);
    }
    public void deleteUserByUserCode(String userCode) {
         userRepo.deleteUserByUserCode(userCode);
    }
}

