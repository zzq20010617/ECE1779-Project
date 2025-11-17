# Stage 1: Build React app
FROM node:18 AS build

WORKDIR /app

# Copy package list first (better for caching)
COPY package.json package-lock.json ./
RUN npm install

# Copy all source code
COPY . ./

# Build the React app
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine

# Copy build output to Nginx web root
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

