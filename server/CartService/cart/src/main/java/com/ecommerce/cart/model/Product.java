
package com.ecommerce.cart.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

    @JsonIgnore
    @ManyToMany(mappedBy = "products")
    private List<User> users;
}


