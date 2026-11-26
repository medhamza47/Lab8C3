package com.edumanager;

import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class StudentService {
    private final StudentRepository repository;

    public StudentService(StudentRepository repository) { this.repository = repository; }

    @Transactional(readOnly = true)
    public List<Student> getAllStudents() {
        List<Student> students = repository.findAll(Sort.by("id"));

        return students;
    }

    @Transactional(readOnly = true)
    public Student getStudentById(Long id) {
        Student student = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Étudiant introuvable"));

        return student;
    }

    public Student createStudent(StudentInput input) { return repository.save(apply(new Student(), input)); }

    public Student updateStudent(Long id, StudentInput input) {
        return repository.save(apply(getStudentById(id), input));
    }

    public void deleteStudent(Long id) { repository.delete(getStudentById(id)); }

    private Student apply(Student student, StudentInput input) {
        student.setFirstName(input.firstName().strip());
        student.setLastName(input.lastName().strip());
        student.setEmail(input.email().strip());
        student.setMajor(input.major().strip());
        return student;
    }
}
