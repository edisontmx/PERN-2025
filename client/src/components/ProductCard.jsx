import { EditIcon, TrashIcon } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useProductStore } from '../store/useProductStore'

function ProductCard({ product }) {
    const { deleteProduct } = useProductStore()
    const navigate = useNavigate()

    const handleDelete = async () => {
        if (window.confirm("youre going to delete this item, please confirm...!!!")) {
            await deleteProduct(product.id)
            navigate("/")
        }
    }


    return <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">

        {/* imagen del producto */}
        <figure className='relative pt-[56.25%]'>
            <img
                src={product.image}
                alt={product.name}
                className='absolute top-0 w-full h-full object-cover' />

        </figure>

        <div className="card-body">
            {/* informacion del producto */}
            <h2 className='card-title text-lg font-semibold'>{product.name}</h2>
            <p className='text-2xl font-bold text-primary '>${Number(product.price).toFixed(2)}</p>
            {/* funciones */}
            <div className="card-actions justify-end mt-4">
                <Link to={`/product/${product.id}`} className='btn btn-sm btn-info btn-outline'>
                    <EditIcon className="size-4" />
                </Link>
                <button
                    className='btn btn-sm btn-error btn-outline'
                    onClick={handleDelete}>
                    <TrashIcon className='size-4' />
                </button>
                {/* <button
                    className='btn btn-sm btn-error btn-outline'
                    onClick={() => deleteProduct(product.id)}>
                    <TrashIcon className='size-4' />
                </button> */}
            </div>

        </div>

    </div>
}



export default ProductCard