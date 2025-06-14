package com.nextronica.server.repositories;

import com.nextronica.server.dtos.ProductPromotionsDetailsDto;
import com.nextronica.server.models.ProductPromotions;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductPromotionRepository extends JpaRepository<ProductPromotions, Integer> {
    @Query("""
            SELECT new com.nextronica.server.dtos.ProductPromotionsDetailsDto(
                pp.id,
                provider.id,
                provider.provider.id,
                CAST(provider.salePrice AS float),
                CAST(provider.salePrice - (provider.salePrice * pp.promotionPercentage / 100) AS float),
                pp.promotionPercentage,
                pp.createdDate,
                pp.deletedDate,
                pp.expiryDate,
                pp.active,
                provider.product.name
            )
            FROM ProductPromotions pp
            JOIN pp.productProvider provider
            WHERE provider.id = :productProviderEntityId
            """)
    List<ProductPromotionsDetailsDto> findPromotionsDetailsByProductProviderEntityId(@Param("productProviderEntityId") Integer productProviderEntityId);

    @Query("""
            SELECT new com.nextronica.server.dtos.ProductPromotionsDetailsDto(
                pp.id,
                provider.id,
                provider.provider.id,
                CAST(provider.salePrice AS float),
                CAST(provider.salePrice - (provider.salePrice * pp.promotionPercentage / 100) AS float),
                pp.promotionPercentage,
                pp.createdDate,
                pp.deletedDate,
                pp.expiryDate,
                pp.active,
                provider.product.name
            )
            FROM ProductPromotions pp
            JOIN pp.productProvider provider
            WHERE pp.active = true
            """)
    Page<ProductPromotionsDetailsDto> findAllPromotionsDetails(Pageable pageable);

    @Query("""
            SELECT new com.nextronica.server.dtos.ProductPromotionsDetailsDto(
                pp.id,
                provider.id,
                provider.provider.id,
                CAST(provider.salePrice AS float),
                CAST(provider.salePrice - (provider.salePrice * pp.promotionPercentage / 100) AS float),
                pp.promotionPercentage,
                pp.createdDate,
                pp.deletedDate,
                pp.expiryDate,
                pp.active,
                provider.product.name
            )
            FROM ProductPromotions pp
            JOIN pp.productProvider provider
            WHERE pp.id = :id
            """)
    Optional<ProductPromotionsDetailsDto> findPromotionDetailsById(@Param("id") Integer id);
}
