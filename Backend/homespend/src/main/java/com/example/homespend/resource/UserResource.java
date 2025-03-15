package com.example.homespend.resource;

import com.example.homespend.model.User;
import com.example.homespend.service.UserService;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;

@RestController
@RequestMapping("/user")
public class UserResource {
    private final UserService userService;

    public UserResource(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.findAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("/find/{id}")
    public ResponseEntity<User> getUserById(@PathVariable("id") Long id) {
        User user = userService.findUserById(id);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<User> addUser(@Valid @RequestBody User user) throws NoSuchAlgorithmException {
        user.setPassword(toHexString(getSHA(user.getPassword())));
        User newUser = userService.addUser(user);
        return new ResponseEntity<>(newUser, HttpStatus.CREATED);
    }

    @PutMapping("/update")
    public ResponseEntity<User> updateUser(@RequestBody User user) {
        User updateUser = userService.updateUser(user);
        return new ResponseEntity<>(updateUser, HttpStatus.OK);
    }

    @Transactional
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable("id") Long id) {
        userService.deleteUser(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    /*@RequestMapping("/login")
    public ResponseEntity<User> login(@RequestBody User user) throws NoSuchAlgorithmException {
        List<User> users = userService.findAllUsers();
        for (User userLog : users) {
            if (userLog.getEmail().equals(user.getEmail()) && userLog.getPassword().equals(toHexString(getSHA(user.getPassword()))))
                return new ResponseEntity<>(user, HttpStatus.OK);
            else
                continue;
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
     */
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User loginRequest) throws NoSuchAlgorithmException {
        // Caută user după email
        User user = userService.findByEmail(loginRequest.getEmail());

        if (user != null) {
            // Verifică parola hashuită
            String hashedPassword = toHexString(getSHA(loginRequest.getPassword()));
            System.out.println("HashedPass:" + hashedPassword);
            if (user.getPassword().equals(hashedPassword)) {
                // ✅ Login reușit
                return ResponseEntity.ok("Login reușit!");
            }
        }

        // ❌ Email sau parolă greșite
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email sau parolă greșită!");
    }

    public static byte[] getSHA(String input) throws NoSuchAlgorithmException
    {
        /* MessageDigest instance for hashing using SHA256 */
        MessageDigest md = MessageDigest.getInstance("SHA-256");
        /* digest() method called to calculate message digest of an input and return array of byte */
        return md.digest(input.getBytes(StandardCharsets.UTF_8));
    }

    public static String toHexString(byte[] hash)
    {
        /* Convert byte array of hash into digest */
        BigInteger number = new BigInteger(1, hash);
        /* Convert the digest into hex value */
        StringBuilder hexString = new StringBuilder(number.toString(16));

        /* Pad with leading zeros */
        while (hexString.length() < 32)
        {
            hexString.insert(0, '0');
        }
        return hexString.toString();
    }
}
