# Brainly - Note-Taking Application

A full-stack note-taking application that allows users to organize and manage their content across different types (articles, videos, podcasts, books, courses, etc.) with tagging capabilities.

## 🚀 Features

### User Features
- **User Authentication**: Secure signup and login with JWT tokens
- **Note Management**: Create, read, update, and delete notes
- **Content Types**: Support for multiple content types:
  - Articles
  - YouTube videos
  - Twitter posts
  - Videos
  - Podcasts
  - Books
  - Courses
  - Other content
- **Tagging System**: Organize notes with tags
- **Search & Filter**: Search notes by title/description and filter by type or tags
- **User Isolation**: Each user can only access their own notes
- **Responsive Design**: Modern, mobile-friendly UI

### Technical Features
- **RESTful API**: Well-structured backend API
- **Type Safety**: Full TypeScript implementation
- **Database ORM**: Prisma for type-safe database access
- **Authentication**: JWT-based authentication with secure password hashing
- **Modern Stack**: Latest technologies and best practices

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **State Management**: React Context API

## 📁 Project Structure

```
Brainly/
├── Backend/                 # Backend API server
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── migrations/     # Database migrations
│   ├── src/
│   │   ├── generated/
│   │   │   └── prisma/     # Generated Prisma Client
│   │   ├── lib/
│   │   │   └── prisma.ts   # Prisma client instance
│   │   ├── middleware/
│   │   │   └── auth.ts     # Authentication middleware
│   │   ├── routes/
│   │   │   ├── auth.ts     # Authentication routes
│   │   │   ├── content.ts  # Content/Notes routes
│   │   │   └── tags.ts     # Tag routes
│   │   └── index.ts        # Main server file
│   ├── .env                # Environment variables
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md           # Backend documentation
│
├── Frontend/               # Frontend React application
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/      # React contexts
│   │   ├── lib/           # Utilities and API client
│   │   ├── pages/         # Page components
│   │   ├── App.tsx        # Main app component
│   │   └── main.tsx       # Entry point
│   ├── .env               # Environment variables
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── README.md          # Frontend documentation
│
└── README.md              # This file
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** or **yarn** (comes with Node.js)
- **Git** - [Download](https://git-scm.com/)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Brainly
```

### 2. Set Up Backend

```bash
# Navigate to Backend directory
cd Backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env  # Or create manually
```

Edit the `.env` file in the Backend directory:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/brainly_db"
JWT_SECRET="your-secret-key-change-in-production"
PORT=3000
FRONTEND_URL="http://localhost:5173"
```

```bash
# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Start development server
npm run dev
```

The backend API will be running at `http://localhost:3000`

### 3. Set Up Frontend

Open a new terminal:

```bash
# Navigate to Frontend directory
cd Frontend

# Install dependencies
npm install

# Create .env file
```

Create a `.env` file in the Frontend directory:
```env
VITE_API_URL=http://localhost:3000/api
```

```bash
# Start development server
npm run dev
```

The frontend will be running at `http://localhost:5173`

## 🎯 Running the Application

### Development Mode

**Backend:**
```bash
cd Backend
npm run dev
```

**Frontend:**
```bash
cd Frontend
npm run dev
```

Both servers support hot-reload, so changes will automatically refresh.

### Production Mode

**Backend:**
```bash
cd Backend
npm run build
npm start
```

**Frontend:**
```bash
cd Frontend
npm run build
npm run preview
```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

#### Signup
- **POST** `/auth/signup`
- **Body**: `{ "username": "string", "email": "string", "password": "string" }`
- **Response**: `{ "user": {...}, "token": "jwt-token" }`

#### Login
- **POST** `/auth/login`
- **Body**: `{ "email": "string", "password": "string" }`
- **Response**: `{ "user": {...}, "token": "jwt-token" }`

### Content Endpoints (Requires Authentication)

All content endpoints require the JWT token in the Authorization header:
```
Authorization: Bearer <your-token>
```

- **GET** `/content/home` - Get user's notes for home page
- **GET** `/content` - Get all user's notes (with optional filters)
- **GET** `/content/:id` - Get single note
- **POST** `/content` - Create new note
- **PUT** `/content/:id` - Update note
- **DELETE** `/content/:id` - Delete note

### Tag Endpoints (Requires Authentication)

- **GET** `/tags` - Get all tags
- **POST** `/tags` - Create new tag

For detailed API documentation, see:
- [Backend README](./Backend/README.md#api-endpoints)

## 🔐 Authentication Flow

1. User signs up or logs in through the frontend
2. Backend validates credentials and returns JWT token
3. Frontend stores token in `localStorage`
4. Token is automatically included in all API requests
5. Backend validates token on protected routes
6. User can access their notes and manage content

## 🗄️ Database Schema

### User
- `id` (Primary Key)
- `username`
- `email` (Unique)
- `password` (Hashed)
- `createdAt`

### Content
- `id` (Primary Key)
- `title`
- `description`
- `link` (Optional)
- `type` (ContentType enum)
- `userId` (Foreign Key)
- `createdAt`
- `updatedAt`
- `tags` (Many-to-Many relation)

### Tag
- `id` (Primary Key)
- `title`
- `content` (Many-to-Many relation)

## 🧪 Development

### Backend Development

```bash
cd Backend

# Run in development mode
npm run dev

# Generate Prisma Client after schema changes
npm run prisma:generate

# Create and apply migrations
npm run prisma:migrate

# Open Prisma Studio (database GUI)
npm run prisma:studio
```

### Frontend Development

```bash
cd Frontend

# Run in development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Making Changes

1. **Database Schema Changes:**
   - Edit `Backend/prisma/schema.prisma`
   - Run `npm run prisma:migrate` in Backend directory
   - Run `npm run prisma:generate` to update Prisma Client

2. **API Changes:**
   - Modify route files in `Backend/src/routes/`
   - Add new routes in `Backend/src/index.ts`

3. **Frontend Changes:**
   - Modify components in `Frontend/src/components/`
   - Update API calls in `Frontend/src/lib/api.ts`

## 🔧 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
JWT_SECRET=your-secret-key-change-in-production
PORT=3000
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/api
```

## 🐛 Troubleshooting

### Backend Issues

**Database Connection Error:**
- Verify PostgreSQL is running
- Check `DATABASE_URL` in `.env` file
- Ensure database exists

**Prisma Client Not Found:**
- Run `npm run prisma:generate` in Backend directory

**Port Already in Use:**
- Change `PORT` in Backend `.env` file
- Or stop the process using port 3000

### Frontend Issues

**API Connection Error:**
- Ensure backend server is running
- Check `VITE_API_URL` in Frontend `.env`
- Verify CORS settings in backend

**Build Errors:**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

## 📝 Available Scripts

### Backend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Run production build
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

ISC

## 📖 Additional Documentation

- [Backend Documentation](./Backend/README.md) - Detailed backend API documentation
- [Frontend Documentation](./Frontend/README.md) - Detailed frontend documentation

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section above
2. Review the individual README files in Backend and Frontend directories
3. Open an issue on the repository

---

**Happy Note-Taking! 📝**
