import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import path from "path"

import productRoutes from "./routes/productRoutes.js"
import { sql } from "./config/db.js";
import { aj } from "./lib/arcjet.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

//middlewares
app.use(express.json())
app.use(cors())
app.use(helmet({
    contentSecurityPolicy: false
}))
/* app.use(helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
        "img-src": ["'self'", "https", 
            "data:"
        ]
    }
})
) */
app.use(morgan("dev"))

//aplicar el rate limit
app.use(async (req, res, next) => {
    try {
        const decision = await aj.protect(req, {
            requested: 1
        })

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                res.status(429).json({
                    error: "too many request"
                })
            } else if (decision.reason.isBot()) {
                res.status(403).json({ error: "Bot access denied" })
            } else {
                res.status(403).json({ error: "Forbidden" })
            }
            return
        }
        next()
    } catch (error) {
        console.error('Error en rate limiting:', error)
        next()
    }
})

app.use("/api/products", productRoutes)

app.get("/api", (req, res) => {
    console.log(res.getHeaders())
    res.send("Hello from the backend");
})

// Servir archivos estáticos en producción
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/client/dist")))

    app.get("/{*any}", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"))
    })
}

async function initDB() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                image VARCHAR(255) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        console.log("db iniciada correctamente")
    } catch (error) {
        console.log("error en la funcion initDB", error)
    }
}

initDB().then(() => {
    // Ruta catch-all para SPA - antes de iniciar el servidor
    if (process.env.NODE_ENV === "production") {
        app.use((req, res, next) => {
            // Solo servir index.html para rutas que no son API ni archivos estáticos
            if (!req.path.startsWith('/api') && !req.path.includes('.')) {
                res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"))
            } else {
                next()
            }
        })
    }
    
    app.listen(PORT, () => {
        console.log("server is running on port", PORT)
    })
}).catch(error => {
    console.error('Error iniciando servidor:', error)
    process.exit(1)
})




