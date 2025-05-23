# Multi-stage build for both frontend and backend

# Python backend stage
FROM python:3.10-slim as python-builder
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# Node.js frontend stage
FROM node:20-alpine as node-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Final stage
FROM python:3.10-slim
COPY --from=python-builder /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH

# Copy frontend build
WORKDIR /app
COPY --from=node-builder /app/dist ./dist
COPY --from=node-builder /app/public ./public

# Copy the rest of the application
COPY . .

# Set environment variable for production
ENV NODE_ENV=production

# Expose port for the application
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
