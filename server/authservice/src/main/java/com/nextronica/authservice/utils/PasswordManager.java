package com.nextronica.authservice.utils;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Arrays;
import java.util.Base64;

public class PasswordManager {

    private static final int SALT_LENGTH = 16;

    /**
     * Generates a salt and creates a hash of the password
     *
     * @param password The password to hash
     * @return An object containing both the hash and salt
     */
    public static HashResult hashPassword(String password) throws NoSuchAlgorithmException {

        SecureRandom random = new SecureRandom();
        byte[] salt = new byte[SALT_LENGTH];
        random.nextBytes(salt);

        MessageDigest md = MessageDigest.getInstance("SHA-256");
        md.update(salt);
        byte[] hashedPassword = md.digest(password.getBytes());

        String hashString = Base64.getEncoder().encodeToString(hashedPassword);
        String saltString = Base64.getEncoder().encodeToString(salt);

        return new HashResult(hashString, saltString);
    }

    /**
     * Verifies a password against a hash and salt
     *
     * @param password The password to verify
     * @param hash     The stored hash
     * @param salt     The stored salt
     * @return true if the password matches, false otherwise
     */
    public static boolean verifyPassword(String password, String hash, String salt)
            throws NoSuchAlgorithmException {
        byte[] saltBytes = Base64.getDecoder().decode(salt);
        byte[] storedHash = Base64.getDecoder().decode(hash);


        MessageDigest md = MessageDigest.getInstance("SHA-256");
        md.update(saltBytes);
        byte[] hashedPassword = md.digest(password.getBytes());

        return Arrays.equals(hashedPassword, storedHash);
    }

    /**
     * Class to hold the hash and salt result
     */

    public record HashResult(String hash, String salt) {

    }
}
