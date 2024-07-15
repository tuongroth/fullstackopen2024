# Phonebook Backend

This repository contains the backend for a phonebook application built with Node.js, Express, and MongoDB.

## Deployed Backend
- **URL**: [Link to your deployed backend on Fly.io](https://fly.io/apps/part2-notes-frontend-part2-4-morning-wind-6734)
- **Description**: This backend serves as the API for managing phonebook entries. It handles CRUD operations and serves data to the frontend application.

### Testing

- Use tools like Postman or a browser to test the API endpoints:
  - GET `/api/persons`: Retrieve all phonebook entries.
  - GET `/api/persons/:id`: Retrieve a specific phonebook entry by ID.
  - POST `/api/persons`: Add a new phonebook entry.
  - DELETE `/api/persons/:id`: Delete a phonebook entry.
  - PUT `/api/persons/:id`: Update a phonebook entry.

- Monitor the backend logs on Fly.io to ensure proper functionality and troubleshoot any issues.

## Frontend Integration

The frontend application interacts with this backend to display and manage phonebook entries. Ensure the frontend is correctly configured to communicate with the deployed backend API.
