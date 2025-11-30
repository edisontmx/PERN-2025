import express from "express";
import dotenv from "dotenv";

console.log('=== PASO 1: Cargando dotenv ===');
dotenv.config();
console.log('dotenv cargado correctamente');

const app = express();
const PORT = process.env.PORT || 3000;

console.log('=== PASO 2: Express inicializado ===');

app.get("/", (req, res) => {
    res.send("Debug server funcionando");
});

console.log('=== PASO 3: Iniciando servidor ===');

app.listen(PORT, () => {
    console.log(`Debug server corriendo en puerto ${PORT}`);
});

console.log('=== PASO 4: Servidor configurado ===');