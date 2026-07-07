package com.visitor.management.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportDTO {

    private Long totalVisitors;

    private Long registeredVisitors;

    private Long checkedInVisitors;

    private Long checkedOutVisitors;

    private Long cancelledVisitors;

}