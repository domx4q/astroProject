FROM ubuntu:20.04 as base
EXPOSE 3000

VOLUME /opt/certs/cert.crt
VOLUME /opt/certs/cert.key

ENTRYPOINT ["/bin/bash", "-c", "cd /opt/astroProject && bash ./dockerEntrypoint.sh"]
WORKDIR /opt
ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=Europe/Berlin

# Install Python, Git, screen, curl and npm
# skipcq: DOK-DL3008,  DOK-DL3015
RUN apt-get update && apt-get install -y python3 python3-pip curl git screen npm openssl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
# Install Node.js via nvm
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
RUN . ~/.nvm/nvm.sh && nvm install --lts

# Download the App
FROM base as download_app
RUN git clone -b testing --single-branch "https://github.com/domx4q/astroProject.git"

WORKDIR /opt/astroProject
