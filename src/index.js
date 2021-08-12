//indexjs
const app= require('./config/server');
const connectionDb= require('./config/connectiondb');

const rutas= require('./app/routers/router.js');
rutas(app);

app.listen(app.get('port'), () => {
    console.log('Servidor en el puerto: ', app.get('port'));
})
