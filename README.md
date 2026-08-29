Traffic Dashboard

It is a full-stack web application designed for displaying interactive traffic graphs and it was built using Next.js on the frontend and NestJS on the backend.

**Backend uses**

- TypeOrm that connects to PostgreSQL
- Redis for Cache
- Jest for testing

**Frontend uses**

- Recharts
- D3 Scale Chromatic for random color generation for each country or Vehicle
- Jest for testing

**Prerequisites**

- PostgreSQL
- Redis
- Docker and Docker Compose (Recommended), or Node.js

---

## Architecture Overview

### Backend - Nest JS

The application on the backend side uses TypeOrm on top of PostgreSQL, the pending migrations run everytime the api is started, it has following modules. The application uses standalone Redis for cache purpose.

**Traffic**

- by-country
  This endpoint returns data aggregated country wise, it checks if data is available in cache than returns from there
  and if no data is available than it calls database, stores that data in cache and returns the data.

- by-vehicle-type
  This endpoint returns data aggregated vehicle type wise,it checks if data is available in cache than returns from there
  and if no data is available than it calls database, stores that data in cache and returns the data.

**Ingestion**

- batch
  This endpoint is used to ingest data into database, it also stores the new records for both coutry wise cache and vehicle wise cache.

### Frontend - Next JS

The application on the frontend side used app router. Uses built in fetch for calling the backend api's. The frontend has only one page that comprises of following components

- Date Range filters
  This component has selectable date field for optional to and from fields. If not selected the api fetches all available data irrespective of the date.

- KPI Metrics
  This is KPI strip that just shows summarises the figures for total vehicles tracked, top country and top vehicle based on the data available fetched.

- Country-wise traffic chart
  This is country-wise traffic chart that displays chart for country wise data using Recharts, it also provides the capability to switch between bar, line or Pie chart. Initially it picking up colors from a fixed array of colors but later it was realised that number of countries can be way more than the colorset so switched to use d3 scale chromatic package for colors.

- Vehicle-type-wise traffic chart
  This is vehicle-type-wise traffic chart that displays chart for vehicle type wise data using Recharts, it also provides the capability to switch between bar, line or Pie chart. Initially it picking up colors from a fixed array of colors but later it was realised that number of countries can be way more than the colorset so switched to use d3 scale chromatic package for colors.

---

## Local Setup (Docker)

### Configure Environment Variables (Required for local development only)

Set up .env files for both the API and the Web workspaces by referring to their example files.

- API: Copy `apps/api/env.example` to `apps/api/.env`.
- Web: Copy the file 'apps/web/env.example' to 'apps/web/.env'

Note that, when using Docker, you should substitute `localhost` with `host.docker.internal` in the connection strings for both your database and Redis. The respective _.env_ files are ignored by git and are intended for use only in local development.

### Start the API

Open a terminal from the project root and spin up the backend container:

cd apps/api
docker compose -p traffic-dashboard-backend up --build

### Start the Web App

Open a second terminal window and spin up the frontend container:

cd apps/web
docker compose -p traffic-dashboard-frontend up --build

When both stacks have started up, open the link http://localhost:3000 in your web browser.

---

## Database Migrations

Whenever the API starts, pending migrations are carried out automatically since migrationsRun is enabled. The schema is automatically generated when a database is first created and does not require any manual action.

To create a new migration after modifying an entity:

cd apps/api && npm run migration:generate -- src/migrations/<MigrationName>

The migration referred to will take effect at the next startup of the API; or else you can carry it out right away by running the command `npm run migration:run`.

---

## Configuration Architecture

The .env files are not copied into the built images; rather, the configuration is added to docker compose at both build and run time. This approach makes it possible to avoid putting any sensitive data into the repository or storing it in plain text on the deployment host.

### API Configuration (apps/api/docker-compose.yml)

- For the non-sensitive settings: variables such as `POSTGRES_USER`, `POSTGRES_DB`, the ports, the hosts, and `CORS_ORIGIN` are directly hardcoded within the `environment` section of the `docker-compose.yml` file.
- Secrets: The `POSTGRES_PASSWORD` is safely interpolated from the environment:

  environment:
  POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:?set POSTGRES_PASSWORD}

  The use of the `:?` syntax causes Docker Compose to produce an error if the value is missing, which stops the container starting with an empty password.

How variables are resolved:

1. In a local setup, Docker Compose automatically retrieves the POSTGRES_PASSWORD from the .env file in the apps/api directory.
2. In the case of CI/CD, the deployment workflow exports the secret from GitHub Actions before running compose.

### Web Configuration (apps/web/docker-compose.yml)

The fact that Next.js includes `NEXT_PUBLIC_*` variables in the client bundle when the site is built means that these are not considered runtime secrets; instead, they are passed as Docker build arguments.

# Dockerfile

ARG NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

# docker-compose.yml

build:
context: .
args:
NEXT_PUBLIC_API_BASE_URL: ${NEXT_PUBLIC_API_BASE_URL:-http://localhost:4000}

In order to use a different address from the default (http://localhost:4000), you just need to export the variable `NEXT_PUBLIC_API_BASE_URL` in your shell prior to running the command `docker compose build`.

---

## Automated Deployment

The deployment pipeline is set out in the file .github/workflows/deploy-local.yml and is triggered each time there is a push to the Production branch; it is executed on a self-hosted runner and automatically rebuilds and restarts both Docker stacks.

The database secret is passed securely at the step level:

- name: Rebuild and restart API
  working-directory: apps/api
  env:
  POSTGRES_PASSWORD: ${{ secrets.POSTGRES_PASSWORD }}
  run: |
  docker compose -p traffic-dashboard-backend down
  docker compose -p traffic-dashboard-backend up --build -d

### Initial Runner Setup

Go to Settings, then choose Secrets and variables, followed by Actions and finally Repository secrets in your GitHub repository. 2. Include a new secret called `POSTGRES_PASSWORD` (note that it must be placed under the Actions tab since workflow runners are unable to read secrets from Agents, Codespaces, or Dependabot). 3. Register a self-hosted runner on your target deployment machine. Make sure Docker is installed and running.

---

## Alternative: Local Development (Without Docker)

If you want to run the application directly using Node.js, you can completely avoid Docker:

Start the API:
cd apps/api
npm ci
npm run start:dev

Start the Web App:
cd apps/web
npm ci
npm run dev
