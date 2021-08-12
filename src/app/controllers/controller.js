// Rutas.
// Conexion con bd.
const {connection} = require("../../config/connectiondb.js");
const bcryptjs = require("bcryptjs");
const random = require("../../public/js/random.js");
const path = require("path");
const {v4} =  require("uuid")
const {unlink} = require("fs-extra");

/* Index */

const getIndex = (req, res) => {
  try {
    if (req.session.loggedin) {
      res.render("index.ejs", {
        // Enviar parametros
        username: req.session.username,
        rol: req.session.rol,
        foto_perfil: req.session.foto_perfil,
        login: true,
      });
    } else {
      res.render("index.ejs", {
        username: req.session.username,
        rol: req.session.rol,
        foto_perfil: req.session.foto_perfil,
        login: false,
      });
    }
  } catch (error) {
    console.log('Error: '+error);
  }
};

const postIndex = async (req, res) => {
  try {
    const { nombre, email, telefono, asunto, argumento } = req.body;
  console.log(req.body);
  let login = req.session.isloggedin ? true : false;
  connection.query(
    "INSERT INTO db_asunto SET ?",{
      nombre: nombre,
      email: email,
      telefono: telefono,
      asunto: asunto,
      argumento: argumento,},
      async (error, results) => {
      if (error) {
        console.log("Que error tengo: " + error);
      } else {
        res.render("index.ejs", {
          login,
          alert: true,
          alertTitle: "Enviado",
          alertMessage: "¡Te estaremos contactando!",
          alertIcon: "success",
          showConfirmButton: false,
          timer: false,
          ruta: "/",
        });
      }
    }
  );
  } catch (error) {
    console.log('Error: '+error);
  }
}

/* Login */
const getLogin =  (req, res) => {
  try {
    if (req.session.loggedin) {
      res.render("login.ejs", {
        // Enviar parametros
        username: req.session.username,
        rol: req.session.rol,
        foto_perfil: req.session.foto_perfil,
        login: true,
      });
    } else {
      res.render("login.ejs", {
        username: req.session.username,
        rol: req.session.rol,
        foto_perfil: req.session.foto_perfil,
        login: false,
      });
    }
  } catch (error) {
    console.log('Error: '+error);
  }
};

const postLogin = async (req, res) => {
  try {
    const { username, passw } = req.body;
    console.log(req.body);
    connection.query(
      "SELECT * FROM db_cliente WHERE username = ? ",[username],
      async (err, result) => {
        if (await result.length === 0 ||!(await bcryptjs.compare(passw, result[0].passw))) {
          res.render("login.ejs", {
            login: false,
            alert: true,
            alertTitle: "Invalido",
            alertMessage: "Usuario y/o Contraseña Inconrrectas",
            alertIcon: "error",
            showConfirmButton: false,
            timer: false,
            ruta: "login",
          });
        } else {
          req.session.loggedin = await true;
          req.session.username = await result[0].username;
          req.session.rol = await result[0].rol;
          req.session.id_cliente = await result[0].id_cliente;
          req.session.foto_perfil = await result[0].foto_perfil;
          req.session.bandera = await true;
          res.redirect("/");
        }
      }
    );
  } catch (error) {
    console.log('Error: '+error);
  }
};

/* Cierre sesión */

const getLogout = (req, res) => {
  try {
    req.session.destroy(() => {
      res.redirect("/");
    });
  } catch (error) {
    console.log('Error: '+error);
  }
};

/* Registro */

