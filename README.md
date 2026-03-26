# 💼 Employability Management System - Backend

This is the core API for the Job Vacancy Management System, built with **NestJS**, **TypeORM**, and **PostgreSQL**. The system provides a secure and scalable infrastructure for managing recruiters (Gestores), administrators, and applicants (Coders).

---

## 🏗️ Architecture & Stack

* **Framework:** [NestJS](https://nestjs.com/) (Node.js)
* **Database:** [PostgreSQL](https://www.postgresql.org/)
* **ORM:** [TypeORM](https://typeorm.io/)
* **Language:** TypeScript
* **Validation:** Class-Validator & Class-Transformer
* **Security:** Passport JWT & Custom API Key Guards

---

## 🔒 Security Layers

The API implements a double-gate security system:

1.  **Global API Key:** Every request must include an `x-api-key` header, ensuring only authorized clients (like our React Frontend) can communicate with the server.
2.  **JWT Authentication:** Users receive a Bearer Token upon login, which encodes their Identity and Role.
3.  **RBAC (Role-Based Access Control):**
    * `ADMIN`: Full system control and user management.
    * `GESTOR`: Can create, edit, and manage job vacancies.
    * `CODER`: Can browse vacancies and apply to them.

---

## 🚀 Key Business Logic (Applications)

The system handles complex hiring constraints automatically:
* **Vacancy Capacity:** Applications are rejected if the vacancy's `maxApplicants` limit is reached.
* **Unique Application:** A Coder cannot apply more than once to the same vacancy.
* **Active Status:** Only vacancies marked as `isActive: true` are open for applications.



---

## 🛠️ Installation & Setup

### 1. Prerequisites
* Node.js (v18+)
* Docker & Docker Compose (for PostgreSQL)

### 2. Environment Variables
Create a `.env` file in the root:
```env
DB_HOST=db
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=riwi_password
DB_DATABASE=riwi_jobs
JWT_SECRET=super_secret_jwt_key
API_KEY=riwi_master_key_2024
```

### 3. Installation
```Bash
npm install
```
### 4. Running the Project


#### Start the database
```
docker-compose up -d
```
#### Start NestJS in dev mode
```
npm run start:dev
```
---
## 🧪 Testing & Quality

The project includes unit tests for core services to ensure business rule compliance.

Coverage: >40% (Meets assessment requirements).

Key Tests: Vacancy creation, User Authentication, and Application Limit validation.

```Bash

# Run unit tests
npm run test

# Check coverage report
npm run test:cov
```
---
## 📖 API Documentation
The API is fully documented with Swagger. You can explore the endpoints, DTOs, and security requirements at: http://localhost:3000/api/docs

---

## 📦 Project Structure

```
src/
├── auth/           # Login, Register, JWT & API Key Guards
├── users/          # User Management & Roles
├── vacancy/        # Job Postings Logic
├── applications/   # Applicant Management (Core Business Logic)
├── common/         # Global Interceptors & Exception Filters
└── seeders/        # Automated Data Population (Admin, Gestor, Coder)
```