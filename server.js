require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const stripe = require("stripe")("sk_test_51R37twCQDSjoSGpDw02h8G5qNaEnj1oF2zMIkjHPdoYe6srwfTVZAonZCJIuhfFJ0Adl35HB6zlnETjySpRScBAE00Yhl477oc");

const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const app = express();
const port = 3000;
const SECRET_KEY = process.env.SECRET_KEY;

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

const target_dir = { zona1: 5, zona2: 10, zona3: 15 };
function calcularEnvio(direccion) {
  return target_dir[direccion] || 0;
}

// 🧩 Middleware para verificar el token JWT
function verificarToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // "Bearer <token>"
  
    if (!token) return res.status(401).json({ error: "Token no proporcionado" });
  
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) return res.status(403).json({ error: "Token inválido" });
      req.user = user; // contiene { id, tipo }
      next();
    });
  }

// 🟢 LOGIN
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    const { data: users, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("email", email);
  
    if (error || users.length === 0) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }
  
    const user = users[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
  
    if (!passwordMatch) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }
  
    const token = jwt.sign({ id: user.id, tipo: user.tipo }, SECRET_KEY, {
      expiresIn: "2h",
    });
  
    res.json({ message: "Inicio de sesión exitoso", token });
  });
  
  // 🟢 Obtener usuario actual (usando JWT)
  app.get("/usuario_actual", verificarToken, (req, res) => {
    res.json({ usuario: req.user });
  });

  // 🟢 Obtener las tiendas del usuario actual
  app.get("/tiendas_usuario", verificarToken, async (req, res) => {
    console.log(req.user); // Verifica qué contiene req.user

    const adminId = req.user.id;  // Aquí estamos usando el admin_id desde el token
    
    if (!adminId) {
        return res.status(401).json({ error: "Usuario no autenticado" });
    }

    // Consultar las tiendas del administrador en la base de datos
    const { data: tiendas, error } = await supabase
        .from("tiendas")
        .select("*")
        .eq("admin_id", adminId);  // Usamos 'admin_id' en lugar de 'usuario_id'
  
    if (error) {
        console.error("Error al obtener tiendas:", error);
        return res.status(500).json({ error: "Error al obtener tiendas", details: error.message });
    }
  
    res.status(200).json(tiendas);
});

// 🟢 GUARDAR TIENDA
app.post("/guardar_tienda", verificarToken, async (req, res) => {
    const { nombre, direccion, descripcion, imagen } = req.body;
  
    if (!nombre || !direccion || !imagen) {
      return res.status(400).json({ error: "Faltan datos requeridos" });
    }
  
    const admin_id = req.user.id;
  
    const { data: usuario, error: usuarioError } = await supabase
      .from("usuarios")
      .select("id")
      .eq("id", admin_id)
      .single();
  
    if (usuarioError || !usuario) {
      return res.status(404).json({ error: "Admin no encontrado" });
    }
  
    const { error: insertError } = await supabase
      .from("tiendas")
      .insert([{ nombre, direccion, descripcion, imagen, admin_id }]);
  
    if (insertError) {
      console.error("Error al insertar tienda:", insertError);
      return res.status(500).json({ mensaje: "Error al guardar la tienda" });
    }
  
    res.status(200).json({ exito: true, mensaje: "Tienda guardada exitosamente" });
  });
// 🟢 OBTENER TIENDAS
app.get("/tiendas", async (req, res) => {
    const { data, error } = await supabase.from("tiendas").select("*");
  
    if (error) {
      console.error("❌ Error en la consulta:", error);
      return res.status(500).json({ error: "Error al obtener las tiendas" });
    }
  
    res.json(data);
  });

// 🟢 OBTENER PRODUCTOS POR TIENDA
app.get("/productos", async (req, res) => {
    const tienda = req.query.tienda;
  
    if (!tienda) {
      return res.status(400).json({ error: "Falta el nombre de la tienda en la consulta" });
    }
  
    const { data: tiendaData, error: tiendaError } = await supabase
      .from("tiendas")
      .select("id")
      .eq("nombre", tienda)
      .single();
  
    if (tiendaError || !tiendaData) {
      return res.status(404).json({ error: "Tienda no encontrada" });
    }
  
    const { data: productos, error: productosError } = await supabase
      .from("productos")
      .select("id, nombre, descripcion, precio, unidades, imagen")
      .eq("tienda_id", tiendaData.id);
  
    if (productosError) {
      console.error("Error al obtener productos:", productosError);
      return res.status(500).json({ error: "Error en el servidor" });
    }
  
    res.json(productos);
  });

// 🟢 AGREGAR PRODUCTO
app.post("/agregar_producto", async (req, res) => {
    const { tienda_id, nombre, descripcion, precio, unidades, imagen } = req.body;
  
    // Validar si faltan datos requeridos
    if (!tienda_id || !nombre || !precio || !unidades || !imagen) {
      return res.status(400).json({ error: "Faltan datos requeridos" });
    }
  
    // Verificar si la tienda existe en la base de datos
    const { data: tienda, error: tiendaError } = await supabase
      .from("tiendas")
      .select("id")
      .eq("id", tienda_id)
      .single();
  
    if (tiendaError || !tienda) {
      // Si la tienda no existe, devolver un error
      return res.status(404).json({ error: "La tienda con el ID proporcionado no existe" });
    }
  
    // Insertar el producto en la base de datos si la tienda existe
    const { error } = await supabase
      .from("productos")
      .insert([{ tienda_id, nombre, descripcion, precio, unidades, imagen }]);
  
    if (error) {
      console.error("Error al agregar producto:", error);
      return res.status(500).json({ error: "Error al agregar producto", details: error.message });
    }
  
    res.status(200).json({ message: "Producto agregado correctamente" });
  });

