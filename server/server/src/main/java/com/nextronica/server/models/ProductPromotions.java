package com.nextronica.server.models;


import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Builder
@Table(name = "product-promotions", indexes = {
        @Index(name = "idx_product_provider", columnList = "productProviderId"),
        @Index(name = "idx_expiry_date", columnList = "expiryDate")
})
@NoArgsConstructor
@AllArgsConstructor
public class ProductPromotions {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "productProviderId", nullable = false)
    private ProductsProvider productProvider;

    @DecimalMin("0.0")
    @DecimalMax("100.0")
    @Column(name = "promotionPercentage", precision = 5, scale = 2)
    private BigDecimal promotionPercentage;

    @NotNull
    @Column(name = "createdDate", nullable = false, updatable = false)
    private LocalDateTime createdDate;

    @Column(name = "deletedDate")
    private LocalDateTime deletedDate;

    @Column(name = "expiryDate")
    private LocalDateTime expiryDate;

    @Column(name = "active")
    @ColumnDefault("true")
    private Boolean active;

    @PrePersist
    protected void onCreate() {
        this.createdDate = LocalDateTime.now();
        if (this.active == null) this.active = true;
    }
}

