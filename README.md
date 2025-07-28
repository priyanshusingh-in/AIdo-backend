# AI Scheduling Backend

A powerful Node.js backend application that uses Google Gemini AI to process natural language scheduling requests and store them in MongoDB. Users can provide prompts in natural language, and the AI will extract scheduling information and return it in JSON format for database storage.

## 🚀 Features

- **Natural Language Processing**: Convert natural language prompts to structured scheduling data using Google Gemini AI
- **Comprehensive Scheduling**: Support for meetings, reminders, tasks, and appointments
- **RESTful API**: Full CRUD operations for schedules
- **Type Safety**: Built with TypeScript for better development experience
- **Security**: Rate limiting, CORS, helmet, and input validation
- **Logging**: Comprehensive logging with Winston
- **Error Handling**: Robust error handling and validation
- **Database**: MongoDB integration with Mongoose ODM
- **Documentation**: Well-documented API endpoints

## 🛠 Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **AI**: Google Gemini AI
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Winston
- **Validation**: Express Validator

## 📋 Prerequisites

- Node.js 18 or higher
- MongoDB instance (local or cloud)
- Google Gemini API key

## 🚀 Quick Start

### Production API

**Live API URL:** `[Your Production URL]`

**Available Endpoints:**

- Health Check: `[Your Production URL]/health`
- API Base: `[Your Production URL]/api/v1`
- Authentication: `[Your Production URL]/api/v1/auth`
- Schedules: `[Your Production URL]/api/v1/schedules`

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd ai-scheduling-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the example environment file and configure your variables:

```bash
cp env.example .env
```

Edit `.env` file with your configuration:

**Development Configuration:**

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Configuration (Local)
MONGODB_URI=mongodb://localhost:27017/ai-scheduling-app

# Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Security
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

**Production Configuration (MongoDB Atlas):**

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# MongoDB Configuration (Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-scheduling-app?retryWrites=true&w=majority

# Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Security
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

### 4. Start the Application

**Development mode:**

```bash
npm run dev
```

**Production mode:**

```bash
npm run build
npm start
```

The server will start on `http://localhost:3000`

## 📚 API Documentation

### Base URL

**Development:**

```
http://localhost:3000/api/v1
```

**Production:**

```
[Your Production URL]/api/v1
```

### Authentication Endpoints

#### 1. Register User (POST `/auth/register`)

Register a new user account.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id_here",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "isActive": true
    },
    "token": "jwt_token_here"
  },
  "message": "User registered successfully"
}
```

#### 2. Login User (POST `/auth/login`)

Authenticate user and get access token.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id_here",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "isActive": true
    },
    "token": "jwt_token_here"
  },
  "message": "Login successful"
}
```

#### 3. Get User Profile (GET `/auth/profile`)

Get current user's profile information.

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "user_id_here",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "isActive": true,
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  }
}
```

### Schedule Endpoints

#### 1. Create Schedule (POST `/schedules`)

Create a new schedule from natural language prompt.

**Headers:**

```
Authorization: Bearer <jwt_token> (optional - for user-specific schedules)
```

**Request Body:**

```json
{
  "prompt": "Schedule a meeting with John next Tuesday at 10 AM"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "type": "meeting",
    "title": "Meeting with John",
    "description": "Meeting scheduled with John",
    "date": "2024-01-16",
    "time": "10:00",
    "duration": 60,
    "participants": ["John"],
    "priority": "medium",
    "category": "work",
    "userId": "optional-user-id",
    "aiPrompt": "Schedule a meeting with John next Tuesday at 10 AM",
    "aiResponse": "{\"type\":\"meeting\",\"title\":\"Meeting with John\",...}",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  },
  "message": "Schedule created successfully"
}
```

#### 2. Get All Schedules (GET `/schedules`)

Retrieve all schedules with pagination.

**Headers:**

```
Authorization: Bearer <jwt_token> (required)
```

**Query Parameters:**

- `limit` (optional): Number of records to return (default: 50)
- `offset` (optional): Number of records to skip (default: 0)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "type": "meeting",
      "title": "Meeting with John",
      "date": "2024-01-16",
      "time": "10:00"
      // ... other fields
    }
  ],
  "message": "Found 1 schedules"
}
```

#### 3. Get Schedule by ID (GET `/schedules/:id`)

Retrieve a specific schedule by its ID.

**Query Parameters:**

- `userId` (optional): Filter by user ID

#### 4. Update Schedule (PUT `/schedules/:id`)

Update an existing schedule.

**Query Parameters:**

- `userId` (optional): Filter by user ID

**Request Body:**

```json
{
  "title": "Updated Meeting Title",
  "description": "Updated description"
}
```

#### 5. Delete Schedule (DELETE `/schedules/:id`)

Delete a schedule by its ID.

**Query Parameters:**

- `userId` (optional): Filter by user ID

#### 6. Get Schedules by Date Range (GET `/schedules/date-range`)

Retrieve schedules within a specific date range.

**Query Parameters:**

