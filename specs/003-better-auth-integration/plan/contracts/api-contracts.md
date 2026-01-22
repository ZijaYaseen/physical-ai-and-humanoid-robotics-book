# Better Auth Integration API Contracts

## Authentication Endpoints

### POST /api/auth/signup
Register a new user account

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required, min 8 chars)",
  "name": "string (optional)",
  "oauth_provider": "string (optional, google|github)",
  "oauth_token": "string (optional)"
}
```

**Responses:**
- 201 Created: `{"success": true, "user_id": "UUID", "session_token": "string"}`
- 400 Bad Request: `{"error": "validation_error", "details": "error message"}`
- 409 Conflict: `{"error": "user_exists", "details": "email already registered"}`

### POST /api/auth/signin
Authenticate user and create session

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)",
  "oauth_provider": "string (optional, google|github)",
  "oauth_token": "string (optional)"
}
```

**Responses:**
- 200 OK: `{"success": true, "user_id": "UUID", "session_token": "string", "profile_complete": "boolean"}`
- 401 Unauthorized: `{"error": "invalid_credentials", "details": "invalid email or password"}`
- 403 Forbidden: `{"error": "account_locked", "details": "account temporarily locked"}`

### POST /api/auth/signout
Terminate current user session

**Headers:**
- Authorization: Bearer {session_token}

**Responses:**
- 200 OK: `{"success": true}`
- 401 Unauthorized: `{"error": "unauthorized", "details": "invalid session token"}`

### GET /api/auth/me
Get current user profile information

**Headers:**
- Authorization: Bearer {session_token}

**Responses:**
- 200 OK: `{"user_id": "UUID", "email": "string", "name": "string", "profile": {...}, "permissions": ["string"]}`
- 401 Unauthorized: `{"error": "unauthorized", "details": "invalid session token"}`

### POST /api/auth/forgot-password
Request password reset

**Request Body:**
```json
{
  "email": "string (required)"
}
```

**Responses:**
- 200 OK: `{"success": true, "message": "reset email sent"}`
- 400 Bad Request: `{"error": "validation_error", "details": "invalid email"}`
- 404 Not Found: `{"error": "user_not_found", "details": "no account found for email"}`

### POST /api/auth/reset-password
Reset password with token

**Request Body:**
```json
{
  "token": "string (required)",
  "new_password": "string (required, min 8 chars)"
}
```

**Responses:**
- 200 OK: `{"success": true, "message": "password reset successful"}`
- 400 Bad Request: `{"error": "validation_error", "details": "invalid token or password"}`
- 401 Unauthorized: `{"error": "invalid_token", "details": "reset token invalid or expired"}`

## Profile Management Endpoints

### GET /api/profile
Get user profile information

**Headers:**
- Authorization: Bearer {session_token}

**Responses:**
- 200 OK:
```json
{
  "user_id": "UUID",
  "programming_experience": "beginner|intermediate|advanced",
  "os_preference": "windows|macos|linux|other",
  "development_tools": ["string"],
  "device_type": "desktop|laptop|tablet|other",
  "personalization_enabled": "boolean",
  "consent_given": "boolean",
  "profile_updated_at": "ISO timestamp",
  "data_retention_expires": "ISO timestamp"
}
```
- 401 Unauthorized: `{"error": "unauthorized", "details": "invalid session token"}`

### PUT /api/profile
Update user profile information

**Headers:**
- Authorization: Bearer {session_token}

**Request Body:**
```json
{
  "programming_experience": "beginner|intermediate|advanced",
  "os_preference": "windows|macos|linux|other",
  "development_tools": ["string"],
  "device_type": "desktop|laptop|tablet|other",
  "personalization_enabled": "boolean",
  "consent_given": "boolean"
}
```

**Responses:**
- 200 OK: `{"success": true, "message": "profile updated", "profile": {...}}`
- 400 Bad Request: `{"error": "validation_error", "details": "validation message"}`
- 401 Unauthorized: `{"error": "unauthorized", "details": "invalid session token"}`

### DELETE /api/profile
Delete user account and all associated data

**Headers:**
- Authorization: Bearer {session_token}

**Request Body:**
```json
{
  "confirm_delete": "boolean (required, must be true)",
  "deletion_reason": "string (optional)"
}
```

**Responses:**
- 200 OK: `{"success": true, "message": "account and data deleted"}`
- 400 Bad Request: `{"error": "validation_error", "details": "confirmation required"}`
- 401 Unauthorized: `{"error": "unauthorized", "details": "invalid session token"}`

### POST /api/profile/export
Export user data for GDPR compliance

**Headers:**
- Authorization: Bearer {session_token}

**Responses:**
- 200 OK: `{"success": true, "export_url": "string", "expires_at": "ISO timestamp"}`
- 401 Unauthorized: `{"error": "unauthorized", "details": "invalid session token"}`

### PUT /api/profile/preferences
Update personalization preferences

**Headers:**
- Authorization: Bearer {session_token}

**Request Body:**
```json
{
  "personalization_enabled": "boolean",
  "preferred_content_format": "text|video|interactive|audio",
  "custom_interests": ["string"]
}
```

**Responses:**
- 200 OK: `{"success": true, "preferences": {...}}`
- 400 Bad Request: `{"error": "validation_error", "details": "validation message"}`
- 401 Unauthorized: `{"error": "unauthorized", "details": "invalid session token"}`

