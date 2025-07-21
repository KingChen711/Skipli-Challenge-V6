# LearnHub

## Architecture

This project consists of two main components:

- **Client**: React Router v7 application with TypeScript and Tailwind CSS
- **Server**: Express.js API server with TypeScript and Firebase integration

## Tech Stack

### Frontend
- React 19 with React Router v7
- TypeScript
- Tailwind CSS v4
- ShadCN UI components
- TanStack Query for data fetching
- Socket.IO client for real-time features
- React Hook Form with Zod validation

### Backend
- Node.js with Express.js
- TypeScript
- Firebase Admin SDK
- Socket.IO for real-time communication
- JWT authentication
- Nodemailer for email services
- Inversify for dependency injection

## Getting Started

### Prerequisites

- Node.js
- npm
- Firebase project (for database)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/KingChen711/Skipli-ChallengeV6-
```

2. Install dependencies for both client and server:
```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### Configuration

#### Server Configuration

1. Copy the environment example file:
```bash
cd server
cp .env.example .env
```

2. Update the `.env` file with your configuration:
```env
PORT=5000
ALLOWED_ORIGINS=http://localhost:5173

AWS_ACCESS_KEY=
AWS_SECRET_KEY=
AWS_REGION=

JWT_SECRET=
JWT_EXPIRES_IN=

NODEMAILER_HOST=smtp.gmail.com
NODEMAILER_PORT=587
NODEMAILER_USER=
NODEMAILER_PASSWORD=

FRONTEND_URL=http://localhost:5173
```

3. Add your `firebase.key.json` to server folder

4. Seed data
```bash
npm run seed
```

#### Client Configuration

The client is configured to connect to the server at `http://localhost:5000` by default. Update `client/.env` if needed:
```env
VITE_PUBLIC_API_ENDPOINT=http://localhost:5000
```

### Development

Start both the client and server in development mode:

```bash
# Terminal 1 - Start the server
cd server
npm run dev

# Terminal 2 - Start the client
cd client
npm run dev
```

The client will be available at `http://localhost:5173` and the server at `http://localhost:5000`.

### Building for Production

#### Client
```bash
cd client
npm run build
npm run start
```

#### Server
```bash
cd server
npm run build
npm run start
```

## Scripts

### Client Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start:csr` - Start production server
- `npm run lint` - Run ESLint
- `npm run prettier` - Check code formatting

### Server Scripts
- `npm run dev` - Start development server with nodemon
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run seed` - Run database seeding
- `npm run lint` - Run ESLint
- `npm run prettier` - Check code formatting