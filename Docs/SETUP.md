# Savore Project Setup Guide

## Backend Setup

1. Navigate to the backend directory:
   ```
   cd BE
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the BE directory with the following content:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/savore_db"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   PORT=3001
   NODE_ENV=development
   ```

4. Generate Prisma client:
   ```
   npx prisma generate
   ```

5. Run database migrations:
   ```
   npx prisma migrate dev --name init
   ```

6. Start the development server:
   ```
   npm run dev
   ```

The backend API will be running on http://localhost:3001

## Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd FE/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

The frontend will be running on http://localhost:5173 (or the port specified in the terminal)

## API Endpoints

### Authentication

- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login with username and password
- GET `/api/auth/profile` - Get current user profile (protected)

## Database Schema

The User model includes the following fields:
- id: Primary key (string)
- username: Unique string
- email: Unique string
- passwordHash: Hashed password
- avatarUrl: Optional string
- fullName: Optional string
- bio: Optional string
- role: Enum (USER, ADMIN, SELLER)
- status: Enum (ACTIVE, BANNED)
- createdAt: DateTime
- updatedAt: DateTime

## Authentication

The API uses JWT tokens for authentication. Tokens expire after 7 days. The frontend automatically includes the token in the Authorization header for all requests to protected endpoints.
