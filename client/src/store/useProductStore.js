import { create } from "zustand"
import axios from "axios"
import toast from "react-hot-toast"

//dinamica dependiendo de si esta en desarollo o en produccion
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : ""

export const useProductStore = create((set, get) => ({
    //products state
    products: [],
    loading: false,
    error: null,
    currentProduct: null,

    //form state
    formData: {
        name: "",
        price: "",
        image: "",
    },

    //agragar producto
    setFormData: (formData) => set({ formData }),
    resetForm: () => set({ formData: { name: "", price: "", image: "" } }),

    addProduct: async (e) => {
        e.preventDefault()
        set({ loading: true })

        try {
            const { formData } = get()
            await axios.post(`${BASE_URL}/api/products`, formData)
            await get().fetchProducts()
            get().resetForm()
            //cerra el modal
            document.getElementById("add_product_modal").close()
            toast.success("Product added successfully")

        } catch (error) {
            console.log("error trying to add a new product", error)
            toast.error("oops, something went wrong..!!!")
        }
    },

    fetchProducts: async () => {
        set({ loading: true })
        try {
            const response = await axios.get(`${BASE_URL}/api/products`)
            set({ products: response.data.data || response.data, error: null })
        } catch (err) {
            if (err.status == 429) set({ error: "too many request", products: [] })
            else set({ error: "something went wrong", products: [] })
        } finally {
            set({ loading: false })
        }
    },

    deleteProduct: async (id) => {
        console.log("delete product function called", id)
        set({ loading: true })
        try {
            await axios.delete(`${BASE_URL}/api/products/${id}`)
            console.log("test", id)
            set((prev) => ({ products: prev.products.filter((product) => product.id !== id) }))
            console.log("test 2", id)
            toast.success("Product deleted successfully")
        } catch (error) {
            console.log("Error deleting function", error)
            toast.error("Error deleting product")
        } finally {
            set({ loading: false })
        }
    },

    /* fetchProduct: async (id) => {
        set({ loading: true })
        try {
            const response = await axios.get(`${BASE_URL}/api/products/${id}`)
            console.log("test id", id)
            set({
                currentProduct: response.data.data,
                formData: response.data.data,
                error: null,
            })
            console.log(currentProduct)
            console.log(formData)
        } catch (error) {
            console.log("Error in fetch one product", error)
            set({ error: "Something went wrong", currentProduct: null })
        } finally {
            set({ loading: false })
        }
    }, */

    fetchProduct: async (id) => {
        set({ loading: true })
        console.log("test ID", id)
        try {
            const response = await axios.get(`${BASE_URL}/api/products/${id}`)
            const productData = response.data.data || response.data
            
            set({
                currentProduct: productData,
                formData: productData,
                error: null,
            })
        } catch (error) {
            console.log("Error in fetchProduct", error)
            set({ error: "something went wrong", currentProduct: null })
        } finally {
            set({ loading: false })
        }
    },

    updateProduct: async (id) => {
        set({ loading: true })
        try {
            const { formData } = get()
            const response = await axios.put(`${BASE_URL}/api/products/${id}`, formData)
            set({ currentProduct: response.data.data || response.data })
            toast.success("Product updated successfully")
            console.log("updating completed")
            get().resetForm()
        } catch (error) {
            console.log("Error updating function", error)
            toast.error("Error updating product")
        } finally {
            set({ loading: false })
        }
    },
}))