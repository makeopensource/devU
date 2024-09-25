FROM python:alpine AS config

WORKDIR /stage
COPY devU-api/config ./config
COPY devU-api/scripts/generateConfig.sh ./generateConfig.sh
RUN apk add --no-cache bash jq openssl \
  && pip install yq
RUN ./generateConfig.sh ./default.yml

FROM node:20 as module_builder

WORKDIR /tmp

COPY devU-shared .

RUN npm install && \
    npm run clean-directory && \
    npm run build-docker

FROM node:20

WORKDIR /app

COPY ./devU-api/package.json ./

RUN npm install

COPY ./devU-api .

COPY --from=config /stage/default.yml ./config/default.yml
COPY --from=module_builder /tmp/devu-shared-modules ./devu-shared-modules

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

# TypeORM Migrations
CMD /wait && npm run typeorm -- migration:run -d src/database.ts && npm start

