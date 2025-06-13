package com.nextronica.server.dtos.responses;


import lombok.Data;

@Data
public class CartItemResponse {
    private Long productProviderId;
    private int quantity;
    private Double price;
}


