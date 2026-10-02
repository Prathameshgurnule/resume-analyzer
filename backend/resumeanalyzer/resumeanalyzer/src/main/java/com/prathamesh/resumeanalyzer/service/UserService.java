package com.prathamesh.resumeanalyzer.service;

import java.util.List;

import com.prathamesh.resumeanalyzer.dto.LoginRequestDTO;
import com.prathamesh.resumeanalyzer.dto.RegisterRequestDTO;
import com.prathamesh.resumeanalyzer.entity.User;

public interface UserService {

    User registerUser(RegisterRequestDTO request);

    String loginUser(LoginRequestDTO request);

    List<User> getAllUsers();

    User getUserById(Long id);

    User updateUser(Long id, User user);

    void deleteUser(Long id);
}