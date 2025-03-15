const mysql = require("mysql");

const pool = mysql.createPool({
    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: "shopzone",
    connectionLimit: 10, // Número máximo de conexiones en el pool
});
/*
connection.connect(err => {
    if (err) {
        console.error("Error de conexión a MySQL:", err);
        return;
    }
    console.log("Conectado a MySQL");
});
*/
module.exports = pool;
