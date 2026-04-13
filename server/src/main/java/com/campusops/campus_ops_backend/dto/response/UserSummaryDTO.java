package com.campusops.campus_ops_backend.dto.response;

import com.campusops.campus_ops_backend.model.User;

public record UserSummaryDTO(
        Long id,
        String name,
        String email,
        String pictureUrl,
        User.Role role) {

        public static UserSummaryDTO from(User user) {
                return new UserSummaryDTO(
                                user.getId(),
                                user.getName(),
                                user.getEmail(),
                                user.getPictureUrl(),
                                user.getRole());
        }
}
