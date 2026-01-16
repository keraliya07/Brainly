# Brainly Backend API

RESTful API backend for the Brainly application built with Express.js, TypeScript, Prisma, and PostgreSQL.

## Features

- User authentication (signup/login) with JWT tokens
- Content/Notes management (CRUD operations)
- Tag management
- User-specific data isolation
- TypeScript for type safety
- Prisma ORM for database management

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

## Installation

1. Clone the repository and navigate to the Backend folder:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the Backend root directory:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
JWT_SECRET="your-secret-key-change-in-production"
PORT=3000
FRONTEND_URL="http://localhost:5173"
```

4. Generate Prisma Client:
```bash
npm run prisma:generate
```

5. Run database migrations:
```bash
npm run prisma:migrate
```

## Running the Application

### Development Mode
```bash
npm run dev
```
Starts the server with hot-reload using `tsx watch`.

### Production Mode
```bash
npm run build
npm start
```

## Available Scripts

- `npm run dev` - Start development server with hot-reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run the compiled JavaScript
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Create and apply database migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)
- `npm run prisma:push` - Push schema changes to database without migrations

## API Endpoints

### Authentication

#### Signup
- **POST** `/api/auth/signup`
- **Body**:
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response**: User object and JWT token

#### Login
- **POST** `/api/auth/login`
- **Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**: User object and JWT token

### Content/Notes

All content endpoints require authentication. Include JWT token in Authorization header:
```
Authorization: Bearer <your-token>
```

#### Get Home Page Notes
- **GET** `/api/content/home`
- **Response**: Array of notes with id, type, title, and tags

#### Get All Notes
- **GET** `/api/content`
- **Query Parameters** (optional):
  - `type` - Filter by content type
  - `tagId` - Filter by tag ID
  - `search` - Search in title and description
- **Response**: Array of user's notes

#### Get Single Note
- **GET** `/api/content/:id`
- **Response**: Single note with tags

#### Create Note
- **POST** `/api/content`
- **Body**:
  ```json
  {
    "title": "string",
    "description": "string",
    "link": "string (optional)",
    "type": "youtube | twitter | video | article | podcast | book | course | other",
    "tagIds": [1, 2, 3]
  }
  ```
- **Response**: Created note

#### Update Note
- **PUT** `/api/content/:id`
- **Body**: Same as create (all fields optional)
- **Response**: Updated note

#### Delete Note
- **DELETE** `/api/content/:id`
- **Response**: Success message

### Tags

#### Get All Tags
- **GET** `/api/tags`
- **Response**: Array of all tags

#### Create Tag
- **POST** `/api/tags`
- **Body**:
  ```json
  {
    "title": "string"
  }
  ```
- **Response**: Created tag

### Health Check

#### Server Status
- **GET** `/health`
- **Response**: Server status

## Database Schema

### User
- `id` - Primary key
- `username` - String
- `email` - String (unique)
- `password` - String (hashed)
- `createdAt` - DateTime

### Content
- `id` - Primary key
- `title` - String
- `description` - String
- `link` - String (optional)
- `type` - ContentType enum
- `userId` - Foreign key to User
- `createdAt` - DateTime
- `updatedAt` - DateTime
- `tags` - Many-to-many relation with Tag

### Tag
- `id` - Primary key
- `title` - String
- `content` - Many-to-many relation with Content

### ContentType Enum
- youtube
- twitter
- video
- article
- podcast
- book
- course
- other

## Project Structure

```
Backend/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── src/
│   ├── generated/
│   │   └── prisma/            # Generated Prisma Client
│   ├── lib/
│   │   └── prisma.ts          # Prisma client instance
│   ├── middleware/
│   │   └── auth.ts            # Authentication middleware
│   ├── routes/
│   │   ├── auth.ts            # Authentication routes
│   │   ├── content.ts         # Content/Notes routes
│   │   └── tags.ts            # Tag routes
│   └── index.ts               # Main server file
├── .env                       # Environment variables
├── package.json
├── tsconfig.json
└── README.md
```

## Security Features

- Password hashing with bcrypt (10 rounds)
- JWT token-based authentication
- User-specific data isolation
- CORS configuration
- Input validation
- Error handling

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `PORT` | Server port (default: 3000) | No |
| `FRONTEND_URL` | Frontend URL for CORS | No |

## Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

Error responses follow this format:
```json
{
  "error": "Error message"
}
```

## Development

### Adding New Routes

1. Create a new route file in `src/routes/`
2. Import and use in `src/index.ts`
3. Apply authentication middleware if needed

### Database Migrations

When modifying the Prisma schema:
1. Update `prisma/schema.prisma`
2. Run `npm run prisma:migrate` to create a migration
3. Run `npm run prisma:generate` to update the Prisma Client

## License

ISC