const postRegistro = async (req, res) => {
  try {
    const {username, firstname, lastname, ciudad, addre, telefono, email, passw,} = req.body;
    console.log(req.body);
    let passHaash = await bcryptjs.hash(passw, 8);
  
    connection.query("SELECT * FROM db_cliente WHERE username = ?",[username],(err, result) => {
        if (result.length === 0) {
          connection.query("SELECT * FROM db_cliente WHERE email = ?",[email],(err, result) => {
              if (result.length === 0) {
                connection.query("INSERT INTO db_cliente SET ?",{
                    username: username,
                    firstname: firstname,
                    lastname: lastname,
                    ciudad: ciudad,
                    addre: addre,
                    telefono: telefono,
                    email: email,
                    passw: passHaash,
                    rol: "usuario",
                  },
                  async (error, results) => {
                    if (error) {
                      console.log("Que error tengo: " + error);
                    } else {
                      res.render("registro.ejs", {
                        login: false,
                        alert: true,
                        alertTitle: "Registrar",
                        alertMessage: "Registro exitoso",
                        alertIcon: "success",
                        showConfirmButton: false,
                        timer: 2500,
                        ruta: "login",
                      });
                    }
                  }
                );
              } else {
                res.render("registro.ejs", {
                  login: false,
                  alert: true,
                  alertTitle: "¡Cuidado!",
                  alertMessage: "Correo no se encuentar disponible",
                  alertIcon: "info",
                  showConfirmButton: false,
                  timer: 3500,
                  ruta: "registro",
                });
              }
            }
          );
        } else {
          res.render("registro.ejs", {
            login: false,
            alert: true,
            alertTitle: "¡Cuidado!",
            alertMessage: "Usuario no se encuentar disponible",
            alertIcon: "info",
            showConfirmButton: false,
            timer: 3500,
            ruta: "registro",
          });
        }
      }
    );
  } catch (error) {
    console.log('Error: '+error);
  }
};


const getRegistro =  (req, res) => {
  try {
    if (req.session.loggedin) {
      res.render("registro.ejs", {
        // Enviar parametros
        username: req.session.username,
        rol: req.session.rol,
        foto_perfil: req.session.foto_perfil,
        login: true,
      });
    } else {
      res.render("registro.ejs", {
        username: req.session.username,
        rol: req.session.rol,
        foto_perfil: req.session.foto_perfil,
        login: false,
      });
    }
  } catch (error) {
    console.log('Error: '+error);
  }
}

/* Terminos Condiciones */

const getTerminosCondiciones = (req, res) => {
  try {
   if (req.session.loggedin) {
     res.render("./terminos_condiciones.ejs", {
       // Enviar parametros
       username: req.session.username,
       foto_perfil: req.session.foto_perfil,
       rol: req.session.rol,
       login: true,
     });
   } else {
     res.render("./terminos_condiciones.ejs", {
       username: req.session.username,
       foto_perfil: req.session.foto_perfil,
       rol: req.session.rol,
       login: false,
     });
   }
  } catch (error) {
   console.log('Error: '+error);
  }
 }

/* Perfil */

const getPerfil = async (req, res) => {
  try {
   await connection.query("SELECT * FROM db_cliente ", (error, results) => {
      if (error) {
        console.log("Que error tengo: " + error);
      } else {
        if (req.session.loggedin) {
          res.render("perfil.ejs", {
            // Enviar parametros
            foto_perfil: req.session.foto_perfil,
            username: req.session.username, 
            rol: req.session.rol,
            login: true,
            datos: results,
          });
        } else {
          res.render("index.ejs", {
            foto_perfil: req.session.foto_perfil,
            username: req.session.username,
            rol: req.session.rol,
            login: false,
          });
        }
      }
    });
  } catch (error) {
    console.log('Error: '+error);
  }
};


const postUpdatePerfil = async (req,res) => {
  try {
    const id= req.params.id;
    const rutaImagen = req.file.filename;
    const{firstname, lastname, ciudad, addre, telefono, email} = req.body;
    await connection.query("UPDATE db_cliente SET foto_perfil = ?, firstname = ?, lastname = ?, ciudad = ?, addre = ?, telefono = ?, email = ?  WHERE id_cliente = ?", 
    [rutaImagen, firstname, lastname, ciudad, addre, telefono, email, id], (err, results) =>  {
      if(err){
        res.send(err);
      }else{
        res.redirect("/perfil");
      }
    });
  } catch (error) {
    console.log('Error: '+error);
  }
}


  /* Sorteos */

