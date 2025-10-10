# Nextronica API Postman Collection

This directory contains a Postman Collection for the Nextronica API. The collection is automatically generated when the server application starts by scanning the Spring MVC controllers and their endpoints.

## How to Use

### Prerequisites
- [Postman](https://www.postman.com/downloads/) installed on your machine

### Importing the Collection
1. Open Postman
2. Click on "Import" in the top left corner
3. Select "File" and browse to the location of the `Nextronica_API_Collection.json` file
4. Click "Import"

### Using the Collection
The collection is organized by API endpoints, with each endpoint having its own folder containing the available HTTP methods.

For endpoints that require authentication:
1. First, use one of the login endpoints to obtain a JWT token
2. Copy the token from the response
3. For authenticated requests, add an "Authorization" header with the value `Bearer <your-token>`

### Available Endpoints

#### Authentication
- POST /api/v1/auth/signup - Register a new user
- GET /api/v1/auth/check-username - Check if a username is available
- POST /api/v1/auth/user/login - User login
- POST /api/v1/auth/vendor/login - Vendor login
- POST /api/v1/auth/admin/login - Admin login

#### User Management
- PUT /api/v1/user/change-password - Change user password (requires authentication)
- GET /api/v1/user/{id} - Get user by ID
- GET /api/v1/user/all/{status} - Get all users by status (requires ADMIN role)

#### Admin Operations
- PUT /api/v1/admin/banuser - Ban a user (requires ADMIN role)
- PATCH /api/v1/admin/unbanuser - Unban a user (requires ADMIN role)
- PATCH /api/v1/admin/promote/{id} - Promote a user to admin (requires ADMIN role)
- PATCH /api/v1/admin/demote/{id} - Demote a user from admin (requires ADMIN role)
- PATCH /api/v1/admin/accept/vendor/{id} - Accept a vendor (requires ADMIN role)

## Regenerating the Collection
The Postman Collection is automatically generated when the server starts. If you need to regenerate it:
1. Restart the server application
2. The collection will be regenerated in this directory

## Troubleshooting
If you encounter any issues with the collection:
- Ensure the server is running on port 8055 (or update the port in the collection)
- Verify that the PostmanCollectionGenerator is working properly by checking the server logs
- Make sure all controllers are properly annotated with @RestController or @Controller
