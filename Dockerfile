# Dockerfile for Frontend

# Step 1: Use an official Node.js image as a parent image
FROM node:20-alpine

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json files
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the entire project into the container
COPY . .

# Step 6: Build the app for production
RUN npm run build

# Step 7: Expose port for the frontend to be accessible
EXPOSE 3000

# Step 8: Set environment variable for production
ENV NODE_ENV=production

# Step 9: Command to run the application
CMD ["npm", "start"]
