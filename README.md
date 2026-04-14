# Employee Scheduling API – Getting Started

### This project use this tools:

node.js - express - rest api - typescript - zod - JWT - bcrypt - prisma orm - postgres - insomnia - react - vite - logging winston - prettier - eslint - 599 modules in backend - 406 muduler in frontend.

```
tree -d -I node_modules
[4.0K]  .
├── [4.0K]  backend
│   ├── [4.0K]  generated
│   │   └── [4.0K]  prisma
│   │       ├── [4.0K]  internal
│   │       └── [4.0K]  models
│   ├── [4.0K]  logs
│   ├── [4.0K]  prisma
│   │   └── [4.0K]  migrations
│   │       ├── [4.0K]  20260407093610_instiall_migration
│   │       └── [4.0K]  20260408100547_instiall_migration2
│   ├── [4.0K]  scripts
│   ├── [4.0K]  SQL scripts
│   └── [4.0K]  types
└── [4.0K]  frontend
    └── [4.0K]  employee-scheduling
        ├── [4.0K]  public
        └── [4.0K]  src
            ├── [4.0K]  components
            ├── [4.0K]  pages
            └── [4.0K]  services

```

$\color{orange}{\large\text{Follow these steps to set up the project locally.}}$

## 1. Setup Express Server and Prisma Postgres DataBase

```bash
git clone https://github.com/ViktorOlausson/Project-Employee-Scheduling.git
cd Project-Employee-Scheduling/backend
pnpm i # install modules. use 'npm' if it feels right

# Ensure '.env' exists in the backend. Set: DATABASE_URL and JWT_SECRET
# edit .env and add your private string to connect to Prisma.io
DATABASE_URL="postgresql://user:password@localhost:5432/employeescheduling"
JWT_SECRET="asdfoiu34ifki < secret code > vq34f+u2kfoekfkfg3k0f"

# Set up postgres database with prisma ORM:
pnpm prisma migrate dev --name init # Apply Database Migrations
pnpm seed                           # add data to the database
pnpm prisma generate                # Prisma client

# Start express server
pnpm dev
pnpm prisma studio                  # Optional: View data in Prisma Studio
```

## 2. Setup Frontend

```bash
cd ../frontend/employee-scheduling/
pnpm i   # install modules
pnpm dev # running vite
```
