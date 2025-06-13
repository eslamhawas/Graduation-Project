package com.nextronica.server.dtos.requests;

import com.nextronica.server.models.ProfitMargin;
import jakarta.validation.constraints.NotNull;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * DTO for {@link ProfitMargin}
 */
public record AddProfitMarginRequestDto(
        @NotNull(message = "Commission percentage can't be null")
        BigDecimal current) implements Serializable {
}