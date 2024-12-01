const mysql = require("mysql2/promise");

const conexion = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "1143856914",
    database: "proyectech"
});

module.exports = conexion;