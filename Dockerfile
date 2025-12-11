FROM node:20-alpine AS build

# Install git
RUN apk add --no-cache git

WORKDIR /app

COPY package.json ./
RUN npm install --production

COPY . .

FROM node:20-alpine
WORKDIR /app

COPY --from=build /app /app

EXPOSE 3000
CMD ["node", "server.js"]
