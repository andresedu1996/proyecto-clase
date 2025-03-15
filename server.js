const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const db = require("./db");

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.static("public")); // Servir archivos estáticos desde la carpeta 'public'
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Simulación de una base de datos de productos
const productos = {
    tienda1: [
        { nombre: "Producto A", imagen: "img/productoA.png", descripcion: "Descripción A", precio: 10, unidades: 50 },
        { nombre: "Producto B", imagen: "img/productoB.png", descripcion: "Descripción B", precio: 20, unidades: 30 }
    ],
    tienda2: [
        { nombre: "Producto X", imagen: "img/productoX.png", descripcion: "Descripción X", precio: 15, unidades: 40 },
        { nombre: "Producto Y", imagen: "img/productoY.png", descripcion: "Descripción Y", precio: 25, unidades: 20 }
    ]
};

// Ruta para obtener productos según la tienda
app.get("/productos", (req, res) => {
    const tienda = req.query.nombre;
    if (productos[tienda]) {
        res.json(productos[tienda]);
    } else {
        res.status(404).json({ error: "Tienda no encontrada" });
    }
});

// Ruta para registrar usuarios con pool de conexiones
app.post("/register", async (req, res) => {
    const { nombre, email, password, tipo } = req.body;

    if (!nombre || !email || !password || !tipo) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Obtener una conexión del pool
        db.getConnection((err, connection) => {
            if (err) {
                console.error("Error al obtener la conexión:", err);
                return res.status(500).json({ error: "Error en la conexión a la base de datos" });
            }

            // Ejecutar la consulta
            connection.query(
                "INSERT INTO usuarios (nombre, email, password, tipo) VALUES (?, ?, ?, ?)",
                [nombre, email, hashedPassword, tipo],
                (err, result) => {
                    connection.release(); // Liberar la conexión después de la consulta

                    if (err) {
                        console.error("Error al registrar usuario:", err);
                        return res.status(500).json({ error: "Error al registrar usuario" });
                    }
                    res.status(201).json({ message: "Usuario registrado correctamente" });
                }
            );
        });

    } catch (error) {
        console.error("Error en el hash de contraseña:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

// Iniciar el servidor (debe llamarse solo una vez)
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
