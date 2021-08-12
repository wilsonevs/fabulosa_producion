const mysql = require('mysql');
const { __esModule } = require('uuid/dist/v1');

//funciona porque el servidor esta conectado con anterioridad a dotenv que esta configurado
//y ligado a la carpeta ./env/.env

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    pass: process.env.DB_PASSWORD,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE
});

//probar el modulo:

function handleDisconnect(connection) {

    connection= mysql.createPool(connection);

    connection.getConnection(function (error) {
        if(error){
            console.log("Error heroku to bd: ", error);
            setTimeout(handleDisconnect, 2000);
        }
    })
    connection.on('Error', function (error) {
        console.log('db error heroku: ', error);
        if (error.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();            
        }else{
            throw error;
        }
    })
}

module.exports = {connection}
