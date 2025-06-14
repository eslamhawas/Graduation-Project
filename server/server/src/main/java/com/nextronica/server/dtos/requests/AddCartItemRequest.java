package com.nextronica.server.dtos.requests;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddCartItemRequest {
    @NotNull(message = "Product provider ID is required")
    private Integer productProviderId;

    @Min(value = 1, message = "Quantity must be at least 1")
    private int quantity;

    private Double price;
}

