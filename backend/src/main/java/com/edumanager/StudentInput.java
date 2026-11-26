package com.edumanager;

import jakarta.validation.constraints.*;

public record StudentInput(
        @NotBlank String firstName,
        @NotBlank String lastName,
        @NotBlank @Email String email,
        @NotBlank String major
) {}
