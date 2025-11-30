import { useNavigate, useParams } from 'react-router-dom'
import { useProductStore } from "../store/useProductStore"
import { useEffect } from 'react'
import { ArrowLeftIcon, SaveIcon, Trash2Icon } from 'lucide-react'

function ProductPage() {
  const {
    currentProduct,
    formData,
    setFormData,
    loading,
    error,
    fetchProduct,
    updateProduct,
    deleteProduct,
    resetForm,
  } = useProductStore()
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    fetchProduct(id)
  }, [fetchProduct, id])

  console.log("currentProduct:", currentProduct)

  const handleDelete = async () => {
    if (window.confirm("youre going to delete this item, please conirm...!!!")) {
      await deleteProduct(id)
      navigate("/")
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="loading loading-spinner loading-lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-error">{error}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button onClick={() => { resetForm(); navigate("/"); }} className="btn btn-ghost mb-8">
        <ArrowLeftIcon className="size-4 mr-2" />
        Back to Products --
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* product image */}
        <div className="rounded-lg overflow-hidden shadow-lg bg-base-100">
          <img
            src={currentProduct?.image}
            alt={currentProduct?.name}
            className='size-full object-cover' />
        </div>

        {/* product form */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="card-title text-2xl mb-6">Edit</div>

            <form onSubmit={(e) => {
              e.preventDefault();
              updateProduct(id)
              navigate("/")
            }}
              className='space-y-6'
            >
              {/* name */}
              <div className="form-control">
                <label className='label'>
                  <span className='label-text text-base font-medium'>Name</span>
                </label>
                <input
                  type="text"
                  placeholder='Type product Name'
                  className='input input-bordered w-full'
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>

              {/* price */}
              <div className="form-control">
                <label className='label'>
                  <span className='label-text text-base font-medium'>Price</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder='0.00'
                  className='input input-bordered w-full'
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
              </div>

              {/* form actions */}
              <div className="flex justify-between mt-8">
                <button type='button' onClick={handleDelete} className='btn btn-error'>
                  <Trash2Icon className='size-4 mr-2' />
                  Delete
                </button>
                <button
                  type="submit"
                  className="btn btn-primary min-w-[120px]"
                  disabled={loading || !formData.name || !formData.price || !formData.image}
                >
                  {
                    loading ? (
                      <span className="loading loading-spinner loading-sm" />
                    ) : (
                      <>
                        <SaveIcon className="size-5 mr-2" />
                        Save
                      </>
                    )
                  }
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>

    </div>
  )
}

export default ProductPage;