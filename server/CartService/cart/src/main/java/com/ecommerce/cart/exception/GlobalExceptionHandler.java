package com.ecommerce.cart.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(NotFoundException ex) {
        String message = ex.getMessage();
        String details = "The requested resource could not be found";
        String errorCode = ex.getResource().toUpperCase() + "_NOT_FOUND";

        ErrorResponse error = new ErrorResponse(message, details, ex.getStatusCode(), errorCode);
        return new ResponseEntity<>(error, HttpStatus.valueOf(ex.getStatusCode()));
    }
}

