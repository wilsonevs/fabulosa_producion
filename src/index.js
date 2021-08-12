//indexjs
const app= require('server.js');
const connection= require('connectiondb.js');

const rutas= require('router.js');
rutas(app);

app.listen(app.get('port'), () => {
    console.log('Servidor en el puerto: ', app.get('port'));
})
