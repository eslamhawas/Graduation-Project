package com.ecommerce.cart.repository;

import com.ecommerce.cart.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}