// 🟢 Obtener productos de una tienda
app.get("/productos/:tiendaId", verificarToken, async (req, res) => {
    const tiendaId = req.params.tiendaId;

    // Consultar los productos de la tienda en la base de datos
    const { data: productos, error } = await supabase
        .from("productos")
        .select("*")
        .eq("tienda_id", tiendaId);  // Filtrar por la tienda seleccionada

    if (error) {
        console.error("Error al obtener productos:", error);
        return res.status(500).json({ error: "Error al obtener productos", details: error.message });
    }

    res.status(200).json(productos);
});



// 🟢 REGISTRAR USUARIO
app.post("/register", async (req, res) => {
    const { nombre, email, password, tipo } = req.body;
  
    if (!nombre || !email || !password || !tipo) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }
  
    // Verificar que el tipo sea válido
    if (!["admin", "cliente", "superadmin"].includes(tipo)) {
      return res.status(400).json({ error: "Tipo de usuario no válido" });
    }
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const { error } = await supabase.from("usuarios").insert([{
        nombre,
        email,
        password: hashedPassword,
        tipo,
      }]);
  
      if (error) {
        console.error("Error al registrar usuario:", error);
        return res.status(500).json({ error: "Error al registrar usuario" });
      }
  
      res.status(201).json({ message: "Usuario registrado correctamente" });
    } catch (error) {
      console.error("Error en el hash de contraseña:", error);
      res.status(500).json({ error: "Error en el servidor" });
    }
  });


// 🟢 PAGOS CON STRIPE
app.post("/pagar", async (req, res) => {
  const { items, token, direccion } = req.body;

  if (!items || !items.length) {
    return res.status(400).json({ error: "El carrito está vacío" });
  }

  let total = items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  const costoEnvio = calcularEnvio(direccion);
  total += costoEnvio;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total * 100,
      currency: "usd",
      payment_method: token.id,
      confirmation_method: "manual",
      confirm: true,
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      costoEnvio: costoEnvio,
    });
  } catch (error) {
    console.error("Error al procesar el pago con Stripe:", error);
    res.status(500).json({ error: "Error al procesar el pago" });
  }
});

// 🟢 CHECKOUT CON STRIPE
app.post("/create-checkout-session", async (req, res) => {
  const { carrito, direccion, costoEnvio } = req.body;

  if (!carrito || !Array.isArray(carrito) || carrito.length === 0) {
    return res.status(400).json({ error: "Carrito inválido" });
  }

  let total = carrito.reduce((sum, producto) => sum + producto.precio * 100 * producto.cantidad, 0);
  if (costoEnvio > 0) total += costoEnvio * 100;

  const line_items = carrito.map((producto) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: producto.nombre,
      },
      unit_amount: producto.precio * 100,
    },
    quantity: producto.cantidad,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error al crear sesión de checkout:", error);
    res.status(500).json({ error: "Error al crear sesión de pago" });
  }
});

// 🟢 CREAR PEDIDO
app.post("/crear_pedido", async (req, res) => {
    const { id_usuario, direccion_entrega, total } = req.body;
  
    if (!id_usuario || !direccion_entrega || total === undefined) {
      return res.status(400).json({ error: "Faltan datos requeridos" });
    }
  
    // Verificar que el usuario existe
    const { data: usuario, error: usuarioError } = await supabase
      .from("usuarios")
      .select("id")
      .eq("id", id_usuario)
      .single();
  
    if (usuarioError || !usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
  
    const { error } = await supabase
      .from("pedidos")
      .insert([{ id_usuario, direccion_entrega, total }]);
  
    if (error) {
      console.error("Error al crear pedido:", error);
      return res.status(500).json({ error: "Error al crear el pedido" });
    }
  
    res.status(201).json({ message: "Pedido creado exitosamente" });
  });

// 🟢 OBTENER PEDIDOS
app.get("/productos_con_pedidos", async (req, res) => {
    const tienda = req.query.tienda;
    
    if (!tienda) {
      return res.status(400).json({ error: "Falta el nombre de la tienda en la consulta" });
    }
    
    const { data: tiendaData, error: tiendaError } = await supabase
      .from("tiendas")
      .select("id")
      .eq("nombre", tienda)
      .single();
    
    if (tiendaError || !tiendaData) {
      return res.status(404).json({ error: "Tienda no encontrada" });
    }
    
    const { data: productos, error: productosError } = await supabase
    .from("productos")
    .select("id, nombre, descripcion, precio, unidades, imagen, count(pedidos.id) as numero_pedidos")
    .eq("tienda_id", tiendaData.id)
    .leftJoin('pedidos', 'productos.id', 'pedidos.producto_id')
    .group('productos.id');
  
    if (productosError) {
      console.error("Error al obtener productos:", productosError);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    
    // Agregar el número de pedidos a cada producto
    for (const producto of productos) {
      const { data: pedidos, error: pedidosError } = await supabase
        .from("pedidos")
        .select("id")
        .eq("producto_id", producto.id);
  
      if (pedidosError) {
        return res.status(500).json({ error: "Error al obtener pedidos para el producto" });
      }
  
      producto.num_pedidos = pedidos.length; // El número de pedidos
    }
  
    res.json(productos);
  });


app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
