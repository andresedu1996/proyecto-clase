const mysql = require("mysql2");

const pool = mysql.createPool({
    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: "shopzone",
    connectionLimit: 10, // Número máximo de conexiones en el pool
});

// Verificar la conexión
pool.getConnection((err, connection) => {
    if (err) {
        console.error("Error de conexión a MySQL:", err);
        return;
    }
    console.log("Conectado a MySQL");
    connection.release(); // Liberar la conexión después de usarla
});

module.exports = pool;