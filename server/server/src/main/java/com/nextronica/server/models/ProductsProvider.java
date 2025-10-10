package com.nextronica.server.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "`products-providers`")
public class ProductsProvider {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @NotNull
    @ColumnDefault("current_timestamp(6)")
    @Column(name = "createdDate", nullable = false)
    private Instant createdDate;

    @NotNull
    @ColumnDefault("current_timestamp(6)")
    @Column(name = "updatedDate", nullable = false)
    private Instant updatedDate;

    @Column(name = "deletedDate")
    private Instant deletedDate;

    @NotNull
    @ColumnDefault("1")
    @Column(name = "countInStock", nullable = false)
    private Integer countInStock;


    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "productId", nullable = false)
    private Product product;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "providerId", nullable = false)
    private User provider;

    @NotNull
    @ColumnDefault("1")
    @Column(name = "salePrice", nullable = false)
    private Integer salePrice;

}