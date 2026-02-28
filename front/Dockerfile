# 1. Build étape
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG VITE_API_BASE=http://localhost:3030
ENV VITE_API_BASE=$VITE_API_BASE
RUN npm run build

# 2. Serve étape
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/public/images /usr/share/nginx/html/images
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]