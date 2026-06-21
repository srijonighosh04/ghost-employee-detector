# Database Migrations with Alembic

This folder serves as the migration control center for the NexusIQ project. The backend application uses **SQLAlchemy** to interface with the database and **Alembic** to manage database schema updates.

---

## Migration Setup Workflow

If you want to configure Alembic from scratch in this project:

### 1. Install Alembic in your Python virtual environment
Ensure you are in the `/backend` directory with your virtual environment active, and install alembic:
```bash
pip install alembic
```

### 2. Initialize Alembic inside this directory
Run the initialization tool targeting this folder:
```bash
alembic init database/migrations
```
This generates:
- `alembic.ini` (in the root directory of execution)
- `database/migrations/env.py` (configuration script for running migrations)
- `database/migrations/script.py.mako` (migration script template)

---

## Connecting Alembic to SQLAlchemy Models

To enable autogeneration of migration files from backend models:

### 1. Update `alembic.ini`
In the root `alembic.ini` file, update the connection URL to read dynamically or set the static URL:
```ini
sqlalchemy.url = sqlite:///./backend/nexusiq.db
# or for production PostgreSQL:
# sqlalchemy.url = postgresql://user:password@host:port/dbname
```

### 2. Update `database/migrations/env.py`
Configure migrations to read SQLAlchemy metadata. Import the models base from the backend and set the target metadata:

```python
import sys
import os

# Add backend directory to path to resolve imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../backend')))

from app.core.database import Base
from app.models import Team, Employee, Project, DocumentRecord  # Import all models to register metadata

# Set metadata
target_metadata = Base.metadata
```

---

## Common Migration Commands

Run all commands from the parent directory where `alembic.ini` is located:

### 1. Create a migration script automatically (Autogenerate)
Compares current database tables to SQLAlchemy models and drafts a schema update script:
```bash
alembic revision --autogenerate -m "initial_schema"
```
The migration file is created inside `database/migrations/versions/`.

### 2. Run pending migrations
Applies all unrun migration scripts to update the database schema to the latest version:
```bash
alembic upgrade head
```

### 3. Rollback the last migration
Reverts the database schema by one revision:
```bash
alembic downgrade -1
```
