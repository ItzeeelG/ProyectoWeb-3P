const API_URL = "http://localhost:3000/productos";
const API_PROVEEDORES = "http://localhost:3000/proveedores";

// ===============================
// INICIALIZACIÓN
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    obtenerProductos();
    cargarProveedores();
});

// ===============================
// CARGAR PRODUCTOS
// ===============================
function obtenerProductos() {
    fetch(API_URL)
        .then(res => res.json())
        .then(data => mostrarTabla(data))
        .catch(err => console.error("Error cargando productos:", err));
}

function mostrarTabla(productos) {
    const tabla = document.getElementById("tablaCatalogo");
    tabla.innerHTML = "";

    productos.forEach(prod => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${prod.Nombre}</td>
            <td>${prod.Stock}</td>
            <td>
                <button class="btn-eliminar">Eliminar</button>
                <button class="btn-modificar">Modificar</button>
                <button class="btn-detalles">Detalles</button>
            </td>
        `;

        // agregar eventos
        fila.querySelector(".btn-eliminar").addEventListener("click", () => eliminarProducto(prod.id));
        fila.querySelector(".btn-modificar").addEventListener("click", () => mostrarEditar(prod.id));
        fila.querySelector(".btn-detalles").addEventListener("click", () => mostrarDetalles(prod.id));

        tabla.appendChild(fila);
    });
}


// ===============================
// AGREGAR PRODUCTO
// ===============================
function agregarProducto() {
    const producto = {
        Nombre: document.getElementById("nombre").value,
        Categoria: document.getElementById("categoria").value,
        Descripcion: document.getElementById("descripcion").value,
        Proveedor: document.getElementById("proveedor").value,
        Precio: document.getElementById("precio").value,
        Stock: document.getElementById("stock").value
    };

    // Validación
    for (let key in producto) {
        if (!producto[key]) {
            toast("Todos los campos son obligatorios ❗", "error");
            return;
        }
    }

    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(producto)
    })
    .then(res => res.json())
    .then(() => {
        toast("Producto agregado ✔", "success");
        obtenerProductos();
    })
    .catch(err => console.error("Error agregando producto:", err));
}

// ===============================
// ELIMINAR PRODUCTO
// ===============================
let idEliminar = null;

function eliminarProducto(id) {
    idEliminar = id;
    document.getElementById("modalConfirm").style.display = "flex";
}

function cerrarConfirm() {
    document.getElementById("modalConfirm").style.display = "none";
}

document.getElementById("btnConfirmarEliminar").addEventListener("click", () => {
    fetch(`${API_URL}/${idEliminar}`, { method: "DELETE" })
        .then(res => res.json())
        .then(() => {
            toast("Producto eliminado", "delete");
            cerrarConfirm();
            obtenerProductos();
        })
        .catch(() => toast("Error eliminando", "error"));
});

// ===============================
// MOSTRAR DETALLES
// ===============================
function mostrarDetalles(id) {
    fetch(API_URL)
        .then(res => res.json())
        .then(productos => {
            const p = productos.find(x => x.id === id);

            document.getElementById("infoDetalles").innerHTML = `
                <p><strong>Nombre:</strong> ${p.Nombre}</p>
                <p><strong>Categoría:</strong> ${p.Categoria}</p>
                <p><strong>Descripción:</strong> ${p.Descripcion}</p>
                <p><strong>Proveedor:</strong> ${p.Proveedor}</p>
                <p><strong>Precio:</strong> $${p.Precio}</p>
                <p><strong>Stock:</strong> ${p.Stock}</p>
            `;

            document.getElementById("modalDetalles").style.display = "flex";
        });
}

function cerrarDetalles() {
    document.getElementById("modalDetalles").style.display = "none";
}

// ===============================
// EDITAR PRODUCTO
// ===============================
let idEditando = null;

function mostrarEditar(id) {
    fetch(API_URL)
        .then(res => res.json())
        .then(productos => {
            const p = productos.find(x => x.id === id);
            idEditando = id;

            document.getElementById("editNombre").value = p.Nombre;
            document.getElementById("editCategoria").value = p.Categoria;
            document.getElementById("editDescripcion").value = p.Descripcion;
            document.getElementById("editProveedor").value = p.Proveedor;
            document.getElementById("editPrecio").value = p.Precio;
            document.getElementById("editStock").value = p.Stock;

            document.getElementById("modalEditar").style.display = "flex";
        });
}

function cerrarModal() {
    document.getElementById("modalEditar").style.display = "none";
}

document.getElementById("btnGuardar").addEventListener("click", () => {
    const productoActualizado = {
        Nombre: document.getElementById("editNombre").value,
        Categoria: document.getElementById("editCategoria").value,
        Descripcion: document.getElementById("editDescripcion").value,
        Proveedor: document.getElementById("editProveedor").value,
        Precio: document.getElementById("editPrecio").value,
        Stock: document.getElementById("editStock").value
    };

    actualizarProducto(idEditando, productoActualizado);
});

function actualizarProducto(id, productoActualizado) {
    fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productoActualizado)
    })
    .then(res => res.json())
    .then(() => {
        toast("Producto actualizado", "update");
        cerrarModal();
        obtenerProductos();
    })
    .catch(err => console.error("Error actualizando producto:", err));
}

// ===============================
// TOAST
// ===============================
function toast(msg, type = "success") {
    const t = document.getElementById("toast");
    t.className = "toast";
    t.classList.add(type);
    t.innerHTML = msg;
    t.classList.add("show");

    setTimeout(() => {
        t.classList.remove("show");
    }, 2500);
}

// ===============================
// CARGAR LISTA DE PROVEEDORES
// ===============================
function cargarProveedores() {
    fetch(API_PROVEEDORES)
        .then(res => res.json())
        .then(data => {
            const selectAdd = document.getElementById("proveedor");
            const selectEdit = document.getElementById("editProveedor");

            // limpia selects
            selectAdd.innerHTML = "";
            selectEdit.innerHTML = "";

            // opción por defecto
            const defaultOptionAdd = document.createElement("option");
            defaultOptionAdd.value = "";
            defaultOptionAdd.textContent = "Selecciona un proveedor";
            selectAdd.appendChild(defaultOptionAdd);

            const defaultOptionEdit = document.createElement("option");
            defaultOptionEdit.value = "";
            defaultOptionEdit.textContent = "Selecciona un proveedor";
            selectEdit.appendChild(defaultOptionEdit);

            // agregar proveedores
            data.forEach(p => {
                const optAdd = document.createElement("option");
                optAdd.value = p.nombre;
                optAdd.textContent = p.nombre;
                selectAdd.appendChild(optAdd);

                const optEdit = document.createElement("option");
                optEdit.value = p.nombre;
                optEdit.textContent = p.nombre;
                selectEdit.appendChild(optEdit);
            });
        })
        .catch(err => console.error("Error cargando proveedores:", err));
}
