import { sql } from "../config/db.js"

export const getProducts = async (req, res) => {

    try {
        const products = await sql`
        SELECT * FROM products
        ORDER BY created_at DESC
        `;
        console.log("products", products)
        res.status(200).json({ success: true, data: products })
    } catch (error) {
        console.log("error de funcion getProducts", error)
        res.status(500), json({ success: false, message: "Error obteniendo productos" })
    }
}
export const createProduct = async (req, res) => {
    const { name, price, image } = req.body

    if (!name || !price || !image) {
        return res.status(400).json({ success: false, message: "Alguno de los campos no existe" })
    }
    try {
        const newProduct = await sql`
        INSERT INTO products (name, price, image)
        VALUES (${name}, ${price}, ${image})
        RETURNING *
        `
        console.log("nuevo producto agregado", newProduct)
        res.status(201).json({ success: true, data: newProduct[0] })
    } catch (error) {
        console.log("error de funcion", error)
        res.status(500).json({ success: false, message: "Error intentando agregar un producto" })
    }
}
export const getProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await sql`
        SELECT * FROM products WHERE id=${id}
        `
        res.status(200).json(product[0])
    } catch (error) {
        console.log("error de la funcion getProduct", error)
        res.status(500).json({ success: false, message: "error, no se pudo encontrar el producto" })
    }
}

export const editProduct = async (req, res) => {
    const { id } = req.params;
    const { name, price, image } = req.body;

    try {
        const updateProduct = await sql`
        UPDATE products
        SET name=${name}, price=${price}, image=${image}
        WHERE id=${id}
        RETURNING *
        `;

        if (updateProduct.length === 0) {
            return res.status(404).json({ success: false, message: "producto no encontrado" })
        }

        res.status(200).json({ success: true, data: updateProduct[0] })
    } catch (error) {
        console.log("error de la funcion editProduct", error)
        res.status(500).json({ succss: false, message: "error al editar el producto" })
    }
}
export const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedProduct = await sql`
        DELETE FROM products WHERE id=${id} RETURNING *
        `;
        if (deletedProduct.length === 0) {
            return res.status(404).json({
                success: false,
                message: "producto no encontrado"
            })

        }
        res.status(200).json({ success: true, message: "el producto ha sido borrado", data: deletedProduct[0] })
    } catch (error) {
        console.log("error", error)
        res.status(500).json({ success: false, message: "error al intentar borrar el producto" })
    }
}

