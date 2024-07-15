package de.neuefische.backend.user;

public record AppUser(
        String id,
        String username,
        String role
) {
}
