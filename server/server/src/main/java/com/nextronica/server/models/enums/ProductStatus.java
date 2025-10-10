package com.nextronica.server.models.enums;


import lombok.Getter;

@Getter
public enum ProductStatus {
    ACCEPTED("Product is Accepted"),
    REJECTED("Product is Rejected"),
    PENDING("Product is Pending");

    private final String description;
    ProductStatus(String description) {
        this.description = description;
    }
}
