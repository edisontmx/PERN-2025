import express from "express";

const app = express();
const PORT = 4000;

console.log('=== SERVIDOR INDEPENDIENTE INICIANDO ===');

app.get("/", (req, res) => {
    console.log('Petición recibida en /');
    res.json({ 
        message: "Servidor funcionando correctamente",
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

app.get("/test", (req, res) => {
    res.json({ status: "OK", test: "passed" });
});

const server = app.listen(PORT, () => {
    console.log(`=== SERVER CORRIENDO EN PUERTO ${PORT} ===`);
    console.log(`Visita: http://localhost:${PORT}`);
});

// Mantener el proceso vivo
setInterval(() => {
    console.log(`Server activo - Uptime: ${Math.floor(process.uptime())}s`);
}, 10000);

// Manejo de señales
process.on('SIGINT', () => {
    console.log('\n=== CERRANDO SERVIDOR ===');
    server.close(() => {
        console.log('Servidor cerrado correctamente');
        process.exit(0);
    });
});

console.log('=== CONFIGURACIÓN COMPLETADA ===');