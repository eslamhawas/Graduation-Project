package com.nextronica.server.models;

import com.nextronica.server.models.enums.ProductStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.Set;

@Builder
@Getter
@Setter
@Entity
@Table(name = "products")
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @NotNull
    @ColumnDefault("current_timestamp(6)")
    @Column(name = "createdDate", nullable = false)
    private LocalDateTime createdDate;

    @NotNull
    @ColumnDefault("current_timestamp(6)")
    @Column(name = "updatedDate", nullable = false)
    private LocalDateTime updatedDate;

    @Column(name = "deletedDate")
    private LocalDateTime deletedDate;

    @Size(max = 255)
    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ProductStatus status = ProductStatus.PENDING;

    @Size(max = 255)
    @Column(name = "imageUrl")
    private String imageUrl;

    @ManyToMany(mappedBy = "products")
    private Set<Category> categories = new LinkedHashSet<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<ProductsProvider> productProviders = new LinkedHashSet<>();

}