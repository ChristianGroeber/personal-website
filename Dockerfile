FROM k0st/alpine-apache-php

ENV WORKDIR /app

RUN apk --update add git zip unzip php-dom php-ctype bash 

RUN composer self-update

RUN wget -P /tmp https://github.com/picocms/Pico/releases/download/v2.1.4/pico-release-v2.1.4.zip
RUN unzip -u /tmp/pico-release-v2.1.4.zip -d /app

WORKDIR $WORKDIR

RUN composer install --no-interaction

EXPOSE 80
