FROM ubuntu:lunar-20231004 as base
EXPOSE 3000

WORKDIR /opt
ENTRYPOINT ["./dockerEntrypoint.sh"]
ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=Europe/Berlin
ENV TERM=xterm

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
RUN git clone --single-branch "https://github.com/domx4q/astroProject.git"
# COPY . /opt/astroProject

WORKDIR /opt/astroProject
