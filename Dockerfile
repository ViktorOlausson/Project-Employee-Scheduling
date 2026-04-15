FROM node:22-alpine

WORKDIR /app

COPY backend/package*.json ./backend/
COPY frontend/employee-scheduling/package*.json ./frontend/employee-scheduling/

WORKDIR /app/backend
RUN npm ci

WORKDIR /app/frontend/employee-scheduling
RUN npm ci

WORKDIR /app
COPY backend ./backend
COPY frontend/employee-scheduling ./frontend/employee-scheduling

WORKDIR /app/backend
ENV DATABASE_URL=postgresql://employee_scheduler:employee_scheduler_password@db:5432/employee_scheduling
RUN npx prisma generate

EXPOSE 3000
EXPOSE 5173

CMD ["sh", "-c", "cd /app/backend && npx prisma migrate deploy && npm run seed:docker && node --loader ts-node/esm server.ts & cd /app/frontend/employee-scheduling && npm run dev -- --host 0.0.0.0"]
