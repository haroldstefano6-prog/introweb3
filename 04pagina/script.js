let listaUsuarios = [];
let indexModificando = null;

document.addEventListener('DOMContentLoaded', () => {
    const btnAgregar = document.getElementById('btnAgregar');
    btnAgregar.addEventListener('click', gestionarRegistro);
});

function gestionarRegistro() {
    const nombres = document.getElementById('nombres').value.trim();
    const apellidos = document.getElementById('apellidos').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const edadInput = document.getElementById('edad').value.trim();
    const edad = parseInt(edadInput);

    // Validar campos obligatorios
    if (!nombres || !apellidos || !correo || !edadInput) {
        alert('⚠️ Por favor, complete todos los campos obligatorios.');
        return;
    }

    // Validar formato de correo electrónico
    const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formatoCorreo.test(correo)) {
        alert('⚠️ Por favor, ingrese un correo electrónico válido (ejemplo: usuario@correo.com).');
        return;
    }

    // Validar edad válida
    if (isNaN(edad) || edad <= 0 || edad > 120) {
        alert('⚠️ Por favor, ingrese una edad válida entre 1 y 120 años.');
        return;
    }

    // Agregar o actualizar registro en el arreglo
    if (indexModificando === null) {
        listaUsuarios.push({ nombres, apellidos, correo, edad });
    } else {
        listaUsuarios[indexModificando] = { nombres, apellidos, correo, edad };
        indexModificando = null;
        document.getElementById('btnAgregar').textContent = 'Agregar Registro';
    }

    limpiarFormulario();
    actualizarTabla();
}

function actualizarTabla() {
    const tbody = document.querySelector('#tablaRegistros tbody');
    tbody.innerHTML = '';

    if (listaUsuarios.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="empty-state">No hay registros agregados aún.</td></tr>`;
        return;
    }

    listaUsuarios.forEach((user, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${user.nombres}</td>
            <td>${user.apellidos}</td>
            <td>${user.correo}</td>
            <td>${user.edad}</td>
            <td>
                <button class="btn-action btn-edit" onclick="cargarEdicion(${index})">Editar</button>
                <button class="btn-action btn-delete" onclick="eliminarRegistro(${index})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function cargarEdicion(index) {
    const user = listaUsuarios[index];
    document.getElementById('nombres').value = user.nombres;
    document.getElementById('apellidos').value = user.apellidos;
    document.getElementById('correo').value = user.correo;
    document.getElementById('edad').value = user.edad;

    indexModificando = index;
    document.getElementById('btnAgregar').textContent = 'Actualizar Registro';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function eliminarRegistro(index) {
    listaUsuarios.splice(index, 1);
    if (indexModificando === index) {
        indexModificando = null;
        document.getElementById('btnAgregar').textContent = 'Agregar Registro';
        limpiarFormulario();
    }
    actualizarTabla();
}

function limpiarFormulario() {
    document.getElementById('nombres').value = '';
    document.getElementById('apellidos').value = '';
    document.getElementById('correo').value = '';
    document.getElementById('edad').value = '';
    document.getElementById('nombres').focus();
}