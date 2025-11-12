# Task Management System

A full-stack task management application built with React, Node.js, Express, and MongoDB. Features include user authentication, role-based access control (Admin/User), task creation, assignment, and management with an intuitive drag-and-drop interface.

## 🚀 Features

### User Management
- **User Registration & Login** - Secure authentication with JWT tokens
- **Role-Based Access Control** - Admin and User roles with different permissions
- **User Profile Management** - View and manage user information
- **Admin Dashboard** - Admin-only access to view, edit, and delete users

### Task Management
- **Create Tasks** - Add new tasks with title, description, priority, and due date
- **Assign Tasks** - Assign tasks to specific users
- **Update Tasks** - Edit task details and status
- **Delete Tasks** - Remove tasks from the system
- **Task Filtering** - View tasks by status (Pending, In Progress, Completed)
- **Drag & Drop** - Intuitive drag-and-drop interface to change task status
- **Task Details** - Comprehensive view of individual tasks with all metadata
- **Pagination** - Navigate through tasks with customizable page size (5, 10, 20, 50)

### UI/UX Features
- **Responsive Design** - Mobile, tablet, and desktop optimized
- **Modern Interface** - Clean design with Tailwind CSS
- **Active Navigation States** - Visual feedback for current page
- **Priority Color Coding** - Visual indicators for task priority levels
- **Loading States** - Smooth loading animations
- **Protected Routes** - Automatic redirection based on authentication status
- **User Task View** - View all tasks assigned to specific users

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **React Router DOM v6** - Client-side routing
- **Axios** - HTTP client for API requests
- **Tailwind CSS v3** - Utility-first CSS framework
- **Vite** - Build tool and dev server

### Backend
- **Node.js** - JavaScript runtime
- **Express v5** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing

## 📁 Project Structure

```
Assignment 2/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── AuthLayout.jsx
│   │   │   ├── MainLayout.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   └── TaskForm.jsx
│   │   ├── contexts/      # React context providers
│   │   │   └── AuthContext.jsx
│   │   ├── pages/         # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── TaskDetails.jsx
│   │   │   ├── Users.jsx
│   │   │   └── UserTasks.jsx
│   │   ├── services/      # API service functions
│   │   ├── App.jsx
│   │   ├── AppRouter.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── server/                # Backend Node.js application
    ├── config/
    │   └── db.js         # Database configuration
    ├── controllers/      # Route controllers
    │   ├── authController.js
    │   ├── taskController.js
    │   └── userController.js
    ├── middleware/       # Custom middleware
    │   ├── auth.js       # JWT authentication
    │   └── authorize.js  # Role-based authorization
    ├── models/          # Mongoose models
    │   ├── Task.js
    │   └── User.js
    ├── routes/          # API routes
    │   ├── auth.js
    │   ├── tasks.js
    │   └── users.js
    ├── index.js         # Server entry point
    ├── package.json
    └── .env            # Environment variables
```

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user info | Private |

