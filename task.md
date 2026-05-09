# Microservices User Management System — Complete Implementation Guide

Build a microservices-based user management application with:

* Frontend: AngularJS 1.8 + Angular Material
* Backend: NestJS + MongoDB + Mongoose
* Authentication using JWT
* File upload support
* Docker support
* CI/CD support
* Multiple environments
* Deployment on Render + Vercel

---

# Final Tech Stack

## Frontend

* AngularJS 1.8
* Angular Material
* UI-Router
* `$http`

---

## Backend

* NestJS
* MongoDB Atlas
* Mongoose
* JWT Authentication
* Multer (local uploads)

---

# Architecture

```txt id="iq48rq"
root-project/
│
├── frontend-angularjs/
│
├── auth-service/
│
├── user-service/
│
├── docker-compose.yml
│
├── README.md
│
└── postman/
```

---

# Microservices Architecture

Two separate NestJS services:

---

# 1. Auth Service

Responsibilities:

* Register
* Login
* Logout
* JWT generation
* Token validation
* Login rate limiting

Port:

```txt id="c3f6d6"
3001
```

---

# 2. User Service

Responsibilities:

* Get profile
* Update profile
* Upload profile photo
* Change password
* Dashboard

Port:

```txt id="0l0rsm"
3002
```

---

# Communication Between Services

Use REST APIs internally.

Example:

```txt id="jlwm1m"
User Service → Auth Service
Authorization: Bearer token
```

Flow:

1. User sends token
2. User Service calls:

```txt id="hu0cgs"
/auth/validate-token
```

3. Auth Service validates JWT
4. Returns user info

---

# Frontend Flow

---

# Pages Required

## Public

* Login
* Register

## Protected

* Dashboard
* Profile
* Edit Profile
* Change Password

---

# Frontend Features

## Authentication

* Store JWT in localStorage
* Add token in headers
* Route protection

---

## Dashboard

Display:

```txt id="x6tbv8"
Welcome [User Name]
```

---

## Profile

Display:

* Name
* Email
* Phone
* Profile photo

---

## Edit Profile

Editable:

* Name
* Email
* Phone

---

## Upload Photo

Use:

```html id="wdgv94"
<input type="file">
```

Upload using multipart/form-data.

---

## Logout

* Remove token
* Redirect to login

---

# AngularJS Structure

```txt id="d7jlwm"
frontend-angularjs/
│
├── app/
│   ├── controllers/
│   ├── services/
│   ├── routes/
│   ├── templates/
│   ├── guards/
│   └── app.js
│
├── assets/
├── styles/
└── index.html
```

---

# Suggested AngularJS Libraries

Install:

```bash id="00qyzp"
npm install angular
npm install angular-ui-router
npm install angular-material
npm install angular-animate
npm install angular-aria
```

---

# Backend Structure

---

# Auth Service Structure

```txt id="97rfdr"
auth-service/
│
├── src/
│   ├── auth/
│   │   ├── dto/
│   │   ├── schemas/
│   │   ├── guards/
│   │   ├── strategies/
│   │   ├── services/
│   │   ├── controllers/
│   │   └── auth.module.ts
│   │
│   ├── common/
│   ├── config/
│   ├── uploads/
│   └── main.ts
```

---

# User Service Structure

```txt id="4gzbgu"
user-service/
│
├── src/
│   ├── users/
│   │   ├── dto/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── controllers/
│   │   └── users.module.ts
│   │
│   ├── uploads/
│   ├── common/
│   ├── config/
│   └── main.ts
```

---

# Database

Use:

* MongoDB Atlas
* Mongoose

Each service can:

* use same cluster
* different database names

Example:

```txt id="91nlyj"
auth_dev
user_dev

auth_test
user_test

auth_live
user_live
```

---

# Environment Setup

Each service must contain:

```txt id="7svkr0"
.env.dev
.env.test
.env.live
```

---

# Example Environment Variables

## Auth Service

```env id="9d1hfd"
PORT=3001

MONGO_URI=

JWT_SECRET=

JWT_EXPIRES=1d

FRONTEND_URL=
```

---

## User Service

```env id="w7w9br"
PORT=3002

MONGO_URI=

AUTH_SERVICE_URL=

FRONTEND_URL=
```

---

# APIs Required

---

# Auth APIs

## Register

```http id="m0n0l9"
POST /auth/register
```

Body:

```json id="my17n9"
{
  "name": "Ajay",
  "email": "ajay@test.com",
  "password": "Password1",
  "phone": "9999999999"
}
```

---

## Login

```http id="x6kg2h"
POST /auth/login
```

Returns:

```json id="gljqoj"
{
  "token": "jwt-token"
}
```

---

## Logout

```http id="ycjlwm"
POST /auth/logout
```

---

## Validate Token

```http id="lbtl3l"
GET /auth/validate-token
```

---

# User APIs

## Get Profile

```http id="exs6dt"
GET /users/profile
```

---

## Update Profile

```http id="5y1g5v"
PUT /users/profile
```

---

## Upload Photo

```http id="10x77x"
POST /users/upload-photo
```

multipart/form-data

