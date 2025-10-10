package com.nextronica.server.dtos.requests;

import com.nextronica.server.models.ProductPromotions;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO for {@link ProductPromotions}
 */
public record AddProductPromotionRequestDto(
        @NotNull
        Integer productProviderId,
        @NotNull(message = "Promotion percentage can't be null")
        @Positive(message = "Promotion Percentage must be larger than 0")
        BigDecimal promotionPercentage,
        Boolean active,
        LocalDateTime expiryDate) {
}