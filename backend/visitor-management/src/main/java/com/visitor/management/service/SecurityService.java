package com.visitor.management.service;

import com.visitor.management.dto.CheckInOutDTO;
import com.visitor.management.dto.VisitorDTO;

import java.util.List;

public interface SecurityService {

    VisitorDTO approveVisitorRequest(String visitId);

    List<VisitorDTO> getTodayVisitors();

    List<VisitorDTO> getVisitorsInside();

    CheckInOutDTO checkIn(String visitId);

    CheckInOutDTO checkOut(String visitId);

}