
package com.prathamesh.resumeanalyzer.serviceimpl;

import java.io.File;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.prathamesh.resumeanalyzer.dto.ResumeDTO;
import com.prathamesh.resumeanalyzer.entity.Resume;
import com.prathamesh.resumeanalyzer.entity.User;
import com.prathamesh.resumeanalyzer.repository.ResumeRepository;
import com.prathamesh.resumeanalyzer.repository.UserRepository;
import com.prathamesh.resumeanalyzer.service.AIService;
import com.prathamesh.resumeanalyzer.service.ResumeService;

@Service
public class ResumeServiceImpl implements ResumeService {

    @Autowired
    private ResumeRepository repo;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AIService aiService;

    @Override
    public ResumeDTO analyzeResume(
            MultipartFile file,
            String jobDescription,
            String email) throws Exception {

        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        String uploadDir =
                System.getProperty("user.dir")
                + File.separator
                + "uploads";

        File directory = new File(uploadDir);

        if (!directory.exists() && !directory.mkdirs()) {
            throw new RuntimeException("Unable to create upload directory");
        }

        String originalFileName = file.getOriginalFilename();

        if (originalFileName == null || originalFileName.isBlank()) {
            throw new RuntimeException("Invalid file name");
        }

        String fileName =
                System.currentTimeMillis()
                + "_"
                + originalFileName;

        File savedFile = new File(directory, fileName);

        file.transferTo(savedFile);

        String resumeText;

        try (PDDocument document = PDDocument.load(savedFile)) {

            PDFTextStripper stripper = new PDFTextStripper();

            resumeText = stripper.getText(document);
        }

        if (resumeText == null || resumeText.isBlank()) {
            throw new RuntimeException(
                    "No readable text found in PDF. Please upload a text-based PDF."
            );
        }

        Set<String> resumeWords =
                new HashSet<>(
                        Arrays.asList(
                                resumeText.toLowerCase().split("\\W+")
                        )
                );

        Set<String> jobWords =
                new HashSet<>(
                        Arrays.asList(
                                jobDescription.toLowerCase().split("\\W+")
                        )
                );

        Set<String> matched = new HashSet<>();
        Set<String> missing = new HashSet<>();

        for (String word : jobWords) {

            if (word.isBlank()) {
                continue;
            }

            if (resumeWords.contains(word)) {
                matched.add(word);
            } else {
                missing.add(word);
            }
        }

        int totalWords = jobWords.size();

        int score =
                totalWords > 0
                        ? (matched.size() * 100) / totalWords
                        : 0;

        // Generate AI suggestions using Gemini
        String suggestions;

        try {

            System.out.println("Calling AI Service...");

            suggestions = aiService.getSuggestions(
                    resumeText,
                    jobDescription
            );

            if (suggestions == null || suggestions.isBlank()) {

                suggestions =
                        "AI service returned an empty response.";
            }

            System.out.println("AI Suggestions Generated Successfully");

        } catch (Exception e) {

            System.err.println("AI SUGGESTION ERROR:");
            e.printStackTrace();

            suggestions =
                    "AI suggestions unavailable: "
                    + e.getMessage();
        }

        Resume resume = new Resume();

        resume.setFileName(fileName);

        resume.setFilePath(
                savedFile.getAbsolutePath()
        );

        resume.setResumeText(resumeText);

        resume.setJobDescription(jobDescription);

        resume.setMatchScore(score);

        resume.setMatchedKeywords(
                matched.isEmpty()
                        ? "None"
                        : String.join(", ", matched)
        );

        resume.setMissingKeywords(
                missing.isEmpty()
                        ? "None"
                        : String.join(", ", missing)
        );

        resume.setAiSuggestions(suggestions);

        resume.setUser(user);

        Resume saved = repo.save(resume);

        return convertToDTO(saved);
    }

    @Override
    public List<ResumeDTO> getAllResumes(String email) {

        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        return repo.findByUser(user)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteResume(Long id, String email) {

        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        Resume resume =
                repo.findByIdAndUser(id, user)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Resume not found or access denied"
                                )
                        );

        repo.delete(resume);
    }

    private ResumeDTO convertToDTO(Resume resume) {

        ResumeDTO dto = new ResumeDTO();

        dto.setId(resume.getId());

        dto.setFileName(resume.getFileName());

        dto.setFilePath(resume.getFilePath());

        dto.setResumeText(resume.getResumeText());

        dto.setJobDescription(resume.getJobDescription());

        dto.setMatchScore(resume.getMatchScore());

        dto.setMatchedKeywords(resume.getMatchedKeywords());

        dto.setMissingKeywords(resume.getMissingKeywords());

        dto.setAiSuggestions(resume.getAiSuggestions());

        return dto;
    }
}

