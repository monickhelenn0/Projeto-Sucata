# Use a imagem oficial do PHP com Apache
FROM php:8.1-apache

# Instale as extensões necessárias para o PHP (como MySQLi)
RUN docker-php-ext-install mysqli

# Copie os arquivos do projeto para o diretório padrão do Apache
COPY . /var/www/html/

# Ajuste permissões
RUN chown -R www-data:www-data /var/www/html && chmod -R 755 /var/www/html

# Exponha a porta padrão do Apache
EXPOSE 80

# Inicie o Apache no modo foreground
CMD ["apache2-foreground"]
