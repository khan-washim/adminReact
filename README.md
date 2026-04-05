# QuAArks Admin Dashboard

A full-stack MERN exam management admin dashboard with JWT authentication, Redux Toolkit state management, and a beautiful animated login page.

---

## Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### 1. Install all dependencies
```bash
npm install          # root (installs concurrently)
npm run install:all  # installs frontend + backend
```

### 2. Configure environment
Edit `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/quaarks
JWT_SECRET=quaarks_super_secret_jwt_key_2025
JWT_EXPIRES_IN=24h
```

### 3. Seed the database (creates admin + sample data)
```bash
npm run seed
```
This creates:
- ✅ Admin account: `admin@quaarks.com` / `admin123`
- ✅ 5 subjects, 4 exam types, 4 exam configs, 22 questions, 4 users

### 4. Start development servers
```bash
npm run dev   # starts backend (:5000) + frontend (:3000) simultaneously
```

Open http://localhost:3000 → login with `admin@quaarks.com` / `admin123`

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite |
| State | Redux Toolkit |
| Routing | React Router DOM v6 |
| Styling | Bootstrap 5 (CSS) + custom CSS variables |
| Charts | react-chartjs-2 + Chart.js |
| HTTP | Axios (with JWT interceptor + 401 auto-redirect) |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken) + bcryptjs |

---

## Authentication Flow

```
Login Page (/login)
  → POST /api/auth/login { email, password }
  ← { token, user: { _id, name, email, role } }
  → Token stored in localStorage
  → All API requests: Authorization: Bearer <token>
  → 401 response → auto-redirect to /login
  → Logout clears localStorage + redirects to /login
```

---

## Routes

| Path | Page | Protected |
|---|---|---|
| `/login` | Login | No |
| `/` | Dashboard | Yes |
| `/question-bank` | Question Bank | Yes |
| `/user-questions` | User Questions | Yes |
| `/import-questions` | Import Questions | Yes |
| `/subjects` | Subjects | Yes |
| `/exam-configs` | Exam Configs | Yes |
| `/exam-types` | Exam Types | Yes |
| `/users` | User Management | Yes |

---

## API Endpoints

### Auth (public)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Login → returns JWT + user |
| GET | `/api/auth/me` | Get current user (protected) |
| POST | `/api/auth/change-password` | Change password (protected) |

### All other endpoints require `Authorization: Bearer <token>`

### Dashboard
| Method | Endpoint |
|---|---|
| GET | `/api/dashboard/stats` |

### Questions
| Method | Endpoint |
|---|---|
| GET | `/api/questions?search=&subject=&examType=&difficulty=&page=` |
| POST | `/api/questions` |
| PUT | `/api/questions/:id` |
| DELETE | `/api/questions/:id` |
| POST | `/api/questions/import` |

### Users
| Method | Endpoint |
|---|---|
| GET | `/api/users` |
| POST | `/api/users` |
| PUT | `/api/users/:id` |
| DELETE | `/api/users/:id` |
| POST | `/api/users/:id/reset-password` |

### Subjects / ExamConfigs / ExamTypes
Standard CRUD: `GET` / `POST` / `PUT /:id` / `DELETE /:id`

---

## Project Structure

```
quaarks/
├── frontend/src/
│   ├── api/axios.js              # Axios + JWT interceptor + 401 handler
│   ├── components/
│   │   ├── common/
│   │   │   ├── Badge.jsx
│   │   │   ├── ChartCard.jsx
│   │   │   ├── DataTable.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── PageHeader.jsx
│   │   │   ├── ProtectedRoute.jsx   ← NEW
│   │   │   ├── StatCard.jsx
│   │   │   └── ToastContainer.jsx
│   │   └── layout/
│   │       ├── Layout.jsx
│   │       ├── Sidebar.jsx          ← logout button, real user info
│   │       └── Topbar.jsx           ← user dropdown + logout
│   ├── hooks/
│   │   ├── useCountUp.js
│   │   └── useToast.js
│   ├── pages/
│   │   ├── Login.jsx               ← NEW: animated login page
│   │   ├── Dashboard.jsx
│   │   ├── QuestionBank.jsx
│   │   ├── UserQuestions.jsx
│   │   ├── ImportQuestions.jsx
│   │   ├── Subjects.jsx
│   │   ├── ExamConfigs.jsx
│   │   ├── ExamTypes.jsx
│   │   └── Users.jsx
│   └── store/slices/
│       ├── authSlice.js             ← NEW: login/logout + localStorage
│       ├── toastSlice.js
│       ├── uiSlice.js
│       ├── dashboardSlice.js
│       ├── questionSlice.js
│       ├── userSlice.js
│       ├── subjectSlice.js
│       ├── examConfigSlice.js
│       └── examTypeSlice.js
│
└── backend/
    ├── middleware/auth.js           ← NEW: JWT protect + adminOnly
    ├── routes/auth.js               ← NEW: login, /me, change-password
    ├── seed.js                      ← NEW: seeder script
    ├── models/ (User, Subject, Question, ExamConfig, ExamType)
    ├── routes/ (dashboard, questions, users, subjects, examConfigs, examTypes)
    └── server.js                    ← all routes protected with JWT
```
