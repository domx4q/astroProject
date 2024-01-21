FROM alpine:3.14 as base

WORKDIR /opt

# Set environment variables
ENV TZ=Europe/Berlin \
    TERM=xterm
    DEBIAN_FRONTEND=noninteractive

# Install necessary packages
RUN apk update && apk add --no-cache \
    nodejs \
    npm \
    git \
    screen \
    openssl

# Expose the required port
EXPOSE 3000

# Set the entrypoint
ENTRYPOINT ["./dockerEntrypoint.sh"]

# Download the App
FROM base as download_app

# Clone the repository
RUN git clone --single-branch "https://github.com/domx4q/astroProject.git" /opt/astroProject

# Set working directory for the app
WORKDIR /opt/astroProject
