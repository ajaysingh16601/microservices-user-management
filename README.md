# Microservices User Management System

A microservices-based user management application built with AngularJS 1.8 frontend, NestJS backend services, MongoDB, and JWT authentication.

---

## Architecture

```
root-project/
│
├── frontend-angularjs/     # AngularJS 1.8 + Angular Material UI
│
├── auth-service/           # NestJS - Authentication (Port 3001)
│
├── user-service/           # NestJS - User Management (Port 3002)
│
├── docker-compose.yml      # Docker orchestration
│
├── postman/                # Postman collection
│
└── README.md
```

### Microservices

| Service | Port | Responsibilities |
|---------|------|-----------------|
| Auth Service | 3001 | Register, Login, Logout, JWT generation, Token validation, Rate limiting |
| User Service | 3002 | Get profile, Update profile, Upload photo, Change password, Dashboard |

### Communication Flow

```
Frontend → Auth Service (login/register)
Frontend → User Service (profile/dashboard)
User Service → Auth Service (validate token via REST)
```

---

## Tech Stack

### Frontend
- AngularJS 1.8
- Angular Material
- UI-Router
- `$http` for API calls

### Backend
- NestJS
- MongoDB Atlas + Mongoose
- JWT Authentication (@nestjs/jwt + passport-jwt)
- Multer (file uploads)
- bcrypt (password hashing)
- class-validator (DTO validation)
- @nestjs/throttler (rate limiting)

---

## Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- npm

### 1. Clone and Install

```bash
# Install Auth Service
cd auth-service
npm install

# Install User Service
cd ../user-service
npm install

# Install Frontend
cd ../frontend-angularjs
npm install
```

### 2. Configure Environment

Update the `.env.dev`, `.env.test`, `.env.live` files in each service with your MongoDB connection strings and JWT secrets.

**Auth Service (.env.dev)**
```
PORT=3001
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/auth_dev
JWT_SECRET=your_secret_key
JWT_EXPIRES=1d
FRONTEND_URL=http://localhost:4200
```

**User Service (.env.dev)**
```
PORT=3002
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/user_dev
AUTH_SERVICE_URL=http://localhost:3001
FRONTEND_URL=http://localhost:4200
```

### 3. Run

#### Development
```bash
# Auth Service
cd auth-service
npm run setup:dev

# User Service (in another terminal)
cd user-service
npm run setup:dev

# Frontend (in another terminal)
cd frontend-angularjs
npm start
```

#### Test Environment
```bash
npm run setup:test
```

#### Live Environment
```bash
npm run setup:live
```

### 4. Seed Test Users
```bash
cd auth-service
node src/seed.js
```

---

## Test Credentials

| Email | Password |
|-------|----------|
| admin@test.com | Password1 |
| user1@test.com | Password1 |
| user2@test.com | Password1 |

---

## API Documentation

### Auth Service (Port 3001)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /auth/register | Register new user | No |
| POST | /auth/login | Login (rate limited: 5/min) | No |
| POST | /auth/logout | Logout | No |
| GET | /auth/validate-token | Validate JWT token | Yes |
| GET | /health | Health check | No |

### User Service (Port 3002)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /users/profile | Get user profile | Yes |
| PUT | /users/profile | Update profile | Yes |
| POST | /users/upload-photo | Upload profile photo | Yes |
| PUT | /users/change-password | Change password | Yes |
| GET | /users/dashboard | Get dashboard data | Yes |
| GET | /health | Health check | No |

---

## Environment Setup

Each service supports three environments:

| Environment | File | Database |
|-------------|------|----------|
| Development | .env.dev | auth_dev / user_dev |
| Test | .env.test | auth_test / user_test |
| Live | .env.live | auth_live / user_live |

---

## Docker

### Build and Run
```bash
docker-compose up --build
```

### Services
- Auth Service: http://localhost:3001
- User Service: http://localhost:3002

---

## CI/CD

GitHub Actions workflow (`.github/workflows/deploy.yml`):

1. Push to `main` branch
2. Build both services
3. Deploy to Render

### Required GitHub Secrets
- `RENDER_API_KEY`
- `AUTH_SERVICE_ID`
- `USER_SERVICE_ID`

---

## Deployment

### Backend (Render)
- Auth Service: `https://auth-service.onrender.com`
- User Service: `https://user-service.onrender.com`

### Frontend (Vercel)
- Frontend: `https://user-management.vercel.app`

---

## Extra Features Implemented

1. **Docker** - Dockerfile for each service + docker-compose.yml
2. **Monitoring** - GET /health endpoint on both services
3. **Message Queue Simulation** - Console log "Welcome email sent" after registration
4. **CI/CD** - GitHub Actions for build and deploy to Render

---

## Folder Structure

### Auth Service
```
auth-service/
├── src/
│   ├── auth/
│   │   ├── dto/
│   │   ├── schemas/
│   │   ├── guards/
│   │   ├── strategies/
│   │   ├── services/
│   │   ├── controllers/
│   │   └── auth.module.ts
│   ├── common/
│   ├── config/
│   └── main.ts
├── uploads/
├── .env.dev
├── .env.test
├── .env.live
└── Dockerfile
```

### User Service
```
user-service/
├── src/
│   ├── users/
│   │   ├── dto/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── controllers/
│   │   └── users.module.ts
│   ├── common/
│   ├── config/
│   └── main.ts
├── uploads/
├── .env.dev
├── .env.test
├── .env.live
└── Dockerfile
```

### Frontend
```
frontend-angularjs/
├── app/
│   ├── controllers/
│   ├── services/
│   ├── routes/
│   ├── templates/
│   └── app.js
├── styles/
├── index.html
└── package.json
```

---

## Security

- Password validation: min 8 chars, 1 uppercase, 1 number
- Password hashing with bcrypt (10 rounds)
- JWT token-based authentication
- Rate limiting: 5 login attempts per minute
- CORS enabled
- Input validation with class-validator
