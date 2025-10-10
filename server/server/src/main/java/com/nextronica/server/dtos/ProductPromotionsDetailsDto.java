package com.nextronica.server.dtos;

import com.nextronica.server.models.ProductPromotions;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO for {@link com.nextronica.server.models.ProductPromotions}
 */
@Data
public class ProductPromotionsDetailsDto implements Serializable {
    Integer id;
    Integer productProviderId;
    Long vendorId;
    Float price;
    Float promoPrice;
    BigDecimal promotionPercentage;
    @NotNull
    LocalDateTime createdDate;
    LocalDateTime deletedDate;
    LocalDateTime expiryDate;
    Boolean active;
    String productName; // Added field

    // Constructor to map from entities
    public ProductPromotionsDetailsDto(ProductPromotions promotion) {
        this.id = promotion.getId();
        this.productProviderId = promotion.getProductProvider().getId();
        this.vendorId = promotion.getProductProvider().getProvider().getId();
        this.price = promotion.getProductProvider().getSalePrice().floatValue();

        // Calculate promo price based on percentage
        if (promotion.getPromotionPercentage() != null) {
            BigDecimal originalPrice = BigDecimal.valueOf(promotion.getProductProvider().getSalePrice());
            BigDecimal discount = originalPrice.multiply(promotion.getPromotionPercentage())
                    .divide(BigDecimal.valueOf(100));
            this.promoPrice = originalPrice.subtract(discount).floatValue();
        }

        this.promotionPercentage = promotion.getPromotionPercentage();
        this.createdDate = promotion.getCreatedDate();
        this.deletedDate = promotion.getDeletedDate();
        this.expiryDate = promotion.getExpiryDate();
        this.active = promotion.getActive();
        this.productName = promotion.getProductProvider().getProduct().getName(); // Set product name
    }

    // Constructor for JPQL queries
    public ProductPromotionsDetailsDto(Integer id, Integer productProviderId, Long vendorId,
                                       Float price, Float promoPrice, BigDecimal promotionPercentage,
                                       LocalDateTime createdDate, LocalDateTime deletedDate, LocalDateTime expiryDate, Boolean active,
                                       String productName) { // Added productName param
        this.id = id;
        this.productProviderId = productProviderId;
        this.vendorId = vendorId;
        this.price = price;
        this.promoPrice = promoPrice;
        this.promotionPercentage = promotionPercentage;
        this.createdDate = createdDate;
        this.deletedDate = deletedDate;
        this.expiryDate = expiryDate;
        this.active = active;
        this.productName = productName;
    }
}