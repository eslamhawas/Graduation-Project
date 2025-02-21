package com.ecommerce.cart.exception;

public class NotFoundException extends RuntimeException {
    private String resource;
    private Long id;
    private int statusCode;

    public NotFoundException(String resource, Long id) {
        super(resource + " with ID " + id + " not found.");
        this.resource = resource;
        this.id = id;
        this.statusCode = 404;
    }

    public NotFoundException(String resource, Long id, String customMessage, int statusCode) {
        super(customMessage);
        this.resource = resource;
        this.id = id;
        this.statusCode = statusCode;
    }

    public String getResource() {
        return resource;
    }

    public Long getId() {
        return id;
    }

    public int getStatusCode() {
        return statusCode;
    }
}

