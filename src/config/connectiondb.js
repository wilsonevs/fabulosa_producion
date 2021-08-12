const mysql = require('mysql');

//funciona porque el servidor esta conectado con anterioridad a dotenv que esta configurado
//y ligado a la carpeta ./env/.env

const connectionDb = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    pass: process.env.DB_PASSWORD,
});

//probar el modulo:

function handleDisconnect(connectionDb) {

    connection= mysql.createPool(connectionDb);

    connection.getConnection(function (err) {
        if(err){
            console.log("error heroku to bd: ", err);
            setTimeout(handleDisconnect, 2000);
        }
    });

    connection.on('Error', function (err) {
        console.log('db error heroku: ', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();            
        }else{
            throw err;
        }
    });
    console.log("WILSON ERROR"+connectionDb);
}


handleDisconnect(connectionDb);
