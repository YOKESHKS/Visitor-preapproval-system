package com.visitor.management.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum Role {
    EMPLOYEE,
    SECURITY,
    ADMIN;

    @JsonCreator
    public static Role fromString(String value) {
        if (value == null) return null;

        // Clean up the string by removing the "ROLE_" prefix if present
        String cleanedValue = value.replace("ROLE_", "").toUpperCase().trim();

        try {
            return Role.valueOf(cleanedValue);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Unknown role: " + value +
                    ". Accepted values are: [EMPLOYEE, SECURITY, ADMIN] or [ROLE_EMPLOYEE, ROLE_SECURITY, ROLE_ADMIN]");
        }
    }
}