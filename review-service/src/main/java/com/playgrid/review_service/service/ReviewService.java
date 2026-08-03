package com.playgrid.review_service.service;

import com.playgrid.review_service.dto.*;

import java.util.List;

public interface ReviewService {

    ReviewResponse addReview(Long userId, ReviewRequest request);

    ReviewResponse updateReview(Long id, UpdateReviewRequest request);

    void deleteReview(Long id);

    List<ReviewResponse> getReviewsByGame(Long gameId);

    RatingSummaryResponse getAverageRating(Long gameId);
}
