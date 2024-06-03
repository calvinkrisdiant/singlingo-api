# Gunakan image node sebagai base image
FROM node:20

# Set work directory
WORKDIR /usr/src/app

# Copy package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port aplikasi
EXPOSE 8080

# Command untuk menjalankan aplikasi
CMD [ "npm", "start" ]
