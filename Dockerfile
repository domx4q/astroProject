FROM ubuntu:20.04
EXPOSE 3511
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

# Install Git
RUN apt-get install -y git
# Install screen
RUN apt-get install -y screen
## Install Python
#RUN apt-get install -y python3
## Install pip
#RUN apt-get install -y python3-pip
## Install pipenv
#RUN pip3 install pipenv
# Install mkcert
#RUN apt-get install -y mkcert
#
#
## generate SSL Certificates
#RUN mkcert -install
#RUN mkcert -key-file /home/clouster/certificates/cloudster.online.key -cert-file /home/clouster/certificates/cert.crt cloudster.online

# Download the App
RUN cd /opt && git clone ${GITHUB_URL} -b 178-docker
