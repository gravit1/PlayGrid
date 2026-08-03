package com.playgrid.review_service.repository;

import com.playgrid.review_service.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByGameId(Long gameId);

    Optional<Review> findByUserIdAndGameId(Long userId, Long gameId);

    boolean existsByUserIdAndGameId(Long userId, Long gameId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.gameId = :gameId")
    Double getAverageRating(@Param("gameId") Long gameId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.gameId = :gameId")
    Long getTotalReviews(@Param("gameId") Long gameId);

}
