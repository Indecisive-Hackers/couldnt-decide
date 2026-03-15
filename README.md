# Couldn't Decide

An AI-powered debate referee. Users submit claims from both sides of a debate and the app uses AI to fact-check each claim for accuracy, helping surface misinformation in real time.

## Stack

- **Frontend**: Angular 18 — `http://localhost:4200`
- **Backend**: Python/Flask — `http://localhost:5000`
- **Database**: PostgreSQL (via Docker) — `localhost:5432`

## Prerequisites

- [Node.js](https://nodejs.org/) + npm
- Python 3 (pip with venv)
- [Docker](https://www.docker.com/)
- Angular CLI: `npm install -g @angular/cli`

## Quick Start

Scripts are provided to start and stop all services:

```bash
./start.sh   # starts DB, backend, and frontend
./stop.sh    # stops all services (and remove pg containers)
```

## Manual Setup

### Database

(pending)
```bash
docker run --name cant-decide \
    -p 5432:5432 \
    -e POSTGRES_DB=cant-decide \
    -e POSTGRES_PASSWORD=cat \
    -d postgres > database.txt
```

### Backend

```bash
cd backend/
python -m venv ../venv
source ../venv/bin/activate
pip install -r ../requirements.txt
./bootstrap.sh
```

The API will be available at `http://localhost:5000`.

### Frontend

```bash
cd frontend/
ng serve
```

The app will be available at `http://localhost:4200`.
