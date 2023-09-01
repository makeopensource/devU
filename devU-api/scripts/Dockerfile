# This is the Dockerfile for ubautograding/devtools and can be extended as
# necessary. Currently it only contains the generateConfig utility.

# GenerateConfig can be used as follows:
#docker run -v $(pwd)/config:/config --rm ubautograding/devtools /generateConfig.sh config/default.yml

FROM docker.io/python:alpine

RUN apk add --no-cache bash jq openssl \
  && pip install yq

COPY ./generateConfig.sh /generateConfig.sh