**POST /api/auth/register**
```json
Request Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**POST /api/auth/login**
```json
Request Body:
{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Task Routes (`/api/tasks`)

All task routes require authentication (JWT token in Authorization header).

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/tasks` | Create a new task | Private |
| GET | `/api/tasks` | Get all tasks (with pagination) | Private |
| GET | `/api/tasks/:id` | Get single task by ID | Private |
| PUT | `/api/tasks/:id` | Update task | Private |
| DELETE | `/api/tasks/:id` | Delete task | Private |

**POST /api/tasks**
```json
Request Body:
{
  "title": "Complete project documentation",
  "description": "Write comprehensive README",
  "priority": "high",
  "dueDate": "2025-12-31",
  "assignedTo": "user_id" // optional
}

Response:
{
  "_id": "task_id",
  "title": "Complete project documentation",
  "description": "Write comprehensive README",
  "priority": "high",
  "status": "pending",
  "dueDate": "2025-12-31T00:00:00.000Z",
  "owner": "creator_user_id",
  "assignedTo": "assigned_user_id",
  "createdAt": "2025-11-12T...",
  "updatedAt": "2025-11-12T..."
}
```

**GET /api/tasks**
```
Query Parameters:
- page: Page number (default: 1)
- limit: Items per page (default: 10)
- status: Filter by status (pending/in-progress/completed)
- priority: Filter by priority (low/medium/high)

Example: /api/tasks?page=1&limit=10&status=pending

Response:
{
  "tasks": [...],
  "totalPages": 5,
  "currentPage": 1,
  "totalTasks": 47
}
```

**PUT /api/tasks/:id**
```json
Request Body (all fields optional):
{
  "title": "Updated title",
  "description": "Updated description",
  "status": "in-progress",
  "priority": "medium",
  "dueDate": "2025-12-31",
  "assignedTo": "user_id"
}
```

### User Routes (`/api/users`)

Admin-only routes for user management.

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/users` | Get all users | Admin Only |
| PUT | `/api/users/:id` | Update user role | Admin Only |
| DELETE | `/api/users/:id` | Delete user | Admin Only |

**GET /api/users**
```json
Response:
[
  {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2025-11-12T..."
  },
  ...
]
```

**PUT /api/users/:id**
```json
Request Body:
{
  "role": "admin" // or "user"
}

Response:
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "admin",
  "updatedAt": "2025-11-12T..."
}
```

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** (v14 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **npm** or **yarn** package manager

### 1. Clone the Repository
```bash
git clone <repository-url>
cd "Assignment 2"
```

### 2. Backend Setup

#### Navigate to server directory
```bash
cd server
```

#### Install dependencies
```bash
npm install
```

#### Create .env file
Create a `.env` file in the `server` directory with the following variables:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskmanager
# For MongoDB Atlas, use: mongodb+srv://<username>:<password>@cluster.mongodb.net/taskmanager

JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_random
NODE_ENV=development
```

#### Start the server
```bash
npm start
# or for development with auto-reload
npm run dev
```

The server will start at `http://localhost:5000`

### 3. Frontend Setup

#### Open a new terminal and navigate to client directory
```bash
cd client
```

#### Install dependencies
```bash
npm install
```

#### Configure API endpoint (if needed)
The API base URL is configured in `client/src/api.js`. By default, it points to `http://localhost:5000/api`.

#### Start the development server
```bash
npm run dev
```

The application will open at `http://localhost:5173`

#### Build for production
```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

#### Preview production build
```bash
npm run preview
```

## 🔐 Default Admin Account

After starting the application, you can register a new user. To create an admin user, you need to manually update the user's role in the MongoDB database:

```javascript
// Using MongoDB shell or MongoDB Compass
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

Or register normally and use an existing admin to promote the user to admin through the Users page.

## 📱 Usage Guide

### For Regular Users

1. **Register/Login** - Create an account or login with existing credentials
2. **Dashboard** - View all your tasks organized by status (Pending, In Progress, Completed)
3. **Create Task** - Click "Create Task" button to add a new task
4. **Manage Tasks** - 
   - Drag and drop tasks between status columns
   - Click on a task card to view full details
   - Edit or delete tasks using action buttons
5. **Pagination** - Use pagination controls to navigate through tasks
6. **Logout** - Click logout in the sidebar

### For Admin Users

All user features, plus:

1. **Users Management** - Access "Users" page from sidebar
2. **View All Users** - See list of all registered users
3. **Change Roles** - Promote users to admin or demote to regular user
4. **Delete Users** - Remove users from the system
5. **View User Tasks** - Click "View Tasks" to see all tasks assigned to a specific user

## 🎨 Features Highlights

### Drag & Drop Interface
- Intuitive task management by dragging cards between status columns
- Real-time status updates
- Smooth animations

### Responsive Design
- **Mobile** - Stacked layout with optimized touch interactions
- **Tablet** - Balanced layout with comfortable viewing
- **Desktop** - Full feature set with sidebar navigation

### Visual Indicators
- **Priority Colors**:
  - 🔴 High - Red accents
  - 🟡 Medium - Amber accents
  - 🟢 Low - Green accents
- **Status Columns**: Organized view (Pending, In Progress, Completed)
- **Active Navigation**: Clear indication of current page

## 🔒 Security Features

- **Password Hashing** - bcryptjs for secure password storage
- **JWT Authentication** - Secure token-based authentication
- **Protected Routes** - Client and server-side route protection
- **Role-Based Access** - Middleware for admin-only resources
- **HTTP-only Tokens** - Secure token storage recommendations

## 🐛 Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify `.env` file exists with correct values
- Check if port 5000 is available

### Frontend won't start
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check if port 5173 is available
- Ensure API URL in `api.js` is correct

### Database connection errors
- Verify MongoDB URI in `.env`
- Check MongoDB service is running
- For MongoDB Atlas, check IP whitelist settings

### Tasks not loading
- Check browser console for errors
- Verify JWT token is being sent in Authorization header
- Check network tab for API response status

## 📝 Environment Variables

### Server (.env)
```env
PORT=5000                    # Server port
MONGODB_URI=                 # MongoDB connection string
JWT_SECRET=                  # Secret key for JWT signing
NODE_ENV=development         # Environment mode
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- Kartik Kesbhat - 

## 🙏 Acknowledgments

- React documentation
- Tailwind CSS
- Express.js
- MongoDB
- Vite
