package com.nextronica.server.exceptions.customExceptions;

public class NoSuchProductProviderException extends RuntimeException {
    public NoSuchProductProviderException(String message) {
        super(message);
    }
}
