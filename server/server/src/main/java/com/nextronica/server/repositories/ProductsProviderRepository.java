package com.nextronica.server.repositories;

import com.nextronica.server.models.ProductsProvider;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductsProviderRepository extends JpaRepository<ProductsProvider, Integer> {
}
