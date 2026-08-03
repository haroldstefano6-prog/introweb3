// =============================
// REGISTRO DE PERSONAS
// =============================

const formulario = document.getElementById("formulario");
const cuerpoTabla = document.getElementById("cuerpoTabla");

formulario.addEventListener("submit", function (e) {

    e.preventDefault();

    let nombres = document.getElementById("txtNombres").value;
    let apellidos = document.getElementById("txtApellidos").value;
    let correo = document.getElementById("txtCorreo").value;
    let edad = document.getElementById("txtEdad").value;

    let nuevaFila = cuerpoTabla.insertRow();

    nuevaFila.insertCell(0).textContent = nombres;
    nuevaFila.insertCell(1).textContent = apellidos;
    nuevaFila.insertCell(2).textContent = correo;
    nuevaFila.insertCell(3).textContent = edad;

    formulario.reset();

    document.getElementById("txtNombres").focus();

});


// =============================
// TABLA DE MULTIPLICAR
// =============================

const btnTabla = document.getElementById("btnTabla");

btnTabla.addEventListener("click", function () {

    let numero = prompt("Ingrese un número:");

    if (numero === null || numero === "" || isNaN(numero)) {
        alert("Debe ingresar un número válido.");
        return;
    }

    numero = Number(numero);

    let html = `
        <table border="1" cellpadding="5" cellspacing="0">
            <tr>
                <th colspan="2">Tabla del ${numero}</th>
            </tr>
    `;

    for (let i = 1; i <= 10; i++) {

        html += `
            <tr>
                <td>${numero} x ${i}</td>
                <td>${numero * i}</td>
            </tr>
        `;

    }

    html += "</table>";

    document.getElementById("resultadoTabla").innerHTML = html;

});