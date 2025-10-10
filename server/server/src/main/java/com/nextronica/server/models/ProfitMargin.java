package com.nextronica.server.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "profit-margin")
public class ProfitMargin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @NotNull
    @ColumnDefault("current_timestamp(6)")
    @Column(name = "createdDate", nullable = false)
    private LocalDateTime createdDate;

    @Column(name = "endDate")
    private LocalDateTime endDate;

    @Column(name = "current", precision = 5, scale = 2)
    private BigDecimal current;


    @PrePersist
    protected void onCreate() {
        createdDate = LocalDateTime.now();
    }

}