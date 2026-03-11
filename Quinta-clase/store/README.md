# Store API

Una API REST completa construida con **Next.js** y **TypeScript**, con autenticación JWT, gestión de usuarios y productos, y validación de datos con Zod.

## 🚀 Características

- ✅ **Autenticación JWT** - Sistema de login y registro seguro
- ✅ **Gestión de Usuarios** - CRUD completo de usuarios
- ✅ **Gestión de Productos** - Crear, leer y gestionar productos
- ✅ **Validación de Datos** - Validación robusta con Zod
- ✅ **Contraseñas Hasheadas** - Seguridad con bcryptjs
- ✅ **Base de Datos MongoDB** - Almacenamiento escalable
- ✅ **TypeScript** - Tipado estático completo
- ✅ **Middleware de Autenticación** - Protección de rutas

## 🛠️ Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| **Next.js** | 16.1.6 | Framework React para API REST |
| **TypeScript** | 5 | Lenguaje tipado |
| **MongoDB** | 7.1.0 | Base de datos NoSQL |
| **Mongoose** | 9.2.1 | ODM para MongoDB |
| **JWT (jose)** | 6.1.3 | Autenticación con tokens |
| **bcryptjs** | 3.0.3 | Hash de contraseñas |
| **Zod** | 4.3.6 | Validación de esquemas |
| **Tailwind CSS** | 4 | Estilos (opcional) |

## 📋 Requisitos Previos

- **Node.js** >= 18.x
- **npm** o **yarn**
- Cuenta en **MongoDB Atlas** (o MongoDB local)

## 🔧 Instalación

1. **Clonar el repositorio** (si aplica)
```bash
git clone <url-del-repositorio>
cd store
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Crea un archivo `.env.local` en la raíz del proyecto:
```env
# Base de Datos
MONGODB_URI=mongodb+srv://<usuario>:<contraseña>@cluster.mongodb.net/store

# Autenticación
JWT_SECRET=tu_clave_secreta_super_segura
```

**Ejemplo con MongoDB local:**
```env
MONGODB_URI=mongodb://localhost:27017/store
JWT_SECRET=clave_desarrollo_local
```

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

La API estará disponible en: `http://localhost:3000`

5. **Compilar para producción**
```bash
npm run build
npm start
```

## 📁 Estructura del Proyecto

```
store/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login/        # Endpoint de login
│   │   │   │   └── register/     # Endpoint de registro
│   │   │   ├── products/         # Endpoints de productos
│   │   │   ├── users/            # Endpoints de usuarios
│   │   │   │   └── [id]/         # Endpoints específicos por ID
│   │   │   ├── test/             # Endpoint de prueba
│   │   │   └── validacion/       # Validadores
│   │   ├── layout.tsx            # Layout principal
│   │   ├── page.tsx              # Página principal
│   │   └── globals.css           # Estilos globales
│   ├── lib/
│   │   ├── mongoose.ts           # Conexión a MongoDB
│   │   └── controller/
│   │       └── userController.ts # Lógica de usuarios
│   ├── models/
│   │   ├── users.ts              # Esquema de usuario
│   │   └── products.ts           # Esquema de producto
│   └── middleware.ts             # Middleware de autenticación
├── public/
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

## 🔐 API Endpoints

### Autenticación

#### Registro de Usuario
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "usuario123",
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

**Respuesta (201):**
```json
{
  "message": "Usuario creado exitosamente",
  "user": { ... }
}
```

**Validaciones:**
- Username: mínimo 3 caracteres
- Email: formato válido
- Contraseña: mínimo 6 caracteres

---

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

**Respuesta (200):**
```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Usuarios

#### Obtener Todos los Usuarios
```http
GET /api/users
```

**Respuesta (200):**
```json
{
  "success": true,
  "users": [ ... ]
}
```

---

#### Crear Usuario
```http
POST /api/users
Content-Type: application/json

{
  "username": "nuevo_usuario",
  "email": "nuevo@ejemplo.com",
  "password": "contraseña123"
}
```

---