- `startDate`: Start date (YYYY-MM-DD)
- `endDate`: End date (YYYY-MM-DD)
- `userId` (optional): Filter by user ID

#### 7. Get Schedules by Type (GET `/schedules/type/:type`)

Retrieve schedules by type (meeting, reminder, task, appointment).

**Query Parameters:**

- `userId` (optional): Filter by user ID

### Health Check

**GET `/health`**

Returns the health status of the application.

```json
{
  "success": true,
  "message": "AI Scheduling Backend is running",
  "timestamp": "2024-01-15T10:00:00.000Z",
  "environment": "development",
  "database": "connected"
}
```

## 🤖 AI Prompt Examples

The application can handle various natural language prompts:

### Meeting Scheduling

```
"Schedule a meeting with John next Tuesday at 10 AM"
"Set up a team meeting tomorrow at 2 PM for 1 hour"
"Book a meeting room for Friday 3 PM with Sarah and Mike"
```

### Reminders

```
"Remind me to call Sarah tomorrow at 3 PM"
"Set a reminder for dentist appointment next Monday at 9 AM"
"Remind me to pick up groceries today at 6 PM"
```

### Tasks

```
"Add a task to review quarterly reports by Friday"
"Create a task to send project proposal by end of day"
"Schedule a task to update website content tomorrow morning"
```

### Appointments

```
"Book a doctor's appointment for next Wednesday at 11 AM"
"Schedule a haircut appointment for Saturday at 2 PM"
"Make an appointment with the accountant for tax filing"
```

## 📊 Database Schema

### Schedule Collection

```typescript
{
  type: 'meeting' | 'reminder' | 'task' | 'appointment',
  title: string,
  description?: string,
  date: string, // YYYY-MM-DD
  time: string, // HH:MM
  duration?: number, // minutes
  participants?: string[],
  location?: string,
  priority?: 'low' | 'medium' | 'high',
  category?: string,
  metadata?: Record<string, any>,
  userId?: string,
  aiPrompt: string,
  aiResponse: string,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔧 Configuration

### Environment Variables

| Variable                  | Description               | Default     |
| ------------------------- | ------------------------- | ----------- |
| `PORT`                    | Server port               | 3000        |
| `NODE_ENV`                | Environment               | development |
| `MONGODB_URI`             | MongoDB connection string | -           |
| `GEMINI_API_KEY`          | Google Gemini API key     | -           |
| `JWT_SECRET`              | JWT secret key            | -           |
| `RATE_LIMIT_WINDOW_MS`    | Rate limit window         | 900000      |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window   | 100         |
| `LOG_LEVEL`               | Logging level             | info        |

## 🚀 Deployment

### Production Deployment (Render)

**Live Application:** `[Your Production URL]`

**Deployment Configuration:**

- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`
- **Environment:** Node.js 18+
- **Auto-deploy:** On commit to main branch

**Required Environment Variables:**

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-scheduling-app?retryWrites=true&w=majority
JWT_SECRET=your-64-character-random-hex-string
GEMINI_API_KEY=AIzaSyC...your-actual-gemini-api-key
NODE_ENV=production
PORT=3000
JWT_EXPIRES_IN=7d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
```

### Docker Deployment

1. Build the Docker image:

```bash
docker build -t ai-scheduling-backend .
```

2. Run the container:

```bash
docker run -p 3000:3000 --env-file .env ai-scheduling-backend
```

### Local Production Deployment

1. Set environment variables for production
2. Build the application:

```bash
npm run build
```

3. Start the production server:

```bash
npm start
```

## 🧪 Testing

Run tests:

```bash
npm test
```

### Testing Authentication

Test the authentication endpoints:

```bash
node test-auth.js
```

This will test:

- User registration
- User login
- Protected routes
- Schedule creation with authentication
- Error handling for invalid credentials

## 📝 Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository.

## 📋 Recent Updates

### Version 2.1.0 (July 2024)

- ✅ **Production Deployment**: Successfully deployed to production environment
- ✅ **Build Fixes**: Resolved TypeScript compilation issues for production builds
- ✅ **Database**: Enhanced MongoDB connection with better error handling
- ✅ **Environment**: Improved environment variable validation and error reporting
- ✅ **Logging**: Added detailed startup logging and error reporting
- ✅ **Security**: Fixed JWT signing type compatibility issues
- ✅ **Performance**: Removed duplicate database index warnings
- ✅ **Documentation**: Updated with production deployment information

### Previous Versions

- **Version 2.0.0**: Added comprehensive user authentication system with JWT
- **Version 1.0.0**: Initial release with AI scheduling functionality

## 🔗 Related Projects

- [Med-AI Backend](https://github.com/pooranjoyb/med-ai-be) - Similar AI-powered healthcare application
- [Resume Optimizer](https://github.com/manthanank/resume-optimizer) - AI-powered resume optimization
- [Doctor Appointment System](https://github.com/tonykalalian/Doctor-Appointment-Management-System-Backend) - Healthcare appointment management
