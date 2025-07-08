# 🧩 Database Schema – Hospital Management System

This document outlines the complete relational schema for the Hospital Management System (HMS), including core tables, field types. The design is scalable, normalized, and tailored for enterprise-level applications.

---

## 📁 1. Users & Roles

### `users`
Handles authentication and role-based access for all system users.

| Field          | Type       | Description                    |
|----------------|------------|--------------------------------|
| `id`           | UUID / INT | Primary key                    |
| `username`     | VARCHAR    | Unique login identifier        |
| `email`        | VARCHAR    | Unique user email              |
| `password`     | TEXT       | Hashed password                |
| `role`         | ENUM       | `admin`, `doctor`, `patient`   |
| `creation_date`| TIMESTAMP  | Account creation date          |

---

## 👨‍⚕️ 2. Doctors & Patients

### `doctors`
Represents doctors with professional and contact information.

| Field        | Type     | Description                  |
|--------------|----------|------------------------------|
| `id`         | INT      | Primary key                  |
| `user_id`    | INT      | FK → `users(id)`             |
| `full_name`  | VARCHAR  | Doctor’s full name           |
| `specialty`  | VARCHAR  | Medical specialization       |
| `phone`      | VARCHAR  | Contact number               |
| `bio`        | TEXT     | Optional profile description |
| `status`     | BOOLEAN  | Active / inactive            |

### `patients`
Stores patient profiles linked to user accounts.

| Field             | Type     | Description                  |
|-------------------|----------|------------------------------|
| `id`              | INT      | Primary key                  |
| `user_id`         | INT      | FK → `users(id)`             |
| `full_name`       | VARCHAR  | Patient’s full name          |
| `date_of_birth`   | DATE     | Birthdate                    |
| `gender`          | VARCHAR  | Male / Female / Other        |
| `phone`           | VARCHAR  | Contact number               |
| `address`         | TEXT     | Address                      |
| `insurance_number`| VARCHAR  | Health insurance number      |

---

## 📅 3. Appointments

### `appointments`
Schedules meetings between patients and doctors.

| Field       | Type      | Description                                 |
|-------------|-----------|---------------------------------------------|
| `id`        | INT       | Primary key                                 |
| `doctor_id` | INT       | FK → `doctors(id)`                          |
| `patient_id`| INT       | FK → `patients(id)`                         |
| `date_time` | DATETIME  | Scheduled date and time                     |
| `status`    | ENUM      | `pending`, `confirmed`, `done`, `cancelled` |
| `notes`     | TEXT      | Optional appointment notes                  |

---

## 📝 4. Medical Records

### `medical_records`
Logs consultation data, diagnoses, and prescriptions.

| Field          | Type      | Description                      |
|----------------|-----------|----------------------------------|
| `id`           | INT       | Primary key                      |
| `patient_id`   | INT       | FK → `patients(id)`              |
| `doctor_id`    | INT       | FK → `doctors(id)`               |
| `diagnosis`    | TEXT      | Medical diagnosis and notes      |
| `prescription` | TEXT      | Treatment and medicine info      |
| `creation_date`| TIMESTAMP | Date of consultation             |

---

## 💳 5. Billing & Payments

### `invoices`
Represents the financial statement for a patient's treatment.

| Field        | Type      | Description                      |
|--------------|-----------|----------------------------------|
| `id`         | INT       | Primary key                      |
| `patient_id` | INT       | FK → `patients(id)`              |
| `amount`     | DECIMAL   | Total bill amount                |
| `date_issued`| TIMESTAMP | Date of invoice generation       |
| `paid`       | BOOLEAN   | Payment status                   |

### `payments`
Logs transactions made against invoices.

| Field         | Type      | Description                  |
|---------------|-----------|------------------------------|
| `id`          | INT       | Primary key                  |
| `invoice_id`  | INT       | FK → `invoices(id)`          |
| `method`      | VARCHAR   | e.g., cash, card, insurance  |
| `paid_date`   | TIMESTAMP | Payment date                 |
| `amount_paid` | DECIMAL   | Actual payment received      |

---

### `files`
Handles document uploads (e.g., scans, test results).

| Field        | Type      | Description                      |
|--------------|-----------|----------------------------------|
| `id`         | INT       | Primary key                      |
| `patient_id` | INT       | FK → `patients(id)`              |
| `doctor_id`  | INT       | FK → `doctors(id)`               |
| `file_path`  | TEXT      | Storage path of uploaded file    |
| `file_type`  | VARCHAR   | `scan`, `report`, `x-ray`, etc.  |
| `upload_date`| TIMESTAMP | File upload date                 |