#### Obtener Usuario por ID
```http
GET /api/users/[id]
```

---

#### Actualizar Usuario
```http
PUT /api/users/[id]
Content-Type: application/json

{
  "username": "nombre_actualizado",
  "email": "nuevo_email@ejemplo.com"
}
```

---

#### Eliminar Usuario
```http
DELETE /api/users/[id]
```

---

### Productos

#### Crear Producto
```http
POST /api/products
Content-Type: application/json

{
  "name": "Laptop Gaming",
  "description": "Laptop de alta gama para gaming y desarrollo",
  "price": 1299.99,
  "stock": 10,
  "image": "https://ejemplo.com/laptop.jpg"
}
```

**Validaciones:**
- Nombre: 3-100 caracteres
- Descripción: 10-1000 caracteres
- Precio: >= 0
- Stock: número entero

---

#### Obtener Todos los Productos
```http
GET /api/products
```

---

#### Obtener Producto por ID
```http
GET /api/products/[id]
```

---

#### Actualizar Producto
```http
PUT /api/products/[id]
Content-Type: application/json

{
  "name": "Laptop Gaming Pro",
  "price": 1499.99,
  "stock": 5
}
```

---

#### Eliminar Producto
```http
DELETE /api/products/[id]
```

---

## 📊 Modelos de Datos

### Usuario (User)

```typescript
interface IUser {
  username: string;      // Único, mínimo 3 caracteres
  email: string;         // Único, email válido
  password: string;      // Hash de la contraseña
}
```

### Producto (Product)

```typescript
interface IProduct {
  name: string;          // Requerido, 3-100 caracteres
  description: string;   // Requerido, 10-1000 caracteres
  price: number;         // Requerido, >= 0
  image?: string;        // Opcional
  stock: number;         // Requerido, default: 0
}
```

## 🔒 Seguridad

- **Contraseñas**: Hasheadas con bcryptjs (10 salts)
- **Autenticación**: JWT con jose
- **Validación**: Esquemas Zod para todas las entradas
- **CORS**: Configurable en Next.js
- **Variables de Entorno**: Nunca commitear `.env.local`

## 🧪 Pruebas con cURL

### Registrar Usuario
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Crear Producto
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Producto Ejemplo",
    "description": "Una descripción detallada del producto",
    "price": 99.99,
    "stock": 50
  }'
```

## 🚨 Manejo de Errores

La API utiliza códigos HTTP estándar:

| Código | Significado |
|--------|------------|
| 200 | Éxito |
| 201 | Recurso creado |
| 400 | Solicitud inválida |
| 401 | No autorizado |
| 404 | Recurso no encontrado |
| 500 | Error del servidor |

**Formato de error:**
```json
{
  "message": "Descripción del error",
  "errors": [
    {
      "field": "email",
      "message": "El correo electrónico no es válido"
    }
  ]
}
```

## 📝 Variables de Entorno Disponibles

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `MONGODB_URI` | URL de conexión a MongoDB | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Clave secreta para JWT | `tu_clave_super_segura` |

## 🐛 Solución de Problemas

### "Define la variable de entorno MONGODB_URI"
- Verifica que el archivo `.env.local` existe
- Asegúrate de que `MONGODB_URI` está definida correctamente
- Reinicia el servidor de desarrollo

### "Conexión rechazada a MongoDB"
- Verifica que MongoDB estés ejecutándose
- Confirma que la URL de conexión es correcta
- Comprueba las credenciales

### "Token inválido"
- Asegúrate de que `JWT_SECRET` es la misma en producción y desarrollo
- Regenera el token iniciando sesión nuevamente

## 📚 Documentación Adicional

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Mongoose ODM](https://mongoosejs.com)
- [Zod Validation](https://zod.dev)
- [JWT con jose](https://github.com/panva/jose)

## 👤 Autor

Proyecto desarrollado para la clase "Quinta-clase"

## 📄 Licencia

Este proyecto es de código abierto bajo la licencia MIT.

---

**Última actualización:** Marzo 2026

**Estado:** En desarrollo ✨
