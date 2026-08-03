package com.playgrid.review_service.service;


import com.playgrid.review_service.client.LibraryServiceClient;
import com.playgrid.review_service.dto.RatingSummaryResponse;
import com.playgrid.review_service.dto.ReviewRequest;
import com.playgrid.review_service.dto.ReviewResponse;
import com.playgrid.review_service.dto.UpdateReviewRequest;
import com.playgrid.review_service.entity.Review;
import com.playgrid.review_service.exception.DuplicateReviewException;
import com.playgrid.review_service.exception.ResourceNotFoundException;
import com.playgrid.review_service.repository.ReviewRepository;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final LibraryServiceClient libraryServiceClient;

    @Override
    public ReviewResponse addReview(Long userId, ReviewRequest request) {

        if (reviewRepository.existsByUserIdAndGameId(
                userId,
                request.getGameId())) {

            throw new DuplicateReviewException("Review already exists");
        }

        try {
            libraryServiceClient.getPurchasedGame(
                    userId,
                    request.getGameId());

        } catch (FeignException.NotFound ex) {

            throw new ResourceNotFoundException(
                    "User has not purchased this game");
        }

        Review review = Review.builder()
                .userId(userId)
                .gameId(request.getGameId())
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        return mapToResponse(reviewRepository.save(review));
    }

    @Override
    public ReviewResponse updateReview(Long id,
                                       UpdateReviewRequest request) {

        Review review = reviewRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Review not found"));

        review.setRating(request.getRating());
        review.setComment(request.getComment());

        return mapToResponse(reviewRepository.save(review));
    }

    @Override
    public void deleteReview(Long id) {

        Review review = reviewRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Review not found"));

        reviewRepository.delete(review);
    }

    @Override
    public List<ReviewResponse> getReviewsByGame(Long gameId) {

        return reviewRepository.findByGameId(gameId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public RatingSummaryResponse getAverageRating(Long gameId) {

        Double averageRating = reviewRepository.getAverageRating(gameId);
        Long totalReviews = reviewRepository.getTotalReviews(gameId);

        return RatingSummaryResponse.builder()
                .averageRating(
                        averageRating == null ? 0.0 : averageRating)
                .totalReviews(totalReviews)
                .build();
    }

    private ReviewResponse mapToResponse(Review review) {

        return ReviewResponse.builder()
                .id(review.getId())
                .userId(review.getUserId())
                .gameId(review.getGameId())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt())
                .build();
    }
}
