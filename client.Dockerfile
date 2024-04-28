FROM node:16 as module_builder

WORKDIR /tmp

COPY devU-shared .

RUN npm install && \
    npm run clean-directory && \
    npm run build-docker

FROM node:16

WORKDIR /app

COPY ./devU-client/package.json ./devU-client/package-lock.json ./


RUN npm install

COPY ./devU-client/ .

COPY --from=module_builder /tmp/devu-shared-modules ./devu-shared-modules

RUN npm run build
CMD cp -r /app/dist/* /out