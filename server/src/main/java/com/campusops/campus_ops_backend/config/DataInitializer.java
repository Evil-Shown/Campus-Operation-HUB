package com.campusops.campus_ops_backend.config;

import java.time.LocalTime;
import java.util.List;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import com.campusops.campus_ops_backend.model.Resource;
import com.campusops.campus_ops_backend.repository.ResourceRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final ResourceRepository resourceRepository;

    @Override
    public void run(ApplicationArguments args) {
        if (resourceRepository.count() > 0) {
            return;
        }

        Resource lectureHall = new Resource();
        lectureHall.setName("Lecture Hall A");
        lectureHall.setType(Resource.ResourceType.LECTURE_HALL);
        lectureHall.setCapacity(120);
        lectureHall.setLocation("Main Library Building");
        lectureHall.setStatus(Resource.ResourceStatus.ACTIVE);
        lectureHall.setAvailabilityStart(LocalTime.of(8, 0));
        lectureHall.setAvailabilityEnd(LocalTime.of(19, 0));

        Resource lab101 = new Resource();
        lab101.setName("Lab 101");
        lab101.setType(Resource.ResourceType.LAB);
        lab101.setCapacity(30);
        lab101.setLocation("Science Block");
        lab101.setStatus(Resource.ResourceStatus.ACTIVE);
        lab101.setAvailabilityStart(LocalTime.of(8, 0));
        lab101.setAvailabilityEnd(LocalTime.of(18, 0));

        Resource meetingRoomB = new Resource();
        meetingRoomB.setName("Meeting Room B");
        meetingRoomB.setType(Resource.ResourceType.MEETING_ROOM);
        meetingRoomB.setCapacity(20);
        meetingRoomB.setLocation("Administration Tower");
        meetingRoomB.setStatus(Resource.ResourceStatus.ACTIVE);
        meetingRoomB.setAvailabilityStart(LocalTime.of(9, 0));
        meetingRoomB.setAvailabilityEnd(LocalTime.of(17, 0));

        resourceRepository.saveAll(List.of(lectureHall, lab101, meetingRoomB));
    }
}
