# CreatorIQ API

A FastAPI + PostgreSQL backend for CreatorIQ.

## Project Structure

```
app/
├── main.py          # FastAPI app entrypoint
├── core/            # Config, security, auth helpers
├── db/              # Database engine/session setup
├── models/          # SQLAlchemy models
├── schemas/         # Pydantic request/response schemas
├── routers/         # API route definitions
├── services/        # Business logic / DB queries
├── utils/           # Shared helpers

tests/               # Pytest test suite
```

## Setup

### 1. Create a virtual environment

```bash
python -m venv venv
```

### 2. Activate it

**Windows**

```bash
venv\Scripts\activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Run the application

```bash
uvicorn app.main:app --reload
```

### 5. Open Swagger

```
http://localhost:8000/docs
```

## Running Tests

```bash
pytest
```
