// =========================================================
// 1. LÓGICA GLOBAL Y MODO OSCURO/CLARO
// =========================================================
let inscripciones = [];
try { inscripciones = JSON.parse(localStorage.getItem("demonInscripciones")) || [] } catch (e) { inscripciones = [] }
let editIndex = null;

const form = document.getElementById("crud-form");
const tablaBody = document.getElementById("tabla-body");
const searchInput = document.getElementById("search");
const sortSelect = document.getElementById("sort");
const themeToggle = document.getElementById("theme-toggle");
const exportBtn = document.getElementById("export-btn");

if (themeToggle) {
    const savedTheme = localStorage.getItem("demonTheme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
    actualizarTextoTema(savedTheme);
    themeToggle.addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("demonTheme", newTheme);
        actualizarTextoTema(newTheme);
    });
}

function actualizarTextoTema(theme) {
    if (themeToggle) themeToggle.textContent = theme === "dark" ? "☀️ Modo Claro" : "🌙 Modo Oscuro";
}

// =========================================================
// 2. LÓGICA DE TIENDA Y MODAL DE COMPRA
// =========================================================
let modalCompra = null;
let productoSeleccionado = null;
let precioSeleccionado = null;

function inicializarTienda() {
    const buyButtons = document.querySelectorAll(".btn-buy");
    if (buyButtons.length === 0) return;

    crearModalCompra();
    buyButtons.forEach(btn => {
        btn.addEventListener("click", abrirModalCompra);
    });
}

function crearModalCompra() {
    let modal = document.getElementById("modal-compra");

    if (!modal) {
        modal = document.createElement("div");
        modal.id = "modal-compra";
        modal.className = "modal-overlay";
        modal.innerHTML = `
<div class="demon-modal" role="dialog" aria-modal="true">
<div class="modal-icon">🛒</div>
<h3>Confirmar compra</h3>
<p>Estás a punto de adquirir el siguiente producto:</p>
<div class="modal-product">
<div class="modal-product-name" id="modal-product-name">Producto</div>
<div class="modal-product-price" id="modal-product-price">$0.00</div>
</div>
<p>¿Deseas confirmar esta compra?</p>
<div class="modal-buttons">
<button type="button" class="btn-modal-cancel" id="modal-cancel">Cancelar</button>
<button type="button" class="btn-modal-confirm" id="modal-confirm">Confirmar compra</button>
</div>
</div>`;
        document.body.appendChild(modal);
    }

    modalCompra = modal;

    const btnCancel = document.getElementById("modal-cancel");
    const btnConfirm = document.getElementById("modal-confirm");

    if (btnCancel) btnCancel.addEventListener("click", cerrarModalCompra);
    if (btnConfirm) btnConfirm.addEventListener("click", confirmarCompra);

    modal.addEventListener("click", e => {
        if (e.target === modal) cerrarModalCompra();
    });

    document.addEventListener("keydown", e => {
        if (e.key === "Escape" && modal.classList.contains("active")) cerrarModalCompra();
    });
}

function abrirModalCompra(e) {
    const card = e.currentTarget.closest(".product-card");
    if (!card) return;

    const nombreElement = card.querySelector("h3");
    const precioElement = card.querySelector(".product-price");

    productoSeleccionado = nombreElement ? nombreElement.textContent.trim() : "Producto Demon Gym";
    precioSeleccionado = precioElement ? precioElement.textContent.trim() : "$0.00";

    const nombreModal = document.getElementById("modal-product-name");
    const precioModal = document.getElementById("modal-product-price");

    if (nombreModal) nombreModal.textContent = productoSeleccionado;
    if (precioModal) precioModal.textContent = precioSeleccionado;

    if (modalCompra) {
        modalCompra.classList.add("active");
        document.body.style.overflow = "hidden";
    }
}

function cerrarModalCompra() {
    if (!modalCompra) return;
    modalCompra.classList.remove("active");
    document.body.style.overflow = "";
}

function confirmarCompra() {
    if (!productoSeleccionado) return;

    const ahora = new Date();
    const compra = {
        id: generarNumeroPedido(),
        producto: productoSeleccionado,
        precio: precioSeleccionado,
        fecha: ahora.toLocaleDateString("es-EC"),
        hora: ahora.toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" })
    };

    let compras = [];
    try { compras = JSON.parse(localStorage.getItem("demonCompras")) || [] } catch (e) { compras = [] }

    compras.push(compra);
    localStorage.setItem("demonCompras", JSON.stringify(compras));

    cerrarModalCompra();
    mostrarCompraExitosa(compra);
}

