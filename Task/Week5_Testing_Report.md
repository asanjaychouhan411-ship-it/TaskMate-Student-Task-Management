# TaskMate — Week 5 Testing Report

## 1. Project Overview

TaskMate is a full-stack student task management application. It allows users to create, view, update, complete, and delete tasks. The application uses React and Vite for the frontend and Node.js, Express.js, and MongoDB for the backend.

## 2. Testing Objectives

- Verify frontend user interface and navigation.
- Test task creation, retrieval, completion, and deletion.
- Validate API input handling and error responses.
- Identify errors through automated tests.
- Verify that the frontend production build completes successfully.

## 3. Testing Tools

- Vitest
- React Testing Library
- Jest DOM matchers
- User Event
- Node.js built-in test runner
- Supertest
- Vite production build

## 4. Frontend Test Cases

The frontend test suite contains six test cases:

1. Render the home page and navigation.
2. Load and display tasks from the API.
3. Display an error when the backend is unavailable.
4. Create a task and reload the task list.
5. Update a task's completion status.
6. Delete a task after confirmation.

Command to run frontend tests:

```bash
npm.cmd run test
```

## 5. Backend Test Cases

The backend test suite contains ten test cases:

1. Verify the home route.
2. Retrieve the task list.
3. Reject an empty task title.
4. Create a task.
5. Reject an invalid task ID.
6. Return 404 for a missing task.
7. Reject an empty title during update.
8. Reject an invalid completion value.
9. Return 404 when deleting a missing task.
10. Reject invalid IDs during update and deletion.

Command to run backend tests:

```bash
npm.cmd test
```

## 6. Debugging and Error Handling

During frontend testing, an ambiguous button query matched both the navigation button labelled "Dashboard" and the hero button labelled "Explore Dashboard". The test selector needs to identify the intended button precisely.

The application also handles backend connection failures, invalid task titles, invalid IDs, and missing tasks through error messages and HTTP status codes.

## 7. Build and Performance Check

The frontend production build completed successfully in the recorded test run.

Recorded build output:

- JavaScript bundle: 228.04 kB (70.96 kB gzip).
- CSS bundle: 6.99 kB (2.21 kB gzip).
- HTML entry file: 0.45 kB (0.29 kB gzip).

These figures are the measured build sizes, not evidence of a before-and-after optimization improvement.

## 8. Test Results

Previously recorded successful runs:

- Frontend: 6 of 6 tests passed.
- Backend: 10 of 10 tests passed.
- Production build: successful.

A later frontend run reported five failing tests due to ambiguous Dashboard button selection. Therefore, the frontend suite must be rerun after correcting the selectors before claiming the final result is fully passing.

## 9. How to Run the Project

### Backend

Open a terminal in the `backend` directory:

```bash
npm install
npm.cmd start
```

Configure `MONGODB_URI` and any required environment variables in a local `.env` file. Never upload real credentials to GitHub.

### Frontend

Open another terminal in the `Task` directory:

```bash
npm install
npm.cmd run test
npm.cmd run build
npm.cmd run dev
```

## 10. Conclusion

Week 5 introduced automated frontend and backend testing, API validation checks, debugging, and production-build verification. The final submission should include the test scripts, this report, setup instructions, and a sanitized configuration example. Final frontend test results should be updated after the selector issue is resolved.

## Final Verification

Final frontend test run: **6 tests passed, 0 failed**.
Backend test run: **10 tests passed, 0 failed**.
Production build: **Successful**.

Production build output:
- JavaScript: 228.04 kB (70.96 kB gzipped)
- CSS: 6.99 kB (2.21 kB gzipped)

The earlier frontend test failures caused by ambiguous Dashboard button selectors were resolved. All frontend tests now pass.
