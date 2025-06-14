package com.nextronica.server.dtos;

import com.nextronica.server.models.ProductsProvider;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItemDetailsResponse {


    private ProductsProvider productProvider;
    private int quantity;
    private float commissionPrice;
    private float discountedPrice;
}