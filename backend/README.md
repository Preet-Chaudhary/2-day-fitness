# 2 Day Fitness Backend API

## Setup Instructions

1. Navigate to the backend directory:
   ```bash
   cd "d:\Projects\2 day fitness\backend"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. For production:
   ```bash
   npm start
   ```

## API Endpoints

### Base URL
```
http://localhost:5000
```

### Authentication Endpoints

#### 1. Sign Up
- **URL:** `POST /api/signup`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "message": "User created successfully",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2025-07-31T..."
    },
    "token": "jwt-token-here"
  }
  ```

#### 2. Login
- **URL:** `POST /api/login`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Login successful",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2025-07-31T..."
    },
    "token": "jwt-token-here"
  }
  ```

#### 3. Get Profile (Protected)
- **URL:** `GET /api/profile`
- **Headers:** 
  ```
  Authorization: Bearer <jwt-token>
  ```
- **Response:**
  ```json
  {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2025-07-31T..."
    }
  }
  ```

#### 4. Logout
- **URL:** `POST /api/logout`
- **Response:**
  ```json
  {
    "message": "Logout successful. Please remove token from client storage."
  }
  ```

### Testing Endpoints

#### Get All Users (Development only)
- **URL:** `GET /api/users`
- **Response:**
  ```json
  {
    "users": [
      {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "createdAt": "2025-07-31T..."
      }
    ]
  }
  ```

## Error Responses

All error responses follow this format:
```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Security Features

- Passwords are hashed using bcrypt
- JWT tokens expire in 24 hours
- CORS enabled for cross-origin requests
- Input validation on all endpoints

## Environment Variables

Create a `.env` file in the backend directory:
```
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

## Notes

- This currently uses in-memory storage. For production, replace with a proper database (MongoDB, PostgreSQL, etc.)
- The JWT secret should be a long, random string in production
- Consider adding rate limiting for production use
- Add password strength requirements and email validation as needed
