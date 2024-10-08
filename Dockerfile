FROM node:18 as base

WORKDIR /opt

ENV TZ=Europe/Berlin \
    TERM=xterm \
    DEBIAN_FRONTEND=noninteractive

# Install necessary packages
RUN apt update && apt install -y \
    git \
    screen \
    openssl

FROM base as download_app

WORKDIR /opt/astroProject
# on production need to clone from github otherwise the permissions are wrong
RUN git clone --single-branch "https://github.com/domx4q/astroProject.git" /opt/astroProject
# for local or github:
# COPY . /opt/astroProject

EXPOSE 3000
ENTRYPOINT ["/opt/astroProject/dockerEntrypoint.sh"]
