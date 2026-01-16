# Troubleshooting Guide

## "Failed to fetch" Error

If you're seeing a "Failed to fetch" error when trying to sign up or log in, follow these steps:

### 1. Check if Backend Server is Running

Make sure the backend server is running:

```bash
cd Backend
npm run dev
```

You should see: `Server is running on http://localhost:3000`

### 2. Check Database Connection

Make sure your database is set up:

```bash
cd Backend
npm run prisma:generate
npm run prisma:migrate
```

Or if you haven't set up migrations yet:

```bash
npm run prisma:push
```

### 3. Check Environment Variables

Create a `.env` file in the `Backend` folder with:

```
DATABASE_URL="your-postgresql-connection-string"
JWT_SECRET="your-secret-key-here"
PORT=3000
FRONTEND_URL=http://localhost:5173
```

### 4. Check Frontend Environment

The frontend should connect to `http://localhost:3000/api` by default.

If your backend is running on a different port, create a `.env` file in the `Frontend` folder:

```
VITE_API_URL=http://localhost:3000/api
```

### 5. Check CORS Settings

Make sure the backend CORS is configured to allow requests from your frontend URL (default: http://localhost:5173)

### 6. Check Browser Console

Open browser DevTools (F12) and check:
- Console tab for any errors
- Network tab to see if the request is being made and what the response is

### Common Issues:

1. **Backend not running**: Start the backend server
2. **Wrong port**: Check if backend is on port 3000
3. **Database not connected**: Set up Prisma and database
4. **CORS error**: Check CORS configuration in backend
5. **Firewall/Network**: Check if localhost:3000 is accessible
