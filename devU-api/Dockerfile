# Debug: docker build devU-api/. --progress=plain --no-cache


# Create and move the generated config ymal files
FROM docker.io/python:alpine AS config
WORKDIR /stage
COPY ./config ./config
COPY ./scripts/generateConfig.sh ./generateConfig.sh
RUN apk add --no-cache bash jq openssl \
  && pip install yq
RUN ./generateConfig.sh ./default.yml
RUN cat default.yml

# Starting up the devU-api
FROM node:16
WORKDIR /app
COPY . .
# Moving the generated config ymal files into the config folder
COPY --from=config /stage/default.yml config/default.yml
COPY package.json package-lock.json ./
RUN npm install
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait
CMD /wait && npm run typeorm -- migration:run && npm start
# This command saved the generated default.yml during build stage used as debugging
# CMD  cp config/default.yml config/tmp && /wait && npm run typeorm -- migration:run && npm start