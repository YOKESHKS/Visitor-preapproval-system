package com.visitor.management.dto;

import com.visitor.management.enums.VisitPurpose;
import com.visitor.management.enums.VisitorStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VisitorDTO {

    private Long id;

    private String visitId;

    private String hostEmployeeId;

    private String hostEmployeeName;

    private String visitorName;

    private String companyName;

    private String governmentId;

    private String mobileNumber;

    private String email;

    private VisitPurpose purpose;

    private LocalDate visitDate;

    private LocalTime expectedInTime;

    private LocalTime expectedOutTime;

    private Integer numberOfVisitors;

    private String remarks;

    private VisitorStatus status;

    private String qrPath;

    private LocalDateTime checkInTime;

    private LocalDateTime checkOutTime;

    private Boolean cancelled;

    private Boolean active;

}