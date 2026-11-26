package com.edumanager;

import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final StudentRepository students;

    public AdminController(StudentRepository students) { this.students = students; }

    @GetMapping("/summary")
    public Map<String, Long> summary() { return Map.of("students", students.count()); }
}
