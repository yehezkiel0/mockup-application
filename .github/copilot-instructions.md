# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

This is a full-stack CRUD application for employee biodata management with the following stack:

- **Backend**: Node.js with Express.js framework
- **Frontend**: React.js
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)

## Project Structure

- `/backend` - Node.js API server
- `/frontend` - React.js application

## Key Features

- User authentication (login/signup)
- Employee biodata CRUD operations
- Form validation
- Responsive design using Bootstrap

## Database Schema

- `users` table for authentication
- `biodata` table for employee information including personal data, education history, training history, and work experience

## API Endpoints

- Authentication: `/api/auth/login`, `/api/auth/register`
- Biodata CRUD: `/api/biodata` (GET, POST, PUT, DELETE)

Please follow JavaScript ES6+ conventions and use async/await for asynchronous operations.
