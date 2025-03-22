require("dotenv").config(); // Cargar variables de entorno

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const db = require("./db");
const jwt = require("jsonwebtoken");
const stripe = require('stripe')('sk_test_51R37twCQDSjoSGpDw02h8G5qNaEnj1oF2zMIkjHPdoYe6srwfTVZAonZCJIuhfFJ0Adl35HB6zlnETjySpRScBAE00Yhl477oc');

const app = express();
const port = 3000;


// Cargar la clave secreta desde las variables de entorno
const SECRET_KEY = process.env.SECRET_KEY;

console.log("Clave secreta cargada:", SECRET_KEY);

// Middleware
app.use(cors());
app.use(express.static("public")); // Servir archivos estáticos desde la carpeta 'public'
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));


// Función para calcular el costo de envío basado en la dirección
// Función para calcular el costo de envío según la dirección
target_dir = {'zona1': 5, 'zona2': 10, 'zona3': 15};
function calcularEnvio(direccion) {
    return target_dir[direccion] || 0;
}

app.post('/guardar_tienda', (req, res) => {
    const { nombre, direccion, descripcion } = req.body;

    // Aquí puedes guardar los datos en la base de datos o hacer lo que necesites
    console.log('Tienda registrada:', req.body);

    const query = "INSERT INTO tiendas (nombre, direccion, descripcion) VALUES (?, ?, ?)";
    
    db.query(query, [nombre, direccion, descripcion], (err, result) => {
        if (err) {
            console.error("Error al insertar tienda:", err);
            return res.status(500).json({ error: "Error al guardar la tienda" });
        }
        
        console.log("Tienda guardada en la base de datos:", result);
        res.json({ exito: true, mensaje: 'Tienda registrada correctamente' });
    });
});

// Ruta GET /tiendas
app.get('/tiendas', (req, res) => {
    const sql = 'SELECT * FROM tiendas';
  
    db.query(sql, (err, results) => {
      if (err) {
        console.error('❌ Error en la consulta:', err);
        res.status(500).json({ error: 'Error al obtener las tiendas' });
        return;
      }
      res.json(results);
    });
  });

// Ruta para obtener productos desde la base de datos según la tienda
app.get("/productos", (req, res) => {
    const tienda = req.query.tienda; // Obtener el nombre de la tienda desde la URL

    if (!tienda) {
        return res.status(400).json({ error: "Falta el nombre de la tienda en la consulta" });
    }

    // Primero buscar el tienda_id
    const tiendaQuery = `SELECT ID FROM tiendas WHERE nombre = ?`;
    db.query(tiendaQuery, [tienda], (err, tiendaResult) => {
        if (err) {
            console.error("Error al obtener tienda:", err);
            return res.status(500).json({ error: "Error al obtener la tienda" });
        }

        if (tiendaResult.length === 0) {
            return res.status(404).json({ error: "Tienda no encontrada" });
        }

        const tienda_id = tiendaResult[0].ID;

        // Luego, buscar los productos por tienda_id
        const query = `SELECT ID, nombre, descripcion, precio, unidades, imagen FROM productos WHERE tienda_id = ?`;
        db.query(query, [tienda_id], (err, results) => {
            if (err) {
                console.error("Error al obtener productos:", err);
                return res.status(500).json({ error: "Error en el servidor" });
            }

            // Verificar si la respuesta es un array
            if (!Array.isArray(results)) {
                return res.status(500).json({ error: "La respuesta no es un array de productos" });
            }

            res.json(results);
        });
    });
});

