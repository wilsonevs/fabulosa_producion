const connectionDb = require("../../config/connectiondb.js");

const {
  upload,
} = require('../../config/multer_upload');

const {
  uploadPerfil,
} = require('../../config/multer_perfil');

const {
  /* Index */
  getIndex, 
  postIndex,
  
  /* Login */
  getLogin , 
  postLogin,

  /* Cierre sesión */
  getLogout,

/* Registro */
  postRegistro,
  getRegistro,

  
/* Terminos Condiciones */
  getTerminosCondiciones,

/* Perfil */
  getPerfil,
  postUpdatePerfil,  
  
/* Sorteos */
  getSorteos,
  postSorteos,
  getParticiparSorteo,
  
  /* Participantes */
  getparticipantes,
  deleteParticipantes,
  
  /* Sorteos Administrador */
  getSorteosAdmin,
  postSorteosAdmin,
  getDeleteSorteos,
  postUpdateSorteo,

  /* Eventos */
  getEventos,
  postEventos,
  getDeleteEventos,
  postUpdateEventos,

/* Resultados */
  getResultados,
  postResultados,
  getDeleteResultados,
  postUpdateResultados,

/* Manejo de errores */
  get404,
  getError,
} = require("../controllers/controller");


// Rutas Recibir Datos.
module.exports = (app) => {
/* Index */
  app.get("/", getIndex);
  app.post("/", postIndex);

/* Login */
  app.get("/login", getLogin);
  app.post("/login", postLogin);

/* Cierre sesión */
  app.get("/logout", getLogout);

/* Registro */
  app.post("/registro", postRegistro);
  app.get("/registro", getRegistro);

/* Terminos Condiciones */
  app.get("/terminos_condiciones", getTerminosCondiciones);
    
/* Perfil */
  app.get("/perfil", getPerfil);
  app.post("/updateperfil/:id", uploadPerfil, postUpdatePerfil);

  /* Sorteos */
  app.get("/sorteos", getSorteos);
  app.post("/sorteos", postSorteos);
  app.get("/participarsorteos/:id", getParticiparSorteo);
  
  /* Participantes */
  app.get("/participantes", getparticipantes);
  app.get("/deleteparticipantes/:id", deleteParticipantes);
  
  /* Sorteos Administrador */
  app.get("/sorteos_admin", getSorteosAdmin);
  app.post("/sorteos_admin", upload, postSorteosAdmin);
  app.get("/deleteSorteos/:id", getDeleteSorteos);
  app.post("/updatesorteo/:id", upload, postUpdateSorteo);
  
/* Eventos */
  app.get("/eventos", getEventos);
  app.post("/eventos", postEventos);
  app.get("/deleteEventos/:id", getDeleteEventos);
  app.post("/updateEventos/:id", postUpdateEventos);
  
/* Resultados */
  app.get("/resultados", getResultados);
  app.post("/resultados", postResultados);
  app.get("/deleteresultados/:id", getDeleteResultados);
  app.post("/updateresultados/:id", postUpdateResultados);

  /* Manejo de errores */
  app.get("/404", get404);
  app.get("/*", getError);
};
