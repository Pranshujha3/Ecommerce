import React, { useState } from 'react'
import EditProductAdmin from './EditProductAdmin'
import CofirmBox from './CofirmBox'
import { IoClose } from 'react-icons/io5'
import SummaryApi from '../common/summaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import toast from 'react-hot-toast'

const ProductCardAdmin = ({ data, fetchProductData }) => {
  const [editOpen, setEditOpen] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)

  const handleDeleteCancel = () => {
    setOpenDelete(false)
  }

  const handleDelete = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteProduct,
        data: {
          _id: data._id
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        toast.success(responseData.message)
        if (fetchProductData) {
          fetchProductData()
        }
        setOpenDelete(false)
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  return (
    <div className='w-full min-w-36 p-4 bg-white rounded shadow-sm border border-gray-100 flex flex-col justify-between'>
      <div>
        <div className='h-32 w-full flex justify-center items-center'>
          <img
            src={data?.image[0]}
            alt={data?.name}
            className='w-full h-full object-scale-down'
          />
        </div>

        {/* --- AI TAGS SECTION --- */}
        <div className='flex flex-wrap gap-1 mt-3 h-10 overflow-hidden'>
          {data?.tags && data?.tags.length > 0 ? (
            data.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className='text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100 uppercase'
              >
                {tag}
              </span>
            ))
          ) : (
            <span className='text-[9px] text-gray-300 italic'>Untagged</span>
          )}
        </div>
        {/* ----------------------- */}

        <p className='text-ellipsis line-clamp-2 font-medium mt-1'>{data?.name}</p>
        <p className='text-slate-400 text-xs'>{data?.unit}</p>
      </div>

      <div className='grid grid-cols-2 gap-3 py-2 mt-2'>
        <button onClick={() => setEditOpen(true)} className='border px-1 py-1 text-sm border-green-600 bg-green-100 text-green-800 hover:bg-green-200 rounded'>Edit</button>
        <button onClick={() => setOpenDelete(true)} className='border px-1 py-1 text-sm border-red-600 bg-red-100 text-red-600 hover:bg-red-200 rounded'>Delete</button>
      </div>

      {
        editOpen && (
          <EditProductAdmin fetchProductData={fetchProductData} data={data} close={() => setEditOpen(false)} />
        )
      }

      {
        openDelete && (
          <section className='fixed top-0 left-0 right-0 bottom-0 bg-neutral-600 z-50 bg-opacity-70 p-4 flex justify-center items-center '>
            <div className='bg-white p-4 w-full max-w-md rounded-md'>
              <div className='flex items-center justify-between gap-4'>
                <h3 className='font-semibold'>Permanent Delete</h3>
                <button onClick={() => setOpenDelete(false)}>
                  <IoClose size={25} />
                </button>
              </div>
              <p className='my-2'>Are you sure want to delete permanent ?</p>
              <div className='flex justify-end gap-5 py-4'>
                <button onClick={handleDeleteCancel} className='border px-3 py-1 rounded bg-red-100 border-red-500 text-red-500 hover:bg-red-200'>Cancel</button>
                <button onClick={handleDelete} className='border px-3 py-1 rounded bg-green-100 border-green-500 text-green-500 hover:bg-green-200'>Delete</button>
              </div>
            </div>
          </section>
        )
      }
    </div>
  )
}

export default ProductCardAdmin