# ----------------------------
# 1️⃣ Build stage
# ----------------------------
FROM node:alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .
# Build the application
# RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "dev"]



