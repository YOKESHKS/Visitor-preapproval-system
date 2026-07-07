# Visitor Pre-Approval System

The Visitor Pre-Approval System is a full-stack web application developed to simplify visitor registration and access management within an organization. Built using React, Spring Boot, Java, and PostgreSQL, the system enables employees to pre-register visitors while allowing security personnel to approve requests, perform check-in/check-out operations, and monitor visitor records through a centralized dashboard.

---

## Tech Stack

### Frontend
- React.js
- Material UI (MUI)
- Axios
- React Router DOM
- JavaScript
- HTML5
- CSS3

### Backend
- Java 8
- Spring Boot 2.x
- Spring Security
- Spring Data JPA
- Maven

### Database
- PostgreSQL
- pgAdmin 4

### Development Tools
- Visual Studio Code
- IntelliJ IDEA
- Postman
- Git & GitHub

---

## Clone the Repository

```bash
git clone https://github.com/YOKESHKS/Visitor-preapproval-system.git
cd Visitor-preapproval-system
```

---

## Backend Setup

```bash
cd backend/visitor-management
```

Configure your PostgreSQL database in:

```text
src/main/resources/application.properties
```

Run the backend:

```bash
mvn spring-boot:run
```

Backend runs at:

```text
http://localhost:8080
```

---

## Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

Frontend runs at:

```text
http://localhost:3000
```
