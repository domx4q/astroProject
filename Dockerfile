FROM node:16 as base

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
# RUN git clone --single-branch "https://github.com/domx4q/astroProject.git" /opt/astroProject
# for local or github:
COPY . /opt/astroProject

EXPOSE 3000
ENTRYPOINT ["./dockerEntrypoint.sh"]