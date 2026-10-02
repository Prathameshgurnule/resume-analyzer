package com.prathamesh.resumeanalyzer.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.prathamesh.resumeanalyzer.dto.ResumeDTO;

public interface ResumeService {

    ResumeDTO analyzeResume(
            MultipartFile file,
            String jobDescription,
            String email
    ) throws Exception;

    List<ResumeDTO> getAllResumes(String email);

    void deleteResume(Long id, String email);
}