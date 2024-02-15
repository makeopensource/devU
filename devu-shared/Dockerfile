FROM node:16.16.0-alpine

WORKDIR /tmp

# devu-shared into /tmp
COPY . .

# Clean any files that might cause conflicts, install dependencies, and run build script in one step
# we do this because if divide the commands docker will run each command in new container
# which will cause the files genrated to be not found on each command.
RUN npm run clean-directory && \
    npm install && \
    npm run build-docker && \
    # Copy generated file into /app -> which is the api dir
    cp -r ./devu-shared-modules ../app/ && \
    # Copy generated file into /client -> which is the frontend dir
    cp -r ./devu-shared-modules ../client/
