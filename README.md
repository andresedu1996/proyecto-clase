Para correr local instalar Nodemon o node.js

npm init -y
npm install express cors
npm install --save-dev nodemon


Se ejecuta en localhost:3000 con 
npm run dev


/// Script para crear la dB

CREATE DATABASE shopzone;
USE shopzone;

-- Tabla de usuarios (Admins y Clientes)
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    tipo ENUM('admin', 'cliente') NOT NULL DEFAULT 'cliente'
);

-- Tabla de productos
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    unidades INT NOT NULL,
    imagen VARCHAR(255) NOT NULL
    tienda VARCHAR(255) NOT NULL
);

-- Tabla de órdenes (para compras)
CREATE TABLE ordenes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    producto_id INT,
    cantidad INT NOT NULL,
    total DECIMAL(10,2),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);


Para reiniciar el servidor si da problemas

netstat -ano | findstr :3000
taskkill /PID 28296 /F