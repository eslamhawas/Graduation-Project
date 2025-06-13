package com.nextronica.server.controllers;


import com.nextronica.server.dtos.requests.AddCartItemRequest;
import com.nextronica.server.dtos.responses.CartItemResponse;
import com.nextronica.server.dtos.responses.CartResponse;
import com.nextronica.server.services.CartService;
import com.nextronica.server.utils.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;
    private final JwtUtil jwtUtil;

    public CartController(CartService cartService, JwtUtil jwtUtil) {
        this.cartService = cartService;
        this.jwtUtil = jwtUtil;
    }


    @PostMapping("/add")
    public ResponseEntity<CartItemResponse> addToCart(@RequestHeader("Authorization") String authHeader,
                                                      @RequestBody AddCartItemRequest request) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().build();
        }
        Long userId = jwtUtil.extractId(authHeader);
        CartItemResponse response = cartService.addItemsToCart(userId, request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/update")
    public ResponseEntity<CartItemResponse> updateCartItem(@RequestHeader("Authorization") String authHeader,
                                                           @RequestBody AddCartItemRequest request) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().build();
        }
        Long userId = jwtUtil.extractId(authHeader);
        CartItemResponse response = cartService.updateCartItem(userId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/item/{productProviderId}")
    public ResponseEntity<Void> deleteCartItem(@RequestHeader("Authorization") String authHeader,
                                               @PathVariable Long productProviderId) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().build();
        }
        Long userId = jwtUtil.extractId(authHeader);
        cartService.deleteCartItem(userId, productProviderId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().build();
        }
        Long userId = jwtUtil.extractId(authHeader);
        cartService.clearCart(userId);

        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<CartResponse> getCart(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().build();
        }
        Long userId = jwtUtil.extractId(authHeader);
        CartResponse response = cartService.getCartDetails(userId);
        return ResponseEntity.ok(response);
    }
}



