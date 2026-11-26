package com.edumanager;

import java.util.List;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/students")
public class StudentController {
    private final StudentService service;

    public StudentController(StudentService service) { this.service = service; }

    @GetMapping
    public List<Student> list() { return service.getAllStudents(); }

    @GetMapping("/{id}")
    public Student get(@PathVariable Long id) { return service.getStudentById(id); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Student create(@Valid @RequestBody StudentInput input) { return service.createStudent(input); }

    @PutMapping("/{id}")
    public Student update(@PathVariable Long id, @Valid @RequestBody StudentInput input) {
        return service.updateStudent(id, input);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) { service.deleteStudent(id); }
}