const getSorteos = (req, res) => {
  try {
    connection.query("SELECT * FROM db_sorteos", (error, results) => {
      if (error) {
        console.log("Que error tengo: " + error);
      } else {
        if (req.session.loggedin) {
          res.render("sorteos.ejs", {
            // Enviar parametros
            username: req.session.username,
            foto_perfil: req.session.foto_perfil,
            rol: req.session.rol,
            login: true,
            datos: results,
          });
        } else {
          res.render("registro.ejs", {
            username: req.session.username,
            foto_perfil: req.session.foto_perfil,
            rol: req.session.rol,
            datos: results,
            login: false,
            alert: true,
            alertTitle: "Registrese",
            alertMessage: "Para poder participar de estos sorteos.",
            alertIcon: "info",
            showConfirmButton: false,
            timer: 3500,
            ruta: "registro",
          });
        }
      }
    });
  } catch (error) {
    console.log('Error: '+error);
  }
}

const postSorteos = (req, res) => {
  try {
    connection.query("SELECT * FROM db_sorteos", (error, results) => {
      if (error) {
        console.log("Que error tengo: " + error);
      } else {
        res.render("sorteos.ejs", {
          results: results,
        });
      }
    });
  } catch (error) {
    console.log('Error: '+error);
  }
};


// pendiente
const getParticiparSorteo = (req, res) => {
  let id_cliente= req.session.id_cliente;
  var id_sorteos= req.params.id; 
  console.log(id_cliente);
  console.log(id_sorteos);
  connection.query("SELECT * FROM r_cliente_sorteos WHERE sorteos_id = ?",[id_sorteos],(err, result) => {
    if (result.length === 0) {
      connection.query( "INSERT INTO r_cliente_sorteos SET ?",{
            cliente_id: id_cliente,
            sorteos_id: id_sorteos,
          },
          async (error, result) => {
            if (error) {
              console.log("Que error tengo: " + error);
            } else {
              res.redirect("/sorteos");
            }
          }
        );
      } else {
        res.redirect("/sorteos");
      }
    });
}


  

  /* Participantes */

  const getparticipantes = (req, res) => {
    try {
        const consulta =("SELECT * FROM r_cliente_sorteos r INNER JOIN db_cliente c ON r.cliente_id = c.id_cliente INNER JOIN db_sorteos s ON r.sorteos_id = s.id_sorteos");
      connection.query(consulta, (error, results) => {
        if (error) {
          console.log("Que error tengo: " + error);
        } else {
          if (req.session.loggedin) {
            res.render("participantes.ejs", {
              // Enviar parametros
              foto_perfil: req.session.foto_perfil,
              username: req.session.username,
              rol: req.session.rol,
              login: true,
              datos: results,
            });
          } else {
            res.render("index.ejs", {
              foto_perfil: req.session.foto_perfil,
              username: req.session.username,
              rol: req.session.rol,
              login: false,
            });
          }
        }
      });
    } catch (error) {
      console.log('Error: '+error);
    }
  };

const deleteParticipantes = (req,res) => {
  try {
    const id= req.params.id;
    const queryDelete= ("DELETE FROM r_cliente_sorteos WHERE id_cliente_sorteos = ?");
    connection.query(queryDelete, [id], (err,result) => {
      if(err){
        res.send(err);
      }else{
         res.redirect("/participantes");
      }
    });
  } catch (error) {
    console.log('Error: '+error);
  }
}

  /* Sorteos Administrador */

const getSorteosAdmin = async(req, res) => {
  try {
    connection.query("SELECT * FROM db_sorteos", (error, results) => {
      if (error) {
        console.log("Que error tengo: " + error);
      } else {
        if (req.session.loggedin) {
          res.render("sorteos_admin.ejs", {
            // Enviar parametros
            foto_perfil: req.session.foto_perfil,
            username: req.session.username,
            rol: req.session.rol,
            login: true,
            datos: results,
          });
        } else {
          res.render("index.ejs", {
            foto_perfil: req.session.foto_perfil,
            username: req.session.username,
            rol: req.session.rol,
            login: false,
          });
        }
      }
    });
  } catch (error) {
    console.log('Error: '+error);
  }
}

