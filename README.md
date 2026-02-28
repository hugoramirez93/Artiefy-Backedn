# Tienda API — Next.js + Prisma 7 + SQLite (better-sqlite3)

Este proyecto es una API construida con Next.js (App Router) y Prisma 7, usando SQLite como base de datos local (dev.db) mediante el adapter @prisma/adapter-better-sqlite3, el cual depende del módulo nativo better-sqlite3.

Este README documenta TODO lo necesario para que el proyecto funcione correctamente y, sobre todo, explica el proceso correcto para copiar o clonar el proyecto sin que falle (especialmente en Windows).

---

## Versiones usadas (confirmadas)

Estas son las versiones con las que el proyecto fue probado y funciona correctamente:

* Next.js: 16.1.6
* Prisma: 7.3.0
* @prisma/adapter-better-sqlite3: 7.3.0
* better-sqlite3: 12.6.2
* Node.js: recomendado LTS (v18 o v20)
* npm: incluido con Node.js

Para verificar las versiones instaladas:
npm ls prisma @prisma/adapter-better-sqlite3 better-sqlite3 next

---

## Requisitos del sistema

Debes tener instalado:

* Node.js LTS
* npm

Opcional (NO requerido para Prisma):

* sqlite3 CLI (solo si quieres inspeccionar la DB manualmente)

IMPORTANTE: Prisma NO usa sqlite3 del sistema. Prisma usa better-sqlite3 dentro de Node.

---

## Estructura importante del proyecto

prisma/

* schema.prisma
* migrations/

src/

* app/

  * api/

    * products/

      * route.ts
      * [id]/route.ts
* lib/

  * prisma.ts

Archivos clave:

* dev.db
* .env
* package.json

---

## Variables de entorno (.env)

Debe existir un archivo .env en la raíz del proyecto con el siguiente contenido:

DATABASE_URL="file:./dev.db"

Esto indica que la base de datos SQLite es un archivo local llamado dev.db.

---

## Instalación y arranque normal del proyecto

1. Instalar dependencias
   npm install

2. Generar Prisma Client
   npx prisma generate

3. Sincronizar el esquema con la base de datos (solo si la DB es nueva o vacía)
   npx prisma db push

4. Levantar el servidor en modo desarrollo
   npm run dev

Servidor disponible en:
[http://localhost:3000](http://localhost:3000)

---

## Punto CRÍTICO: runtime Node.js en rutas API

Como el proyecto usa better-sqlite3 (módulo nativo), TODAS las rutas API deben ejecutarse en Node.js.

En cada archivo route.ts de la API debe existir esta línea:

export const runtime = "nodejs";

Ejemplo básico de ruta API:

export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
const products = await prisma.product.findMany();
return NextResponse.json(products);
}

Si no se define el runtime, Next puede intentar ejecutar la ruta en un entorno incompatible.

---

## Endpoints principales (Postman)

GET – Listar productos
GET [http://localhost:3000/api/products](http://localhost:3000/api/products)

POST – Crear producto
POST [http://localhost:3000/api/products](http://localhost:3000/api/products)

Body (JSON):
{
"name": "PS5",
"description": "Consola de videojuegos",
"price": 599.99
}

---

## Verificaciones rápidas (debug)

Validar el esquema de Prisma:
npx prisma validate

Generar Prisma Client:
npx prisma generate

Abrir Prisma Studio:
npx prisma studio

Ver versiones instaladas:
npm ls prisma @prisma/adapter-better-sqlite3 better-sqlite3 next

---

## PROCESO CORRECTO PARA COPIAR O CLONAR EL PROYECTO

Esta sección es CLAVE para evitar errores.

### Regla de oro

Cuando copies o clones el proyecto, NO copies nunca:

* node_modules
* .next

Estos directorios contienen estado de compilación y módulos nativos ya compilados que pueden romperse en Windows.

---

## Limpieza obligatoria después de copiar

### Si usas Git Bash

rm -rf .next node_modules package-lock.json

### Si usas PowerShell

Remove-Item -Recurse -Force .next, node_modules
Remove-Item -Force package-lock.json

### Si usas CMD

rmdir /s /q .next
rmdir /s /q node_modules
del package-lock.json

---

## Reinstalación limpia (pasos obligatorios)

Después de limpiar:

1. Instalar dependencias
   npm install

2. Generar Prisma Client
   npx prisma generate

3. Aplicar el esquema a la DB (si es nueva o reiniciada)
   npx prisma db push

4. Levantar el proyecto
   npm run dev

---

## Problema típico: error 500 en Postman + Turbopack panic

Síntomas:

* GET /api/products devuelve 500
* En consola aparece:
  FATAL: An unexpected Turbopack error occurred
* El error menciona junction, symlink o better-sqlite3

Causa real:
NO es el código.
NO es Prisma.
Es un estado corrupto del build en Windows por:

* Next.js + Turbopack
* módulos nativos (better-sqlite3)
* cache copiado o instalación sucia

Solución:

* Borrar .next, node_modules y package-lock.json
* Reinstalar dependencias
* Regenerar Prisma Client
* Volver a ejecutar el proyecto

---

## Notas sobre la base de datos dev.db

* dev.db es un archivo local
* Para reiniciar la DB:

  * borra dev.db
  * ejecuta: npx prisma db push
* Las migraciones (si existen) están en prisma/migrations

---

## Resultado final esperado

* Servidor levanta sin errores
* [http://localhost:3000](http://localhost:3000) funciona
* GET /api/products responde 200 OK
* Prisma Client generado correctamente
* Postman muestra JSON correctamente

---
