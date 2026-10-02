package com.prathamesh.resumeanalyzer.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.prathamesh.resumeanalyzer.config.JwtUtil;
import com.prathamesh.resumeanalyzer.dto.LoginRequestDTO;
import com.prathamesh.resumeanalyzer.dto.RegisterRequestDTO;
import com.prathamesh.resumeanalyzer.entity.User;
import com.prathamesh.resumeanalyzer.service.UserService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    // REGISTER
    @PostMapping("/register")
    public User register(@RequestBody RegisterRequestDTO request) {
        return userService.registerUser(request);
    }

    // GET ALL USERS
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // GET USER BY ID
    @GetMapping("/users/{id}")
    public User getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    // UPDATE USER
    @PutMapping("/users/{id}")
    public User updateUser(
            @PathVariable Long id,
            @RequestBody User user) {

        return userService.updateUser(id, user);
    }

    // DELETE USER
    @DeleteMapping("/users/{id}")
    public String deleteUser(@PathVariable Long id) {

        userService.deleteUser(id);

        return "User Deleted Successfully";
    }

    // LOGIN + JWT TOKEN
    @PostMapping("/login")
    public Map<String, String> login(
            @RequestBody LoginRequestDTO request) {

        String result = userService.loginUser(request);

        if (result.equals("Login Successful")) {

            String token =
                    jwtUtil.generateToken(
                            request.getEmail());

            return Map.of(
                    "message", "Login Successful",
                    "token", token
            );
        }

        throw new RuntimeException(
                "Invalid Credentials");
    }
}