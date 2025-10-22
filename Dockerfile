# ETAPA 1: BUILDER (Construcción)
# Usamos una imagen base con Node.js y las herramientas de compilación
FROM node:20-slim AS builder

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de definición de dependencias
COPY package*.json ./

# Instala las dependencias de producción y desarrollo
# Usamos la opción '--omit=dev' en la etapa final, aquí instalamos todo
RUN npm install

# Copia el resto del código fuente del proyecto
COPY . .

# Compila la aplicación NestJS
# Esto genera el código JavaScript en el directorio 'dist'
RUN npm run build

# ----------------------------------------------------------------------
# ETAPA 2: RUNNER (Ejecución de producción)
# Usamos una imagen más ligera para el entorno de producción
FROM node:20-slim AS runner

# Establece el directorio de trabajo
WORKDIR /app

# Copia *solo* los archivos de dependencias de producción
# Es importante que el package.json esté presente para el 'npm install --omit=dev'
COPY package*.json ./

# Instala solo las dependencias de producción
RUN npm install --omit=dev

# Copia la aplicación compilada desde la etapa 'builder'
COPY --from=builder /app/dist ./dist

# Expone el puerto que usa NestJS (por defecto 3000)
# Ajusta si tu aplicación usa otro puerto
EXPOSE 3000

# Comando para iniciar la aplicación en modo producción
CMD [ "node", "dist/main" ]