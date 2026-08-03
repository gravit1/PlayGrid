# PlayGrid - Full-Stack Digital Game Store

PlayGrid is a full-stack digital game store platform modeled after Steam. It features a microservices backend built with Spring Cloud and a dynamic frontend built with React, TypeScript, and Tailwind CSS.

## Project Structure

```
playGrid/
├── backend/                  # Spring Cloud Microservices Architecture
│   ├── eureka-server/        # Service Registry (Port 8761)
│   ├── api-gateway/          # Spring Cloud Gateway & Security (Port 8080)
│   ├── auth-service/         # User Auth & JWT Token Issuance (Port 8081)
│   ├── game-service/         # Game Catalog Management (Port 8082)
│   ├── library-service/      # User Owned Games & Fulfillment (Port 8083)
│   ├── wishlist-service/     # Wishlist Management (Port 8084)
│   ├── review-service/       # Game Reviews & Ratings (Port 8085)
│   └── order-service/        # Order Processing & Transactions (Port 8086)
│
└── frontend/                 # React + TypeScript + Vite Client Application
    ├── src/
    │   ├── components/       # Reusable UI components & layouts
    │   ├── context/          # AuthContext & CartContext
    │   ├── pages/            # Public, User, and Admin views
    │   └── services/         # Axios API clients for backend microservices
    └── package.json
```

## Getting Started

### Backend Microservices
1. Start PostgreSQL server and ensure databases exist.
2. Start `eureka-server` (Port 8761).
3. Start `api-gateway` (Port 8080).
4. Start core microservices (`auth-service`, `game-service`, `library-service`, `wishlist-service`, `review-service`, `order-service`).

### Frontend Client
1. Navigate to `frontend/`:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
2. Open `http://localhost:5173` in your browser.
