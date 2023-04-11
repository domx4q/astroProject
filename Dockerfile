FROM ubuntu:20.04
EXPOSE 3000

VOLUME /opt/certs

ENTRYPOINT ["/bin/bash", "-c", "cd /opt/astroProject && bash ./dockerEntrypoint.sh"]
WORKDIR /opt
ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=Europe/Berlin

# Install Python, Git, screen, curl and npm
# skipcq: DOK-DL3008,  DOK-DL3015
RUN apt-get update && apt-get install -y python3 python3-pip curl git screen npm && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
# Install Node.js via nvm
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
RUN . ~/.nvm/nvm.sh && nvm install --lts

# Download the App
RUN git clone "https://github.com/domx4q/astroProject.git"

WORKDIR /opt/astroProject
