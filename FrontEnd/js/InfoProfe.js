const API_URL_usuarios = "https://fbd2-191-106-132-128.ngrok-free.app/profesores/usuarios";
const API_URL_GRADO = "https://fbd2-191-106-132-128.ngrok-free.app/profesores/grado";
const API_URL = "https://fbd2-191-106-132-128.ngrok-free.app/profesores";


document.addEventListener("DOMContentLoaded",()=>{
    const elems = document.querySelectorAll("select");
    M.FormSelect.init(elems);

    // Inicializar modales de Materialize
    const modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);

    cargaUsu();
    cargaProfe();
    cargaGrados();

    const form = document.getElementById("formProfesor");
    form.addEventListener('submit', crearProfesor);
})

async function cargaUsu(){
    try {
        const respuesta = await fetch(API_URL_usuarios, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        });

        const usu = await respuesta.json()
        VerUsuarios(usu);
    } catch (error) {
        console.log("Error al traer los registros de usuarios: ", error)
    }
}

function VerUsuarios(usu){
    const verEnTabla = document.getElementById("InfoUsu");

    usu.forEach((usu)=>{
        const TrUsuario = document.createElement("tr");
        TrUsuario.innerHTML = `
            <td>${usu.id_usu}</td>
            <td>${usu.username}</td>
        `;
        verEnTabla.appendChild(TrUsuario);
    })
}

async function cargaGrados(selectId = "grados_id") {
    try {
        const responseGrado = await fetch(API_URL_GRADO);
        const grados = await responseGrado.json();

        const selectGrado = document.getElementById(selectId);
        selectGrado.innerHTML = `<option value="" disabled selected>Seleccione un grado</option>`; // Limpia las opciones previas

        grados.forEach((GR) => {
            const opcion = document.createElement("option");
            opcion.value = GR.id_grado;
            opcion.textContent = GR.nombre_grado;
            selectGrado.appendChild(opcion);
        });

        // Inicializar Materialize para que el select se actualice
        const elems = document.querySelectorAll("select");
        M.FormSelect.init(elems);
    } catch (error) {
        console.log("Error al cargar los grados: ", error);
    }
}


async function crearProfesor(event) {
    event.preventDefault();

    // Extraer valores del formulario
    const nombre = document.getElementById("nombre").value;
    const materia = document.getElementById("materia").value;
    const id_usuario = document.getElementById("id_usuario").value;
    const grados_id = document.getElementById("grados_id").value; // Asegúrate de tomar solo el valor seleccionado

    // Validar que todos los campos están llenos
    if (!nombre || !materia || !id_usuario || !grados_id) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    try {
        // Crear el objeto de datos
        const profesorData = {
            nombre,
            materia,
            id_usuario,
            grados_id,
        };

        // Enviar al servidor
        const respuestaProfesor = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profesorData),
        });

        const data = await respuestaProfesor.json();
        if (respuestaProfesor.ok) {
            alert("El profesor fue creado exitosamente");
            document.getElementById("formProfesor").reset();
            location.reload();
        } else {
            console.error("Error al registrar al profesor: ", data.message || data.error);
        }
    } catch (error) {
        console.error("Error al realizar la inserción del profesor: ", error);
    }
}


async function cargaProfe(){
    try {
        const result = await fetch(API_URL, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        });

        const profe = await result.json();
        verProfesor(profe);
    } catch (error) {
        console.log("Error al traer los registros del usuario: ", error);
    }
};

