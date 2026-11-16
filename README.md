# Inventario Web

Interfaz web para consultar los productos activos de `inventario-api` y crear
productos con su precio y stock inicial.

## Requisitos

- Node.js 20.19 o superior y npm.
- Python 3.12 o superior para ejecutar `inventario-api`.

Las versiones de dependencias de JavaScript están fijadas en `package.json` y
`package-lock.json`.

## Ejecutar inventario-api

Desde la carpeta del proyecto:

```powershell
Set-Location ..\inventario-api
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements-dev.txt
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

La API estará disponible en `http://localhost:8000`. Si no se define
`CORS_ORIGINS`, la API permite por defecto el origen `http://localhost:5173`,
que es el que usa Vite en desarrollo. Si necesitas cambiarlo, configura esa
variable en la terminal antes de iniciar la API, por ejemplo:

```powershell
$env:CORS_ORIGINS = "http://localhost:5173"
```

La API usa SQLite por defecto. Consulta el README de `inventario-api` para
opciones de base de datos y configuración.

## Configuración y ejecución

Desde la carpeta `inventario-web`, instala dependencias y crea el archivo local
de entorno:

```powershell
npm install
Copy-Item .env.example .env.local
```

`VITE_API_URL` indica la URL base de la API. Su valor predeterminado es
`http://localhost:8000`; cambia esta variable en `.env.local` si la API se
ejecuta en otra dirección.

Inicia la aplicación:

```powershell
npm run dev
```

Abre `http://localhost:5173` en el navegador. La vista consulta `GET /productos`
y permite agregar productos con `POST /productos`.

## Scripts disponibles

- `npm run dev`: inicia el servidor local de Vite.
- `npm run lint`: ejecuta ESLint.
- `npm run test`: ejecuta las pruebas unitarias y de componentes con Vitest.
- `npm run test:e2e`: ejecuta las pruebas de navegador con Playwright.
- `npm run build`: verifica TypeScript estricto y genera la compilación de
  producción.
- `npm run preview`: sirve localmente la compilación de producción.

## Pruebas

Ejecuta todas las comprobaciones con:

```powershell
npm run lint
npm run test
npm run build
npm run test:e2e
```

Vitest usa jsdom y MSW para simular `GET /productos` y `POST /productos` en las
pruebas de componentes. La prueba E2E usa `page.route` de Playwright para
interceptar esas solicitudes en el navegador. Este mock de red mantiene la
prueba reproducible y no requiere una API o una base de datos en ejecución.
