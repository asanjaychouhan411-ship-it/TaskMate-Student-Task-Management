# TaskMate — Student Task Management System

TaskMate is a full-stack student task management application built using React, Node.js, Express.js, and MongoDB. It helps students organize, manage, and track their tasks through a simple user interface.

## Features

- Create new tasks
- View the task list
- Update existing tasks
- Delete tasks
- Mark tasks as completed
- React-based frontend
- REST API backend
- MongoDB database integration

## Tech Stack

**Frontend**
- React
- Vite
- JavaScript
- CSS

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose

## Project Structure

```text
TaskMate-Student-Task-Management/
├── Task/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── README.md
├── backend/
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
└── .gitignore
```

## Prerequisites

Install the following before running the project:

- Node.js and npm
- MongoDB Atlas account or a local MongoDB server
- Git

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/asanjaychouhan411-ship-it/TaskMate-Student-Task-Management.git
cd TaskMate-Student-Task-Management
```

### 2. Configure the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder and add your own MongoDB connection string and port configuration. Never upload your real database credentials to GitHub.

Example:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

Use the environment variable names expected by `backend/server.js`.

Start the backend:

```bash
npm start
```

If the backend package does not define a start script, run:

```bash
node server.js
```

### 3. Configure the frontend

Open a second terminal from the project root:

```bash
cd Task
npm install
npm run dev
```

Open the local URL shown by Vite in the terminal.

## API Overview

The backend provides REST API operations for task management.

| Method | Operation |
|---|---|
| GET | Retrieve tasks |
| POST | Create a task |
| PUT | Update a task |
| DELETE | Delete a task |

The exact endpoint paths and request body formats should be checked in `backend/server.js`.

## Security

- Do not commit `.env` files or database credentials.
- Do not upload `node_modules` folders.
- Keep database credentials private.

## Project Goal

TaskMate demonstrates full-stack development by connecting a React frontend with backend REST APIs and a MongoDB database.

## Author

Sanjay Chouhan

