# Multi-stage Dockerfile for combined backend (Node) and frontend (React)

# Stage 1: Build React app
FROM node:18-alpine AS react-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Stage 2: Build backend and include React build
FROM node:18-alpine AS backend-build
WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json ./
RUN npm install
COPY backend/ .
# Compile TypeScript
RUN npm run build
# Copy React build into public for serving
COPY --from=react-build /app/frontend/dist/. public/

# Stage 3: Final runtime image
FROM node:18-alpine
WORKDIR /app/backend
# Copy backend build output and dependencies
COPY --from=backend-build /app/backend .
# Expose API port
EXPOSE 4000
# Start the application
CMD ["npm", "run", "start"]
