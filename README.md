# School Management System

A clean and simple Next.js application for managing school data with MySQL database integration.

## Features

- **Add School**: Form to input and store school information with validation
- **View Schools**: Display schools in a responsive card-based layout
- **Image Upload**: Store school images securely
- **Form Validation**: Comprehensive validation using React Hook Form
- **Responsive Design**: Works perfectly on both desktop and mobile devices

## Technology Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Form Management**: React Hook Form
- **Database**: MySQL (Cloud-ready)
- **File Upload**: Native file handling
- **Deployment**: Vercel ready

## Project Structure

```
src/
├── app/
│   ├── addSchool/          # Add school form page
│   │   └── page.tsx
│   ├── showSchools/        # Display schools page
│   │   └── page.tsx
│   ├── api/
│   │   └── schools/        # API routes for school operations
│   │       └── route.ts
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx           # Home page
├── lib/
│   └── database.ts         # Database connection utility
public/
└── schoolImages/           # School images storage
```

## Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Configuration
Update `.env.local` with your database credentials:
```env
DB_HOST=your_mysql_host
DB_PORT=3306
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=your_database_name
```

### 3. Create Database Table
Run the SQL script in `database_setup.sql` in your MySQL database.

### 4. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to use the application.

## Pages Overview

### Home Page (`/`)
Clean navigation hub with links to add and view schools.

### Add School (`/addSchool`)
Form with comprehensive validation for:
- School Name (required)
- Address (required)
- City & State (required)
- Contact Number (10 digits, required)
- Email Address (valid format, required)
- School Image (required)

### Show Schools (`/showSchools`)
Responsive grid displaying:
- School name, address, city
- School image with fallback
- Clean card-based design

## Database Schema

```sql
CREATE TABLE schools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    contact VARCHAR(20) NOT NULL,
    image TEXT,
    email_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## API Endpoints

### GET `/api/schools`
Fetch all schools from database.

### POST `/api/schools`
Add new school with form data and image upload.

## Deployment

Ready for deployment on Vercel, Netlify, or any Node.js hosting platform.

Set environment variables in your deployment platform matching those in `.env.local`.

---

**Clean, Simple, and Production-Ready** ✨
