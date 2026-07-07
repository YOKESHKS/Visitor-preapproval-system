package com.visitor.management.service.impl;

import com.visitor.management.dto.ReportDTO;
import com.visitor.management.enums.VisitorStatus;
import com.visitor.management.repository.VisitorRepository;
import com.visitor.management.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final VisitorRepository repository;

    @Override
    public ReportDTO generateReport() {

        return ReportDTO.builder()

                .totalVisitors(repository.count())

                .registeredVisitors(
                        repository.countByStatus(VisitorStatus.REGISTERED)
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

                .build();

    }

}