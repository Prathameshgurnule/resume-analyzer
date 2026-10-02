package com.prathamesh.resumeanalyzer.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.prathamesh.resumeanalyzer.entity.Resume;
import com.prathamesh.resumeanalyzer.entity.User;

public interface ResumeRepository extends JpaRepository<Resume, Long> {

    List<Resume> findByUser(User user);

    java.util.Optional<Resume> findByIdAndUser(Long id, User user);
}