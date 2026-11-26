package com.edumanager;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SampleData {
    @Bean
    CommandLineRunner seedStudents(StudentService students) {
        return args -> students.createStudent(new StudentInput(
                "Alice", "Dupont", "alice@example.com", "Informatique"));
    }
}
