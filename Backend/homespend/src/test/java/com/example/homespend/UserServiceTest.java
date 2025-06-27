package com.example.homespend;

import com.example.homespend.model.User;
import com.example.homespend.repo.UserRepo;
import com.example.homespend.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.security.NoSuchAlgorithmException;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceTest {

    @Mock
    private UserRepo userRepo;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this); // inițializează mock-urile
    }

    @Test
    void testAddUser_DefaultRoleIsLocatar() {
        User user = new User();
        user.setName("Ion Popescu");
        user.setEmail("ion@example.com");
        user.setPassword("parola123");

        when(userRepo.save(any(User.class))).thenAnswer(i -> i.getArguments()[0]);

        User savedUser = userService.addUser(user);

        assertNotNull(savedUser.getUserCode());
        assertEquals("LOCATAR", savedUser.getRole());
        verify(userRepo, times(1)).save(savedUser);
    }

    @Test
    void testFindByEmail_UserFound() {
        User user = new User();
        user.setEmail("ana@example.com");

        when(userRepo.findUserByEmail("ana@example.com")).thenReturn(user);

        User result = userService.findByEmail("ana@example.com");

        assertNotNull(result);
        assertEquals("ana@example.com", result.getEmail());
    }

    @Test
    void testUpdateUserById_UpdatesFields() throws NoSuchAlgorithmException {
        Long id = 1L;
        User existingUser = new User();
        existingUser.setId(id);
        existingUser.setName("Vechi");

        User newUser = new User();
        newUser.setName("Nou");

        when(userRepo.findById(id)).thenReturn(Optional.of(existingUser));
        when(userRepo.save(any(User.class))).thenAnswer(i -> i.getArguments()[0]);

        User updated = userService.updateUserById(id, newUser);

        assertEquals("Nou", updated.getName());
        verify(userRepo).save(existingUser);
    }

    @Test
    void testDeleteUserByUserCode_CallsRepo() {
        String userCode = UUID.randomUUID().toString();

        doNothing().when(userRepo).deleteUserByUserCode(userCode);

        userService.deleteUserByUserCode(userCode);

        verify(userRepo, times(1)).deleteUserByUserCode(userCode);
    }
}
