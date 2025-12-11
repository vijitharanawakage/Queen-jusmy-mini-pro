# ===== BUILD =====
FROM node:20-alpine AS build

WORKDIR /app

# install dependencies
COPY package.json ./
RUN npm install --production

# copy app
COPY . .

# ===== RUN =====
FROM node:20-alpine

WORKDIR /app

COPY --from=build /app /app

EXPOSE 3000
CMD ["node", "server.js"]
