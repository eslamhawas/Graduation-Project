package com.ecommerce.cart.service;
import com.ecommerce.cart.dto.CartItemDTO;
import com.ecommerce.cart.dto.CartItemResponseDTO;
import com.ecommerce.cart.exception.NotFoundException;
import com.ecommerce.cart.model.CartItem;
import com.ecommerce.cart.model.Product;
import com.ecommerce.cart.model.User;
import com.ecommerce.cart.repository.CartItemRepository;
import com.ecommerce.cart.repository.ProductRepository;
import com.ecommerce.cart.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    public void addItemsToCart(Long userId, List<CartItemDTO> products) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            throw new NotFoundException("User", userId);
        }

        for (CartItemDTO dto : products) {
            Optional<Product> productOptional = productRepository.findById(dto.getProductId());
            if (!productOptional.isPresent()) {
                throw new NotFoundException("Product", dto.getProductId());
            }

            CartItem cartItem = new CartItem();
            cartItem.setUser(userOptional.get());
            cartItem.setProduct(productOptional.get());
            cartItemRepository.save(cartItem);
        }
    }
    @Transactional
    public void removeItemsFromCart(Long userId, List<CartItemDTO> products) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            throw new NotFoundException("User", userId);
        }

        for (CartItemDTO dto : products) {
            cartItemRepository.deleteByUserIdAndProductId(userId, dto.getProductId());
        }
    }

    public List<CartItemResponseDTO> getAllItemsDtoByUserId(Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            throw new NotFoundException("User", userId);
        }

        List<CartItem> items = cartItemRepository.findAllByUserId(userId);

        return items.stream().map(item -> {
            CartItemResponseDTO dto = new CartItemResponseDTO();
            dto.setId(item.getId());
            dto.setUserId(item.getUser().getId());
            dto.setProductId(item.getProduct().getId());
            return dto;
        }).toList();
    }

}
