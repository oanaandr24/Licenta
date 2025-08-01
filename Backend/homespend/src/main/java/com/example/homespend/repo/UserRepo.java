package com.example.homespend.repo;

import com.example.homespend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepo extends JpaRepository<User, Long> {
    void deleteUserById(Long id);
    void deleteUserByUserCode(String userCode);

    Optional<User> findUserById(Long id);
    Optional<User> findUserByUserCode(String userCode);
    User findUserByEmail(String email);
}
