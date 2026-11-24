# CRUM API --- Technical Documentation

## 1. Overview

This README documents the system's data models, endpoints, request
parameters, responses, and communication events.

## 2. General Conventions

---

Element Convention

---

Data format JSON JSON

Attribute naming \`camelCase\` in English

Identifiers `id` or specific identifiers such
as `emergencyId`

Dates and times ISO 8601 in UTC

Coordinates `latitude` and `longitude`

Boolean values `true` / `false`

Optional fields May be omitted or set to `null`,
depending on the endpoint contract

Content type `application/json`

---

# 3. Data Models

The following models define reusable API data structures. An endpoint
may return a complete model or a projection containing only the
attributes required for its operation.

## 3.1 Location

Represents a geographic location used by ambulances, emergencies, and
hospitals.

```json
{
  "latitude": 19.5102018,
  "longitude": -99.1258884,
  "h3Index": "8c2a1072b59ffff"
}
```

---

Attribute Type Description

---

`latitude` number Geographic latitude.

`longitude` number Geographic longitude.

`h3Index` string Spatial H3 index
corresponding to the
location.

---

## 3.2 Ambulance

Represents an ambulance registered in the system.

```json
{
  "id": 12,
  "licensePlate": "ABC-123",
  "ambulanceType": "BASIC",
  "operationalBase": "CRUM",
  "status": "AVAILABLE",
  "isReceivingAssignments": true,
  "location": {
    "latitude": 19.5102018,
    "longitude": -99.1258884,
    "h3Index": "8c2a1072b59ffff"
  }
}
```

---

Attribute Type Description

---

`id` number Identifier of the
ambulance.

`licensePlate` string Vehicle license
plate.

`ambulanceType` string Type de ambulance.

`operationalBase` string Operational base to
which it belongs.

`availabilityStatus` string Operational status of
the ambulance.

`isReceivingAssignments` boolean Indicates whether it
receives new
assignments.

`location` Location Current location.

`socketId` string / null Identifier of the
WebSocket connection,
if connected.

---

### 3.2.1 `ambulanceType` Values

Value Description

---

`TRANSPORT` Patient transport ambulance.
`BASIC` Basic life support ambulance.
`ADVANCED` Advanced life support ambulance.
`INTENSIVE_CARE` Intensive care ambulance.

### 3.2.2 `availabilityStatus` Values

Value Description

---

`AVAILABLE` Available to receive assignments.
`UNAVAILABLE` Unavailable to receive assignments.
`EN_ROUTE` En route to the incident scene.
`ON_SCENE` At the incident scene.
`HOSPITAL_REQUEST` Hospital transport request
`TRANSPORTING` Transporting the patient.
`ON_HOSPITAL` At the hospital.
`DISCONNECTED` Disconnected from the system.

`status` represents the unit's operational status.
`isReceivingAssignments` indicates whether the unit is enabled to
receive new assignments; the two attributes serve different purposes.

## 3.3 User

Represents the properties shared by system users.

```json
{
  "id": 5,
  "username": "operator@crum.com",
  "fullName": "John Smith",
  "role": "OPERATOR"
}
```

Attribute Type Description

---

`id` number User identifier.
`username` string Username or email address.
`fullName` string Full name.
`role` string Assigned role.

### 3.3.1 `role` Values

- `ADMIN`
- `OPERATOR`
- `AMBULANCE`
- `PATIENT`

### 3.3.2 Operator

Extended model for a CRUM operator.

```json
{
  "id": 5,
  "username": "operator@crum.com",
  "fullName": "John Smith",
  "role": "OPERATOR",
  "headquarters": "C5"
}
```

Attribute Type Description

---

`id` number Identifier of ththe operator.
`username` string Username.
`fullName` string Full name.
`role` string Rol `OPERATOR`.
`headquarters` string Headquarters or station to which it belongs.

### 3.3.3 Ambulance

Extended model for an ambulance.

```json
{
  "id": 8,
  "username": "ambulance@crum.com",
  "fullName": "Ambulance staff",
  "role": "AMBULANCE_STAFF"
}
```

Attribute Type Description

---

`id` number User identifier.
`username` string Username.
`fullName` string Full name.
`role` string Rol `AMBULANCE_STAFF`.

## 3.4 Emergency

Represents a medical incident from registration through closure.

```json
{
  "id": 105,
  "operatorId": 5,
  "contactPhone": "5635049272",
  "emergencyType": "HIGH",
  "description": "Patient injured in a traffic accident",
  "location": {
    "latitude": 19.5102018,
    "longitude": -99.1258884
  },
  "status": "ACTIVE"
}
```

---

Attribute Type Description

---

`id` number Identifier of the
emergency.

`operatorId` number Operator who registered
the emergency.

`contactPhone` string Contact phone number
associated with the
incident.

`emergencyType` string Priority or
classification of the
emergency.

`description` string Description of the
incident.

`location` Location Location of the
incident.

`status` string Current status of the
emergency.

---

### 3.4.1 `emergencyType` Values

- `HIGH`
- `MEDIUM`
- `LOW`

### 3.4.2 `status` Values

- `ACTIVE`
- `COMPLETED`
- `CANCELLED`

These statuses represent the overall emergency lifecycle. The statuses
and ambulance statuses are managed independently.

## 3.5 AmbulanceRequest

Represents the number and type of ambulances required for an emergency.

Ambulance requests are represented by the `ambulanceRequests` array.
Each item identifies the unit type and the required quantity.

```json
{
  "ambulanceRequests": [
    {
      "ambulanceType": "TRANSPORT",
      "quantity": 1
    },
    {
      "ambulanceType": "ADVANCED",
      "quantity": 1
    }
  ]
}
```

Attribute Type Description

---

`ambulanceType` string Requested ambulance type.
`quantityRequested` number Total requested quantity.
`quantityPending` number Quantity pending assignment.
`quantityAssigned` number Quantity already assigned.

## 3.6 Hospital

Represents a hospital registered in the system.

```json
{
  "id": 7,
  "name": "Hospital General",
  "phone": "5555555555",
  "location": {
    "latitude": 19.432,
    "longitude": -99.1332
  }
}
```

---

Attribute Type Description

---

`id` number Identifier of thel
hospital.

`name` string Hospital name.
establecimiento.

`phone` string Contact phone number.

`location` Location Geographic location.

---

## 3.7 Assignment

Represents the assignment of an ambulance to an emergency. An emergency
may have multiple assignments, each with its own status.

```json
{
  "id": 250,
  "emergencyId": 105,
  "ambulanceId": 12,
  "status": "SEARCHING",
  "requestedAmbulanceType": "BASIC"
}
```

Attribute Type Description

---

`id` number Identifier of the assignment.
`emergencyId` number Related emergency.
`ambulanceId` number Assigned ambulance.
`status` string Assignment status.
`assignedAt` string Assignment date and time.
`acceptedAt` string / null Acceptance date and time.
`rejectedAt` string / null Rejection date and time.

### 3.7.1 `status` Values

- `SEARCHING`
- `ASSIGNING`
- `EN_ROUTE`
- `ON_SCENE`
- `HOSPITAL_REQUEST`
- `ON_HOSPITAL`
- `CONNECTION_LOST`
- `COMPLETED`
- `CANCELLED`

## 3.8 Message

Represents a message exchanged bet|een the operator and ambulance
ambulance.

```json
{
  "id": 450,
  "emergencyId": 105,
  "senderId": 5,
  "receiverId": 8,
  "messageType": "TEXT",
  "content": "The ambulance has arrived at the incident scene.",
  "createdAt": "2026-11-19T15:40:00Z"
}
```

Attribute Type Description

---

`id` number Identifier of thel mensaje.
`emergencyId` number Related emergency.
`senderId` number User who sends the message.
`receiverId` number / null Recipient user.
`messageType` string Message type.
`content` string Message content.
`createdAt` string Sent date and time.

### 3.8.1 `messageType` Values

- `TEXT`
- `STATUS_UPDATE`
- `TRANSFER_REQUEST`
- `HOSPITAL_ASSIGNMENT`

## 3.9 Rating

Represents the user's service rating.

```json
{
  "id": 15,
  "emergencyId": 105,
  "userId": 20,
  "score": 5,
  "comment": "Excellent service.",
  "createdAt": "2026-11-19T17:00:00Z"
}
```

Attribute Type Description

---

`id` number Rating identifier.
`emergencyId` number Rated emergency.
`userId` number User submitting the rating.
`score` number Score from 1 to 5.
`comment` string / null Additional comment.
`createdAt` string Rating date and time.

---

# 4. General Response Formats

All HTTP responses follow a consistent structure. This simplifies result
and error handling in the web and mobile clients.

## 4.1 Successful Response

```json
{
  "success": true,
  "message": "Emergency created successfully.",
  "data": {
    "id": 105
  }
}
```

---

Attribute Type Description

---

`success` boolean Indicates whether the
operation fue exitosa.

`message` string Description of the
resultado.

`data` object / array / null Information returned by
the endpoint.

---

## 4.2 Error Response

```json
{
  "success": false,
  "message": "Invalid emergency data.",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "field": "location.latitude",
        "message": "Latitude must be between -90 and 90."
      }
    ]
  }
}
```

Attribute Type Description

---

`success` boolean Indicates that the operation failed.
`message` string General error description.
`error.code` string Error identifier code.
`error.details` array Details of the errors found.

## 4.3 HTTP Status Codes

Código Uso

---

`200 OK` Successful operation.
`201 Created` Resource created successfully.
`204 No Content` Successful operation with no response body.
`400 Bad Request` Invalid request.
`401 Unauthorized` User is not authenticated.
`403 Forbidden` Insufficient permissions to perform the operation.
`404 Not Found` Resource not found.
`409 Conflict` Conflict with the resource's current state.
`422 Unprocessable Entity` Invalid data.
`500 Internal Server Error` Internal server error.

---

# 5. REST Endpoints

The following endpoints describe the API's HTTP operations and the
structure of their requests and responses.

## 5.1 Ambulance Registration

**Method:** `POST`\
**Path:** `/users/register/ambulance`\
**Description:** Registers a user account associated with an ambulance.

### Request

```json
{
  "username": "ambulance@crum.com",
  "password": "StrongPassword123!",
  "ambulance": {
    "licensePlate": "ABC-123",
    "ambulanceType": "BASIC",
    "operationalBase": "CRUM"
  }
}
```

### Response --- `201 Created`

```json
{
  "success": true,
  "message": "Ambulance registered successfully.",
  "data": {
    "user": {
      "id": 8,
      "username": "ambulance@crum.com",
      "role": "AMBULANCE"
    },
    "ambulance": {
      "id": 8,
      "licensePlate": "ABC-123",
      "ambulanceType": "BASIC"
    }
  }
}
```

## 5.2 Operator Registration

**Method:** `POST`\
**Path:** `/users/register/operator`\
**Description:** Registers a CRUM operator account.

### Request

```json
{
  "username": "operator@crum.com",
  "password": "StrongPassword123!",
  "fullName": "Juan Perez",
  "headquarters": "C5"
}
```

### Response --- `201 Created`

```json
{
  "success": true,
  "message": "Operator registered successfully.",
  "data": {
    "user": {
      "id": 8,
      "username": "operator@crum.com",
      "role": "OPERATOR"
    },
    "operator": {
      "id": 8,
      "fullName": "Juan Perez",
      "headquarters": "C5"
    }
  }
}
```

## 5.3 Administrator Registration

**Method:** `POST`\
**Path:** `/users/register/admin`\
**Description:** Registers an administrator account. The
`accessPassword` is used to validate authorization for registration.

### Request

```json
{
  "username": "admin@crum.com",
  "password": "StrongPassword123!",
  "accessPassword": "ADMIN_REGISTRATION_SECRET"
}
```

### Response --- `201 Created`

```json
{
  "success": true,
  "message": "Administrator registered successfully.",
  "data": {
    "id": 1,
    "username": "admin@crum.com",
    "role": "ADMIN"
  }
}
```

## 5.4 Login

**Method:** `POST`\
**Path:** `/auth/login`\
**Description:** Authenticates the user and returns an access token.

### Request

```json
{
  "username": "ambulance@crum.com",
  "password": "StrongPassword123!"
}
```

### Response --- `200 OK`

```json
{
  "success": true,
  "message": "Authentication successful.",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 3600,
    "user": {
      "id": 8,
      "username": "ambulance@crum.com",
      "role": "AMBULANCE"
    }
  }
}
```

### Authorization

The token is included in protected requests through the HTTP header:

```http
Authorization: Bearer <accessToken>
```

## 5.5 Create a New Emergency

**Method:** `POST`\
**Path:** `/emergencies/new`\
**Description:** Registers an emergency and the required ambulance
quantities.

### Request

```json
{
  "contactPhone": "5635049272",
  "emergencyType": "HIGH",
  "description": "Patient injured in a traffic accident",
  "location": {
    "latitude": 19.5102018,
    "longitude": -99.1258884,
    "h3_index": "894995b98b7ffff"
  },
  "ambulanceRequests": [
    {
      "ambulanceType": "TRANSPORT",
      "quantity": 1
    },
    {
      "ambulanceType": "ADVANCED",
      "quantity": 1
    }
  ],
  "ignoreDuplicates": false
}
```

The server obtains `operatorId` from the authenticated session and
pending and assigned quantities for each ambulance type.

### Response --- `201 Created`

```json
{
  "success": true,
  "message": "Emergency registered successfully.",
  "data": {
    "emergency": {
      "id": 105,
      "operatorId": 5,
      "contactPhone": "5635049272",
      "emergencyType": "HIGH",
      "description": "Patient injured in a traffic accident",
      "location": {
        "latitude": 19.5102018,
        "longitude": -99.1258884
      },
      "status": "ACTIVE"
    },
    "assignments": [
      {
        "id": 250,
        "emergencyId": 105,
        "ambulanceId": NULL,
        "status": "SEARCHING",
        "requestedAmbulanceType": "TRANSPORT"
      },
      {
        "id": 251,
        "emergencyId": 105,
        "ambulanceId": NULL,
        "status": "SEARCHING",
        "requestedAmbulanceType": "ADVANCED"
      }
    ]
  }
}
```

## 5.6 Update Ambulance Location

**Method:** `PATCH`\
**Path:** `/ambulances/{ambulanceId}/location`\
**Description:** Updates an ambulance's geographic location.

### Request

```json
{
  "location": {
    "latitude": 19.5102018,
    "longitude": -99.1258884
  },
  "recordedAt": "2026-11-19T15:35:00Z"
}
```

### Response --- `200 OK`

```json
{
  "success": true,
  "message": "Ambulance location updated successfully.",
  "data": {
    "ambulanceId": 12,
    "location": {
      "latitude": 19.5102018,
      "longitude": -99.1258884,
      "h3Index": "8c2a1072b59ffff"
    },
    "updatedAt": "2026-11-19T15:35:00Z"
  }
}
```

The server calculates the H3 index from the coordinates and updates the
stored location.

Frequent location updates are transmitted through WebSockets to keep
ambulance positions synchronized in real time.

---

# 6. WebSocket Communication

WebSockets provide bidirectional communication between the server,
operators, and ambulance staff. The system uses them to transmit
locations, notifications, status changes, and messages.

## 6.1 General Event Structure

All events use a common structure:

```json
{
  "event": "ambulance:data.update",
  "data": {
    "id": 12,
    "licensePlate": "ABC-123",
    "ambulanceType": "BASIC",
    "operationalBase": "CRUM",
    "availabilityStatus": "AVAILABLE",
    "isReceivingAssignments": true,
    "location": {
      "latitude": 19.5102018,
      "longitude": -99.1258884,
      "h3Index": "8c2a1072b59ffff"
    }
  },
  "timestamp": "2026-11-19T15:35:00Z"
}
```

Attribute Type Description

---

`event` string Event name.
`data` object Data associated with the event.
`timestamp` string Event date and time.

## 6.2 Event Catalog

---

Evento Direction Description

---

`ambulance:data.update` Ambulance → Update of location.

`server:assignment` Server → New assignment.

`ambulance:assignment.accepted` Ambulance → Acceptance of assignment

`ambulance:assignment.rejected` Ambulance → Rejection of assignment.

`message.created` Bidirectional New message.

`hospital.assigned` Server → Ho spital selected y
Ambulance b the operator.
