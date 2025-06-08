package com.nextronica.server.services;


import com.nextronica.server.dtos.PaginationDto;
import com.nextronica.server.dtos.ProductPromotionsDetailsDto;
import com.nextronica.server.dtos.requests.AddProductPromotionRequestDto;
import com.nextronica.server.exceptions.customExceptions.NoSuchProductPromotionException;
import com.nextronica.server.exceptions.customExceptions.NoSuchProductProviderException;
import com.nextronica.server.models.ProductPromotions;
import com.nextronica.server.models.ProductsProvider;
import com.nextronica.server.repositories.ProductPromotionRepository;
import com.nextronica.server.repositories.ProductsProviderRepository;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;

@Service
public class ProductPromotionsService {

    final private ProductPromotionRepository _productPromotionRepository;
    final private ProductsProviderRepository _productsProviderRepository;
    final private ModelMapper _modelMapper;

    public ProductPromotionsService(ProductPromotionRepository productPromotionRepository, ProductsProviderRepository productsProviderRepository, ModelMapper modelMapper) {
        _productPromotionRepository = productPromotionRepository;
        _productsProviderRepository = productsProviderRepository;
        _modelMapper = modelMapper;
    }

    public ProductPromotionsDetailsDto addProductPromotion(AddProductPromotionRequestDto dto) {
        ProductPromotions productPromotion = _modelMapper.map(dto, ProductPromotions.class);
        productPromotion.setId(null);
        ProductsProvider existingProvider = _productsProviderRepository.findById(dto.productProviderId()).orElseThrow(
                () -> new NoSuchProductProviderException("There is no product provider with the given ID")
        );
        productPromotion.setProductProvider(existingProvider);
        ProductPromotions promo = _productPromotionRepository.save(productPromotion);
        return _modelMapper.map(promo, ProductPromotionsDetailsDto.class);
    }

    public void deleteProductPromotion(int productPromotionId) {
        if (productPromotionId <= 0) {
            throw new IllegalArgumentException("Product Promotion ID must be greater than 0");
        }
        ProductPromotions productPromotions = _productPromotionRepository.findById(productPromotionId).orElseThrow(
                () -> new NoSuchProductProviderException("There is no product promotion with the given ID")
        );
        _productPromotionRepository.delete(productPromotions);
    }

    public HashMap<String, Object> getAllProductPromotions(Pageable pageable) {
        Page<ProductPromotionsDetailsDto> productPromotions = _productPromotionRepository.findAllPromotionsDetails(pageable);
        PaginationDto paginationDto = _modelMapper.map(productPromotions, PaginationDto.class);
        HashMap<String, Object> paginationMap = new HashMap<>();
        paginationMap.put("pagination", paginationDto);
        paginationMap.put("productPromotions", productPromotions.getContent());
        return paginationMap;
    }

    public ProductPromotionsDetailsDto getProductPromotionById(int productPromotionId) {
        if (productPromotionId <= 0) {
            throw new IllegalArgumentException("Product Promotion ID must be greater than 0");
        }
        ProductPromotions productPromotions = _productPromotionRepository.findById(productPromotionId).orElseThrow(
                () -> new NoSuchProductPromotionException("There is no product promotion with the ID: " + productPromotionId)
        );
        return _modelMapper.map(productPromotions, ProductPromotionsDetailsDto.class);
    }

    public List<ProductPromotionsDetailsDto> getProductPromotionsByProviderId(int providerId) {
        if (providerId <= 0) {
            throw new IllegalArgumentException("Product Promotion ID must be greater than 0");
        }
        ProductsProvider provider = _productsProviderRepository.findById(providerId).orElseThrow(
                () -> new NoSuchProductProviderException("There is no product provider with the given ID")
        );
        return _productPromotionRepository.findPromotionsDetailsByProductProviderEntityId(providerId);
    }


}
