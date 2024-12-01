const conexion = require("../database/Conection");

const getUsuario = async (req, res)=>{
    try {
        const [rows] = await conexion.query("SELECT * FROM usuarios");
        res.json(rows);
    } catch (error) {
        res.status(500).json({error: "Error al obtener los registros"})
    }
}

const CreateUsuario = async (req, res) => {
    const { username, rol, password } = req.body;

    if (!username || !rol || !password) {
        return res.status(400).json({ success: false, message: "Todos los campos son obligatorios" });
    }

    try {
        const [result] = await conexion.query(
            "INSERT INTO usuarios(username, rol, password) VALUES ( ?, ? , ?)",
            [username, rol, password]
        );

        res.status(201).json({ success: true, id: result.insertId, message: "Registro exitoso" });
    } catch (error) {
        console.log("Error en la inserción: ",error);
        res.status(500).send("Error al realizar la inserción del usuario");
    }
}


//Actualizar usuarios
const updateUsuario = async (req, res)=>{
    const {id}  = req.params
    
    const { username, rol, password } = req.body;

    try {
        const result = await conexion.query("UPDATE usuarios SET username = ?, rol = ?, password = ? WHERE id = ?",
        [username, rol, password, id]);

        if(result.affectedRows === 0){
            return res.status(404).json({error: "Usuario no encontrado"})
        }

        res.json({ message: `El usuario con ID:${id} se actualizo.` })
    } catch (error) {
        res.status(500).json({error: "Error al actualizar el usuario"})
    }
}

//Eliminar usuarios
const deleteUsuario = async (req, res) => {
    const {id} = req.params;
    console.log("ID recibido:", id);

    try {
        const resultado = await conexion.query("DELETE FROM usuarios WHERE id = ?",[id]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.json({message: "Usuario eliminado correctamente"})
    } catch (error) {
        res.status(500).json({error: "Error al eliminar el usuario"})
    }
}


//exportar modulos
module.exports = {
    getUsuario,
    CreateUsuario,
    updateUsuario,
    deleteUsuario
};