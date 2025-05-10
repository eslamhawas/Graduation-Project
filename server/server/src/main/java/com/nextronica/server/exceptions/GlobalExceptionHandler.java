package com.nextronica.server.exceptions;

import com.nextronica.server.exceptions.customExceptions.IllegalAgeException;
import com.nextronica.server.exceptions.customExceptions.NoSuchUserException;
import com.nextronica.server.exceptions.customExceptions.PasswordMismatchException;
import com.nextronica.server.exceptions.customExceptions.UserAlreadyExistsException;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Set;

@ControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);


    private ErrorResponse createErrorResponse(HttpServletRequest request, HttpStatus status, String error, String message) {
        return new ErrorResponse(
                status.value(),
                error,
                message,
                request.getRequestURI(),
                request.getMethod()
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(
            MethodArgumentNotValidException ex, HttpServletRequest request) {

        log.error("Validation error occurred: {}", ex.getMessage());

        ErrorResponse errorResponse = createErrorResponse(
                request,
                HttpStatus.BAD_REQUEST,
                "Validation Error",
                "There were validation errors in your request"
        );

        BindingResult result = ex.getBindingResult();
        for (FieldError error : result.getFieldErrors()) {
            errorResponse.addFieldError(error.getField(), error.getDefaultMessage());
        }

        // Handle global errors
        for (ObjectError error : result.getGlobalErrors()) {
            errorResponse.addFieldError(error.getObjectName(), error.getDefaultMessage());
        }

        return ResponseEntity.badRequest().body(errorResponse);
    }

    @ExceptionHandler(PasswordMismatchException.class)
    public ResponseEntity<ErrorResponse> handlePasswordMismatch(
            PasswordMismatchException ex, HttpServletRequest request) {

        log.error("Password mismatch: {}", ex.getMessage());

        ErrorResponse errorResponse = createErrorResponse(
                request,
                HttpStatus.BAD_REQUEST,
                "Password Error",
                ex.getMessage()
        );
        errorResponse.addFieldError("password", ex.getMessage());

        return ResponseEntity.badRequest().body(errorResponse);
    }

    @ExceptionHandler(IllegalAgeException.class)
    public ResponseEntity<ErrorResponse> handleIllegalAgeException(
            IllegalAgeException ex, HttpServletRequest request) {

        log.error("Illegal age: {}", ex.getMessage());

        ErrorResponse errorResponse = createErrorResponse(
                request,
                HttpStatus.BAD_REQUEST,
                "Age Validation Error",
                ex.getMessage()
        );
        errorResponse.addFieldError("age", ex.getMessage());

        return ResponseEntity.badRequest().body(errorResponse);
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleUserAlreadyExists(
            UserAlreadyExistsException ex, HttpServletRequest request) {

        log.error("User already exists: {}", ex.getMessage());

        ErrorResponse errorResponse = createErrorResponse(
                request,
                HttpStatus.CONFLICT,
                "User Creation Error",
                ex.getMessage()
        );
        errorResponse.addFieldError("user", ex.getMessage());

        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
    }

    @ExceptionHandler(NoSuchUserException.class)
    public ResponseEntity<ErrorResponse> handleNoSuchUser(
            NoSuchUserException ex, HttpServletRequest request) {

        log.error("User not found: {}", ex.getMessage());

        ErrorResponse errorResponse = createErrorResponse(
                request,
                HttpStatus.NOT_FOUND,
                "User Not Found",
                ex.getMessage()
        );

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> handleConstraintViolationException(
            ConstraintViolationException ex, HttpServletRequest request) {

        log.error("Constraint violation: {}", ex.getMessage());

        ErrorResponse errorResponse = createErrorResponse(
                request,
                HttpStatus.BAD_REQUEST,
                "Validation Error",
                "There were validation errors in your request"
        );

        Set<ConstraintViolation<?>> violations = ex.getConstraintViolations();
        for (ConstraintViolation<?> violation : violations) {
            String propertyPath = violation.getPropertyPath().toString();
            String fieldName = propertyPath.contains(".") ?
                    propertyPath.substring(propertyPath.lastIndexOf('.') + 1) : propertyPath;
            errorResponse.addFieldError(fieldName, violation.getMessage());
        }

        return ResponseEntity.badRequest().body(errorResponse);
    }

    @ExceptionHandler(org.hibernate.exception.ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> handleDatabaseConstraintViolationException(
            org.hibernate.exception.ConstraintViolationException ex, HttpServletRequest request) {

        log.error("Database constraint violation: {}", ex.getMessage());

        ErrorResponse errorResponse = createErrorResponse(
                request,
                HttpStatus.BAD_REQUEST,
                "Database Constraint Error",
                "A database constraint was violated"
        );
        errorResponse.addFieldError("databaseError", ex.getMessage());

        return ResponseEntity.badRequest().body(errorResponse);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgumentException(
            IllegalArgumentException ex, HttpServletRequest request) {

        log.error("Illegal argument: {}", ex.getMessage());

        ErrorResponse errorResponse = createErrorResponse(
                request,
                HttpStatus.BAD_REQUEST,
                "Invalid Argument",
                ex.getMessage()
        );

        return ResponseEntity.badRequest().body(errorResponse);
    }

    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<ErrorResponse> handleExpiredJwtException(
            ExpiredJwtException ex, HttpServletRequest request) {

        log.error("JWT token expired: {}", ex.getMessage());

        ErrorResponse errorResponse = createErrorResponse(
                request,
                HttpStatus.UNAUTHORIZED,
                "Authentication Error",
                "JWT token has expired"
        );

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
    }

    @ExceptionHandler(io.jsonwebtoken.security.SignatureException.class)
    public ResponseEntity<ErrorResponse> handleSignatureException(
            io.jsonwebtoken.security.SignatureException ex, HttpServletRequest request) {

        log.error("JWT signature error: {}", ex.getMessage());

        ErrorResponse errorResponse = createErrorResponse(
                request,
                HttpStatus.UNAUTHORIZED,
                "Authentication Error",
                "Invalid JWT signature"
        );

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
    }
    @ExceptionHandler(io.jsonwebtoken.MalformedJwtException.class)
    public ResponseEntity<ErrorResponse> handleMalformedTokenException(
            io.jsonwebtoken.MalformedJwtException ex, HttpServletRequest request) {

        log.error("JWT Malformed error: {}", ex.getMessage());

        ErrorResponse errorResponse = createErrorResponse(
                request,
                HttpStatus.UNAUTHORIZED,
                "Authentication Error",
                "Malformed JWT Token"
        );

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
    }


    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(
            Exception ex, HttpServletRequest request) {

        log.error("Unhandled exception occurred", ex);

        ErrorResponse errorResponse = createErrorResponse(
                request,
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Server Error",
                "An unexpected error occurred"
        );

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
}