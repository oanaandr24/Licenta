package com.example.homespend.service;

import com.example.homespend.exception.UserNotFoundException;
import com.example.homespend.model.Role;
import com.example.homespend.model.User;
import com.example.homespend.repo.UserRepo;
import com.example.homespend.resource.UserResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Optional;
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

    public User updateUserById(Long id, User user) throws NoSuchAlgorithmException {
        Optional<User> optionalExistingUser = userRepo.findById(id);
        if (optionalExistingUser.isEmpty()) {
            throw new RuntimeException("User not found with id: " + id);
        }
        User existingUser = optionalExistingUser.get();
        User updatedUser = updateFields(user, existingUser);

        return userRepo.save(updatedUser);
    }

    public User updateUserByEmail(String email, User user) throws NoSuchAlgorithmException {
        Optional<User> optionalExistingUser = Optional.ofNullable(userRepo.findUserByEmail(email));
        if (optionalExistingUser.isEmpty()) {
            throw new RuntimeException("User not found with email: " + email);
        }
        User existingUser = optionalExistingUser.get();
        User updatedUser = updateFields(user, existingUser);

        return userRepo.save(updatedUser);
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

    private User updateFields(User newUser, User existingUser) throws NoSuchAlgorithmException {
        if (newUser.getName() != null) existingUser.setName(newUser.getName());
        if (newUser.getEmail() != null) existingUser.setEmail(newUser.getEmail());
        if (newUser.getPhone() != null) existingUser.setPhone(newUser.getPhone());
        if (newUser.getRole() != null) existingUser.setRole(newUser.getRole());
        if (newUser.getPassword() != null) {
            existingUser.setPassword(UserResource.toHexString(UserResource.getSHA(newUser.getPassword())));
        }
        if (newUser.getUserCode() != null) throw new RuntimeException("Action not allowed!");
        return existingUser;
    }
}