## Personalization Endpoints

### GET /api/personalization/context
Get current personalization context

**Headers:**
- Authorization: Bearer {session_token}

**Responses:**
- 200 OK:
```json
{
  "user_id": "UUID",
  "last_course_module_visited": "string",
  "preferred_content_format": "text|video|interactive|audio",
  "difficulty_override": "beginner|intermediate|advanced|null",
  "custom_interests": ["string"],
  "personalization_enabled": "boolean"
}
```
- 401 Unauthorized: `{"error": "unauthorized", "details": "invalid session token"}`

### PUT /api/personalization/context
Update personalization context

**Headers:**
- Authorization: Bearer {session_token}

**Request Body:**
```json
{
  "last_course_module_visited": "string",
  "preferred_content_format": "text|video|interactive|audio",
  "difficulty_override": "beginner|intermediate|advanced|null",
  "custom_interests": ["string"]
}
```

**Responses:**
- 200 OK: `{"success": true, "context": {...}}`
- 400 Bad Request: `{"error": "validation_error", "details": "validation message"}`
- 401 Unauthorized: `{"error": "unauthorized", "details": "invalid session token"}`

### POST /api/personalization/opt-out
Temporarily disable personalization

**Headers:**
- Authorization: Bearer {session_token}

**Request Body:**
```json
{
  "opt_out_reason": "string (optional)"
}
```

**Responses:**
- 200 OK: `{"success": true, "message": "personalization disabled", "previous_setting": "boolean"}`
- 401 Unauthorized: `{"error": "unauthorized", "details": "invalid session token"}`

### POST /api/personalization/opt-in
Re-enable personalization

**Headers:**
- Authorization: Bearer {session_token}

**Responses:**
- 200 OK: `{"success": true, "message": "personalization enabled"}`
- 401 Unauthorized: `{"error": "unauthorized", "details": "invalid session token"}`

## Enhanced RAG Integration Endpoints

### POST /api/query
Enhanced query endpoint that includes user context

**Headers:**
- Authorization: Bearer {session_token} (optional, for personalization)

**Request Body:**
```json
{
  "query": "string (required)",
  "selected_text": "string (optional)",
  "mode": "augment", // Default, strict mode removed
  "session_id": "string (optional)",
  "top_k": "integer (optional, default 5)"
}
```

**Responses:**
- 200 OK:
```json
{
  "answer": "string",
  "retrieved": [
    {
      "source_path": "string",
      "chunk_id": "string",
      "text": "string",
      "score": "float",
      "page_title": "string"
    }
  ],
  "session_id": "string",
  "mode": "augment",
  "personalized": "boolean" // Indicates if response was personalized
}
```
- 400 Bad Request: `{"error": "validation_error", "details": "validation message"}`

### POST /api/chatkit/session
Enhanced session endpoint with user profile context

**Headers:**
- Authorization: Bearer {session_token} (optional, for personalization)

**Request Body:**
```json
{
  "session_id": "string (optional)",
  "user_preferences": {
    "programming_level": "string",
    "os_preference": "string",
    "tools_familiarity": ["string"],
    "personalization_enabled": "boolean"
  }
}
```

**Responses:**
- 200 OK:
```json
{
  "session_id": "string",
  "messages": [
    {
      "id": "string",
      "role": "user|assistant",
      "content": "string",
      "timestamp": "ISO timestamp",
      "retrieved_chunks": ["RetrievedChunk"]
    }
  ],
  "created": "boolean",
  "personalized": "boolean"
}
```
- 400 Bad Request: `{"error": "validation_error", "details": "validation message"}`

## Session Management Endpoints

### GET /api/session/status
Get current session status

**Headers:**
- Authorization: Bearer {session_token}

**Responses:**
- 200 OK:
```json
{
  "authenticated": "boolean",
  "user_id": "UUID",
  "session_expires_at": "ISO timestamp",
  "personalization_enabled": "boolean",
  "last_activity": "ISO timestamp"
}
```
- 401 Unauthorized: `{"error": "unauthorized", "details": "invalid session token"}`

### PUT /api/session/extend
Extend current session

**Headers:**
- Authorization: Bearer {session_token}

**Request Body:**
```json
{
  "extend_by_minutes": "integer (optional, default 60)"
}
```

**Responses:**
- 200 OK: `{"success": true, "new_expires_at": "ISO timestamp"}`
- 400 Bad Request: `{"error": "validation_error", "details": "validation message"}`
- 401 Unauthorized: `{"error": "unauthorized", "details": "invalid session token"}`

## Error Response Format

All error responses follow this format:
```json
{
  "error": "error_code",
  "message": "human-readable message",
  "details": "specific details about the error",
  "timestamp": "ISO timestamp",
  "request_id": "unique identifier for the request"
}
```

## Common Headers

### Authentication
- `Authorization: Bearer {session_token}` - Required for authenticated endpoints

### Request Identification
- `X-Request-ID: string` - Optional, client-generated request identifier
- `User-Agent: string` - Required, identifies the client application

### Rate Limiting
- `X-RateLimit-Limit: integer` - Maximum requests allowed in the current window
- `X-RateLimit-Remaining: integer` - Remaining requests in the current window
- `X-RateLimit-Reset: ISO timestamp` - Time when the rate limit resets