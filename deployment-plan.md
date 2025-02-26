# Deployment Plan for Click & Ship Tycoon

This document outlines the steps to prepare the Click & Ship Tycoon project for GitHub and Heroku deployment.

## Table of Contents

1. [GitHub Repository Setup](#github-repository-setup)
2. [Docker Configuration](#docker-configuration)
   - [Frontend Dockerfile](#frontend-dockerfile)
   - [Backend Dockerfile](#backend-dockerfile)
   - [Docker Compose Configuration](#docker-compose-configuration)
3. [Heroku Deployment Setup](#heroku-deployment-setup)
   - [Prerequisites](#prerequisites)
   - [Application Configuration](#application-configuration)
   - [Database Configuration](#database-configuration)
4. [Deployment Instructions](#deployment-instructions)
   - [Local Development](#local-development)
   - [Heroku Deployment](#heroku-deployment)
5. [CI/CD Pipeline](#cicd-pipeline)
6. [Troubleshooting](#troubleshooting)

## GitHub Repository Setup

1. **Initialize Git Repository** (if not already done):
   ```bash
   git init
   ```

2. **Create .gitignore File**:
   The project already has a .gitignore file, but ensure it includes:
   ```
   # Node.js
   node_modules/
   npm-debug.log
   
   # Python
   __pycache__/
   *.py[cod]
   *$py.class
   *.so
   .Python
   env/
   venv/
   ENV/
   
   # Build files
   frontend/dist/
   
   # Environment variables
   .env
   .env.local
   .env.development.local
   .env.test.local
   .env.production.local
   
   # Docker
   .dockerignore
   
   # IDE files
   .idea/
   .vscode/
   *.swp
   *.swo
   ```

3. **Create GitHub Repository**:
   - Go to [GitHub](https://github.com) and create a new repository
   - Follow GitHub's instructions to push your existing repository

4. **Add README and Documentation**:
   - The project already has a comprehensive README.md
   - Consider adding additional documentation for deployment

## Docker Configuration

### Frontend Dockerfile

Create a Dockerfile in the frontend directory:

```dockerfile
# frontend/Dockerfile
FROM node:18-alpine as build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

Create an nginx.conf file in the frontend directory:

```nginx
# frontend/nginx.conf
server {
    listen 80;
    
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
    
    # Proxy API requests to the backend
    location /api {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Backend Dockerfile

Create a Dockerfile in the backend directory:

```dockerfile
# backend/Dockerfile
FROM python:3.10-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Expose port
EXPOSE 8000

# Command to run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Docker Compose Configuration

Update the docker-compose.yml file to include all services:

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      - POSTGRES_SERVER=postgres
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=clickship
      - BACKEND_CORS_ORIGINS=["http://localhost:80"]
    restart: unless-stopped

  postgres:
    image: postgres:16-alpine
    container_name: clickship-postgres
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=clickship
    volumes:
      - postgres-data:/var/lib/postgresql/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres-data:
```

## Heroku Deployment Setup

### Prerequisites

1. **Install Heroku CLI**:
   ```bash
   # macOS
   brew install heroku/brew/heroku
   
   # Ubuntu
   curl https://cli-assets.heroku.com/install-ubuntu.sh | sh
   
   # Windows
   # Download installer from: https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login to Heroku**:
   ```bash
   heroku login
   ```

3. **Install Heroku Container Registry Plugin** (for Docker deployments):
   ```bash
   heroku plugins:install heroku-container-registry
   ```

### Application Configuration

1. **Create Heroku Apps**:
   ```bash
   # Create frontend app
   heroku create clickship-frontend
   
   # Create backend app
   heroku create clickship-backend
   ```

2. **Create Heroku.yml Files**:

   For the backend:
   ```yaml
   # backend/heroku.yml
   build:
     docker:
       web: Dockerfile
   ```

   For the frontend:
   ```yaml
   # frontend/heroku.yml
   build:
     docker:
       web: Dockerfile
   ```

3. **Create Procfile for Backend** (alternative to Docker deployment):
   ```
   # backend/Procfile
   web: uvicorn app.main:app --host=0.0.0.0 --port=${PORT:-8000}
   ```

### Database Configuration

1. **Add PostgreSQL Add-on to Backend App**:
   ```bash
   heroku addons:create heroku-postgresql:mini --app clickship-backend
   ```

2. **Configure Environment Variables**:
   ```bash
   # Get the DATABASE_URL from Heroku
   heroku config:get DATABASE_URL --app clickship-backend
   
   # Set environment variables for the backend
   heroku config:set SECRET_KEY=$(openssl rand -hex 32) --app clickship-backend
   heroku config:set BACKEND_CORS_ORIGINS='["https://clickship-frontend.herokuapp.com"]' --app clickship-backend
   
   # Set environment variables for the frontend
   heroku config:set VITE_API_URL=https://clickship-backend.herokuapp.com --app clickship-frontend
   ```

## Deployment Instructions

### Local Development

1. **Build and Run with Docker Compose**:
   ```bash
   # Build all services
   docker-compose build
   
   # Start all services
   docker-compose up -d
   
   # View logs
   docker-compose logs -f
   ```

2. **Access the Application**:
   - Frontend: http://localhost
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Heroku Deployment

1. **Deploy Backend**:
   ```bash
   cd backend
   
   # Set Git remote for Heroku
   heroku git:remote --app clickship-backend
   
   # Deploy using Docker
   heroku container:push web --app clickship-backend
   heroku container:release web --app clickship-backend
   
   # Run migrations
   heroku run python -m alembic upgrade head --app clickship-backend
   
   # Initialize database
   heroku run python -m app.initial_data --app clickship-backend
   ```

2. **Deploy Frontend**:
   ```bash
   cd frontend
   
   # Set Git remote for Heroku
   heroku git:remote --app clickship-frontend
   
   # Deploy using Docker
   heroku container:push web --app clickship-frontend
   heroku container:release web --app clickship-frontend
   ```

3. **Access the Deployed Application**:
   - Frontend: https://clickship-frontend.herokuapp.com
   - Backend API: https://clickship-backend.herokuapp.com
   - API Documentation: https://clickship-backend.herokuapp.com/docs

## CI/CD Pipeline

For automated deployments, consider setting up GitHub Actions:

1. **Create GitHub Actions Workflow File**:
   ```yaml
   # .github/workflows/deploy.yml
   name: Deploy
   
   on:
     push:
       branches: [ main ]
   
   jobs:
     deploy-backend:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - name: Login to Heroku
           uses: akhileshns/heroku-deploy@v3.12.14
           with:
             heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
             heroku_app_name: "clickship-backend"
             heroku_email: ${{ secrets.HEROKU_EMAIL }}
             usedocker: true
             appdir: "backend"
         - name: Run migrations
           run: |
             heroku run python -m alembic upgrade head --app clickship-backend
   
     deploy-frontend:
       runs-on: ubuntu-latest
       needs: deploy-backend
       steps:
         - uses: actions/checkout@v3
         - name: Login to Heroku
           uses: akhileshns/heroku-deploy@v3.12.14
           with:
             heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
             heroku_app_name: "clickship-frontend"
             heroku_email: ${{ secrets.HEROKU_EMAIL }}
             usedocker: true
             appdir: "frontend"
   ```

2. **Add GitHub Secrets**:
   - HEROKU_API_KEY: Your Heroku API key
   - HEROKU_EMAIL: Your Heroku account email

## Troubleshooting

### Common Issues and Solutions

1. **Database Connection Issues**:
   - Check that the DATABASE_URL environment variable is correctly set
   - Ensure the database credentials are correct
   - Verify that the database server is accessible from the application

2. **CORS Issues**:
   - Ensure the BACKEND_CORS_ORIGINS environment variable includes the frontend URL
   - Check that the frontend is making requests to the correct backend URL

3. **Build Failures**:
   - Check the build logs for errors
   - Ensure all dependencies are correctly specified in package.json and requirements.txt
   - Verify that the Node.js and Python versions are compatible with the code

4. **Heroku Deployment Issues**:
   - Check the Heroku logs: `heroku logs --tail --app clickship-backend`
   - Ensure the Procfile or heroku.yml is correctly configured
   - Verify that the PORT environment variable is being used correctly

### Debugging Tools

1. **View Heroku Logs**:
   ```bash
   heroku logs --tail --app clickship-backend
   heroku logs --tail --app clickship-frontend
   ```

2. **Access Heroku Bash**:
   ```bash
   heroku run bash --app clickship-backend
   ```

3. **Check Heroku Config**:
   ```bash
   heroku config --app clickship-backend
   heroku config --app clickship-frontend