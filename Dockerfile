# Usamos una imagen ligera de Node.js
FROM node:20-slim

# Creamos la carpeta de la app
WORKDIR /app

# Copiamos archivos de dependencias
COPY package*.json ./

# Instalamos solo lo necesario
RUN npm install --production

# Copiamos el resto del código
COPY . .

# Exponemos el puerto que usa tu app (normalmente 3000)
EXPOSE 3000

# Comando para arrancar la app
CMD ["npm", "start"]
