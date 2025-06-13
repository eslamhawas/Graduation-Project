package com.nextronica.server.utils;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import javax.crypto.SecretKey;


/**
 * Utility class for JWT operations including creation, validation, and claims extraction.
 */
@Component
public class JwtUtil {

    private final SecretKey secret = Keys.hmacShaKeyFor("m7z4tD8wK3y6B9vX2c5fR7hE1gH4jL8pO0qW9eA6uI5nT3xV".getBytes(StandardCharsets.UTF_8));


    private static final long JWT_TOKEN_VALIDITY = 60 * 60 * 1000;

    /**
     * Extracts username from token
     *
     * @param token JWT token
     * @return username
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extracts expiration date from token
     *
     * @param token JWT token
     * @return expiration date
     */
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Extracts a specific claim from the token using the provided claims resolver
     *
     * @param token JWT token
     * @param claimsResolver function to resolve the specific claim
     * @return the resolved claim
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Extracts all claims from token
     *
     * @param token JWT token
     * @return all claims
     */
    public Claims extractAllClaims(String token) {
        if (token.contains("Bearer")) {
            token = token.replace("Bearer ", "");
        }
        return Jwts.parserBuilder()
                .setSigningKey(secret)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * Checks if token is expired
     *
     * @param token JWT token
     * @return true if token is expired, false otherwise
     */
    private Boolean isTokenExpired(String token) {
        final Date expiration = extractExpiration(token);
        return expiration.before(new Date());
    }

    /**
     * Generates token for user
     *
     * @param username user identifier
     * @return JWT token
     */
    public String generateToken(String username) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, username);
    }

    /**
     * Generates token with extra claims
     *
     * @param extraClaims additional claims to include
     * @param username user identifier
     * @return JWT token
     */
    public String generateToken(Map<String, Object> extraClaims, String username) {
        return createToken(extraClaims, username);
    }

    /**
     * Creates a token with provided claims and subject
     *
     * @param claims claims to include in token
     * @param subject token subject (typically username)
     * @return JWT token
     */
    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + JWT_TOKEN_VALIDITY))
                .signWith(secret, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Validates token including signature verification
     *
     * @param token JWT token
     * @param username user identifier to validate against
     * @return true if token is valid, false otherwise
     */
    public Boolean validateToken(String token, String username) {
        try {
            if (token.contains("Bearer")){
                token = token.replace("Bearer ","");
            }
            final Claims claims = extractAllClaims(token);

            final String extractedUsername = claims.getSubject();

            final Date expiration = claims.getExpiration();
            final boolean isExpired = expiration.before(new Date());


            return extractedUsername.equals(username) && !isExpired;
        } catch (SignatureException | MalformedJwtException e) {
            System.out.println("Invalid JWT signature or format: " + e.getMessage());
            return false;
        } catch (ExpiredJwtException e) {
            System.out.println("JWT token is expired: " + e.getMessage());
            return false;
        } catch (JwtException e) {
            System.out.println("Invalid JWT: " + e.getMessage());
            return false;
        }
    }

    /**
     * Validates token including signature verification
     *
     * @param token JWT token
     * @return true if token is valid, false otherwise
     */
    public Boolean validateToken(String token) {
        try {
            if (token.contains("Bearer")){
                token = token.replace("Bearer ","");
            }
            final Claims claims = extractAllClaims(token);

            final Date expiration = claims.getExpiration();
            final boolean isExpired = expiration.before(new Date());

            return !isExpired;
        } catch (SignatureException | MalformedJwtException e) {
            System.out.println("Invalid JWT signature or format: " + e.getMessage());
            return false;
        } catch (ExpiredJwtException e) {
            System.out.println("JWT token is expired: " + e.getMessage());
            return false;
        } catch (JwtException e) {
            System.out.println("Invalid JWT: " + e.getMessage());
            return false;
        }
    }

    /**
     * Creates a token with custom expiration time
     *
     * @param claims claims to include in token
     * @param subject token subject (typically username)
     * @param expirationTimeMs expiration time in milliseconds
     * @return JWT token
     */
    public String createTokenWithCustomExpiration(Map<String, Object> claims, String subject, long expirationTimeMs) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expirationTimeMs))
                .signWith(secret, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Refreshes an existing token
     *
     * @param token existing JWT token
     * @return new JWT token with updated expiration
     */
    public String refreshToken(String token) {
        final Claims claims = extractAllClaims(token);
        final String subject = claims.getSubject();
        return createToken(new HashMap<>(claims), subject);
    }

    public String extractToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    public long extractId (String token) {
        Claims claims = extractAllClaims(token);
        return claims.get("id", Long.class);
    }
}