const postSorteosAdmin = async (req, res) => {
  try {
  
  const rutaImagen = req.file.filename;
  const {titulo, nombre_producto, lugar, fecha, hora, telefono,} = req.body;
        
  console.log("Ruta de imagen:"+ rutaImagen);
  console.log(req.body);
  console.log("Mostrar File: "+req.file);
  connection.query("INSERT INTO db_sorteos SET ?",
    {
      titulo: titulo,
      codigo: "Cod-" + uuidv8(),
      nombre_producto: nombre_producto,
      lugar: lugar,
      fecha: fecha,
      hora: hora,
      telefono: telefono,
      imagen: rutaImagen,
    },async (error, results) => {
      if (error) {
        console.log("Que error tengo: " + error);
      } else {
        res.render("sorteos_admin.ejs", {
          datos: results,
          foto_perfil: req.session.foto_perfil,
          username: req.session.username,
          login: true,
          rol: req.session.rol,
          alert: true,
          alertTitle: "Enviado",
          alertMessage: "¡Actualziación exitosa!",
          alertIcon: "success",
          showConfirmButton: false,
          timer: false,
          ruta: "sorteos_admin",
        });
      }
    }
  );
  } catch (error) {
    console.log('Error: '+error);
  }
}

const getDeleteSorteos = (req,res) => {
  try {
    const id= req.params.id;
    // const rutaImagen = req.file.filename;
    // console.log("Ruta: "+rutaImagen);
    // unlink(path.resolve("./src/public/utils/img/uploads/"+rutaImagen));
    const queryDelete= ("DELETE FROM db_sorteos WHERE id_sorteos = ?");
    connection.query(queryDelete, [id], (err,result) => {
      if(err){
        res.send(err);
      }else{
         res.redirect("/sorteos_admin");
      }
    });
  } catch (error) {
    console.log('Error: '+error);
  }
}

const postUpdateSorteo = (req,res) => {
  try {
  const id= req.params.id;
  const rutaImagen = req.file.filename;
  const{titulo, nombre_producto, lugar, fecha, hora, telefono} = req.body;
  console.log(req.body);
  const queryUpdateSorteo=("UPDATE db_sorteos SET titulo = ?, nombre_producto = ?, lugar = ?, fecha = ?, hora = ?, telefono = ?, imagen = ? WHERE id_sorteos = ?");
  connection.query( queryUpdateSorteo, [titulo, nombre_producto, lugar, fecha, hora, telefono, rutaImagen, id], (err, results) =>  {
    if(err){
      res.send(err);
    }else{
      res.redirect("/sorteos_admin");
    }
  });
  } catch (error) {
    console.log('Error: '+error);
  }
};

/* Eventos */

const getEventos = (req, res) => {
  try {
    connection.query("SELECT * FROM db_eventos", (error, results) => {
      if (error) {
        console.log("Que error tengo: " + error);
      } else {
        if (req.session.loggedin) {
          res.render("eventos.ejs", {
            // Enviar parametros
            foto_perfil: req.session.foto_perfil,
            username: req.session.username,
            rol: req.session.rol,
            login: true,
            datos: results,
          });
        } else {
          res.render("index.ejs", {
            foto_perfil: req.session.foto_perfil,
            username: req.session.username,
            rol: req.session.rol,
            login: false,
          });
        }
      }
    });
  } catch (error) {
    console.log('Error: '+error);
  }
};

const postEventos = async (req, res) => {
  try {
    const {nombre_evento, fecha, hora, patrocinador, actividad, lugar } = req.body;
    console.log(req.body);
    connection.query(
      "INSERT INTO db_eventos SET ?",
      {
        nombre_evento: nombre_evento,
        fecha: fecha,
        hora: hora,
        patrocinador: patrocinador,
        actividad: actividad,
        lugar: lugar,
      },
      async (error, results) => {
        if (error) {
          console.log("Que error tengo: " + error);
        } else {
          res.render("eventos.ejs", {
            datos:results,
            foto_perfil: req.session.foto_perfil,
            username: req.session.username,
            login: true,
            rol: req.session.rol,
            alert: true,
            alertTitle: "Enviado",
            alertMessage: "¡Actualziación exitosa!",
            alertIcon: "success",
            showConfirmButton: false,
            timer: false,
            ruta: "eventos",
          });
        }
      }
    );
  } catch (error) {
    console.log('Error: '+error);
  }
};

const getDeleteEventos = (req,res) => {
  try {
    const id= req.params.id;
    connection.query("DELETE FROM db_eventos WHERE id_eventos = ?", [id], (err,result) => {
      if(err){
        res.send(err);
      }else{
         res.redirect("/eventos");
      }
    });
  } catch (error) {
    console.log('Error: '+error);
  }
}

