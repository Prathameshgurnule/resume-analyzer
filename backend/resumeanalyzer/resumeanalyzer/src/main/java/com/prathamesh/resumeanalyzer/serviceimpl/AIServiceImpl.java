
package com.prathamesh.resumeanalyzer.serviceimpl;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.prathamesh.resumeanalyzer.service.AIService;

@Service
public class AIServiceImpl implements AIService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public String getSuggestions(
            String resumeText,
            String jobDescription) {

        try {

            if (apiKey == null || apiKey.isBlank()) {
                throw new RuntimeException(
                        "Gemini API key is missing."
                );
            }

            String prompt =
                    "You are an expert resume reviewer and ATS specialist.\n\n"
                    + "Analyze the following resume against the job description.\n\n"
                    + "Provide a structured response with these sections:\n\n"
                    + "1. ATS Improvement Suggestions\n"
                    + "2. Missing Skills\n"
                    + "3. Important Keywords To Add\n"
                    + "4. Resume Improvement Tips\n"
                    + "5. Recommended Resume Changes\n\n"
                    + "Give practical, specific suggestions.\n"
                    + "Do not invent experience, qualifications, or skills.\n"
                    + "Use clear headings and bullet points.\n\n"
                    + "RESUME:\n"
                    + resumeText
                    + "\n\nJOB DESCRIPTION:\n"
                    + jobDescription;

            String url =
                    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key="
                    + apiKey;

            HttpHeaders headers = new HttpHeaders();

            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> requestBody = Map.of(

                    "contents",

                    new Object[]{

                            Map.of(

                                    "parts",

                                    new Object[]{

                                            Map.of(
                                                    "text",
                                                    prompt
                                            )

                                    }

                            )

                    },

                    "generationConfig",

                    Map.of(
                            "temperature", 0.4,
                            "maxOutputTokens", 2048
                    )
            );

            HttpEntity<Map<String, Object>> entity =
                    new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response =
                    restTemplate.exchange(
                            url,
                            HttpMethod.POST,
                            entity,
                            String.class
                    );

            System.out.println(
                    "Gemini HTTP Status: "
                    + response.getStatusCode()
            );

            JsonNode root =
                    mapper.readTree(response.getBody());

            JsonNode candidates =
                    root.path("candidates");

            if (!candidates.isArray() || candidates.isEmpty()) {

                System.err.println(
                        "Gemini returned no candidates: "
                        + root
                );

                return "Gemini did not return a suggestion. Please try again.";
            }

            JsonNode parts =
                    candidates.get(0)
                            .path("content")
                            .path("parts");

            if (!parts.isArray() || parts.isEmpty()) {

                System.err.println(
                        "Gemini response contains no text parts: "
                        + root
                );

                return "Gemini returned an empty response.";
            }

            String suggestions =
                    parts.get(0)
                            .path("text")
                            .asText("");

            if (suggestions.isBlank()) {

                return "Gemini returned an empty suggestion.";
            }

            System.out.println(
                    "Gemini suggestions generated successfully."
            );

            return suggestions;

        } catch (HttpStatusCodeException e) {

            System.err.println(
                    "Gemini HTTP Error: "
                    + e.getStatusCode()
            );

            System.err.println(
                    "Gemini Error Response: "
                    + e.getResponseBodyAsString()
            );

            return "Gemini API Error: "
                    + e.getStatusCode()
                    + ". Check the backend console for details.";

        } catch (Exception e) {

            System.err.println(
                    "Gemini Integration Error: "
                    + e.getMessage()
            );

            e.printStackTrace();

            return "AI suggestions unavailable due to a backend or Gemini configuration error. Check the backend console.";

        }
    }
}

