package com.visitor.management.dto;

import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegistrationFreezeDTO {

    private Long id;

    private LocalDate freezeDate;

    private String reason;

    private Boolean active;

}