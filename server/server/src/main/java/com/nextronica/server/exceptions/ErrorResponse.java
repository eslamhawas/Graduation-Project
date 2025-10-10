// First, let's create the ErrorResponse class

package com.nextronica.server.exceptions;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;


import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Data
public class ErrorResponse {
    private LocalDateTime timestamp;
    private int status;
    private String error;
    private String message;
    private String path;
    private String method;
    private Map<String, String> fieldErrors;

    // Default constructor
    public ErrorResponse() {
        this.timestamp = LocalDateTime.now();
    }

    // Constructor with basic error information
    public ErrorResponse(int status, String error, String message) {
        this();
        this.status = status;
        this.error = error;
        this.message = message;
    }

    // Constructor with all fields
    public ErrorResponse(int status, String error, String message, String path, String method) {
        this(status, error, message);
        this.path = path;
        this.method = method;
    }

    // Add a single field error
    public void addFieldError(String field, String errorMessage) {
        if (fieldErrors == null) {
            fieldErrors = new HashMap<>();
        }
        fieldErrors.put(field, errorMessage);
    }

    // Add multiple field errors
    public void addFieldErrors(Map<String, String> errors) {
        if (fieldErrors == null) {
            fieldErrors = new HashMap<>();
        }
        fieldErrors.putAll(errors);
    }

}