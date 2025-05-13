package com.nextronica.server.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "cart_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;

    @ManyToOne
    @JoinColumn(name = "product_provider_id", nullable = false)
    private ProductsProvider productProviderId;

    @Min(1)
    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false)
    private double priceAtAddition;

    private LocalDateTime addedAt;
}

