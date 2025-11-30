import express from "express";

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
    res.send("Server funcionando correctamente");
});

app.listen(PORT, () => {
    console.log(`Server corriendo en puerto ${PORT}`);
});

console.log("Servidor iniciado...");