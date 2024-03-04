FROM node:16-alpine as base

WORKDIR /opt

ENV TZ=Europe/Berlin \
    TERM=xterm \
    DEBIAN_FRONTEND=noninteractive

# Install necessary packages
RUN apk update && apk add --no-cache \
    git \
    screen \
    openssl

FROM base as download_app

WORKDIR /opt/astroProject
RUN #git clone --single-branch "https://github.com/domx4q/astroProject.git" /opt/astroProject
COPY . .

EXPOSE 3000
ENTRYPOINT ["./dockerEntrypoint.sh"]
