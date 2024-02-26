# keycloak-workshop
Keycloak Workshop. Learn how to connect Frontend and Backend with Keycloak in the "right-way"

## First Steps

1. Copy `.env.example` to `.env` in root repository directory
2. Copy `apps/backend/.env.example` to `apps/backend/.env`
3. Copy `apps/frontend/.env.example` to `apps/frontend/.env`
4. Execute command `docker compose up --build`

## Services

- Keycloak http://localhost:30090
- Backend http://localhost:30100
- Frontend http://localhost:30101
- MailDev http://localhost:30081
- Adminer http://localhost:30080

## Tasks

1. Create realm `workshop` in Keycloak
2. Create `backend` and `frontend` clients in Keycloak
3. Fix Frontend code to working properly with Keycloak
4. Fix Backend code to working properly with Keycloak
5. Write the missing code in Backend
