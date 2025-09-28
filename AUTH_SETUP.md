# Authentication Setup Guide

## Backend Setup

### 1. Environment Variables
Create a `.env` file in the backend root directory with the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/bab-studio

# Server Configuration
PORT=5000

# Admin Authentication
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# AWS S3 Configuration (if using)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=your-aws-region
AWS_BUCKET_NAME=your-s3-bucket-name
```

### 2. Dependencies
The following packages have been added:
- `jsonwebtoken` - For JWT token generation and verification

### 3. API Endpoints

#### POST `/api/auth/login`
Login endpoint for admin authentication.

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt-token-here",
  "user": {
    "username": "admin",
    "role": "admin"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

#### GET `/api/auth/verify`
Verify JWT token validity.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (Success):**
```json
{
  "success": true,
  "user": {
    "username": "admin",
    "role": "admin"
  }
}
```

### 4. Protected Routes
All admin routes are now protected with JWT authentication middleware.

## Frontend Setup

### 1. Authentication Context
- `AuthContext.jsx` - Provides authentication state management
- `ProtectedRoute.jsx` - Protects admin routes from unauthorized access

### 2. Updated Components
- `Footer.jsx` - Updated with secure login/logout functionality
- `App.jsx` - Wrapped with AuthProvider and protected admin route
- `Admin.jsx` - Added user info and logout functionality

### 3. Authentication Flow
1. User clicks "Admin Login" in footer
2. Enters credentials (username: admin, password: admin123)
3. Frontend sends POST request to `/api/auth/login`
4. Backend validates credentials and returns JWT token
5. Token is stored in localStorage and axios headers
6. User is redirected to `/admin` page
7. Admin page is protected - unauthorized users are redirected to home

### 4. Security Features
- JWT tokens with 24-hour expiration
- Automatic token verification on app load
- Protected routes that redirect unauthorized users
- Secure logout that clears tokens and redirects
- Error handling for expired/invalid tokens

## Usage

### Default Admin Credentials
- **Username:** admin
- **Password:** admin123

### Testing the Authentication
1. Start the backend server: `npm start`
2. Start the frontend: `npm run dev`
3. Navigate to `http://localhost:5173`
4. Click "Admin Login" in the footer
5. Enter credentials: admin / admin123
6. You'll be redirected to the admin panel
7. Try accessing `http://localhost:5173/admin` directly without logging in - you'll be redirected to home

### Security Notes
- Change the default credentials in production
- Use a strong JWT_SECRET in production
- Consider implementing additional security measures like rate limiting
- The current setup is suitable for a small studio admin panel
