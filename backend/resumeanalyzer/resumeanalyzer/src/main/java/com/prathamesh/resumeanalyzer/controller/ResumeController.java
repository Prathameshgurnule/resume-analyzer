package com.prathamesh.resumeanalyzer.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.prathamesh.resumeanalyzer.config.JwtUtil;
import com.prathamesh.resumeanalyzer.dto.ResumeDTO;
import com.prathamesh.resumeanalyzer.service.ResumeService;

@RestController
@RequestMapping("/api/resume")
@CrossOrigin("*")
public class ResumeController {

    @Autowired
    private ResumeService service;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/analyze")
    public ResponseEntity<?> analyze(
            @RequestParam("file") MultipartFile file,
            @RequestParam("jobDescription") String jobDescription,
            @RequestHeader("Authorization") String authorization
    ) {

        try {

            String email =
                    extractEmail(authorization);

            ResumeDTO result =
                    service.analyzeResume(
                            file,
                            jobDescription,
                            email
                    );

            return ResponseEntity.ok(result);

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAll(
            @RequestHeader("Authorization") String authorization
    ) {

        try {

            String email =
                    extractEmail(authorization);

            List<ResumeDTO> resumes =
                    service.getAllResumes(email);

            return ResponseEntity.ok(resumes);

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authorization
    ) {

        try {

            String email =
                    extractEmail(authorization);

            service.deleteResume(
                    id,
                    email
            );

            return ResponseEntity.ok(
                    "Resume deleted successfully"
            );

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(e.getMessage());
        }
    }

    private String extractEmail(
            String authorization
    ) {

        if (authorization == null ||
                !authorization.startsWith("Bearer ")) {

            throw new RuntimeException(
                    "Missing or invalid Authorization header"
            );
        }

        String token =
                authorization.substring(7);

        if (!jwtUtil.validateToken(token)) {

            throw new RuntimeException(
                    "Invalid or expired token"
            );
        }

        return jwtUtil.extractUsername(token);
    }
}