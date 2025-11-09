# Docker deploy for your Laravel + Inertia app

## 0) Prerequisites
- Docker Desktop installed
- Your project root contains: `composer.json`, `artisan`, `public/`, `resources/`, `vite.config.ts/js`
- Copy `.env.example` to `.env` and set:
```
APP_ENV=local
APP_KEY=
APP_URL=http://localhost:8000
DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=meettrip
DB_USERNAME=meettrip
DB_PASSWORD=secret
```
(Adjust values as you wish.)

## 1) Build & start
```bash
docker compose up -d --build
```

## 2) Install PHP deps
```bash
docker compose exec app composer install --no-interaction --prefer-dist --optimize-autoloader
```

## 3) Generate app key & link storage
```bash
docker compose exec app php artisan key:generate
docker compose exec app php artisan storage:link
```

## 4) Set writable permissions (first time)
```bash
docker compose exec app sh -lc "chown -R www-data:www-data storage bootstrap/cache && chmod -R ug+rwx storage bootstrap/cache"
```

## 5) Create database & seed (optional if you have migrations)
```bash
docker compose exec app php artisan migrate --seed
```

## 6) Build front assets (Vite)
This runs automatically once at container start, but run it again if you change front code:
```bash
docker compose exec node npm run build
```
Built files will be in `public/build` and served by Nginx on http://localhost:8000

## 7) (Dev mode) Vite hot reload
If you want hot-reload during dev, modify the `node` service command to `npm run dev`, and add the Vite dev server port to `web`:
```yaml
  web:
    ports:
      - "8000:80"
      - "5173:5173"  # if Vite serves on 5173
```
Then set `VITE_DEV_SERVER_URL` in `.env` (or follow your existing Vite/Laravel config).

## 8) Useful commands
- Logs:
```bash
docker compose logs -f app
docker compose logs -f web
docker compose logs -f node
docker compose logs -f db
```
- Tinker:
```bash
docker compose exec app php artisan tinker
```
- Queue (if used):
```bash
docker compose exec app php artisan queue:work
```

## Notes
- Nginx points to `/public` and forwards PHP to `app:9000` (php-fpm).
- DB service name is `db` so `DB_HOST=db` in `.env`.
- If you keep images in `public/storage/activities`, ensure `php artisan storage:link` is done.
- For production, you would typically remove volumes and bake assets inside an image or CI/CD, but for local deploy this is fine.