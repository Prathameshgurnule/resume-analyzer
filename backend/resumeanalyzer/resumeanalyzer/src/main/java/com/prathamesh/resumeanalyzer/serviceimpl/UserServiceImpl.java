package com.prathamesh.resumeanalyzer.serviceimpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.prathamesh.resumeanalyzer.dto.LoginRequestDTO;
import com.prathamesh.resumeanalyzer.dto.RegisterRequestDTO;
import com.prathamesh.resumeanalyzer.entity.User;
import com.prathamesh.resumeanalyzer.repository.UserRepository;
import com.prathamesh.resumeanalyzer.service.UserService;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public User registerUser(RegisterRequestDTO request) {

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        BCryptPasswordEncoder encoder =
                new BCryptPasswordEncoder();

        user.setPassword(
                encoder.encode(request.getPassword())
        );

        return userRepository.save(user);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    @Override
    public User updateUser(Long id, User user) {

        User existingUser =
                userRepository.findById(id).orElse(null);

        if (existingUser != null) {

            existingUser.setName(user.getName());
            existingUser.setEmail(user.getEmail());
            existingUser.setPassword(user.getPassword());

            return userRepository.save(existingUser);
        }

        return null;
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public String loginUser(LoginRequestDTO request) {

        User user =
                userRepository.findByEmail(request.getEmail());

        if (user == null) {
            return "Email not found";
        }

        BCryptPasswordEncoder encoder =
                new BCryptPasswordEncoder();

        boolean isPasswordMatch =
                encoder.matches(
                        request.getPassword(),
                        user.getPassword()
                );

        if (isPasswordMatch) {
            return "Login Successful";
        }

        return "Invalid Password";
    }
}