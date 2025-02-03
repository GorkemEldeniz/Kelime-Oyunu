# Instructions for Building an Authentication Service

## Overview

This guide provides detailed instructions for creating a simple authentication service using the following technologies:

- **Next.js (latest version)**: For building the frontend and API routes.
- **PostgreSQL**: As the database for storing user credentials and tokens.
- **Prisma**: As the ORM for database interactions.

The service will support traditional username-password authentication as well as social login (e.g., Google). It will include token-based authentication with access and refresh tokens.

---

## Features

1. **User Registration**: Allow users to sign up with an email, username, and password.
2. **User Login**: Authenticate users with email and password.
3. **Social Login**: Allow users to sign in using Google.
4. **Token Management**: Implement access and refresh tokens for session management.
5. **Token Refresh Endpoint**: Allow users to refresh expired access tokens.
6. **Secure Password Storage**: Use bcrypt for hashing passwords.

---

## Project Structure

Below is the recommended file and folder structure:

```
project-root/
├── prisma/
│   ├── schema.prisma
├── src/
│   ├── pages/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── register.ts
│   │   │   │   ├── login.ts
│   │   │   │   ├── social-login.ts
│   │   │   │   ├── refresh-token.ts
│   │   │   │   ├── logout.ts
│   │   ├── index.tsx
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── auth-utils.ts
│   ├── components/
│   │   ├── AuthForm.tsx
├── .env
```

---

## Database Schema

Define the database schema in `prisma/schema.prisma`:

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  username  String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Token {
  id          Int      @id @default(autoincrement())
  userId      Int
  token       String   @unique
  expiresAt   DateTime
  createdAt   DateTime @default(now())
  user        User     @relation(fields: [userId], references: [id])
}
```

---

## API Routing

### 1. **User Registration**

- **Endpoint**: `POST /api/auth/register`
- **Description**: Create a new user.
- **Request Body**:
  ```json
  {
  	"email": "example@example.com",
  	"username": "exampleUser",
  	"password": "securePassword"
  }
  ```
- **Response**:
  ```json
  {
  	"message": "User registered successfully"
  }
  ```

### 2. **User Login**

- **Endpoint**: `POST /api/auth/login`
- **Description**: Authenticate user and return tokens.
- **Request Body**:
  ```json
  {
  	"email": "example@example.com",
  	"password": "securePassword"
  }
  ```
- **Response**:
  ```json
  {
  	"accessToken": "...",
  	"refreshToken": "..."
  }
  ```

### 3. **Social Login**

- **Endpoint**: `POST /api/auth/social-login`
- **Description**: Handle Google OAuth login.
- **Request Body**:
  ```json
  {
  	"provider": "google",
  	"idToken": "googleIdToken"
  }
  ```
- **Response**:
  ```json
  {
  	"accessToken": "...",
  	"refreshToken": "..."
  }
  ```

### 4. **Refresh Token**

- **Endpoint**: `POST /api/auth/refresh-token`
- **Description**: Issue a new access token using the refresh token.
- **Request Body**:
  ```json
  {
  	"refreshToken": "..."
  }
  ```
- **Response**:
  ```json
  {
  	"accessToken": "..."
  }
  ```

### 5. **Logout**

- **Endpoint**: `POST /api/auth/logout`
- **Description**: Revoke the refresh token.
- **Request Body**:
  ```json
  {
  	"refreshToken": "..."
  }
  ```
- **Response**:
  ```json
  {
  	"message": "Logged out successfully"
  }
  ```

## Notes

- Use `jsonwebtoken` to handle JWTs for access and refresh tokens.
- Securely hash passwords with `bcrypt`.
- Protect routes with middleware to verify access tokens.
- Implement rate limiting on sensitive endpoints to enhance security.
