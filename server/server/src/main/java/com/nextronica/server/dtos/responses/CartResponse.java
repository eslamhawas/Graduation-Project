package com.nextronica.server.dtos.responses;

import java.util.List;

import com.nextronica.server.dtos.CartItemDetailsResponse;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartResponse {

    /**
     * A list of detailed responses for each item in the cart.
     * See {@link CartItemDetailsResponse} for more details.
     */
    private List<CartItemDetailsResponse> items;

    /**
     * The total calculated price for all items in the cart, after all discounts.
     */
    private float total;
}
