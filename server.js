const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const db = require("./db");
const stripe = require('stripe')('sk_test_51R37twCQDSjoSGpDw02h8G5qNaEnj1oF2zMIkjHPdoYe6srwfTVZAonZCJIuhfFJ0Adl35HB6zlnETjySpRScBAE00Yhl477oc');

const app = express();
const port = 3000;


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



// Ruta para obtener productos desde la base de datos según la tienda
app.get("/productos", (req, res) => {
    const tienda = req.query.nombre; // Obtener el nombre de la tienda desde la URL

    if (!tienda) {
        return res.status(400).json({ error: "Falta el nombre de la tienda en la consulta" });
    }

    const query = `SELECT ID, nombre, descripcion, precio, unidades, imagen FROM productos WHERE tienda = ?`;

    db.query(query, [tienda], (err, results) => {
        if (err) {
            console.error("Error al obtener productos:", err);
            return res.status(500).json({ error: "Error en el servidor" });
        }
        res.json(results);
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
    const { carrito, direccion } = req.body;

    if (!carrito || !Array.isArray(carrito) || carrito.length === 0) {
        return res.status(400).json({ error: "Carrito inválido" });
    }

    // Calcular total del carrito
    let total = carrito.reduce((sum, producto) => sum + (producto.precio * 100 * producto.cantidad), 0);

    // Agregar costo de envío
    const costoEnvio = calcularEnvio(direccion);
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