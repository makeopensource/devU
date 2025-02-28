FROM node:20 AS module_builder

WORKDIR /tmp

COPY devU-shared .

RUN npm install && \
    npm run clean-directory && \
    npm run build-docker

FROM node:16  AS frontend

WORKDIR /app

COPY ./devU-client/package.json ./

RUN npm install

COPY ./devU-client/ .

COPY --from=module_builder /tmp/devu-shared-modules ./devu-shared-modules

# Pass API_URL and ROOT_PATH as build arguments
ARG API_URL
ARG ROOT_PATH

# Use build arguments in the build command
RUN API_URL=$API_URL ROOT_PATH=$ROOT_PATH npm run build-docker

# final stage serve frontend files
FROM nginx:1.23.3

COPY nginx.conf /etc/nginx/nginx.conf

# Copy built frontend files to nginx serving directory
COPY --from=frontend /app/dist/local /usr/share/nginx/html