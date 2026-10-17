
# TaskMate – Student Task Management System

## About

TaskMate is a responsive task management application that helps students organize assignments, track deadlines, and monitor their progress. It includes a React frontend, a Node.js and Express backend, and MongoDB Atlas for persistent data storage.

## Features

- Add new tasks with titles and descriptions
- View individual task details
- Mark tasks as pending or completed
- Delete tasks
- Dashboard with task statistics
- Store task records in MongoDB Atlas
- REST API for task management
- Responsive user interface
- Input validation and error handling

## Technology Stack

- React.js
- JavaScript
- CSS
- Vite
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- dotenv
- CORS

## Project Structure

```text
TaskMate-frontend/
├── Task/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── README.md
└── backend/
    ├── server.js
    ├── package.json
    ├── package-lock.json
    └── .env (create locally; do not share)
```

## Prerequisites

Install Node.js and npm before running the project. A MongoDB Atlas cluster and a database connection string are also required.

## Environment Configuration

Create a `.env` file inside the `backend` folder and add:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

Replace `your_mongodb_connection_string` with your actual MongoDB Atlas connection string.

**Security:** Never upload your real `.env` file, database password, or connection string to GitHub or include them in a public submission ZIP.

## Run Locally

### 1. Start the Backend

Open a terminal in VS Code and run:

```bash
cd backend
npm install
npm start
```

The backend API runs at:

http://localhost:5000

The terminal should display messages confirming that MongoDB connected successfully and the server is running.

### 2. Start the Frontend

Open a second terminal and run:

```bash
cd Task
npm install
npm run dev
```

Open the local URL displayed by Vite in your browser. For example:

http://localhost:5173

The port may differ if another application is already using it.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/tasks` | Retrieve all tasks |
| POST | `/api/tasks` | Create a new task |
| GET | `/api/tasks/:id` | Retrieve one task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

### Example: Create a Task

Send a POST request to `/api/tasks` with JSON:

```json
{
  "title": "Complete OS Assignment",
  "description": "Prepare operating system notes"
}
```

### Task Data

Each task includes a title, description, completion status, and timestamps. MongoDB generates a unique document ID for each task.

## Database

Task records are stored in MongoDB Atlas using Mongoose. The database connection string is read from the `MONGODB_URI` environment variable in the backend `.env` file.

## Testing

The API can be tested using the application, a REST API client, or PowerShell requests.

Test the following operations:

- Create a task using POST.
- Retrieve tasks using GET.
- Update task status using PUT.
- Delete a task using DELETE.
- Verify the task changes in MongoDB Atlas.

## Troubleshooting

- If the backend does not start, check the terminal error message.
- If MongoDB does not connect, verify `MONGODB_URI`, the database username and password, and the Atlas network access settings.
- If the frontend cannot connect, confirm that the backend is running on port 5000.
- If the frontend uses a different Vite port, open the URL shown in its terminal.

## Author

Sanjay Chouhan

## Project Status

TaskMate includes a React frontend, REST API endpoints, and MongoDB Atlas integration. Core task creation, retrieval, updating, and deletion have been tested.
