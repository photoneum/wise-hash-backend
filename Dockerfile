FROM node:22.11.0-slim

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Install openssl
RUN apt-get update && apt-get install -y openssl

# Build TypeScript
RUN npm run build

# Generate Prisma client
RUN npx prisma generate

# Expose port
EXPOSE 4000

# Use a different command to ensure we're in the right directory
CMD ["node", "dist/index.js"]