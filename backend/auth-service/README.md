# Auth Service – PlayGrid

## Package Structure

```
com.playgrid.authService
├── controller     REST endpoints (AuthController, UserController)
├── service        Business logic (AuthService)
├── repository     Spring Data JPA repositories
├── entity         JPA entity (User) and the Role enum
├── dto            Request/response payloads
├── config         Non-security beans (PasswordEncoder, AuthenticationManager)
├── security       SecurityConfig, JwtAuthFilter, CustomUserDetailsService
├── exception      Custom exceptions + GlobalExceptionHandler
└── util           JwtService (token generation/validation)
```

## Accessing via the API Gateway

The `api-gateway` module (port `8080`) routes to this service through Eureka service discovery:

| Gateway path | Forwarded to |
|---|---|
| `http://localhost:8080/auth/**` | `auth-service` `/auth/**` |
| `http://localhost:8080/users/**` | `auth-service` `/users/**` |

So once Eureka, the gateway, and this service are all running, we can call the same endpoints through `http://localhost:8080` instead of `http://localhost:8081` directly. See `playGrid/api-gateway/src/main/resources/application.properties` for the route definitions.

## API Endpoints

### `POST /auth/register` — public

Registers a new user, assigns `ROLE_USER`, and returns a JWT.

Request:
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

Response `201 Created`:
```json
{
  "token": "eyJhbGciOi...",
  "type": "Bearer",
  "username": "johndoe",
  "email": "john@example.com",
  "role": "ROLE_USER"
}
```

### `POST /auth/login` — public

Authenticates a user and returns a JWT.

Request:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response `200 OK`: same shape as register.

### `GET /users/profile` — protected

Returns the authenticated user's profile. Requires header:
```
Authorization: Bearer <token>
```

Response `200 OK`:
```json
{
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "role": "ROLE_USER"
}
```

## Error Responses

All errors are handled by `GlobalExceptionHandler` and returned as JSON:

```json
{
  "timestamp": "2024-01-01T12:00:00",
  "status": 409,
  "error": "Email already in use: john@example.com"
}
```

| Scenario | Status |
|---|---|
| Validation failure (bad request body) | 400 |
| Email already registered | 409 |
| Wrong email/password on login | 401 |
| Requested user/role not found | 404 |
| No/invalid token on a protected route | 403 |
| Unexpected server error | 500 |

## Security Notes

- Passwords are hashed with BCrypt, never stored in plain text.
- Sessions are stateless — every request must carry its own JWT.
- CSRF is disabled since there are no browser-based sessions/cookies.
- CORS is open (`*`) for local development.

## Tests

Run with:
```
./mvnw test
```

Included tests:
- `AuthServiceTest` — registration and login business logic (Mockito)
- `AuthControllerTest` — controller request/response behavior (`@WebMvcTest`)
- `JwtServiceTest` — token generation, validation, and expiry
- `SecurityConfigTest` — public vs protected endpoint access rules