function generarNumeroPedido() {
    return `DG-${Math.floor(100000 + Math.random() * 900000)}`;
}

function mostrarCompraExitosa(compra) {
    const mensaje = document.createElement("div");
    mensaje.className = "modal-overlay active";
    mensaje.innerHTML = `
<div class="demon-modal" role="alertdialog" aria-modal="true">
<div class="modal-icon modal-success">✓</div>
<h3>¡Compra exitosa!</h3>
<p>Tu solicitud ha sido registrada correctamente.</p>
<div class="modal-product">
<div class="modal-product-name">${escaparHTML(compra.producto)}</div>
<div class="modal-product-price">${escaparHTML(compra.precio)}</div>
</div>
<p><strong>Número de pedido:</strong> ${compra.id}<br><strong>Fecha:</strong> ${compra.fecha}<br><strong>Hora:</strong> ${compra.hora}</p>
<div class="modal-buttons">
<button type="button" class="btn-modal-confirm" id="btn-cerrar-exito">Aceptar</button>
</div>
</div>`;

    document.body.appendChild(mensaje);
    document.body.style.overflow = "hidden";

    const cerrarBtn = mensaje.querySelector("#btn-cerrar-exito");

    cerrarBtn.addEventListener("click", () => {
        mensaje.remove();
        document.body.style.overflow = "";
    });

    mensaje.addEventListener("click", e => {
        if (e.target === mensaje) {
            mensaje.remove();
            document.body.style.overflow = "";
        }
    });
}

function escaparHTML(texto) {
    const div = document.createElement("div");
    div.textContent = texto;
    return div.innerHTML;
}

inicializarTienda();

