package com.playgrid.review_service.dto;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RatingSummaryResponse {

    private Double averageRating;

    private Long totalReviews;
}
