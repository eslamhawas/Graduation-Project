package com.nextronica.server.exceptions.customExceptions;

public class NoSuchProductPromotionException extends RuntimeException {
    public NoSuchProductPromotionException(String message) {
        super(message);
    }
}
