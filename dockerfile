# Use a imagem base do PHP com Apache
FROM php:8.1-apache

# Instale as extensões necessárias
RUN docker-php-ext-install mysqli

# Copie os arquivos do Backend para o Apache
COPY ./Backend/ /var/www/html/

# Ajuste permissões
RUN chown -R www-data:www-data /var/www/html
RUN chmod -R 755 /var/www/html

# Habilite o mod_rewrite do Apache
RUN a2enmod rewrite
