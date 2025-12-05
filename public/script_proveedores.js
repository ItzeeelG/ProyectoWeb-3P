const API_PROVEEDORES = "http://localhost:3000/proveedores";

document.addEventListener("DOMContentLoaded", () => {
    cargarProveedores();
});

function cargarProveedores() {
    fetch(API_PROVEEDORES)
        .then(res => res.json())
        .then(data => mostrarProveedores(data))
        .catch(err => console.error("Error al cargar proveedores:", err));
}

function mostrarProveedores(data) {
    const tabla = document.getElementById("tablaProveedores");
    tabla.innerHTML = "";

    data.forEach(prov => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${prov.nombre}</td>
            <td>${prov.telefono}</td>
            <td>
                <button class="btn-modificar">Editar</button>
                <button class="btn-eliminar">Eliminar</button>
            </td>
        `;
        tabla.appendChild(fila);

        fila.querySelector(".btn-modificar").addEventListener("click", () => mostrarModalEditar(prov.nombre, prov.telefono));
        fila.querySelector(".btn-eliminar").addEventListener("click", () => mostrarModalEliminar(prov.nombre));
    });
}

// ================= AGREGAR =================
function agregarProveedor() {
    const nombre = document.getElementById("nombreProveedor").value.trim();
    const telefono = document.getElementById("telefonoProveedor").value.trim();

    if (!nombre || !telefono) {
        mostrarToast("Completa todos los campos", "error");
        return;
    }

    fetch(API_PROVEEDORES, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, telefono })
    })
    .then(res => res.json())
    .then(() => {
        cargarProveedores();
        document.getElementById("nombreProveedor").value = "";
        document.getElementById("telefonoProveedor").value = "";
        mostrarToast("Proveedor agregado", "success");
    })
    .catch(err => mostrarToast("Error al agregar", "error"));
}

// ================= EDITAR =================
let proveedorOriginal = "";

function mostrarModalEditar(nombre, telefono) {
    proveedorOriginal = nombre;
    document.getElementById("editarNombre").value = nombre;
    document.getElementById("editarTelefono").value = telefono;
    document.getElementById("modalEditar").style.display = "flex";
}

function cerrarModalEditar() {
    document.getElementById("modalEditar").style.display = "none";
    proveedorOriginal = "";
}

function guardarEdicion() {
    const nuevoNombre = document.getElementById("editarNombre").value.trim();
    const nuevoTelefono = document.getElementById("editarTelefono").value.trim();

    if (!nuevoNombre || !nuevoTelefono) {
        mostrarToast("Completa todos los campos", "error");
        return;
    }

    fetch(`${API_PROVEEDORES}/${encodeURIComponent(proveedorOriginal)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nuevoNombre, telefono: nuevoTelefono })
    })
    .then(res => {
        if (!res.ok) throw new Error("Error al actualizar");
        return res.json();
    })
    .then(() => {
        cargarProveedores();
        cerrarModalEditar();
        mostrarToast("Proveedor actualizado", "update");
    })
    .catch(err => mostrarToast(err.message, "error"));
}

// ================= ELIMINAR =================
let proveedorAEliminar = "";

function mostrarModalEliminar(nombre) {
    proveedorAEliminar = nombre;
    document.getElementById("mensajeEliminar").textContent = `¿Seguro que deseas eliminar a ${nombre}?`;
    document.getElementById("modalEliminar").style.display = "flex";
}

function cerrarModalEliminar() {
    document.getElementById("modalEliminar").style.display = "none";
    proveedorAEliminar = "";
}

function confirmarEliminar() {
    fetch(`${API_PROVEEDORES}/${encodeURIComponent(proveedorAEliminar)}`, {
        method: "DELETE"
    })
    .then(res => {
        if (!res.ok) throw new Error("Error al eliminar");
        return res.json();
    })
    .then(() => {
        cargarProveedores();
        cerrarModalEliminar();
        mostrarToast("Proveedor eliminado", "delete");
    })
    .catch(err => mostrarToast(err.message, "error"));
}

// ================= TOAST =================
function mostrarToast(mensaje, tipo="success") {
    const toast = document.createElement("div");
    toast.classList.add("toast", tipo, "show");
    toast.textContent = mensaje;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.remove("show");
        toast.remove();
    }, 3000);
}
