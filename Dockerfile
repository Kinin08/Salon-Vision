FROM php:8.2-apache

# Extensões do PHP
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Habilita mod_rewrite
RUN a2enmod rewrite

# Copia o projeto
COPY . /var/www/html/

WORKDIR /var/www/html

EXPOSE 80