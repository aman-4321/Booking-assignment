# AtmoSpark Ground Booking API

A REST API for sports ground booking system built with Express.js and TypeScript.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```bash
MONGODB_URL=your_mongodb_connection_string
PORT=8080
NODE_ENV=dev
JWT_SECRET=your_jwt_secret
```

### 3. Start Server

```bash
npm run dev
```

## API Endpoints

### Authentication Routes

#### 1. Sign Up

- **Route:** `POST /api/v1/user/signup`
- **Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

- **Success Response:** (200)

```json
{
  "message": "User created successfully",
  "userId": "65cf12d4e5c77d1234567890",
  "email": "john@example.com"
}
```

- **Error Response:** (409)

```json
{
  "message": "Email already Exists"
}
```

#### 2. Login

- **Route:** `POST /api/v1/user/login`
- **Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

- **Success Response:** (200)

```json
{
  "message": "Logged in successfully",
  "token": "jwt_token_string"
}
```

- **Error Response:** (401)

```json
{
  "message": "Invalid email or password"
}
```

### Ground Routes

#### 1. Get All Grounds

- **Route:** `GET /api/v1/grounds`
- **Auth:** Required
- **Success Response:** (200)

```json
{
  "grounds": [
    {
      "_id": "65cf12d4e5c77d1234567890",
      "name": "Football Ground 1",
      "type": "Football",
      "pricePerHour": 1000,
      "location": "City Center",
      "capacity": 22
    }
  ]
}
```

### Booking Routes

#### 1. Create Booking

- **Route:** `POST /api/v1/bookings`
- **Auth:** Required
- **Body:**

```json
{
  "groundId": "65cf12d4e5c77d1234567890",
  "date": "2024-02-20",
  "timeSlot": {
    "start": "14:00",
    "end": "15:00"
  }
}
```

- **Success Response:** (201)

```json
{
  "message": "Booking created successfully",
  "booking": {
    "_id": "65cf12d4e5c77d1234567890",
    "groundId": "65cf12d4e5c77d1234567890",
    "userId": "65cf12d4e5c77d1234567890",
    "date": "2024-02-20T00:00:00.000Z",
    "timeSlot": {
      "start": "14:00",
      "end": "15:00"
    }
  }
}
```

- **Error Response:** (409)

```json
{
  "message": "Time slot already booked",
  "existingBooking": {
    // booking details
  }
}
```

#### 2. Get User Bookings

- **Route:** `GET /api/v1/bookings/:userId`
- **Auth:** Required
- **Success Response:** (200)

```json
{
  "message": "Bookings fetched successfully",
  "bookings": [
    {
      "_id": "65cf12d4e5c77d1234567890",
      "groundId": {
        "_id": "65cf12d4e5c77d1234567890",
        "name": "Football Ground 1",
        "type": "Football"
      },
      "userId": {
        "_id": "65cf12d4e5c77d1234567890",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "date": "2024-02-20T00:00:00.000Z",
      "timeSlot": {
        "start": "14:00",
        "end": "15:00"
      }
    }
  ]
}
```

#### 3. Cancel Booking

- **Route:** `DELETE /api/v1/bookings/:bookingId`
- **Auth:** Required
- **Success Response:** (200)

```json
{
  "message": "Booking cancelled successfully"
}
```

- **Error Response:** (403)

```json
{
  "message": "You are not authorized to cancel this booking"
}
```

## Input Validation

### User Routes

#### 1. Sign Up (`POST /api/v1/user/signup`)

| Field    | Type   | Required | Validation Rules                                    |
| -------- | ------ | -------- | --------------------------------------------------- |
| name     | string | Yes      | Min length: 2 characters                            |
| email    | string | Yes      | Valid email format                                  |
| password | string | Yes      | Min length: 6 characters, Max length: 20 characters |

#### 2. Login (`POST /api/v1/user/login`)

| Field    | Type   | Required | Validation Rules                                    |
| -------- | ------ | -------- | --------------------------------------------------- |
| email    | string | Yes      | Valid email format                                  |
| password | string | Yes      | Min length: 6 characters, Max length: 20 characters |

### Booking Routes

#### 1. Create Booking (`POST /api/v1/bookings`)

| Field          | Type   | Required | Validation Rules                        |
| -------------- | ------ | -------- | --------------------------------------- |
| groundId       | string | Yes      | Valid MongoDB ObjectId (24 characters)  |
| date           | string | Yes      | Format: YYYY-MM-DD, Must be future date |
| timeSlot.start | string | Yes      | Format: HH:mm (24-hour)                 |
| timeSlot.end   | string | Yes      | Format: HH:mm (24-hour)                 |

## Authentication

- Uses JWT tokens stored in HTTP-only cookies
- Token expiration: 24 hours
- Protected routes require valid JWT token
