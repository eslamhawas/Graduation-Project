package com.ecommerce.cart.dto;

import lombok.Data;
@Data
public class CartItemDTO {
    private Long productId;

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }
}

