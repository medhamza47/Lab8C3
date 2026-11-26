package com.edumanager;

import jakarta.persistence.*;

@Entity
@Table(name = "students")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String major;

    public Long getId() { return id; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String value) { firstName = value; }

    public String getLastName() { return lastName; }
    public void setLastName(String value) { lastName = value; }

    public String getEmail() { return email; }
    public void setEmail(String value) { email = value; }

    public String getMajor() { return major; }
    public void setMajor(String value) { major = value; }
}
