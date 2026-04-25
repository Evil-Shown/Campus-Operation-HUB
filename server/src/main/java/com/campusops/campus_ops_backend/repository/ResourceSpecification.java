package com.campusops.campus_ops_backend.repository;

import com.campusops.campus_ops_backend.model.Resource;
import com.campusops.campus_ops_backend.model.ResourceStatus;
import com.campusops.campus_ops_backend.model.ResourceType;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

public class ResourceSpecification {
    public static Specification<Resource> filterResources(
            ResourceType type, String locationKeyword, Integer minCapacity, boolean hideOutOfService) {
        
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (type != null) {
                predicates.add(criteriaBuilder.equal(root.get("type"), type));
            }
            if (StringUtils.hasText(locationKeyword)) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("physicalLocation")), 
                        "%" + locationKeyword.toLowerCase() + "%"));
            }
            if (minCapacity != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("seatingCapacity"), minCapacity));
            }
            if (hideOutOfService) {
                predicates.add(criteriaBuilder.notEqual(root.get("status"), ResourceStatus.OUT_OF_SERVICE));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}