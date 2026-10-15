# Use official Node.js LTS image
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files first (for layer caching)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy rest of backend code
COPY . .

# Create uploads folder (for avatars)
RUN mkdir -p uploads/avatars

# Expose port
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]