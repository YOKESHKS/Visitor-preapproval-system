package com.visitor.management.repository;

import com.visitor.management.entity.RegistrationFreeze;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface RegistrationFreezeRepository extends JpaRepository<RegistrationFreeze,Long> {

    Optional<RegistrationFreeze> findByFreezeDate(LocalDate freezeDate);

    boolean existsByFreezeDate(LocalDate freezeDate);

}