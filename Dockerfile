# ----------------------------
# 1️⃣ Build stage
# ----------------------------
FROM node:alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .
# Build the application
RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "dev"]



