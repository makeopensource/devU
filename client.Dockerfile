FROM node:22-alpine AS module_builder

WORKDIR /tmp

COPY devU-shared .

RUN npm install && \
    npm run clean-directory && \
    npm run build-docker

FROM node:22-alpine

WORKDIR /app

COPY ./devU-client/package.json ./

RUN npm install

COPY ./devU-client/ .

COPY --from=module_builder /tmp/devu-shared-modules ./devu-shared-modules

# build frontend during run so that we can modify baseurl via docker envoirment
CMD npm run build-docker && rm -rf /out/* && cp -r /app/dist/* /out
