# Authentication API Documentation

This backend now includes a complete authentication system with user registration, login, and protected routes.

## API Endpoints

### Authentication Routes (`/auth`)

#### 1. User Registration
- **POST** `/auth/signup`
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```

#### 2. User Login
- **POST** `/auth/signin`
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "Password123"
  }
  ```
- **Response**: Same as registration

#### 3. Verify Token
- **GET** `/auth/verify`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Token is valid",
    "data": {
      "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    }
  }
  ```

#### 4. Get User Profile
- **GET** `/auth/profile`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Same as verify token

## Password Requirements

- Minimum 6 characters
- Must contain at least one lowercase letter
- Must contain at least one uppercase letter
- Must contain at least one number

## Environment Variables

Make sure to set up your `.env` file with the following variables:

```
DB_HOST=localhost
DB_NAME=your_database_name
DB_USER=your_username
DB_PASSWORD=your_password
DB_DIALECT=mysql
JWT_SECRET=your_very_secure_secret_key
PORT=3001
```

## Usage Examples

### Using cURL

#### Register a new user:
```bash
curl -X POST http://localhost:3001/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123"
  }'
```

#### Login:
```bash
curl -X POST http://localhost:3001/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123"
  }'
```

#### Access protected route:
```bash
curl -X GET http://localhost:3001/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## Security Features

- Password hashing using bcryptjs
- JWT token authentication
- Input validation using express-validator
- Email uniqueness constraint
- Secure password requirements
- Automatic password hashing on user creation/update
- Token expiration (7 days)
- Protected routes with middleware

## Database

The system will automatically create a `users` table with the following schema:
- `id` (INTEGER, PRIMARY KEY, AUTO_INCREMENT)
- `name` (STRING, NOT NULL)
- `email` (STRING, NOT NULL, UNIQUE)
- `password` (STRING, NOT NULL, HASHED)
- `createdAt` (DATETIME)
- `updatedAt` (DATETIME)
