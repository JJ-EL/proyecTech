const API_URL = "https://fbd2-191-106-132-128.ngrok-free.app/usuarios";

document.addEventListener("DOMContentLoaded",()=>{
    cargaUsuario();
    crea();
})

//Agregar usuarios
function crea(){
    const form = document.getElementById('formProfesor');
    const errorMensaje = document.getElementById('errorMensaje');

    form.addEventListener('submit', async(event)=>{
        event.preventDefault();
        errorMensaje.textContent = "";

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const rol = document.getElementById('rol').value;

        if(!username || !password || !rol){
            errorMensaje.textContent = "Por favor, completa todos los campos";
            return;
        }

        await handleProfesor({ username, rol, password }, errorMensaje)
    })
}

/**
 * Maneja el inicio de sesión enviando los datos al servidor
 * @param {Object} registro - Credenciales del usuario (username, password)
 * @param {HTMLElement} errorMessage - Elemento para mostrar errores
 */
async function handleProfesor(registro, errorMessage) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registro),
        });

        const data = await response.json();

        // Mostrar mensaje según la respuesta del servidor
        if (!data.success) {
            errorMessage.textContent = data.message; // Mostrar error
        } else {
            errorMessage.textContent = "Registro creado";
            location.reload();
            // window.location.href = "../FrontEnd/admin.html";
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        errorMessage.textContent = "Ocurrió un error al conectarse al servidor.";
    }
}

//Visualizar la infomarción
async function cargaUsuario() {
    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        });

        const usuario = await response.json();
        displeyUsuarios(usuario);
    } catch (error) {
        console.log("Error al traer los usuarios: ", error);
    }
}

function displeyUsuarios(usuario){
    const tableBody = document.getElementById("usuariosTableBody");

    usuario.forEach((usuario)=>{
        const TR = document.createElement("tr");
        TR.innerHTML = `
            <td>${usuario.id}</td>
            <td>${usuario.username}</td>
            <td>${usuario.password}</td>
            <td>${usuario.rol}</td>
            <td><button type="button" class="btn btn-actualizar" 
                    data-id="${usuario.id}" data-username="${usuario.username}" data-rol="${usuario.rol}">Actualizar
                </button>
            </td>
            <td><button type="button" class="btn red btn-eliminar" data-id="${usuario.id}">Elimiar</button></td>
        `;
        tableBody.appendChild(TR);
    })
}


//Evento para los botones eliminar y editar
document.addEventListener("click", (event)=>{
    const id = event.target.dataset.id;

    if(event.target.classList.contains("btn-actualizar")){
        const username = prompt("Editar nombre del usuario: ", event.target.dataset.username);
        const rol = prompt("Editar el rol del usuario: ", event.target.dataset.rol);
        const password = prompt("Editar la contraseña del usuario: ","*******");

        if(username && rol && password){
            actualizarUsuario(id,{username, rol, password});
        }else{
            alert("Actualización cancelada. Todos los campos son obligatorios.");
        }
    }

    if(event.target.classList.contains("btn-eliminar")){
        const userId = event.target.dataset.id;
        eliminarUsuario(userId);
    }
})

//Editar usuarios
async function actualizarUsuario(id, data) {
    console.log("Datos enviados al servidor:", data);
    try {
        const response = await fetch(`${API_URL}/${id}`,{
            method: "PUT",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });

        if(response.ok){
            alert("Usuario Actualizado");
            location.reload();
        }else{
            console.log("Error al actualizar el usuario", await response.json());
            alert("Hubo un error al actualizar el usuario")
        }
    } catch (error) {
        console.log("Error al realizar la solicitud de actualización: ",error);
    }
}

//Eliminar usuarios
async function eliminarUsuario(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {  
            method: "DELETE",
        })
        if(response.ok){
            alert("Usuario eliminado");
            location.reload();
        }else{
            console.log("Error al eliminar el usuario")
        }
    } catch (error) {
        console.log("Error en la solicitud de eliminación: ",error);
    }
}