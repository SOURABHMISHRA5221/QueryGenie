# Use a Node.js base image
FROM node:16-alpine  # Or a later LTS version

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if it exists)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app (if necessary)
RUN npm run build

# Use a production-ready server (e.g., Nginx)
# You can use serve as well if you want a simpler approach
# FROM nginx:alpine 

# COPY --from=0 /app/build /usr/share/nginx/html

# Configure Nginx (if you use it)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port that the app runs on (usually 3000 for React apps)
EXPOSE 3000

# Start the application
# CMD ["nginx", "-g", "daemon off;"] # If using Nginx
CMD ["npm", "start"] # Or "serve", "-s", "build" if using serve