FROM node:16 as module_builder

WORKDIR /tmp

COPY devU-shared .

RUN npm install && \
    npm run clean-directory && \
    npm run build-docker

FROM node:16

WORKDIR /app

COPY ./devU-api/package.json ./devU-api/package-lock.json ./

RUN npm install

COPY ./devU-api .

COPY --from=module_builder /tmp/devu-shared-modules ./devu-shared-modules

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

# TypeORM Migrations
CMD /wait && npm run typeorm -- migration:run && npm start

