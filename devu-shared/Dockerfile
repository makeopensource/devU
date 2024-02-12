FROM node:16.16.0-alpine

WORKDIR /tmp

# devu-shared into /tmp
COPY . .

# clean any files that might cause conflicts
RUN npm run clean-directory

RUN npm install

# run build modules script
RUN npm run build-local

# copy generated file into /app -> which is the api dir
COPY ./devu-shared-modules ../app/