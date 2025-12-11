# Dockerfile - Node 18
FROM node:18-alpine

WORKDIR /app

# install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# copy app
COPY . .

# create sessions folder
RUN mkdir -p /app/sessions

EXPOSE 3000
CMD ["node", "server.js"]
