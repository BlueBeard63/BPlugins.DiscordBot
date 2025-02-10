FROM node:18

RUN apt-get update && apt-get install -y rsync

COPY ./src/ /discordBotFiles/src
COPY package.json /discordBotFiles
COPY tsconfig.json /discordBotFiles
COPY config.template.toml /discordBotFiles

COPY boot.sh .

RUN useradd -m container

RUN chown -R container:container /home/container
RUN chmod -R 755 /home/container

RUN npm install -g tsx

USER container

ENV HOME /home/container
ENV USER container

WORKDIR /home/container

CMD ["/bin/bash", "../../../boot.sh"]