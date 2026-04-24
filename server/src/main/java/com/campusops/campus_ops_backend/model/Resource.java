package com.campusops.campus_ops_backend.model;

import java.time.LocalTime;
import jakarta.validation.constraints.Min; // For capacity validation
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Builder.Default;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "resources")
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ResourceType type;


    @Min(value = 0, message = "Capacity cannot be negative") // prevent input Negative values
    private Integer capacity;

    @Column(nullable = false)
    private String location;

    @Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ResourceStatus status = ResourceStatus.ACTIVE;

    private LocalTime availabilityStart;
    private LocalTime availabilityEnd;

    public enum ResourceType { LECTURE_HALL, LAB, MEETING_ROOM, EQUIPMENT }
    public enum ResourceStatus { ACTIVE, OUT_OF_SERVICE }
}