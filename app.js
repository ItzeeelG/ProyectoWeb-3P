const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

// -----------------------------
// CONEXIÓN A MYSQL
// -----------------------------
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "tienda_web"
});

db.connect(err => {
    if (err) {
        console.error("Error conectando a MySQL:", err);
        return;
    }
    console.log("MySQL conectado ✔");
});

// -----------------------------
// SERVIR CARPETA PUBLIC
// -----------------------------
app.use(express.static(path.join(__dirname, "public")));

// Página principal
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "pagina_de_inicio.html"));
});

// -----------------------------
// GET PRODUCTOS
// -----------------------------
app.get("/productos", (req, res) => {
    db.query("SELECT * FROM productos", (err, rows) => {
        if (err) return res.status(500).json({ error: err });
        res.json(rows);
    });
});

// ==============================
// GET PROVEEDORES
// ==============================
app.get("/proveedores", (req, res) => {
    db.query("SELECT  nombre, telefono FROM proveedores", (err, rows) => {
        if (err) return res.status(500).json({ error: err });
        res.json(rows);
    });
});


// -----------------------------
// POST PRODUCTO
// -----------------------------
app.post("/productos", (req, res) => {
    const datos = req.body;
    db.query("INSERT INTO productos SET ?", datos, (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ msg: "Producto agregado", id: result.insertId });
    });
});

// -----------------------------
// DELETE PRODUCTO
app.delete("/productos/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM productos WHERE id = ?", [id], (err) => {
        if (err) return res.status(500).send(err);
        res.json({ msg: "Producto eliminado" });
    });
});

// PUT PRODUCTO
app.put("/productos/:id", (req, res) => {
    const { id } = req.params;
    const { Nombre, Categoria, Descripcion, Proveedor, Precio, Stock } = req.body;
    db.query(
        "UPDATE productos SET Nombre = ?, Categoria = ?, Descripcion = ?, Proveedor = ?, Precio = ?, Stock = ? WHERE id = ?",
        [Nombre, Categoria, Descripcion, Proveedor, Precio, Stock, id],
        (err) => {
            if (err) return res.status(500).send(err);
            res.json({ msg: "Producto actualizado" });
        }
    );
});


// -----------------------------
// POST PROVEEDOR
// -----------------------------
app.post("/proveedores", (req, res) => {
    const { nombre, telefono } = req.body;
    db.query("INSERT INTO proveedores (nombre, telefono) VALUES (?, ?)", [nombre, telefono], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ msg: "Proveedor agregado", id: result.insertId });
    });
});

// DELETE PROVEEDOR
app.delete("/proveedores/:nombre", (req, res) => {
    const nombre = req.params.nombre;
    db.query("DELETE FROM proveedores WHERE nombre = ?", [nombre], (err) => {
        if (err) return res.status(500).send(err);
        res.json({ msg: "Proveedor eliminado" });
    });
});

// PUT PROVEEDOR
app.put("/proveedores/:nombre", (req, res) => {
    const nombreOriginal = req.params.nombre; // nombre que vamos a actualizar
    const { nombre: nuevoNombre, telefono } = req.body;

    db.query(
        "UPDATE proveedores SET nombre = ?, telefono = ? WHERE nombre = ?",
        [nuevoNombre, telefono, nombreOriginal],
        (err) => {
            if (err) return res.status(500).send(err);
            res.json({ msg: "Proveedor actualizado" });
        }
    );
});



// -----------------------------
// INICIAR SERVIDOR
// -----------------------------
app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});
