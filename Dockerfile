# Etapa 1: Build
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build -- --configuration production

# Etapa 2: Servir con Nginx
FROM nginx:alpine
COPY --from=build /app/dist/fifa-frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
