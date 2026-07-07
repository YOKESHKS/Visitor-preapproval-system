package com.visitor.management.entity;

import lombok.*;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "registration_freeze")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegistrationFreeze {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate freezeDate;

    @Column(nullable = false)
    private String reason;

    @Column(nullable = false)
    private Boolean active;

    private LocalDateTime createdDate;

}