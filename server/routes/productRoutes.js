import express from "express";
import { createProduct, deleteProduct, editProduct, getProduct, getProducts } from "../controllers/productController.js";

const router = express.Router();

//lista de productos
router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", createProduct);
router.put("/:id", editProduct);
router.delete("/:id", deleteProduct);

export default router;

