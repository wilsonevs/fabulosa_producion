const mysql = require('mysql');

//funciona porque el servidor esta conectado con anterioridad a dotenv que esta configurado
//y ligado a la carpeta ./env/.env

const dataConnection = {
    host: 'us-cdbr-east-04.cleardb.com',
    user: 'b7ba6f0ae3efd4',
    database: 'heroku_b728dea260d0291',
    password: 'd2564c03',
};

function handleDisconnect(dataConnection) {
	const connection = mysql.createPool(dataConnection);

	connection.getConnection((err) => {
		if (err) {
			console.log('Error de conexion con db:', err);
			setTimeout(handleDisconnect, 2000);
		} else {
			console.log('Conectado exitosamente con la DB');
		}
	});

	connection.on('error', (err) => {
		console.log('Db error', err);
		if (err.code === 'PROTOCOL_DataConnection_LOST') {
			handleDisconnect();
		} else {
			throw err;
		}
	});

	return connection;
}

const connection = handleDisconnect(dataConnection);

// Exportacion de la conexion
module.exports = connection;


