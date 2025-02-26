# Deployment Instructions for Click & Ship Tycoon

This document provides step-by-step instructions for deploying the Click & Ship Tycoon application to GitHub and Heroku.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development with Docker](#local-development-with-docker)
3. [Heroku Deployment](#heroku-deployment)
4. [GitHub Actions CI/CD](#github-actions-cicd)
5. [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, make sure you have the following installed:

- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/get-started) and Docker Compose
- [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
- [Node.js](https://nodejs.org/) (v18+)
- [Python](https://www.python.org/) (v3.10+)

## Local Development with Docker

The project is configured to run locally using Docker Compose, which sets up the frontend, backend, and PostgreSQL database.

### Building and Running the Application

1. **Build the Docker images**:
   ```bash
   make docker-build
   ```

2. **Start all services**:
   ```bash
   make docker-up
   ```

3. **Initialize the database** (first time only):
   ```bash
   make init-db
   ```

4. **Access the application**:
   - Frontend: http://localhost
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

5. **Stop all services**:
   ```bash
   make docker-down
   ```

## Heroku Deployment

### Initial Setup

1. **Login to Heroku**:
   ```bash
   make heroku-login
   ```

2. **Create Heroku apps** (only needed once):
   ```bash
   make heroku-create
   ```

3. **Set up PostgreSQL on Heroku**:
   ```bash
   heroku addons:create heroku-postgresql:mini --app clickship-backend
   ```

4. **Configure environment variables**:
   ```bash
   # Generate a secret key
   SECRET_KEY=$(openssl rand -hex 32)
   
   # Set backend environment variables
   heroku config:set SECRET_KEY=$SECRET_KEY --app clickship-backend
   heroku config:set BACKEND_CORS_ORIGINS='["https://clickship-frontend.herokuapp.com"]' --app clickship-backend
   
   # Set frontend environment variables
   heroku config:set VITE_API_URL=https://clickship-backend.herokuapp.com --app clickship-frontend
   ```

### Deployment

1. **Deploy the backend**:
   ```bash
   make heroku-deploy-backend
   ```

2. **Run database migrations**:
   ```bash
   make heroku-run-migrations
   ```

3. **Initialize the database**:
   ```bash
   make heroku-init-db
   ```

4. **Deploy the frontend**:
   ```bash
   make heroku-deploy-frontend
   ```

5. **Deploy everything at once** (after initial setup):
   ```bash
   make heroku-deploy-all
   ```

6. **Access the deployed application**:
   - Frontend: https://clickship-frontend.herokuapp.com
   - Backend API: https://clickship-backend.herokuapp.com
   - API Documentation: https://clickship-backend.herokuapp.com/docs

## GitHub Actions CI/CD

The project includes a GitHub Actions workflow that automatically deploys the application to Heroku when changes are pushed to the main branch.

### Setup

1. **Add GitHub Secrets**:
   - Go to your GitHub repository
   - Navigate to Settings > Secrets and variables > Actions
   - Add the following secrets:
     - `HEROKU_API_KEY`: Your Heroku API key (find it in your Heroku account settings)
     - `HEROKU_EMAIL`: Your Heroku account email

2. **Push to GitHub**:
   ```bash
   git push origin main
   ```

The GitHub Actions workflow will automatically:
1. Deploy the backend to Heroku
2. Run database migrations
3. Deploy the frontend to Heroku

## Troubleshooting

### Common Issues

#### Database Connection Issues

- **Check DATABASE_URL**: Make sure the DATABASE_URL environment variable is correctly set on Heroku:
  ```bash
  heroku config:get DATABASE_URL --app clickship-backend
  ```

- **Verify database connection**:
  ```bash
  heroku run python -c "from app.core.database import engine; from sqlalchemy import text; result = engine.execute(text('SELECT 1')); print(result.scalar())" --app clickship-backend
  ```

#### CORS Issues

- **Check CORS settings**: Ensure the BACKEND_CORS_ORIGINS environment variable includes the frontend URL:
  ```bash
  heroku config:get BACKEND_CORS_ORIGINS --app clickship-backend
  ```

- **Test CORS with a simple request**:
  ```javascript
  // Run this in the browser console
  fetch('https://clickship-backend.herokuapp.com/api/v1/users', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  }).then(response => console.log(response));
  ```

#### Heroku Deployment Issues

- **Check Heroku logs**:
  ```bash
  heroku logs --tail --app clickship-backend
  heroku logs --tail --app clickship-frontend
  ```

- **Verify Heroku configuration**:
  ```bash
  heroku config --app clickship-backend
  heroku config --app clickship-frontend
  ```

- **Access Heroku bash**:
  ```bash
  heroku run bash --app clickship-backend