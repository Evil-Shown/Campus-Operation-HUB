package com.campusops.campus_ops_backend.config;

import java.time.LocalTime;
import java.util.List;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import com.campusops.campus_ops_backend.model.Resource;
import com.campusops.campus_ops_backend.model.ResourceStatus;
import com.campusops.campus_ops_backend.model.ResourceType;
import com.campusops.campus_ops_backend.repository.ResourceRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
@SuppressWarnings("null")
public class DataInitializer implements ApplicationRunner {

    private final ResourceRepository resourceRepository;

    @Override
    public void run(ApplicationArguments args) {
        if (resourceRepository.count() > 0) {
            return;
        }

        Resource lectureHall = new Resource();
        lectureHall.setName("Lecture Hall A");
        lectureHall.setType(ResourceType.LECTURE_HALL);
        lectureHall.setSeatingCapacity(120);
        lectureHall.setPhysicalLocation("Main Library Building");
        lectureHall.setStatus(ResourceStatus.ACTIVE);
        lectureHall.setAvailableFrom(LocalTime.of(8, 0));
        lectureHall.setAvailableTo(LocalTime.of(19, 0));

        Resource lab101 = new Resource();
        lab101.setName("Lab 101");
        lab101.setType(ResourceType.LAB);
        lab101.setSeatingCapacity(30);
        lab101.setPhysicalLocation("Science Block");
        lab101.setStatus(ResourceStatus.ACTIVE);
        lab101.setAvailableFrom(LocalTime.of(8, 0));
        lab101.setAvailableTo(LocalTime.of(18, 0));

        Resource meetingRoomB = new Resource();
        meetingRoomB.setName("Meeting Room B");
        meetingRoomB.setType(ResourceType.MEETING_ROOM);
        meetingRoomB.setSeatingCapacity(20);
        meetingRoomB.setPhysicalLocation("Administration Tower");
        meetingRoomB.setStatus(ResourceStatus.ACTIVE);
        meetingRoomB.setAvailableFrom(LocalTime.of(9, 0));
        meetingRoomB.setAvailableTo(LocalTime.of(17, 0));

        resourceRepository.saveAll(List.of(lectureHall, lab101, meetingRoomB));
    }
}
