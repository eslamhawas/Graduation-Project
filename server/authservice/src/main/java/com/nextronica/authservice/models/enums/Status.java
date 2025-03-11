package com.nextronica.authservice.models.enums;

import lombok.Getter;


@Getter
public enum Status {
    ACTIVE("Account is active"),
    SUSPENDED("Account is suspended"),
    PENDING_VERIFICATION("Pending email verification");

    private final String description;
    Status(String description) {
        this.description = description;
    }
}
