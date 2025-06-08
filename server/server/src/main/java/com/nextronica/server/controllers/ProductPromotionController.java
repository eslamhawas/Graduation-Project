package com.nextronica.server.controllers;

import com.nextronica.server.dtos.ProductPromotionsDetailsDto;
import com.nextronica.server.dtos.requests.AddProductPromotionRequestDto;
import com.nextronica.server.services.ProductPromotionsService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/api/v1/promotions")
public class ProductPromotionController {

    private final ProductPromotionsService productPromotionsService;

    public ProductPromotionController(ProductPromotionsService productPromotionsService) {
        this.productPromotionsService = productPromotionsService;
    }


    @PostMapping
    public ResponseEntity<ProductPromotionsDetailsDto> addProductPromotion(@Valid @RequestBody AddProductPromotionRequestDto dto) {
        ProductPromotionsDetailsDto promotionsDetailsDto = productPromotionsService.addProductPromotion(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(promotionsDetailsDto);
    }


    @DeleteMapping("/{promotionId}")
    public ResponseEntity<Void> deleteProductPromotion(@PathVariable int promotionId) {
        productPromotionsService.deleteProductPromotion(promotionId);
        return ResponseEntity.noContent().build();
    }


    @GetMapping
    public ResponseEntity<HashMap<String, Object>> getAllProductPromotions(Pageable pageable) {
        HashMap<String, Object> response = productPromotionsService.getAllProductPromotions(pageable);
        return ResponseEntity.ok(response);
    }


    @GetMapping("/{promotionId}")
    public ResponseEntity<ProductPromotionsDetailsDto> getProductPromotionById(@PathVariable int promotionId) {
        ProductPromotionsDetailsDto promotion = productPromotionsService.getProductPromotionById(promotionId);
        return ResponseEntity.ok(promotion);
    }


    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<ProductPromotionsDetailsDto>> getProductPromotionsByProviderId(@PathVariable int providerId) {
        List<ProductPromotionsDetailsDto> promotions = productPromotionsService.getProductPromotionsByProviderId(providerId);
        return ResponseEntity.ok(promotions);
    }
}