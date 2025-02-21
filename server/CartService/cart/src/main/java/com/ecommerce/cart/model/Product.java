package com.ecommerce.cart.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import lombok.Data;

import java.util.List;

@Entity
@Data
public class Product {



    @Id
    private Long id;

    @ManyToMany(mappedBy = "products")
    private List<User> users;


}

