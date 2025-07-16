# Wellness Platform API Documentation

This document provides comprehensive documentation for the Wellness Platform API.

## 🔗 Base URL

- **Development:** `http://localhost:3000/api/v1`
- **Production:** `https://your-domain.com/api/v1`

## 🔐 Authentication

Currently, the API does not require authentication for demonstration purposes. In production, implement proper authentication using JWT tokens or similar.

## 📋 API Endpoints

### Health Check

#### GET /health

Check the health status of the application and its dependencies.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "1.0.0",
  "services": {
    "database": true,
    "external_api": true,
    "redis": true
  }
}
```

### Clients

#### GET /clients

Retrieve a list of clients with pagination and search capabilities.

**Query Parameters:**
- `page` (integer, optional): Page number (default: 1)
- `per_page` (integer, optional): Items per page (default: 20, max: 100)
- `search` (string, optional): Search term for name, email, or phone

**Response:**
```json
{
  "success": true,
  "data": {
    "clients": [
      {
        "id": 1,
        "external_id": "client_001",
        "name": "John Smith",
        "email": "john.smith@email.com",
        "phone": "555-0101",
        "notes": "Prefers morning appointments",
        "active": true,
        "appointment_count": 3,
        "created_at": "2024-01-15T10:00:00Z",
        "updated_at": "2024-01-15T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "per_page": 20,
      "total": 5,
      "total_pages": 1
    }
  }
}
```

#### GET /clients/:id

Retrieve a specific client by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "external_id": "client_001",
    "name": "John Smith",
    "email": "john.smith@email.com",
    "phone": "555-0101",
    "notes": "Prefers morning appointments",
    "active": true,
    "appointment_count": 3,
    "appointments": [
      {
        "id": 1,
        "start_time": "2024-01-16T09:00:00Z",
        "end_time": "2024-01-16T10:00:00Z",
        "status": "confirmed",
        "appointment_type": "Wellness Check"
      }
    ],
    "created_at": "2024-01-15T10:00:00Z",
    "updated_at": "2024-01-15T10:00:00Z"
  }
}
```

#### GET /clients/search

Search clients by name, email, or phone number.

**Query Parameters:**
- `q` (string, required): Search query

**Response:**
```json
{
  "success": true,
  "data": {
    "clients": [
      {
        "id": 1,
        "external_id": "client_001",
        "name": "John Smith",
        "email": "john.smith@email.com",
        "phone": "555-0101",
        "active": true,
        "appointment_count": 3
      }
    ],
    "query": "john"
  }
}
```

### Appointments

#### GET /appointments

Retrieve a list of appointments with filtering and pagination.

**Query Parameters:**
- `page` (integer, optional): Page number (default: 1)
- `per_page` (integer, optional): Items per page (default: 20, max: 100)
- `status` (string, optional): Filter by status (scheduled, confirmed, cancelled, completed)
- `start_date` (string, optional): Filter by start date (YYYY-MM-DD)
- `end_date` (string, optional): Filter by end date (YYYY-MM-DD)
- `client_id` (integer, optional): Filter by client ID
- `appointment_type` (string, optional): Filter by appointment type

**Response:**
```json
{
  "success": true,
  "data": {
    "appointments": [
      {
        "id": 1,
        "external_id": "apt_001",
        "client_id": 1,
        "client": {
          "id": 1,
          "name": "John Smith",
          "email": "john.smith@email.com"
        },
        "start_time": "2024-01-16T09:00:00Z",
        "end_time": "2024-01-16T10:00:00Z",
        "status": "confirmed",
        "appointment_type": "Wellness Check",
        "notes": "Annual wellness checkup",
        "duration_minutes": 60,
        "is_upcoming": true,
        "is_past": false,
        "is_today": false,
        "created_at": "2024-01-15T10:00:00Z",
        "updated_at": "2024-01-15T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "per_page": 20,
      "total": 5,
      "total_pages": 1
    }
  }
}
```

#### GET /appointments/:id

Retrieve a specific appointment by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "external_id": "apt_001",
    "client_id": 1,
    "client": {
      "id": 1,
      "name": "John Smith",
      "email": "john.smith@email.com"
    },
    "start_time": "2024-01-16T09:00:00Z",
    "end_time": "2024-01-16T10:00:00Z",
    "status": "confirmed",
    "appointment_type": "Wellness Check",
    "notes": "Annual wellness checkup",
    "duration_minutes": 60,
    "is_upcoming": true,
    "is_past": false,
    "is_today": false,
    "created_at": "2024-01-15T10:00:00Z",
    "updated_at": "2024-01-15T10:00:00Z"
  }
}
```

#### POST /appointments

Create a new appointment.

**Request Body:**
```json
{
  "appointment": {
    "client_external_id": "client_001",
    "start_time": "2024-01-17T14:00:00Z",
    "end_time": "2024-01-17T15:00:00Z",
    "appointment_type": "Massage Therapy",
    "notes": "Deep tissue massage session"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "external_id": "apt_002",
    "client_id": 1,
    "client": {
      "id": 1,
      "name": "John Smith",
      "email": "john.smith@email.com"
    },
    "start_time": "2024-01-17T14:00:00Z",
    "end_time": "2024-01-17T15:00:00Z",
    "status": "scheduled",
    "appointment_type": "Massage Therapy",
    "notes": "Deep tissue massage session",
    "duration_minutes": 60,
    "is_upcoming": true,
    "is_past": false,
    "is_today": false,
    "created_at": "2024-01-15T11:00:00Z",
    "updated_at": "2024-01-15T11:00:00Z"
  },
  "message": "Appointment created successfully"
}
```

#### PUT /appointments/:id

Update an existing appointment.

**Request Body:**
```json
{
  "appointment": {
    "start_time": "2024-01-17T15:00:00Z",
    "end_time": "2024-01-17T16:00:00Z",
    "status": "confirmed",
    "notes": "Updated notes"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "external_id": "apt_002",
    "client_id": 1,
    "client": {
      "id": 1,
      "name": "John Smith",
      "email": "john.smith@email.com"
    },
    "start_time": "2024-01-17T15:00:00Z",
    "end_time": "2024-01-17T16:00:00Z",
    "status": "confirmed",
    "appointment_type": "Massage Therapy",
    "notes": "Updated notes",
    "duration_minutes": 60,
    "is_upcoming": true,
    "is_past": false,
    "is_today": false,
    "created_at": "2024-01-15T11:00:00Z",
    "updated_at": "2024-01-15T12:00:00Z"
  },
  "message": "Appointment updated successfully"
}
```

#### DELETE /appointments/:id

Delete an appointment.

**Response:**
```json
{
  "success": true,
  "message": "Appointment deleted successfully"
}
```

#### PATCH /appointments/:id/cancel

Cancel an appointment.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "external_id": "apt_002",
    "client_id": 1,
    "client": {
      "id": 1,
      "name": "John Smith",
      "email": "john.smith@email.com"
    },
    "start_time": "2024-01-17T15:00:00Z",
    "end_time": "2024-01-17T16:00:00Z",
    "status": "cancelled",
    "appointment_type": "Massage Therapy",
    "notes": "Updated notes",
    "duration_minutes": 60,
    "is_upcoming": false,
    "is_past": false,
    "is_today": false,
    "created_at": "2024-01-15T11:00:00Z",
    "updated_at": "2024-01-15T13:00:00Z"
  },
  "message": "Appointment cancelled successfully"
}
```