---

## Change Password

```http id="08ofkq"
PUT /users/change-password
```

Require:

* oldPassword
* newPassword

---

## Dashboard

```http id="zk5h9l"
GET /users/dashboard
```

---

# Authentication Flow

## Register

1. User registers
2. Password hashed with bcrypt
3. User saved in MongoDB
4. Mock welcome email logged
5. JWT returned

---

## Login

1. Validate email/password
2. Generate JWT
3. Return token

---

## Protected Routes

1. Frontend sends JWT
2. User Service validates token using Auth Service
3. Allow access

---

# Security Requirements

---

# Password Validation

Rules:

* Minimum 8 chars
* One uppercase
* One number

Use:

* class-validator

Example regex:

```txt id="92e9ms"
/^(?=.*[A-Z])(?=.*\d).{8,}$/
```

---

# Password Hashing

Use:

```bash id="c77u5z"
bcrypt
```

---

# JWT

Use:

```bash id="lhsyxh"
@nestjs/jwt
passport-jwt
```

---

# Rate Limiting

Max:

```txt id="2tv5it"
5 login attempts/minute
```

Use:

```bash id="bhfdvn"
@nestjs/throttler
```

---

# File Upload

Use:

* Multer
* Local uploads folder

Structure:

```txt id="hjlwmr"
uploads/profile/
```

Store:

```txt id="5skqzl"
photo filename/path in MongoDB
```

Serve static files:

```txt id="x1ttjj"
/uploads/profile/filename.jpg
```

---

# Selected Extra Features

Implement these 4:

---

# 1. Docker

Create:

```txt id="jlwmvb"
Dockerfile
docker-compose.yml
```

Docker Compose should include:

* auth-service
* user-service

---

# 2. Monitoring

Add:

```http id="jlwm5w"
GET /health
```

Returns:

```json id="y84n0e"
{
  "status": "ok"
}
```

---

# 3. Message Queue Simulation

After registration:

```txt id="v7fj1v"
Welcome email sent to ajay@test.com
```

Console log only.

---

# 4. CI/CD

Use GitHub Actions.

Flow:

```txt id="ljswyv"
Push to main
→ Build
→ Deploy to Render test environment
```

---

# Deployment Plan

---

# Backend Deployment

Deploy separately on Render:

## Auth Service

```txt id="j8cs6g"
https://auth-service.onrender.com
```

## User Service

```txt id="p4c29y"
https://user-service.onrender.com
```

---

# Frontend Deployment

Deploy AngularJS app on Vercel.

Example:

```txt id="yjlwm0"
https://user-management.vercel.app
```

---

# Setup Commands

Must work:

---

## Development

```bash id="d7s8p2"
npm run setup:dev
```

Should:

* install deps
* create uploads folder
* load .env.dev
* start dev server

---

## Test

```bash id="k63jlwm"
npm run setup:test
```

Should:

* load .env.test
* seed 3 dummy users
* start app

---

## Live

```bash id="qgnv53"
npm run setup:live
```

Should:

* load .env.live
* start production

---

# Dummy Users For Test

Create 3 users:

```txt id="nlv9jq"
admin@test.com
user1@test.com
user2@test.com
```

Password:

```txt id="bjlwm0"
Password1
```

---

# README Requirements

Must include:

* Project overview
* Architecture diagram
* Setup steps
* Environment setup
* API list
* Deployment URLs
* Test credentials
* Docker steps
* CI/CD explanation
* Selected extra skills
* Folder structure

---

# Postman Collection

Include:

* Auth APIs
* User APIs
* Protected APIs

Export:

```txt id="77rgom"
postman_collection.json
```

---

# Demo Video Flow

Show:

1. Dev environment
2. Test environment
3. Live environment
4. Registration
5. Login
6. Profile update
7. Upload photo
8. Password change
9. Logout
10. Health endpoint

---

# Recommended Backend Packages

## NestJS

```bash id="d9as72"
npm install @nestjs/mongoose mongoose
npm install @nestjs/jwt passport-jwt
npm install bcrypt
npm install multer
npm install @nestjs/platform-express
npm install @nestjs/throttler
npm install class-validator class-transformer
```

---

# Recommended Frontend Packages

```bash id="jlwm3t"
npm install angular
npm install angular-material
npm install angular-ui-router
npm install angular-animate
npm install angular-aria
```

---

# Important Notes

## Keep UI Simple

Assignment is backend-focused.

---

## Focus Areas

Most important:

* architecture
* deployment
* clean code
* environments
* JWT flow
* microservices separation

---

# Recommended Execution Order

## Step 1

Setup:

* auth-service
* user-service
* AngularJS frontend

---

## Step 2

Implement:

* register
* login
* JWT

---

## Step 3

Implement:

* profile
* edit
* password change

---

## Step 4

Implement:

* uploads
* protected routes

---

## Step 5

Add:

* rate limiting
* validations
* health endpoint

---

## Step 6

Dockerize

---

## Step 7

Deploy:

* MongoDB Atlas
* Render
* Vercel

---

## Step 8

Add:

* README
* Postman
* Demo video
