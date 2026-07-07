# Visitor Pre-Approval System

The Visitor Pre-Approval System is a full-stack web application developed using React, Spring Boot, and PostgreSQL to simplify visitor management within an organization. It enables employees to register visitor requests, security personnel to manage visitor entry and exit, and provides a centralized platform for maintaining visitor records efficiently.

## Clone the Repository

```bash
git clone https://github.com/YOKESHKS/Visitor-preapproval-system.git
cd Visitor-preapproval-system
```

## Backend Setup

```bash
cd backend/visitor-management
```

Update the database configuration in:

```
src/main/resources/application.properties
```

Run the backend:

```bash
mvn spring-boot:run
```

## Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

The application will be available at:

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:8080
```
