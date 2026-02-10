# Tienda API (Next.js + Prisma 7 + SQLite)

Este proyecto usa:
- Next.js (App Router)
- Prisma v7
- SQLite (`dev.db`)
- Adapter: `@prisma/adapter-better-sqlite3` (depende de `better-sqlite3`)

> Nota importante (Windows): `better-sqlite3` es un módulo nativo. Si copias/clonas el proyecto, NO copies `node_modules` ni `.next`. Instala y genera todo de nuevo para evitar errores de Turbopack/junctions.

---

## ✅ Requisitos
- Node.js LTS (recomendado)
- npm
- Windows / macOS / Linux

---

## 🧠 Estructura relevante
- `prisma/schema.prisma` → esquema de la base de datos
- `dev.db` → base de datos SQLite local
- `src/lib/prisma.ts` → cliente Prisma (singleton recomendado)
- `src/app/api/products/route.ts` → endpoint `/api/products`
- `src/app/api/products/[id]/route.ts` → endpoint `/api/products/:id`

---

# 🚀 Cómo correr el proyecto (normal)

## 1) Instalar dependencias
```bash
npm install
