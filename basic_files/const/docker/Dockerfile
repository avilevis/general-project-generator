FROM node:14.14.0-alpine

# Install nodemon
RUN npm install -g nodemon

# Add a /app volume
VOLUME ["/app"]

# Define working directory
WORKDIR /app

# Run npm install
RUN npm install

# Expose port
EXPOSE ${exposePort}

# Run app
CMD npm run dev
