FROM node:22.11.0-slim

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 4000

# Use a different command to ensure we're in the right directory
CMD ["node", "dist/index.js"]