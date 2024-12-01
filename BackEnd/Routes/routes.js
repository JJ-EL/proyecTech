const express = require("express");
const { login } = require("../Controller/controller");
const { 
    getUsuario,
    CreateUsuario,
    updateUsuario,
    deleteUsuario
} = require("../Controller/usuariosController");
const {
    getUsuInfo,
    getProfesor,
    getGrado,
    CreateProfesor,
    updateProfesor,
    deleteProfesor
} = require("../Controller/ProfeController");
const {
    getAlumno,
    CreateAlumno,
    // updateAlumno,
    deleteAlumno
} = require("../Controller/AlumnoController");

const router = express.Router();

//Ruta para el login
router.post("/login", login);

//rutas usuarios
router.get("/usuarios", getUsuario); //ver los usuarios en la tabla
router.post("/usuarios", CreateUsuario);// para agregar usuarios
router.put("/usuarios/:id", updateUsuario);//ruta para actualizar usuarios
router.delete("/usuarios/:id", deleteUsuario);//ruta para eliminar usuarios

//ruta para el crud de Profesores
router.get("/profesores/usuarios", getUsuInfo);//visualizar los usuarios
router.get("/profesores", getProfesor);// visualizar los profesores
router.get("/profesores/grado", getGrado);// obtener el valor de la tabla grados
router.post("/profesores", CreateProfesor);//Crear o insertar en la tabla profesores y grado_profesores
router.put("/profesores/:id", updateProfesor);//actualizar la tabla profesores y grado profesores
router.delete("/profesores/:id", deleteProfesor);//eliminar registros de la tabla profsores y grado profesores

//Ruta para el CRUD de los alumnos
router.get("/alumnos",getAlumno);
router.post("/alumnos",CreateAlumno);
// router.put("/alumnos/:id",updateAlumno);
router.delete("/alumnos/:id",deleteAlumno)

module.exports = router;