const postUpdateEventos = (req,res) => {
  try {
    const id= req.params.id;
    const{nombre_evento, fecha, hora, patrocinador, actividad, lugar } = req.body;
    console.log(req.body);
    connection.query("UPDATE db_eventos SET nombre_evento = ?, fecha = ?, hora = ?, patrocinador = ?, actividad = ?, lugar = ? WHERE id_eventos = ?", 
    [nombre_evento, fecha, hora, patrocinador, actividad, lugar, id], (err, results) =>  {
      if(err){
        res.send(err);
      }else{
        res.redirect("/eventos");
      }
    });
  } catch (error) {
    console.log('Error: '+error);
  }
};


/* Resultados */


const getResultados = (req, res) => {
  try {
    connection.query("SELECT * FROM db_ganador", (error, results) => {
      if (error) {
        console.log("Que error tengo: " + error);
      } else {
        if (req.session.loggedin) {
          res.render("resultados.ejs", {
            // Enviar parametros
            foto_perfil: req.session.foto_perfil,
            username: req.session.username,
            rol: req.session.rol,
            login: true,
            datos: results,
          });
        } else {
          res.render("index.ejs", {
            foto_perfil: req.session.foto_perfil,
            username: req.session.username,
            rol: req.session.rol,
            login: false,
          });
        }
      }
    });
  } catch (error) {
    console.log('Error: '+error);
  }
}

const postResultados = async (req, res) => {
  try {
    const { firstname, lastname, premio_entregado, patrocinador, codigo, fecha_entrega} = req.body;
    console.log(req.body);
    connection.query(
      "INSERT INTO db_ganador SET ?",
      {
        firstname: firstname,
        lastname: lastname,
        premio_entregado: premio_entregado,
        patrocinador: patrocinador,
        codigo: codigo,
        fecha_entrega: fecha_entrega,
      },
      async (error, results) => {
        if (error) {
          console.log("Que error tengo: " + error);
        } else {
          res.render("resultados.ejs", {
            datos: results,
            foto_perfil: req.session.foto_perfil,
            username: req.session.username,
            login: true,
            rol: req.session.rol,
            alert: true,
            alertTitle: "Enviado",
            alertMessage: "¡Actualziación exitosa!",
            alertIcon: "success",
            showConfirmButton: false,
            timer: false,
            ruta: "resultados",
          });
        }
      }
    );
  } catch (error) {
    console.log('Error: '+error);
  }
};

const getDeleteResultados = (req,res) => {
  try {
    const id= req.params.id;
    connection.query("DELETE FROM db_ganador WHERE id_ganador = ?", [id], (err,result) => {
      if(err){
        res.send(err);
      }else{
         res.redirect("/resultados");
      }
    });
  } catch (error) {
    console.log('Error: '+error);
  }
}

const postUpdateResultados = (req,res) => {
  try {
    const id= req.params.id;
    const{firstname, lastname, premio_entregado, patrocinador, codigo, fecha_entrega } = req.body;
    console.log(req.body);
    connection.query("UPDATE db_ganador SET firstname = ?, lastname = ?, premio_entregado = ?, patrocinador = ?, codigo = ?, fecha_entrega = ? WHERE id_ganador = ?", 
    [firstname, lastname, premio_entregado, patrocinador, codigo, fecha_entrega, id], (err, results) =>  {
      if(err){
        res.send(err);
      }else{
        res.redirect("/resultados");
      }
    });
  } catch (error) {
    console.log('Error: '+error);
  }
};

 /* Manejo de errores */

const get404 = (req, res) => {
  try {
    res.render("./404.ejs");
  } catch (error) {
    console.log('Error: '+error);
  }
}

const getError = (req, res) => {
  try {
    if (req.session.loggedin) {
      res.render("404.ejs", {
        // Enviar parametros
        username: req.session.username,
        foto_perfil: req.session.foto_perfil,
        rol: req.session.rol,
        login: true,
      });
    } else {
      res.render("404.ejs", {
        username: req.session.username,
        foto_perfil: req.session.foto_perfil,
        rol: req.session.rol,
        login: false,
      });
    }
  } catch (error) {
    console.log('Error: '+error);
  }
}

module.exports = {
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
};