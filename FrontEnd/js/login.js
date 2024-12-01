const API_URL = "https://fbd2-191-106-132-128.ngrok-free.app/login";

// Esperar a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
    initLoginForm();
});

/**
 * Inicializa el formulario de inicio de sesión
 */
function initLoginForm() {
    // Seleccionar el formulario
    const form = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage'); // Elemento para mostrar el error

    // Agregar evento 'submit' al formulario
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevenir el comportamiento por defecto del formulario
        errorMessage.textContent = ""; // Limpiar mensajes de error

        // Obtener los datos del formulario
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Validar campos antes de enviar
        if (!username || !password) {
            errorMessage.textContent = "Por favor, completa todos los campos.";
            return;
        }

        // Enviar datos al servidor
        await handleLogin({ username, password }, errorMessage);
    });
}

/**
 * Maneja el inicio de sesión enviando los datos al servidor
 * @param {Object} credentials - Credenciales del usuario (username, password)
 * @param {HTMLElement} errorMessage - Elemento para mostrar errores
 */
async function handleLogin(credentials, errorMessage) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });

        const data = await response.json();

        // Mostrar mensaje según la respuesta del servidor
        if (!data.success) {
            errorMessage.textContent = data.message; // Mostrar error
        } else {
            if(data.role && data.role.trim().toLowerCase() === "administrador"){
                window.location.href = "/FrontEnd/admin.html";
            }else if(data.role && (data.role.trim().toLowerCase() === "profesor" || data.role.trim().toLowerCase() === "profesora")){
                window.location.href = "/FrontEnd/PrincipalProfesor.html"
            }else{
                errorMessage.textContent = "Rol no autorizado.";
            }
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        errorMessage.textContent = "Ocurrió un error al conectarse al servidor.";
    }
}