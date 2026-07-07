package com.visitor.management.repository;

import com.visitor.management.entity.Visitor;
import com.visitor.management.enums.VisitorStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface VisitorRepository extends JpaRepository<Visitor, Long> {

    Optional<Visitor> findByVisitId(String visitId);


    boolean existsByGovernmentId(String governmentId);

    List<Visitor> findByHostEmployeeId(String employeeId);

    List<Visitor> findByVisitDate(LocalDate visitDate);

    List<Visitor> findByStatus(VisitorStatus status);


    long countByVisitDate(LocalDate visitDate);

    long countByStatus(VisitorStatus status);

    long countByCancelled(Boolean cancelled);


    List<Visitor> findByCancelledFalse();

    List<Visitor> findByActiveTrue();

}