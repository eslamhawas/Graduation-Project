package com.nextronica.server.services;

import com.nextronica.server.dtos.CartItemDetailsResponse;
import com.nextronica.server.dtos.ProductPromotionsDetailsDto;
import com.nextronica.server.dtos.requests.AddCartItemRequest;
import com.nextronica.server.dtos.responses.CartItemResponse;
import com.nextronica.server.dtos.responses.CartResponse;
import com.nextronica.server.exceptions.ResourceNotFoundException;
import com.nextronica.server.exceptions.customExceptions.NoSuchProductProviderException;
import com.nextronica.server.exceptions.customExceptions.NoSuchUserException;
import com.nextronica.server.models.*;
import com.nextronica.server.repositories.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final ProductsProviderRepository productsProviderRepository;
    private final UserRepository userRepository;
    private final ProductPromotionRepository promotionRepository;
    private final ProfitMarginRepository profitMarginRepository;

    public CartService(CartRepository cartRepository, ProductsProviderRepository productsProviderRepository, UserRepository userRepository, ProductPromotionRepository promotionRepository, ProfitMarginRepository profitMarginRepository) {
        this.cartRepository = cartRepository;
        this.productsProviderRepository = productsProviderRepository;
        this.userRepository = userRepository;
        this.promotionRepository = promotionRepository;
        this.profitMarginRepository = profitMarginRepository;
    }

    public CartItemResponse addItemsToCart(Long userId, AddCartItemRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchUserException("There is no user with id: "  + userId));

        Cart cart = cartRepository.findByUserId(userId).orElseGet(() -> {
            Cart newCart = new Cart();
            newCart.setUser(user);
            return cartRepository.save(newCart);
        });

        ProductsProvider provider = productsProviderRepository.findById(request.getProductProviderId())
                .orElseThrow(() -> new NoSuchProductProviderException("There is no product provider with id: " + request.getProductProviderId()));

        if (provider.getCountInStock() < request.getQuantity()) {
            throw new IllegalArgumentException("Not enough stock available for the product provider with id: " + request.getProductProviderId());
        }



        CartItem item = new CartItem();
        item.setCart(cart);
        item.setProductProviderId(provider);
        item.setQuantity(request.getQuantity());
        item.setAddedAt(LocalDateTime.now());

        cart.getItems().add(item);
        cartRepository.save(cart);

        CartItemResponse response = new CartItemResponse();
        response.setProductProvider(provider);
        response.setQuantity(item.getQuantity());

        return response;
    }

    public CartItemResponse updateCartItem(Long userId, AddCartItemRequest request) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found for user"));

        ProductsProvider provider = productsProviderRepository.findById(request.getProductProviderId())
                .orElseThrow(() -> new ResourceNotFoundException("Product provider not found"));

        if (provider.getCountInStock() < request.getQuantity()) {
            throw new IllegalArgumentException("Not enough stock available");
        }

        CartItem item = cart.getItems().stream()
                .filter(i -> i.getProductProviderId().getId().equals(request.getProductProviderId()))
                .findFirst()
                .orElseGet(() -> {
                    CartItem newItem = new CartItem();
                    newItem.setCart(cart);
                    newItem.setProductProviderId(provider);
                    cart.getItems().add(newItem);
                    return newItem;
                });

        item.setQuantity(request.getQuantity());
        item.setAddedAt(LocalDateTime.now());

        cartRepository.save(cart);

        CartItemResponse response = new CartItemResponse();
        response.setProductProvider(provider);
        response.setQuantity(item.getQuantity());

        return response;
    }

    public void clearCart(Long userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    public void deleteCartItem(Long userId, Long productProviderId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

        cart.getItems().removeIf(item -> item.getProductProviderId().getId().equals(productProviderId.intValue()));
        cartRepository.save(cart);
    }

    public CartResponse getCartDetails(Long userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

        List<CartItemDetailsResponse> items = new ArrayList<>();
        float total = 0;

        for (CartItem item : cart.getItems()) {
            ProductsProvider provider = item.getProductProviderId();
            ProfitMargin margin = profitMarginRepository
                    .findTopByOrderByCreatedDateDesc()
                    .orElseThrow(() -> new ResourceNotFoundException("Profit margin not found"));

            float salePrice = provider.getSalePrice();
            float commissionPrice = salePrice + (salePrice * margin.getCurrent().floatValue() / 100);

            Optional<ProductPromotionsDetailsDto> promotionOpt =
                    promotionRepository.findPromotionsDetailsByProductProviderEntityId(provider.getId())
                            .stream()
                            .filter(ProductPromotionsDetailsDto::getActive)
                            .findFirst();

            float discountedPrice = promotionOpt
                    .map(p -> commissionPrice - (commissionPrice * p.getPromotionPercentage().floatValue() / 100))
                    .orElse(commissionPrice);

            CartItemDetailsResponse responseItem = new CartItemDetailsResponse();
            responseItem.setProductProviderName(provider.getProvider().getUsername());
            responseItem.setProductProviderId(provider.getId().longValue());
            responseItem.setProductImageUrl(provider.getProduct().getImageUrl());
            responseItem.setProductName(provider.getProduct().getName());
            responseItem.setQuantity(item.getQuantity());
            responseItem.setCommissionPrice(commissionPrice);
            responseItem.setDiscountedPrice(discountedPrice);
            total += discountedPrice * item.getQuantity();
            items.add(responseItem);
        }

        CartResponse response = new CartResponse();
        response.setItems(items);
        response.setTotal(total);
        return response;
    }
}



