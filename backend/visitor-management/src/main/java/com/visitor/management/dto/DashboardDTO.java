package com.visitor.management.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardDTO {

    private Long totalVisitors;

    private Long todayVisitors;

    private Long checkedInVisitors;

    private Long checkedOutVisitors;

    private Long cancelledVisitors;

    private Long activeVisitors;

}