app.post("/agregar_producto", (req, res) => {
    const { tienda_id, nombre, descripcion, precio, unidades, imagen } = req.body;

    // Verificar que todos los campos necesarios estén presentes
    if (!tienda_id || !nombre || !precio || !unidades || !imagen) {
        return res.status(400).json({ error: "Faltan datos requeridos" });
    }

    // Subir imagen si es proporcionada
    let imagenPath = imagen || '';

    // Inserción del producto en la base de datos
    const query = `INSERT INTO productos (tienda_id, nombre, descripcion, precio, unidades, imagen) 
                   VALUES (?, ?, ?, ?, ?, ?)`;

    db.query(query, [tienda_id, nombre, descripcion, precio, unidades, imagenPath], (err, result) => {
        if (err) {
            console.error("Error al agregar producto:", err);  // Ver detalles del error en la consola
            return res.status(500).json({ error: "Error al agregar producto", details: err.message });
        }

        // Respuesta al cliente indicando que el producto se agregó correctamente
        res.status(200).json({ message: "Producto agregado correctamente" });
    });
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


// Ruta para verificar la sesión del usuario
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM usuarios WHERE email = ?", [email], async (err, results) => {
        if (err) return res.status(500).json({ error: "Error en el servidor" });
        if (results.length === 0) return res.status(401).json({ error: "Usuario no encontrado" });

        const user = results[0];

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return res.status(401).json({ error: "Contraseña incorrecta" });

        // Generar token JWT
        const token = jwt.sign({ id: user.id, tipo: user.tipo }, SECRET_KEY, { expiresIn: "2h" });

        res.json({ message: "Inicio de sesión exitoso", token, tipo: user.tipo });
    });
});

// Ruta para procesar el pago con Stripe
// Ruta para procesar el pago con Stripe
app.post('/pagar', async (req, res) => {
    const { items, token, direccion } = req.body;
    if (!items || !items.length) {
        return res.status(400).json({ error: 'El carrito está vacío' });
    }
    let total = items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    const costoEnvio = calcularEnvio(direccion);
    total += costoEnvio;
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: total * 100,
            currency: 'usd',
            payment_method: token.id,
            confirmation_method: 'manual',
            confirm: true,
        });
        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
            costoEnvio: costoEnvio
        });
    } catch (error) {
        console.error('Error al procesar el pago con Stripe:', error);
        res.status(500).json({ error: 'Error al procesar el pago' });
    }
});

// Ruta para crear la sesión de pago con Stripe
app.post('/create-checkout-session', async (req, res) => {
    const { carrito, direccion, costoEnvio } = req.body;

    if (!carrito || !Array.isArray(carrito) || carrito.length === 0) {
        return res.status(400).json({ error: "Carrito inválido" });
    }

    // Calcular total del carrito
    let total = carrito.reduce((sum, producto) => sum + (producto.precio * 100 * producto.cantidad), 0);

    // Agregar costo de envío
    if (costoEnvio > 0) {
        total += costoEnvio * 100;
    }

    const line_items = carrito.map((producto) => ({
        price_data: {
            currency: 'usd',
            product_data: {
                name: producto.nombre,
                images: [producto.imagen],
            },
            unit_amount: producto.precio * 100,
        },
        quantity: producto.cantidad,
    }));

    // Agregar costo de envío como un producto adicional
    if (costoEnvio > 0) {
        line_items.push({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: "Costo de envío",
                },
                unit_amount: costoEnvio * 100,
            },
            quantity: 1,
        });
    }

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: line_items,
            mode: 'payment',
            success_url: `http://localhost:${port}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `http://localhost:${port}/cancel`,
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error("Error al crear la sesión de pago:", error);
        res.status(500).json({ error: 'Hubo un problema al procesar la solicitud de pago.' });
    }
});


app.get('/success', (req, res) => {
    res.send(` 
        <html>
            <head>
                <meta charset="UTF-8">
                <title>Pago Exitoso</title>
                <script>
                    localStorage.removeItem("carrito"); // Vaciar el carrito en el frontend
                    setTimeout(() => {
                        window.location.href = "http://localhost:3000/";
                    }, 5000);
                </script>
            </head>
            <body style="text-align: center; font-family: Arial, sans-serif;">
                <h1>¡Pago realizado con éxito!</h1>
                <p>Redirigiendo a la página principal en 5 segundos...</p>
            </body>
        </html>
    `);
});

app.get('/cancel', (req, res) => {
    res.send(`
        <html>
            <head>
                <meta charset="UTF-8">
                <title>Pago Cancelado</title>
                <script>
                    setTimeout(() => {
                        window.location.href = "http://localhost:3000/";
                    }, 5000);
                </script>
            </head>
            <body style="text-align: center; font-family: Arial, sans-serif;">
                <h1>Pago Cancelado</h1>
                <p>Redirigiendo a la página principal en 5 segundos...</p>
            </body>
        </html>
    `);
});



// Iniciar el servidor (debe llamarse solo una vez)
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});