function verProfesor(profe) {
    const tabla = document.getElementById("InfoProfesor");

    profe.forEach((profesor) => {
        const TrProfesor = document.createElement("tr");
        TrProfesor.innerHTML = `
            <td>${profesor.profe_id}</td>
            <td>${profesor.username}</td>
            <td>${profesor.nombre_profe}</td>
            <td>${profesor.materia}</td>
            <td>${profesor.nombre_materia}</td>
            <td>
                <a class="waves-effect waves-light btn modal-trigger" href="#modalUpdate" 
                   data-id="${profesor.profe_id}" 
                   data-username="${profesor.username}" 
                   data-nombre="${profesor.nombre_profe}" 
                   data-materia="${profesor.materia}" 
                   data-grado="${profesor.nombre_materia}">
                   Actualizar
                </a>
            </td>
            <td>
                <button type="button" class="btn red btn-delete" data-id="${profesor.profe_id}">
                    Eliminar
                </button>
            </td>
        `;
        tabla.appendChild(TrProfesor);
    });

    // Asociar evento al botón "Actualizar"
    document.querySelectorAll('.modal-trigger').forEach((btn) => {
        btn.addEventListener('click', async (event) => {
            const profeId = event.target.dataset.id;
            const username = event.target.dataset.username;
            const nombre = event.target.dataset.nombre;
            const materia = event.target.dataset.materia;
            const grado = event.target.dataset.grado;
    
            // Llenar campos del modal con los datos del profesor
            document.getElementById("idProfesorUpdate").value = profeId;
            document.getElementById("nombreUpdate").value = nombre;
            document.getElementById("materiaUpdate").value = materia;
            document.getElementById("idUsuarioUpdate").value = username;
    
            // Cargar grados en el select del modal
            await cargaGrados("gradosUpdate");
    
            // Seleccionar el grado actual del profesor
            const selectGrado = document.getElementById("gradosUpdate");
            Array.from(selectGrado.options).forEach((option) => {
                if (option.textContent === grado) {
                    option.selected = true;
                }
            });
    
            // Actualizar Materialize
            M.updateTextFields();
            M.FormSelect.init(selectGrado);
        });
    });    
}


document.addEventListener("click", (event)=>{
    const id = event.target.dataset.id;

    //Evento para eliminar registros
    if(event.target.classList.contains("btn-delete")){
        const profesor_id = event.target.dataset.id;
        eliminarProfesor(profesor_id);
    }
})

//function para elimnar profesor
async function eliminarProfesor(id){
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });
        if(response.ok){
            alert("Profesor eliminado");
            location.reload();
        }else{
            console.log("Error al eliminar el profesor");
        }
    } catch (error) {
        console.log("Error en la solicitud de eliminación: ", error);
    }
}

function abrirModalUpdate(profesor) {
    // Llenar los campos del modal con los datos del profesor
    document.getElementById("idProfesorUpdate").value = profesor.profe_id;
    document.getElementById("nombreUpdate").value = profesor.nombre_profe;
    document.getElementById("materiaUpdate").value = profesor.materia;
    document.getElementById("idUsuarioUpdate").value = profesor.id_usuario;
  
    const selectGrados = document.getElementById("gradosUpdate");
    selectGrados.value = profesor.grado_id; // Asegúrate de tener el ID del grado en los datos
  
    // Actualizar Materialize
    M.updateTextFields();
    M.FormSelect.init(selectGrados);
  
    // Abrir el modal
    const modalInstance = M.Modal.getInstance(document.getElementById("modalUpdate"));
    modalInstance.open();
};

document.getElementById("btnActualizar").addEventListener("click", async () => {
    // Obtener los valores del modal
    const id = document.getElementById("idProfesorUpdate").value;
    const nombre = document.getElementById("nombreUpdate").value;
    const materia = document.getElementById("materiaUpdate").value;
    const idUsuario = document.getElementById("idUsuarioUpdate").value;
    const gradoId = document.getElementById("gradosUpdate").value;

    if (!id || !nombre || !materia || !idUsuario || !gradoId) {
        alert("Todos los campos son obligatorios");
        return;
    }

    try {
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nombre,
                materia,
                id_usuario: idUsuario,
                grados_id: gradoId,
            }),
        });

        const data = await respuesta.json();

        if (respuesta.ok) {
            alert("Profesor actualizado correctamente");
            document.getElementById("formUpdateProfesor").reset();
            cargaProfe(); // Refresca la tabla de profesores
        } else {
            console.error("Error al actualizar el profesor: ", data.message);
            alert("Error al actualizar el profesor");
        }
    } catch (error) {
        console.error("Error al realizar la actualización: ", error);
        alert("Ocurrió un error al intentar actualizar el profesor");
    }
});
