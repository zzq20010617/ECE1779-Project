# Stage 1: Build React app
FROM node:18 AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . ./
RUN npm run build

# Stage 2: Serve using Nginx
FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html

# default nginx config
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
