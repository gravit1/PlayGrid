package com.playgrid.review_service.controller;
import com.playgrid.review_service.dto.RatingSummaryResponse;
import com.playgrid.review_service.dto.ReviewRequest;
import com.playgrid.review_service.dto.ReviewResponse;
import com.playgrid.review_service.dto.UpdateReviewRequest;
import com.playgrid.review_service.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<ReviewResponse> addReview(
            @Valid @RequestBody ReviewRequest request) {

        return ResponseEntity.ok(reviewService.addReview(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReviewResponse> updateReview(
            @PathVariable Long id,
            @Valid @RequestBody UpdateReviewRequest request) {

        return ResponseEntity.ok(reviewService.updateReview(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteReview(
            @PathVariable Long id) {

        reviewService.deleteReview(id);

        return ResponseEntity.ok("Review deleted successfully");
    }

    @GetMapping("/game/{gameId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByGame(
            @PathVariable Long gameId) {

        return ResponseEntity.ok(reviewService.getReviewsByGame(gameId));
    }

    @GetMapping("/game/{gameId}/average")
    public ResponseEntity<RatingSummaryResponse> getAverageRating(
            @PathVariable Long gameId) {

        return ResponseEntity.ok(reviewService.getAverageRating(gameId));
    }
}
