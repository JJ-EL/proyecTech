const conexion = require("../database/Conection");

const getUsuInfo = async (req, res)=>{
    try {
        const [row] = await conexion.query("SELECT id as id_usu, username FROM usuarios where rol != 'Administrador' order by 1 desc limit 4");
        res.json(row);
    } catch (error) {
        res.status(500).json({error: "Error al obtener los registros de usuarios"});
    }
}

const getProfesor = async(req, res)=>{
    try {
        const [rows] = await conexion.query(`
                SELECT 
                    p.id as profe_id,
                    u.username, 
                    p.nombre as nombre_profe, 
                    p.materia, 
                    g.nombre as nombre_materia 
                FROM 
                    profesores p 
                    join grado_profesor gp on p.id = gp.profesor_id 
                    join grados g on gp.grado_id = g.id 
                    join usuarios u on p.id_usuario = u.id
            `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({error: "Error al obtener los registros de la tabla profesores"})
    }
}

const getGrado = async (req, res)=>{
    try {
        const [grados] = await conexion.query("select id as id_grado, nombre as nombre_grado from grados")
        res.json(grados);
    } catch (error) {
        res.status(500).json({error: "Error al obtener los registros de la tabla grados"})
    }
}

const CreateProfesor = async (req, res) =>{
    const { nombre, materia, id_usuario, grados_id } = req.body;
    console.log(req.body)

    if(!nombre || !materia || !id_usuario || !grados_id){
        return res.status(400).json({ success: false, message: "Todos los campos son obligatorios"});
    }

    try {
        const[ProfesorResultado] = await conexion.query("INSERT INTO profesores (id_usuario, nombre, materia) values (?, ?, ?)",
        [id_usuario, nombre, materia]);

        const id_profesor = ProfesorResultado.insertId;
        console.log("profe:", id_profesor);

        await conexion.query("INSERT INTO grado_profesor (grado_id, profesor_id) VALUES (?, ?)",
            [grados_id, id_profesor]
        );

        res.status(200).json({ success: true, message: "Profesor creado exitosamente"})
    } catch (error) {
        console.log("Error en la inserción: ", error);
        res.status(500).send("Error al realizar la insersión del profesor");
    }
};

const updateProfesor = async (req, res) => {
    const { id } = req.params;
    const { nombre, materia, id_usuario, grado_id } = req.body;
  
    try {
      // Actualizar el profesor
      await conexion.query(
        "UPDATE profesores SET nombre = ?, materia = ?, id_usuario = ? WHERE id = ?",
        [nombre, materia, id_usuario, id]
      );
  
      // Actualizar el grado del profesor
      await conexion.query(
        "UPDATE grado_profesor SET grado_id = ? WHERE profesor_id = ?",
        [grado_id, id]
      );
  
      res.json({ success: true, message: "Profesor actualizado correctamente" });
    } catch (error) {
      console.error("Error al actualizar el profesor: ", error);
      res.status(500).json({ error: "Error al actualizar el profesor" });
    }
  };
  

const deleteProfesor = async(req, res)=>{
    const {id} = req.params;
    
    try {
        const DeleteGradoProfe = await conexion.query("DELETE FROM grado_profesor WHERE id = ?", [id]);

        const DeleteProfesor = await conexion.query("DELETE FROM profesores WHERE id = ?", [id]);

        if(DeleteProfesor.affectedRows === 0){
            return res.status(404).json({error: "profesor no encontrado"});
        }

        res.json({message: "Profesor eliminado correctamente"})
    } catch (error) {
        res.status(500).json({error: "Error aliminar el profesor"})
    }
}

//Exportar mis modulos de querys
module.exports = {
    getUsuInfo,
    getProfesor,
    getGrado,
    CreateProfesor,
    updateProfesor,
    deleteProfesor
}
