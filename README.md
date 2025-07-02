#  Hospital Management System HAP

An enterprise-grade, full-stack Hospital Management System built with **React.js** (frontend) and **Go (Golang)** (backend), designed to digitize and streamline hospital operations including patient management, appointment scheduling, billing, and medical records.

---

##  Features

- 👥 Patient registration, profiles, and medical history
- 👨‍⚕️ Doctor schedules and availability management
- 📅 Appointment booking and status tracking
- 🧾 Invoice generation and payment tracking
- 🔐 Secure login and role-based access control (Admin, Doctor, Patient)
- 🧠 Medical record management
- 📊 Admin dashboard with key hospital metrics

---

##  Tech Stack

| Layer      | Technology           |
|------------|----------------------|
| Frontend   | React.js, TailwindCSS, React Router |
| Backend    | Go (Golang), Gin/Fiber, GORM         |
| Database   | PostgreSQL            |
| Auth       | JWT (JSON Web Tokens) |
| Tools      | Docker, GitHub, Postman |
| Optional   | Redis (caching), Mailgun (emails), Stripe (billing)

---

##  Project Structure

hospital-management-system/
├── frontend/ # React.js client
│ └── src/
│ ├── components/
│ ├── pages/
│ ├── services/
│ └── ...
├── backend/ # Go backend API
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ └── ...
├── docs/ # Architecture, API docs
├── docker-compose.yml # Multi-service setup
├── .env.example # Environment template
└── README.md

## Author

Sami Chentouba
Master’s in Information Systems Management
GitHub: @samichen99
Email: samichentouba77@gmail.com

## License

This project is licensed under the MIT License. See LICENSE file for details.