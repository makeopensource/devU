# Debug: docker build devU-api/. --progress=plain
# Create and move the generated config ymal files
FROM docker.io/python:alpine AS config


WORKDIR /stage
COPY ./config ./config
COPY ./scripts/generateConfig.sh ./generateConfig.sh
RUN apk add --no-cache bash jq openssl \
  && pip install yq

RUN ./generateConfig.sh ./default.yml
# RUN ls
RUN cat default.yml


FROM node:16

WORKDIR /app

COPY . .
COPY --from=config /stage/default.yml config/default.yml
# Moving the generated config ymal files into the config folder
COPY package.json package-lock.json ./
RUN npm install

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait
RUN ls /app/config
CMD /wait && npm run typeorm -- migration:run && npm start
