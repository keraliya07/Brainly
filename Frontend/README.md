# Brainly Frontend

Modern React-based frontend application for the Brainly note-taking platform. Built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- User authentication (login/signup)
- Protected routes with authentication guard
- Note/Content management (CRUD operations)
- Tag management
- Home page with user's notes
- Search and filter functionality
- Responsive design with Tailwind CSS
- Type-safe API client
- Context-based state management

## Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **State Management**: React Context API

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API server running (see Backend README)

## Installation

1. Navigate to the Frontend folder:
```bash
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the Frontend root directory:
```env
VITE_API_URL=http://localhost:3000/api
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (default Vite port).

## Available Scripts

- `npm run dev` - Start development server with hot-reload
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally

## Project Structure

```
Frontend/
├── public/
│   └── logo.svg              # Application logo
├── src/
│   ├── components/
│   │   ├── ContentModal.tsx  # Modal for creating/editing notes
│   │   ├── Layout.tsx        # Main application layout
│   │   ├── MainContent.tsx   # Main content area with notes grid
│   │   ├── NoteCard.tsx      # Individual note card component
│   │   ├── ProtectedRoute.tsx # Route protection wrapper
│   │   ├── Sidebar.tsx       # Sidebar navigation
│   │   └── TopBar.tsx        # Top navigation bar
│   ├── contexts/
│   │   └── AuthContext.tsx   # Authentication context provider
│   ├── lib/
│   │   └── api.ts            # API client and endpoints
│   ├── pages/
│   │   ├── Login.tsx         # Login page
│   │   └── Signup.tsx        # Signup page
│   ├── App.tsx               # Main app component with routing
│   ├── main.tsx              # Application entry point
│   └── index.css             # Global styles
├── index.html                # HTML template
├── package.json
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite configuration
└── tailwind.config.js        # Tailwind CSS configuration
```

## Application Routes

- `/login` - User login page
- `/signup` - User registration page
- `/` - Home page (protected, shows user's notes)
- All other routes redirect to home if authenticated, or login if not

## Key Components

### AuthContext
Provides authentication state and methods throughout the application:
- `user` - Current authenticated user
- `token` - JWT authentication token
- `login()` - Login function
- `signup()` - Signup function
- `logout()` - Logout function
- `isAuthenticated` - Authentication status
- `loading` - Loading state

### ProtectedRoute
Wrapper component that protects routes requiring authentication. Redirects to login if user is not authenticated.

### Layout
Main application layout including:
- TopBar with user info and logout
- Sidebar with navigation and filters
- MainContent area for notes display

### MainContent
Displays user's notes in a grid layout with:
- Note cards showing type, title, and tags
- Search functionality
- Filter by content type
- Filter by tags
- Create new note button

### ContentModal
Modal component for:
- Creating new notes
- Editing existing notes
- Form validation
- Tag selection

## API Integration

The application uses a centralized API client (`src/lib/api.ts`) that handles:
- Automatic JWT token injection
- Error handling
- Request/response formatting
- Type-safe API methods

### API Methods

#### Authentication
- `authApi.signup(username, email, password)`
- `authApi.login(email, password)`

#### Content/Notes
- `contentApi.getHome()` - Get notes for home page
- `contentApi.getAll(params?)` - Get all notes with optional filters
- `contentApi.getById(id)` - Get single note
- `contentApi.create(data)` - Create new note
- `contentApi.update(id, data)` - Update note
- `contentApi.delete(id)` - Delete note

#### Tags
- `tagApi.getAll()` - Get all tags
- `tagApi.create(title)` - Create new tag

## Content Types

The application supports the following content types:
- `article` - Articles
- `youtube` - YouTube videos
- `twitter` - Twitter posts
- `video` - Videos
- `podcast` - Podcasts
- `book` - Books
- `course` - Courses
- `other` - Other content

Each type has a corresponding icon displayed on note cards.

## Styling

The application uses Tailwind CSS with a custom purple color scheme. The design is:
- Fully responsive
- Modern and clean
- Accessible
- Consistent across components

### Custom Colors
- Purple theme (50-900 shades)
- Custom color palette defined in `tailwind.config.js`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:3000/api` |

## Authentication Flow

1. User visits the application
2. If not authenticated, redirected to `/login`
3. User logs in or signs up
4. JWT token stored in `localStorage`
5. User redirected to home page
6. Token included in all API requests via `Authorization` header
7. On logout, token removed and user redirected to login

## State Management

The application uses React Context API for state management:
- **AuthContext**: Manages authentication state globally
- Local component state for UI-specific data
- API responses cached in component state

## Error Handling

- Network errors display user-friendly messages
- API errors shown in UI
- Automatic token validation
- Redirect to login on authentication failure

## Building for Production

1. Build the application:
```bash
npm run build
```

2. The production build will be in the `dist/` folder

3. Preview the production build:
```bash
npm run preview
```

4. Deploy the `dist/` folder to your hosting service (Vercel, Netlify, etc.)

## Development Tips

### Adding New Components
1. Create component file in `src/components/`
2. Use TypeScript for type safety
3. Follow existing component patterns
4. Use Tailwind CSS for styling

### Adding New API Endpoints
1. Add method to appropriate API object in `src/lib/api.ts`
2. Use the `api` client instance for requests
3. Define TypeScript interfaces for request/response types

### Styling Guidelines
- Use Tailwind utility classes
- Follow the existing color scheme
- Maintain responsive design
- Keep components modular and reusable

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

ISC
