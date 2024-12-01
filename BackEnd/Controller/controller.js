//controlador para el login, se encarga de realizar el select para validar si existe el usuario
const conexion = require("../database/Conection");

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const [user] = await conexion.query(
            "SELECT username, rol FROM usuarios WHERE username = ?",
            [username]
        );

        if (!user.length) {
            return res.status(200).json({ success: false, message: "El usuario no existe" });
        }

        const [validarUser] = await conexion.query(
            "SELECT username, password FROM usuarios WHERE username = ? AND password = ?",
            [username, password]
        );

        if (!validarUser.length) {
            return res.status(200).json({ success: false, message: "Contraseña incorrecta" });
        }

        res.json({ success: true, message: "Inicio de sesión exitoso", role: user[0].rol });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error en el servidor" });
    }
};

module.exports = { login };