## 🔄 Data Synchronization

### POST /sync/clients

Trigger manual synchronization of clients from the external API.

**Response:**
```json
{
  "success": true,
  "message": "Client synchronization completed",
  "data": {
    "synced_count": 5,
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### POST /sync/appointments

Trigger manual synchronization of appointments from the external API.

**Response:**
```json
{
  "success": true,
  "message": "Appointment synchronization completed",
  "data": {
    "synced_count": 8,
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

## 📊 Error Responses

### Validation Error (422)

```json
{
  "success": false,
  "error": "Validation Failed",
  "message": "Validation failed: Email is invalid",
  "details": [
    "Email is invalid",
    "Start time can't be blank"
  ]
}
```

### Not Found Error (404)

```json
{
  "success": false,
  "error": "Not Found",
  "message": "Couldn't find Client with 'id'=999"
}
```

### Bad Request Error (400)

```json
{
  "success": false,
  "error": "Bad Request",
  "message": "param is missing or the value is empty: appointment"
}
```

### Server Error (500)

```json
{
  "success": false,
  "error": "Internal Server Error",
  "message": "Something went wrong"
}
```

## 🔧 Rate Limiting

The API implements rate limiting to prevent abuse:

- **Rate Limit:** 100 requests per minute per IP
- **Headers:** 
  - `X-RateLimit-Limit`: Request limit per window
  - `X-RateLimit-Remaining`: Remaining requests in current window
  - `X-RateLimit-Reset`: Time when the rate limit resets

## 📝 Data Models

### Client Model

```json
{
  "id": "integer",
  "external_id": "string (unique)",
  "name": "string",
  "email": "string (valid email format)",
  "phone": "string",
  "notes": "string (optional)",
  "active": "boolean",
  "appointment_count": "integer",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### Appointment Model

```json
{
  "id": "integer",
  "external_id": "string (unique)",
  "client_id": "integer",
  "client": {
    "id": "integer",
    "name": "string",
    "email": "string"
  },
  "start_time": "datetime",
  "end_time": "datetime",
  "status": "enum (scheduled, confirmed, cancelled, completed)",
  "appointment_type": "string",
  "notes": "string (optional)",
  "duration_minutes": "integer",
  "is_upcoming": "boolean",
  "is_past": "boolean",
  "is_today": "boolean",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

## 🔗 External API Integration

The platform integrates with an external wellness API for data synchronization:

### External API Endpoints

- `GET /clients` - Fetch all clients
- `GET /appointments` - Fetch all appointments
- `POST /appointments` - Create new appointment
- `PUT /clients/:id` - Update client
- `PUT /appointments/:id` - Update appointment

### Synchronization Process

1. **Automatic Sync:** Background jobs run every 15-30 minutes
2. **Manual Sync:** Triggered via API endpoints
3. **Conflict Resolution:** Local changes take precedence
4. **Error Handling:** Failed syncs are logged and retried

## 🧪 Testing

### Test Endpoints

Use the following endpoints for testing:

- **Health Check:** `GET /health`
- **Sample Data:** Available after running `rails db:seed`

### Test Data

The API includes sample data for testing:

- 5 sample clients
- 5 sample appointments
- Various appointment types and statuses

## 📞 Support

For API support:

1. Check the health endpoint for service status
2. Review error responses for specific issues
3. Check logs for detailed error information
4. Contact the development team with specific error details

---

**Note:** This API documentation covers the current implementation. For production use, additional security measures and authentication should be implemented. 