# Click & Ship Tycoon

A mobile web game where players manage an order fulfillment business. Built with React, FastAPI, and PostgreSQL.

## Project Overview

Click & Ship Tycoon is an idle clicker game where players:
- Receive orders automatically
- Build products by clicking
- Ship orders by clicking
- Purchase technologies to improve efficiency
- Track statistics and compete on leaderboards

The game features a colorful, engaging art style with satisfying animations and sound effects to make the clicking and management aspects enjoyable.

## Tech Stack

### Frontend
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion

### Backend
- **Framework**: FastAPI (Python 3.10+)
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy with Alembic for migrations
- **Authentication**: JWT-based auth system

## Prerequisites

- Node.js (v18+) - we recommend using [nvm](https://github.com/nvm-sh/nvm) to manage Node.js versions
- Python (v3.10+)
- Docker and Docker Compose (for PostgreSQL)

### Node.js Setup with NVM

```bash
# Install nvm if you haven't already
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Install and use the recommended Node.js version
# .nvmrc files are provided in both the root and frontend directories
nvm install   # This will read the version from .nvmrc (v18)
nvm use       # This will use the version specified in .nvmrc
```

> **Note**: We've added `.nvmrc` files to both the project root and the frontend directory to make it easier to use the correct Node.js version with nvm.

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/click-ship-tycoon.git
cd click-ship-tycoon
```

### 2. Install Dependencies

You can install all dependencies at once using:

```bash
make setup
```

Or install them separately:

#### Frontend Dependencies
```bash
cd frontend
npm install
```

> **Note**: The project uses Tailwind CSS v3 for styling.

#### Backend Dependencies
```bash
cd backend
pip3 install -r requirements.txt
```

### 3. Database Setup

First, make sure all Python dependencies are installed:

```bash
cd backend
pip3 install -r requirements.txt
```

Start the PostgreSQL database:

```bash
make db-up
```

This will start a PostgreSQL container using Docker Compose.

Initialize the database schema:

```bash
make db-upgrade
```

Seed the database with initial data:

```bash
make init-db
```

## Running the Application

### Run Both Frontend and Backend

```bash
make run-all
```

### Run Frontend Only

```bash
make run-frontend
```

The frontend will be available at: http://localhost:5173

### Run Backend Only

```bash
make run-backend
```

The backend API will be available at: http://localhost:8000

API documentation (Swagger UI) will be available at: http://localhost:8000/docs

## Available Commands

| Command | Description |
|---------|-------------|
| `make setup` | Install all dependencies |
| `make run-all` | Run both frontend and backend |
| `make run-frontend` | Run frontend only |
| `make run-backend` | Run backend only |
| `make db-up` | Start PostgreSQL database |
| `make db-down` | Stop PostgreSQL database |
| `make db-migrate message="Migration message"` | Create a new database migration |
| `make db-upgrade` | Apply all pending migrations |
| `make db-downgrade` | Revert the last migration |
| `make init-db` | Initialize the database with seed data |
| `make build` | Build the frontend for production |

## Project Structure

```
click-ship-tycoon/
├── frontend/                  # React frontend
│   ├── src/
│   │   ├── assets/            # Images, sounds, etc.
│   │   ├── components/        # Reusable UI components
│   │   ├── features/          # Feature-based modules
│   │   ├── hooks/             # Custom React hooks
│   │   ├── store/             # State management
│   │   └── utils/             # Helper functions
│   └── ...
├── backend/                   # FastAPI backend
│   ├── app/
│   │   ├── api/               # API endpoints
│   │   ├── core/              # Core application code
│   │   ├── models/            # Database models
│   │   ├── schemas/           # Pydantic schemas
│   │   └── services/          # Business logic
│   ├── migrations/            # Alembic migrations
│   └── ...
├── docker-compose.yml         # Docker Compose configuration
├── Makefile                   # Make commands
└── README.md                  # This file
```

## Game Mechanics

1. **Order Management**: Orders are automatically generated and have deadlines
2. **Production**: Click to build products to fulfill orders
3. **Shipping**: Click to ship completed orders
4. **Technologies**: Purchase and upgrade technologies to improve efficiency
5. **Economy**: Earn money by shipping orders, spend money on technologies

## Development

### Database Migrations

When you make changes to the database models, you need to create a migration:

```bash
make db-migrate message="Add new field to business model"
```

This will use `python3 -m alembic` to generate a migration script.

Then apply the migration:

```bash
make db-upgrade
```

### Adding New Technologies

To add new technologies to the game, edit the `backend/app/initial_data.py` file and add new technology entries to the `technologies` list.

## Troubleshooting

### Frontend Issues

1. **Tailwind CSS Error**: If you encounter errors with Tailwind CSS, make sure you're using Tailwind CSS v3 as specified in package.json.

2. **Node.js Version**: This project requires Node.js v18+. If you encounter syntax errors or unexpected token errors, make sure you're using the correct Node.js version:
   ```bash
   nvm use
   ```

3. **Missing Dependencies**: If you encounter errors about missing dependencies, try reinstalling the dependencies:
   ```bash
   cd frontend
   rm -rf node_modules
   npm install
   ```

### Backend Issues

1. **Missing Python Packages**: If you encounter errors about missing Python packages, make sure you've installed all the required dependencies:
   ```bash
   cd backend
   pip3 install -r requirements.txt
   ```

2. **Database Connection Issues**: Make sure the PostgreSQL database is running:
   ```bash
   docker ps
   ```
   If it's not running, start it with:
   ```bash
   make db-up
   ```

## Deployment

The application is designed to be deployed as a Docker container. A Dockerfile is provided for both the frontend and backend.

For production deployment, you would typically:

1. Build the frontend: `make build`
2. Build and push Docker images
3. Deploy to your hosting platform of choice

## License

MIT