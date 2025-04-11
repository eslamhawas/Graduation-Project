package com.ecommerce.cart.controller;

import com.ecommerce.cart.dto.CartItemDTO;
import com.ecommerce.cart.dto.CartItemResponseDTO;
import com.ecommerce.cart.dto.SuccessResponse;
import com.ecommerce.cart.model.CartItem;
import com.ecommerce.cart.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @PostMapping("/add/{userId}")
    public ResponseEntity<?> addItems(@PathVariable Long userId, @RequestBody List<CartItemDTO> products) {
        cartService.addItemsToCart(userId, products);
        String message = "Products successfully added to user " + userId + "'s cart.";
        return ResponseEntity.ok().body(new SuccessResponse(message));
    }


    @DeleteMapping("/remove/{userId}")
    public ResponseEntity<?> removeItems(@PathVariable Long userId, @RequestBody List<CartItemDTO> products) {
        cartService.removeItemsFromCart(userId, products);
        String message = "Products successfully removed from user " + userId + "'s cart.";
        return ResponseEntity.ok(new SuccessResponse(message));
    }


    @GetMapping("/get/{userId}")
    public ResponseEntity<?> getAllItems(@PathVariable Long userId) {
        List<CartItemResponseDTO> cartItems = cartService.getAllItemsDtoByUserId(userId);

        if (cartItems.isEmpty()) {
            String message = "User " + userId + "'s cart is empty.";
            return ResponseEntity.ok(new SuccessResponse(message));
        }

        return ResponseEntity.ok(cartItems);
    }


}

