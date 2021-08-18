const mysql = require('mysql');

//funciona porque el servidor esta conectado con anterioridad a dotenv que esta configurado
//y ligado a la carpeta ./env/.env

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    pass: process.env.DB_PASSWORD,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE
});

//probar el modulo:

connection.connect((err) => {
    if(err){
        console.log("El error de conexion a BD es: " + err)
        // return res.redirect('./500.ejs');
    }
    console.log("Conectado exitosamente a BD");
})

module.exports = connection;
