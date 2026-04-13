# Smart Campus Operations Hub
IT3030 PAF Assignment 2026 — Group XX

## Team
| Member | Module | Endpoints |
|--------|--------|-----------|
| Leader | Auth + Notifications | /api/auth/**, /api/notifications/** |
| Member 2 | Facilities | /api/resources/** |
| Member 3 | Bookings | /api/bookings/** |
| Member 4 | Tickets | /api/tickets/**, /api/tickets/{id}/comments/** |

## Prerequisites
- Java 17 (check: java -version)
- Maven 3.9+ (check: mvn -version)
- Node 18+ (check: node -v)
- PostgreSQL 15 (check: psql --version)

## Database setup
Run these commands once:
```sql
sudo -u postgres psql
CREATE USER campus_user WITH PASSWORD 'campus123';
CREATE DATABASE smart_campus OWNER campus_user;
CREATE DATABASE smart_campus_test OWNER campus_user;
GRANT ALL PRIVILEGES ON DATABASE smart_campus TO campus_user;
GRANT ALL PRIVILEGES ON DATABASE smart_campus_test TO campus_user;
\q
```

## Backend setup
1. Open Google Cloud Console → APIs & Services → Credentials
2. Create OAuth 2.0 Client ID (Web application)
3. Add authorized redirect URI: http://localhost:8080/login/oauth2/code/google
4. Copy client-id and client-secret into server/src/main/resources/application.properties
5. Run: cd server && mvn spring-boot:run
6. API available at: http://localhost:8080

## Frontend setup (done separately by team)
cd client && npm install && npm run dev
App available at: http://localhost:5173

## API endpoints summary
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/health | Public | Service health probe |
| GET | /api/auth/health | Public | Auth service health probe |
| GET | /oauth2/authorization/google | Public | Start Google OAuth2 login via Spring Security |
| GET | /api/auth/me | Authenticated | Get current user summary |
| GET | /api/resources | Public | Search resources by type, location, and capacity |
| GET | /api/resources/{id} | Public | Get a single resource by id |
| POST | /api/resources | Admin only | Create a resource |
| PUT | /api/resources/{id} | Admin only | Update a resource |
| DELETE | /api/resources/{id} | Admin only | Soft delete a resource by marking it out of service |
| POST | /api/bookings | Authenticated | Create a booking request |
| GET | /api/bookings/my | Authenticated | Get bookings for the current user |
| GET | /api/bookings | Admin only | List all bookings, optionally filtered by status |
| GET | /api/bookings/{id} | Authenticated | Get booking details by id |
| PATCH | /api/bookings/{id}/approve | Admin only | Approve a booking |
| PATCH | /api/bookings/{id}/reject | Admin only | Reject a booking with a reason |
| PATCH | /api/bookings/{id}/cancel | Authenticated | Cancel the current user’s booking |
| POST | /api/tickets | Authenticated | Create a maintenance or incident ticket with optional image uploads |
| GET | /api/tickets | Authenticated | List all tickets, optionally filtered by status |
| GET | /api/tickets/my | Authenticated | Get tickets created by the current user |
| GET | /api/tickets/{id} | Authenticated | Get ticket details by id |
| PATCH | /api/tickets/{id}/status | Admin or Technician | Update ticket status and optional resolution note |
| PATCH | /api/tickets/{id}/assign | Admin only | Assign a technician or staff user to a ticket |
| POST | /api/tickets/{ticketId}/comments | Authenticated | Add a comment to a ticket |
| DELETE | /api/tickets/{ticketId}/comments/{commentId} | Authenticated | Delete a comment if authorized |
| DELETE | /api/tickets/{id} | Admin only | Delete a ticket |
| GET | /api/notifications | Authenticated | List notifications for the current user |
| GET | /api/notifications/unread-count | Authenticated | Count unread notifications |
| PATCH | /api/notifications/read-all | Authenticated | Mark all notifications as read |
| PATCH | /api/notifications/{id}/read | Authenticated | Mark one notification as read |

## GitHub Actions
CI runs on every push. Requires PostgreSQL 15 service — configured in .github/workflows/ci.yml.
