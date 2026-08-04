package com.playgrid.authService.repository;

import com.playgrid.authService.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    @org.springframework.data.jpa.repository.Query("SELECT u.email FROM User u")
    java.util.List<String> findAllEmails();
}
