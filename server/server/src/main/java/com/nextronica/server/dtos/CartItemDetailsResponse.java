package com.nextronica.server.dtos;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * Data Transfer Object for detailed information about an item in the shopping cart.
 * This class encapsulates data that is sent to the client, including pricing details
 * like commission and discounts.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItemDetailsResponse {

    /**
     * The unique identifier for the product provider.
     */
    private Long productProviderId;

    /**
     * The quantity of the product in the cart.
     */
    private int quantity;

    /**
     * The price including the commission. This is the base price for discount calculations.
     */
    private float commissionPrice;

    /**
     * The final price after applying any active promotions or discounts.
     */
    private float discountedPrice;

    /**
     * The price of the item at the time it was added to the cart.
     * This can be useful for tracking price changes.
     */
    private double priceAtAddition;
}