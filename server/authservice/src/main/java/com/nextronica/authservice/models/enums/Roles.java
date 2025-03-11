package com.nextronica.authservice.models.enums;

import lombok.Getter;

@Getter
public enum Roles {
    ADMIN("Administrator"),
    USER("Regular User"),
    VENDOR("Vendor");

    private final String description;

    Roles(String description) {
        this.description = description;
    }
}