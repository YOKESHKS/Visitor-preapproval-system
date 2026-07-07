package com.visitor.management.service.impl;

import com.visitor.management.dto.DashboardDTO;
import com.visitor.management.enums.VisitorStatus;
import com.visitor.management.repository.VisitorRepository;
import com.visitor.management.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final VisitorRepository repository;

    @Override
    public DashboardDTO getDashboard() {

        return DashboardDTO.builder()
                .totalVisitors(repository.count())

                .todayVisitors(
                        repository.countByVisitDate(LocalDate.now())
                )

                .checkedInVisitors(
                        repository.countByStatus(VisitorStatus.CHECKED_IN)
                )

                .checkedOutVisitors(
                        repository.countByStatus(VisitorStatus.CHECKED_OUT)
                )

                .cancelledVisitors(
                        repository.countByCancelled(true)
                )

                // FIX: Count only visitors who are actually checked in.
                // Earlier it was countByActive(true), which included all
                // registered visitors.
                .activeVisitors(
                        repository.countByStatus(VisitorStatus.CHECKED_IN)
                )

                .build();
    }
}