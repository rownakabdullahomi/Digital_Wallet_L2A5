# Digital Wallet API - Backend System

**Live Demo**: [Digital Wallet on Vercel](https://digital-wallet-ashy.vercel.app)

## Table of Contents
- [Project Description](#project-description)
- [Key Features](#key-features)
- [Technologies Used](#technologies-used)
- [Folder Structure](#folder-structure)
- [Installation](#installation)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Error Handling](#error-handling)
- [Authentication](#authentication)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Project Description

The Digital Wallet API is a comprehensive backend system designed to facilitate secure financial transactions between users, agents, and administrators. This robust Node.js application provides a complete solution for digital wallet management, including user authentication, transaction processing, commission rate management, and wallet operations.

Built with TypeScript and Express.js, this system implements modern security practices including JWT authentication, Google OAuth 2.0, role-based access control, and secure cookie management. The modular architecture ensures maintainability and scalability as the application grows.

## Key Features

### User Management
- Role-based user system (USER, AGENT, ADMIN, SUPER_ADMIN)
- User registration and profile management
- Secure authentication with JWT and refresh tokens
- Google OAuth 2.0 integration
- Password reset functionality

### Wallet Operations
- Wallet creation and management
- Wallet status updates (admin-controlled)
- Transaction history tracking
- Balance management

### Transaction System
- Cash-in/cash-out requests
- Agent approval workflow
- Peer-to-peer money transfers
- Transaction history with pagination
- Commission rate application for agents

### Administration
- Super Admin dashboard
- Commission rate management
- User management
- Comprehensive transaction monitoring

### Security
- JWT authentication with access/refresh tokens
- Secure HTTP-only cookies
- Role-based route protection
- Input validation with Zod
- Comprehensive error handling

## Technologies Used

### Core Stack
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe JavaScript
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### Authentication
- **Passport.js** - Authentication middleware
- **JSON Web Tokens** - Secure token-based auth
- **Google OAuth 2.0** - Social login
- **bcryptjs** - Password hashing

### Utilities
- **Zod** - Schema validation
- **http-status-codes** - Standard HTTP status codes
- **dotenv** - Environment variables
- **cookie-parser** - Cookie handling

### Development Tools
- **ts-node-dev** - TypeScript execution
- **ESLint** - Code linting
- **Prettier** - Code formatting

## Folder Structure

```
src/
├── app/
│   ├── config/
│   │   ├── env.ts
│   │   └── passport.ts
│   ├── error/
│   │   ├── AppError.ts
│   │   └── helpers/
│   │       ├── handleCastError.ts
│   │       ├── handleDuplicateError.ts
│   │       ├── handleValidationError.ts
│   │       └── handleZodError.ts
│   ├── interfaces/
│   │   ├── error.types.ts
│   │   └── index.d.ts
│   ├── middlewares/
│   │   ├── checkAuth.ts
│   │   ├── globalErrorHandler.ts
│   │   ├── notFound.ts
│   │   └── validateRequest.ts
│   └── modules/
│       ├── auth/
│       │   ├── auth.controller.ts
│       │   ├── auth.routes.ts
│       │   └── auth.service.ts
│       ├── commissionRate/
│       │   ├── commissionRate.controller.ts
│       │   ├── commissionRate.model.ts
│       │   └── commissionRate.routes.ts
│       ├── transaction/
│       │   ├── transaction.controller.ts
│       │   ├── transaction.interface.ts
│       │   ├── transaction.model.ts
│       │   ├── transaction.routes.ts
│       │   ├── transaction.service.ts
│       │   └── transaction.validation.ts
│       ├── user/
│       │   ├── user.controller.ts
│       │   ├── user.interface.ts
│       │   ├── user.model.ts
│       │   ├── user.routes.ts
│       │   ├── user.service.ts
│       │   └── user.validation.ts
│       └── wallet/
│           ├── wallet.controller.ts
│           ├── wallet.interface.ts
│           ├── wallet.model.ts
│           ├── wallet.routes.ts
│           ├── wallet.service.ts
│           └── wallet.validation.ts
├── routes/
│   └── routes.ts
├── utils/
│   ├── catchAsync.ts
│   ├── constants.ts
│   ├── jwt.ts
│   ├── QueryBuilder.ts
│   ├── seedSuperAdmin.ts
│   ├── sendResponse.ts
│   ├── setCookie.ts
│   ├── userTokens.ts
│   └── validateUserById.ts
├── app.ts
└── server.ts
```

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB instance
- Google OAuth credentials (for social login)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/rownakabdullahomi/Digital_Wallet_L2A5.git
   cd Digital_Wallet_L2A5
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory based on the `.env.example` template:
   ```env
   PORT=5000
   DATABASE_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/digital-wallet
   NODE_ENV=development
   JWT_ACCESS_SECRET=your_access_token_secret
   JWT_ACCESS_EXPIRES=1h
   JWT_REFRESH_SECRET=your_refresh_token_secret
   JWT_REFRESH_EXPIRES=7d
   BCRYPT_SALT_ROUND=12
   SUPER_ADMIN_EMAIL=admin@example.com
   SUPER_ADMIN_PASSWORD=secure_password
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback
   EXPRESS_SESSION_SECRET=your_session_secret
   FRONTEND_URL=http://localhost:3000
   ```

4. **Run the application**
   - Development mode:
     ```bash
     npm run dev
     ```
   - Production mode:
     ```bash
     npm run build
     npm start
     ```

5. **Seed the super admin**
   The super admin account will be automatically created on server startup using the credentials from your `.env` file.

## API Documentation

The API follows RESTful principles and uses JSON for data exchange. All endpoints are prefixed with `/api/v1`.

### Authentication
- `POST /api/v1/auth/login` - User login with credentials
- `POST /api/v1/auth/refresh-token` - Refresh access token
- `POST /api/v1/auth/logout` - Logout user
- `POST /api/v1/auth/reset-password` - Reset password
- `GET /api/v1/auth/google` - Initiate Google OAuth
- `GET /api/v1/auth/google/callback` - Google OAuth callback

### User Management
- `POST /api/v1/user/register` - Register new user
- `GET /api/v1/user/all-users` - Get all users (admin only)
- `PATCH /api/v1/user/:id` - Update user information

### Wallet Operations
- `PATCH /api/v1/wallet/update-status/:walletId` - Update wallet status (admin only)

### Transactions
- `POST /api/v1/transaction/agent-add-money/:userId` - Add money to agent wallet
- `POST /api/v1/transaction/user-cash-in-out` - User cash in/out request
- `POST /api/v1/transaction/cash-in-out-approval-from-agent` - Agent approval for transactions
- `POST /api/v1/transaction/send-money` - Send money to another user
- `GET /api/v1/transaction/history/:walletId` - Get transaction history for wallet
- `GET /api/v1/transaction/all-history` - Get all transactions (admin only)

### Commission Rates
- `GET /api/v1/commission` - Get current commission rate (admin only)
- `PATCH /api/v1/commission/update` - Update commission rate (admin only)

## Environment Variables

The application requires the following environment variables:

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| PORT | Port to run the server | Yes | 5000 |
| DATABASE_URI | MongoDB connection URI | Yes | - |
| NODE_ENV | Application environment | Yes | development |
| JWT_ACCESS_SECRET | Secret for access tokens | Yes | - |
| JWT_ACCESS_EXPIRES | Access token expiration | Yes | 1h |
| JWT_REFRESH_SECRET | Secret for refresh tokens | Yes | - |
| JWT_REFRESH_EXPIRES | Refresh token expiration | Yes | 7d |
| BCRYPT_SALT_ROUND | Salt rounds for password hashing | Yes | - |
| SUPER_ADMIN_EMAIL | Super admin email | Yes | - |
| SUPER_ADMIN_PASSWORD | Super admin password | Yes | - |
| GOOGLE_CLIENT_ID | Google OAuth client ID | No | - |
| GOOGLE_CLIENT_SECRET | Google OAuth client secret | No | - |
| GOOGLE_CALLBACK_URL | Google OAuth callback URL | No | - |
| EXPRESS_SESSION_SECRET | Session secret | Yes | - |
| FRONTEND_URL | Frontend application URL | Yes | http://localhost:5173 |

## Error Handling

The API implements a comprehensive error handling system with:

- Custom `AppError` class for consistent error responses
- Global error handler middleware
- Specialized error handlers for:
  - Mongoose validation errors
  - Duplicate key errors
  - Cast errors (invalid ID formats)
  - Zod validation errors

Error responses include:
- HTTP status code
- Error message
- Error sources (for validation errors)
- Stack trace (in development)

Example error response:
```json
{
  "success": false,
  "message": "Validation Error",
  "errorSources": [
    {
      "path": "email",
      "message": "Email is required"
    },
    {
      "path": "password",
      "message": "Password must be at least 8 characters"
    }
  ]
}
```

## Authentication

### JWT Authentication
- Uses access and refresh tokens
- Access tokens are short-lived (1 hour)
- Refresh tokens are long-lived (7 days) and stored in HTTP-only cookies
- Tokens contain user ID, email, and role for authorization

### Google OAuth 2.0
- Implements Passport.js Google strategy
- Returns JWT tokens upon successful authentication
- Supports session-less authentication

### Password Security
- bcryptjs for password hashing
- Salt rounds for strong hashing
- Password reset functionality

### Role-Based Access Control
Four user roles with different permissions:
1. **USER**: Basic wallet operations
2. **AGENT**: Can approve cash-in/out requests
3. **ADMIN**: Can manage commission rates, view all transactions, manage updates and others
4. **SUPER_ADMIN**: Full system access

## Deployment

The application is deployed on Vercel and can be accessed at:
[https://digital-wallet-ashy.vercel.app](https://digital-wallet-ashy.vercel.app)

### Deployment Steps
1. Set up MongoDB Atlas database
2. Configure production environment variables
3. Build the TypeScript application:
   ```bash
   npm run build
   ```
4. Start the production server:
   ```bash
   npm start
   ```

For Vercel deployment:
1. Connect your GitHub repository
2. Configure environment variables in Vercel dashboard
3. Set build command: `npm run build`
4. Set output directory: `dist`

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards
- Follow existing code style
- Use TypeScript types consistently
- Write unit tests for new features
- Document new endpoints
- Keep commits atomic and well-described



---

**Project Maintainer**: Rownak Abdullah
**GitHub**: [rownakabdullahomi](https://github.com/rownakabdullahomi)  
**Live Demo**: [Digital Wallet on Vercel](https://digital-wallet-ashy.vercel.app)