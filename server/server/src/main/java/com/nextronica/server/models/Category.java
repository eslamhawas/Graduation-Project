package com.nextronica.server.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "categories")
public class Category {
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

    @ManyToMany
    @JoinTable(name = "products-categories",
            joinColumns = @JoinColumn(name = "categoriesId"),
            inverseJoinColumns = @JoinColumn(name = "productsId"))
    private Set<Product> products = new LinkedHashSet<>();

}