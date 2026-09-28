package com.notesshare.util;

import com.notesshare.entity.Role;
import com.notesshare.security.CustomUserDetails;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

public final class SecurityUtil {

    private SecurityUtil() {
    }

    public static Optional<CustomUserDetails> getCurrentUserDetails() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails userDetails) {
            return Optional.of(userDetails);
        }
        return Optional.empty();
    }

    public static Optional<String> getCurrentUserEmail() {
        return getCurrentUserDetails().map(CustomUserDetails::getEmail);
    }

    public static Optional<Long> getCurrentUserId() {
        return getCurrentUserDetails().map(CustomUserDetails::getId);
    }

    public static boolean isCurrentUserAdmin() {
        return getCurrentUserDetails()
                .map(user -> user.getRole() == Role.ADMIN)
                .orElse(false);
    }
}
