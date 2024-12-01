const API_URL = "https://fbd2-191-106-132-128.ngrok-free.app/alumnos";

document.addEventListener("DOMContentLoaded", () => {
    crear();
    cargarAlumnos();
});

function crear() {
    const form = document.getElementById("formAlumno");
    const Mensaje = document.getElementById("Mensaje");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        Mensaje.textContent = "";

        const nombre = document.getElementById("nombre").value;
        let date = document.getElementById("date").value;
        const telefono = document.getElementById("telefono").value;

        if (!nombre || !date || !telefono) {
            Mensaje.textContent = "Por favor, completa todos los campos";
            return;
        }

        await postAlumno({ nombre, date, telefono }, Mensaje);
    });
}

async function postAlumno(registro, Mensaje) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(registro),
        });

        const data = await response.json();

        if (!data.success) {
            Mensaje.textContent = data.message;
        } else {
            Mensaje.textContent = "Registro Creado";
            alert("Registro creado");
            location.reload(); // Asegúrate de que se invoca como función
        }
    } catch (error) {
        console.log("Error en la solicitud: ", error);
    }
}

async function cargarAlumnos(){
    try {
        const respuesta = await fetch(API_URL, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        });

        const alumnos = await respuesta.json();
        verAlumnos(alumnos);
    } catch (error) {
        console.log("Error al traer los alumnos: ", error);
    }
}

function verAlumnos(alumnos) {
    const tableBody = document.getElementById("AlumnoTable");

    alumnos.forEach((alumn) => {
        const TR = document.createElement("tr");
        const fechaNacimiento = new Date(alumn.fecha_nacimiento);
        const date = fechaNacimiento.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });

        TR.innerHTML = `
            <td>${alumn.id}</td>
            <td>${alumn.nombre}</td>
            <td>${date}</td>
            <td>${alumn.telefono}</td>
            <td><button type="button" class="btn btn-actualizar" 
                    data-id="${alumn.nombre}" data-username="${alumn.fecha_nacimiento}" data-rol="${alumn.telefono}">Actualizar
                </button>
            </td>
            <td><button type="button" class="btn red btn-eliminar" data-id="${alumn.id}">Eliminar</button></td>
        `;
        tableBody.appendChild(TR);
    });
}

document.addEventListener("click", (event)=>{
    const id = event.target.dataset.id;

    if(event.target.classList.contains("btn-eliminar")){
        const alumnoID = event.target.dataset.id;
        eliminarAlumno(alumnoID);
    }
})

async function eliminarAlumno(id){
    try {
        const response = await fetch(`${API_URL}/${id}`,{
            method: 'DELETE',
        });
        if(response.ok){
            alert("Alumno eliminado");
            location.reload();
        }else{
            console.log("Error al eliminar al alumno");
        }
    } catch (error) {
        console.log("Error en la solicitud de eliminacion: ", error);
    }
}