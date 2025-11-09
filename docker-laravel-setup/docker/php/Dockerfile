# PHP-FPM with common Laravel extensions
FROM php:8.3-fpm-alpine

# Install system dependencies
RUN apk add --no-cache     bash git curl unzip libzip-dev icu-dev oniguruma-dev     libpng-dev libjpeg-turbo-dev freetype-dev libxml2-dev shadow     && docker-php-ext-configure gd --with-freetype --with-jpeg     && docker-php-ext-install pdo_mysql bcmath opcache intl gd zip

# Copy Composer from official image
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Create a non-root user for safety (www-data exists; ensure has home)
RUN usermod -u 1000 www-data || true && groupmod -g 1000 www-data || true

WORKDIR /var/www/html

# Recommended PHP settings for Laravel
RUN {     echo "memory_limit=512M";     echo "upload_max_filesize=64M";     echo "post_max_size=64M";     echo "max_execution_time=120";     } > /usr/local/etc/php/conf.d/laravel.ini

CMD ["php-fpm", "-y", "/usr/local/etc/php-fpm.conf", "-R"]