// =========================================================
// 3. CRUD DE INSCRIPCIONES
// =========================================================
if (form) {
    const btnSubmit = document.getElementById("btn-submit");

    form.addEventListener("submit", guardarRegistro);
    if (searchInput) searchInput.addEventListener("input", renderTabla);
    if (sortSelect) sortSelect.addEventListener("change", renderTabla);
    if (exportBtn) exportBtn.addEventListener("click", exportarCSV);

    function guardarRegistro(e) {
        e.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const apellido = document.getElementById("apellido").value.trim();
        const edad = parseInt(document.getElementById("edad").value, 10);
        const plan = document.getElementById("plan").value;
        const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

        if (!nombre || !apellido || !plan) {
            alert("⚠️ Todos los campos son obligatorios.");
            return;
        }

        if (!soloLetras.test(nombre) || !soloLetras.test(apellido)) {
            alert("⚠️ Nombre y Apellido solo deben contener letras.");
            return;
        }

        if (isNaN(edad) || edad < 15 || edad > 100) {
            alert("⚠️ La edad debe ser un número entre 15 y 100 años.");
            return;
        }

        const registro = { nombre, apellido, edad, plan };

        if (editIndex === null) {
            inscripciones.push(registro);
        } else {
            inscripciones[editIndex] = registro;
            editIndex = null;
            if (btnSubmit) btnSubmit.textContent = "Guardar Inscripción";
        }

        form.reset();
        guardarYRenderizar();
    }

    function guardarYRenderizar() {
        localStorage.setItem("demonInscripciones", JSON.stringify(inscripciones));
        renderTabla();
    }

    function renderTabla() {
        if (!tablaBody) return;

        tablaBody.innerHTML = "";

        const filtro = searchInput ? searchInput.value.toLowerCase().trim() : "";
        const orden = sortSelect ? sortSelect.value : "";

        let datosFiltrados = inscripciones.filter(req =>
            req.nombre.toLowerCase().includes(filtro) ||
            req.apellido.toLowerCase().includes(filtro) ||
            req.plan.toLowerCase().includes(filtro)
        );

        if (orden === "nombre") {
            datosFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
        } else if (orden === "edad") {
            datosFiltrados.sort((a, b) => a.edad - b.edad);
        } else if (orden === "plan") {
            datosFiltrados.sort((a, b) => a.plan.localeCompare(b.plan));
        }

        if (datosFiltrados.length === 0) {
            tablaBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No hay registros</td></tr>`;
        } else {
            datosFiltrados.forEach(req => {
                const realIndex = inscripciones.indexOf(req);
                const tr = document.createElement("tr");

                tr.innerHTML = `
<td>${escaparHTML(req.nombre)}</td>
<td>${escaparHTML(req.apellido)}</td>
<td>${req.edad}</td>
<td>${escaparHTML(req.plan)}</td>
<td>
<button type="button" class="btn-edit" onclick="cargarEdicion(${realIndex})">Editar</button>
<button type="button" class="btn-delete" onclick="eliminarRegistro(${realIndex})">Eliminar</button>
</td>`;

                tablaBody.appendChild(tr);
            });
        }

        actualizarIndicadores();
    }

    window.cargarEdicion = function (index) {
        const req = inscripciones[index];
        if (!req) return;

        document.getElementById("nombre").value = req.nombre;
        document.getElementById("apellido").value = req.apellido;
        document.getElementById("edad").value = req.edad;
        document.getElementById("plan").value = req.plan;

        editIndex = index;

        if (btnSubmit) btnSubmit.textContent = "Actualizar Inscripción";

        form.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    window.eliminarRegistro = function (index) {
        const registro = inscripciones[index];
        if (!registro) return;
        mostrarModalEliminar(registro, index);
    };

    function mostrarModalEliminar(registro, index) {
        const modalAnterior = document.getElementById("modal-eliminar");
        if (modalAnterior) modalAnterior.remove();

        const modal = document.createElement("div");
        modal.id = "modal-eliminar";
        modal.className = "modal-overlay active";

        modal.innerHTML = `
<div class="demon-modal" role="dialog" aria-modal="true">
<div class="modal-icon modal-warning">⚠️</div>
<h3>Eliminar miembro</h3>
<p>Estás a punto de eliminar este registro del directorio.</p>
<div class="modal-product">
<div class="modal-product-name">${escaparHTML(registro.nombre)} ${escaparHTML(registro.apellido)}</div>
<div class="modal-delete-info">${escaparHTML(registro.plan)} · ${registro.edad} años</div>
</div>
<p class="modal-danger-text">Esta acción no se puede deshacer.</p>
<div class="modal-buttons">
<button type="button" class="btn-modal-cancel" id="cancelar-eliminacion">Cancelar</button>
<button type="button" class="btn-modal-delete" id="confirmar-eliminacion">🗑️ Eliminar</button>
</div>
</div>`;

        document.body.appendChild(modal);
        document.body.style.overflow = "hidden";

        document.getElementById("cancelar-eliminacion").addEventListener("click", cerrarModalEliminar);

        document.getElementById("confirmar-eliminacion").addEventListener("click", () => {
            eliminarRegistroConfirmado(index);
            cerrarModalEliminar();
        });

        modal.addEventListener("click", e => {
            if (e.target === modal) cerrarModalEliminar();
        });

        const cerrarConEscape = e => {
            if (e.key === "Escape") {
                cerrarModalEliminar();
                document.removeEventListener("keydown", cerrarConEscape);
            }
        };

        document.addEventListener("keydown", cerrarConEscape);
    }

    function cerrarModalEliminar() {
        const modal = document.getElementById("modal-eliminar");
        if (modal) modal.remove();
        document.body.style.overflow = "";
    }

    function eliminarRegistroConfirmado(index) {
        if (index < 0 || index >= inscripciones.length) return;

        inscripciones.splice(index, 1);

        if (editIndex !== null) {
            if (index === editIndex) {
                editIndex = null;
                if (form) form.reset();
                const btnSubmit = document.getElementById("btn-submit");
                if (btnSubmit) btnSubmit.textContent = "Guardar Inscripción";
            } else if (index < editIndex) {
                editIndex -= 1;
            }
        }

        guardarYRenderizar();
        mostrarMensajeEliminado();
    }

    function mostrarMensajeEliminado() {
        const mensaje = document.createElement("div");
        mensaje.className = "modal-overlay active";

        mensaje.innerHTML = `
<div class="demon-modal" role="alertdialog" aria-modal="true">
<div class="modal-icon modal-success">✓</div>
<h3>Registro eliminado</h3>
<p>El miembro ha sido eliminado correctamente del directorio de Demon Gym.</p>
<div class="modal-buttons">
<button type="button" class="btn-modal-confirm" id="cerrar-mensaje-eliminado">Aceptar</button>
</div>
</div>`;

        document.body.appendChild(mensaje);
        document.body.style.overflow = "hidden";

        mensaje.querySelector("#cerrar-mensaje-eliminado").addEventListener("click", () => {
            mensaje.remove();
            document.body.style.overflow = "";
        });

        mensaje.addEventListener("click", e => {
            if (e.target === mensaje) {
                mensaje.remove();
                document.body.style.overflow = "";
            }
        });
    }

    function actualizarIndicadores() {
        const total = inscripciones.length;
        const statTotal = document.getElementById("stat-total");
        const statEdad = document.getElementById("stat-edad");
        const statPlan = document.getElementById("stat-plan");

        if (statTotal) statTotal.textContent = total;

        if (total === 0) {
            if (statEdad) statEdad.textContent = "0";
            if (statPlan) statPlan.textContent = "N/A";
            return;
        }

        const sumaEdades = inscripciones.reduce((sum, req) => sum + req.edad, 0);

        if (statEdad) statEdad.textContent = Math.round(sumaEdades / total);

        const conteoPlanes = {};

        inscripciones.forEach(req => {
            conteoPlanes[req.plan] = (conteoPlanes[req.plan] || 0) + 1;
        });

        const planEstrella = Object.keys(conteoPlanes).reduce((a, b) =>
            conteoPlanes[a] > conteoPlanes[b] ? a : b
        );

        if (statPlan) statPlan.textContent = planEstrella;
    }

    function exportarCSV() {
        if (inscripciones.length === 0) {
            alert("No hay datos para exportar.");
            return;
        }

        let csvContent = "data:text/csv;charset=utf-8,Nombre,Apellido,Edad,Plan\n";

        inscripciones.forEach(row => {
            csvContent += `"${row.nombre}","${row.apellido}",${row.edad},"${row.plan}"\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");

        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "inscripciones_demongym.csv");

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    renderTabla();
}

if (!themeToggle) {
    const savedTheme = localStorage.getItem("demonTheme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
}

// =========================================================
// 4. LÓGICA DEL FORMULARIO DE COMENTARIOS (FINAL)
// =========================================================
const formComentario = document.getElementById("form-comentario");
const contenedorComentarios = document.getElementById("comentarios-grid");

if (formComentario && contenedorComentarios) {
    formComentario.addEventListener("submit", function(event) {
        event.preventDefault();

        const nombre = document.getElementById("nombre-comentario").value.trim();
        const texto = document.getElementById("texto-comentario").value.trim();

        if (nombre !== "" && texto !== "") {
            
            const nuevaTarjeta = document.createElement("div");
            nuevaTarjeta.className = "card";
            nuevaTarjeta.style.borderTopColor = "#333";

            nuevaTarjeta.innerHTML = `
                <p><em>"${texto}"</em></p>
                <br>
                <h3 style="font-size: 1.1rem; color: var(--primary-color);">- ${nombre} (Nuevo Miembro)</h3>
            `;

            contenedorComentarios.appendChild(nuevaTarjeta);
            formComentario.reset();

            // Llamamos a la nueva función del modal en lugar del alert()
            mostrarMensajeComentarioExitoso();
        }
    });
}

// Esta es la función que hace que el mensaje se vea como tus otros modales
function mostrarMensajeComentarioExitoso() {
    const mensaje = document.createElement("div");
    mensaje.className = "modal-overlay active";

    mensaje.innerHTML = `
        <div class="demon-modal" role="alertdialog" aria-modal="true">
            <div class="modal-icon modal-success">✓</div>
            <h3>¡Publicado!</h3>
            <p>Tu experiencia ha sido compartida con la comunidad de Demon Gym.</p>
            <div class="modal-buttons">
                <button type="button" class="btn-modal-confirm" id="cerrar-mensaje-comentario">Aceptar</button>
            </div>
        </div>`;

    document.body.appendChild(mensaje);
    document.body.style.overflow = "hidden";

    // Evento para cerrar el modal
    mensaje.querySelector("#cerrar-mensaje-comentario").addEventListener("click", () => {
        mensaje.remove();
        document.body.style.overflow = "";
    });

    // Cerrar si hacen clic fuera del modal
    mensaje.addEventListener("click", e => {
        if (e.target === mensaje) {
            mensaje.remove();
            document.body.style.overflow = "";
        }
    });
}