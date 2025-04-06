package com.ecommerce.cart.controller;

import com.ecommerce.cart.dto.CartItemDTO;
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
    public ResponseEntity<Void> addItems(@PathVariable Long userId, @RequestBody List<CartItemDTO> products) {
        cartService.addItemsToCart(userId, products);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/remove/{userId}")
    public ResponseEntity<Void> removeItems(@PathVariable Long userId, @RequestBody List<CartItemDTO> products) {
        cartService.removeItemsFromCart(userId, products);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/get/{userId}")
    public ResponseEntity<List<CartItem>> getAllItems(@PathVariable Long userId) {
        List<CartItem> cartItems = cartService.getAllItemsByUserId(userId);
        return ResponseEntity.ok(cartItems);
    }
}

