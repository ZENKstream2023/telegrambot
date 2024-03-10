"use strict";
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const bot = require('./controllers/bot');
const port = process.env.PORT || 3900;

app.use(bodyParser.json());

const routes = require("./routes/routes");
app.use((req, res, next) => {
    console.log(req.body); // Agrega este registro
    bodyParser.json()(req, res, next);
});
// Rutas
app.use("/api", routes);

// Conectar a la base de datos
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Conexión a la base de datos establecida correctamente");
        // Iniciar el servidor
        app.listen(port, () => {
            console.log(`Servidor corriendo en vercel`);
        });
    })
    .catch((error) => {
        console.error("Error al conectar a la base de datos:", error.message);
    });

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Error interno del servidor");
});