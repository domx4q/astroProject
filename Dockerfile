FROM ubuntu:20.04
EXPOSE 3000

VOLUME /opt/certs

ENTRYPOINT ["/bin/bash", "-c", "cd /opt/astroProject && bash ./dockerEntrypoint.sh"]
WORKDIR /opt/astroProject
ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=Europe/Berlin

ENV USERNAME=domx4q
ENV GITHUB_PAT=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
ENV GITHUB_URL="https://${USERNAME}:${GITHUB_PAT}@github.com/domx4q/astroProject.git"

# Install Node.js via nvm
RUN apt-get update && apt-get install -y curl
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
RUN . ~/.nvm/nvm.sh && nvm install --lts
# Install npm
RUN apt-get install -y npm

# Install Git
RUN apt-get install -y git
# Install screen
RUN apt-get install -y screen

# Download the App
RUN cd /opt && git clone ${GITHUB_URL}
