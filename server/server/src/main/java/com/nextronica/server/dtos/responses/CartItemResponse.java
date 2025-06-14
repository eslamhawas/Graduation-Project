package com.nextronica.server.dtos.responses;


import com.nextronica.server.models.ProductsProvider;
import lombok.Data;

@Data
public class CartItemResponse {
    private ProductsProvider productProvider;
    private int quantity;
}


