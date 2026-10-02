package com.prathamesh.resumeanalyzer.service;

public interface AIService {

    String getSuggestions(
            String resumeText,
            String jobDescription
    );
}