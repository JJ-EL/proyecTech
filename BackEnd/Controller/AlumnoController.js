const conexion = require("../database/Conection");

const getAlumno = async (req, res)=>{
    try {
        const [rows] = await conexion.query("SELECT * FROM alumnos");
        res.json(rows);
    } catch (error) {
        res.status(500).json({error: "Error al obtener los registros"});
    }
}

const CreateAlumno = async (req, res) => {
    const { nombre, date, telefono } = req.body;

    if (!nombre || !date || !telefono) {
        return res.status(400).json({ success: false, message: "Todos los campos son obligatorios" });
    }

    try {
        const [result] = await conexion.query(
            "INSERT INTO alumnos (nombre, fecha_nacimiento, telefono) VALUES (?, ?, ?)",
            [nombre, date, telefono]
        );

        res.status(201).json({ success: true, message: "Registro exitoso" });
    } catch (error) {
        console.error("Error en la inserción: ", error);
        res.status(500).json({ success: false, message: "Error al realizar la inserción del alumno" });
    }
};


const deleteAlumno = async(req, res)=>{
    const {id} = req.params;
    
    try {
        const resultadoDelete = await conexion.query("DELETE FROM alumnos WHERE id = ?", [id]);

        if(resultadoDelete.affectedRows === 0){
            return res.status(400).json({ error: "Alumno no encontrado" });
        }

        res.json({message: "Alumno eliminado"})
    } catch (error) {
        res.status(500).json({error: "Error al eliminar el alumno"});
    }
}


module.exports = {
    getAlumno,
    CreateAlumno,
    deleteAlumno
}