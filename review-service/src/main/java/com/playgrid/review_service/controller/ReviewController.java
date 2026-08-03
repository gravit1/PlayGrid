package com.playgrid.review_service.controller;
import com.playgrid.review_service.dto.RatingSummaryResponse;
import com.playgrid.review_service.dto.ReviewRequest;
import com.playgrid.review_service.dto.ReviewResponse;
import com.playgrid.review_service.dto.UpdateReviewRequest;
import com.playgrid.review_service.service.ReviewService;
import jakarta.servlet.http.HttpServletRequest;
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
            @Valid @RequestBody ReviewRequest request,
            HttpServletRequest httpServletRequest) {

        return ResponseEntity.ok(reviewService.addReview(getUserId(httpServletRequest), request));
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

    private Long getUserId(HttpServletRequest request) {
        return Long.valueOf(request.getHeader("X-User-Id"));
    }
}
