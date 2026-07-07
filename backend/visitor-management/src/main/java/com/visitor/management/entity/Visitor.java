package com.visitor.management.entity;

import com.visitor.management.enums.VisitPurpose;
import com.visitor.management.enums.VisitorStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "visitor")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Visitor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "visit_id", unique = true, nullable = false)
    private String visitId;

    @Column(name = "host_employee_id", nullable = false)
    private String hostEmployeeId;

    @Column(name = "host_employee_name", nullable = false)
    private String hostEmployeeName;

    @Column(name = "visitor_name", nullable = false)
    private String visitorName;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(name = "government_id", nullable = false, unique = true)
    private String governmentId;

    @Column(name = "mobile_number", nullable = false)
    private String mobileNumber;

    @Column(name = "email")
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VisitPurpose purpose;

    @Column(name = "visit_date", nullable = false)
    private LocalDate visitDate;

    @Column(name = "expected_in_time", nullable = false)
    private LocalTime expectedInTime;

    @Column(name = "expected_out_time", nullable = false)
    private LocalTime expectedOutTime;

    @Column(name = "number_of_visitors", nullable = false)
    private Integer numberOfVisitors;

    @Column(length = 500)
    private String remarks;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VisitorStatus status;

    @Column(name = "qr_path")
    private String qrPath;

    @Column(name = "check_in_time")
    private LocalDateTime checkInTime;

    @Column(name = "check_out_time")
    private LocalDateTime checkOutTime;

    @Column(nullable = false)
    private Boolean cancelled;

    @Column(nullable = false)
    private Boolean active;

    @Column(name = "created_date")
    private LocalDateTime createdDate;

}