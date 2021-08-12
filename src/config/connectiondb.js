const mysql = require('mysql');

//funciona porque el servidor esta conectado con anterioridad a dotenv que esta configurado
//y ligado a la carpeta ./env/.env

const connectionDb = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    pass: process.env.DB_PASSWORD,
});




module.exports = connectionDb;
