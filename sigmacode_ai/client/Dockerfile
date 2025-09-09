#############################################
# Dev stage (Node + Vite dev server)
#############################################
FROM node:20-alpine AS dev
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3092"]

#############################################
# Builder stage (Production build)
#############################################
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

#############################################
# Prod stage (Nginx to serve static build)
#############################################
FROM nginx:1.25-alpine AS prod
WORKDIR /usr/share/nginx/html
COPY --from=builder /app/dist .
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
