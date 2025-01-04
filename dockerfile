FROM php:8.1-apache

# Instale as extensões necessárias
RUN docker-php-ext-install mysqli

# Copie os arquivos do Backend para o Apache
COPY .//var/www/html/

# Ajuste permissões
RUN chown -R www-data:www-data /var/www/html && chmod -R 755 /var/www/html

# Configure o DirectoryIndex do Apache
RUN echo "DirectoryIndex index.php" >> /etc/apache2/apache2.conf

# Exponha a porta padrão do Apache
EXPOSE 80
