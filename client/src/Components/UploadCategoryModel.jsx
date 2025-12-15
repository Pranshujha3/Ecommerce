import React, { useState } from 'react'
import { IoClose } from "react-icons/io5";
import Axios from '../utils/Axios';
import SummaryApi from '../common/summaryApi';
import toast from 'react-hot-toast';
import uploadImage from '../utils/UploadImage';

const UploadCategoryModel = ({ close, fetchData }) => {
    const [data, setData] = useState({
        name: "",
        image: ""
    })
    const [loading, setLoading] = useState(false)

    const handleOnChange = (e) => {
        const { name, value } = e.target
        setData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    const handleUploadCategory = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        const response = await uploadImage(file)
        const { data: ImageResponse } = response
        
        setData((prev) => {
            return {
                ...prev,
                image: ImageResponse.data.url
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.addCategory,
                data: data
            })
            const { data: responseData } = response

            if (responseData.success) {
                toast.success(responseData.message)
                close()
                fetchData()
            }
        } catch (error) {
            toast.error(error?.response?.data?.message)
        } finally {
            setLoading(false)
        }
    }

    // THIS SECTION (fixed, z-50) IS WHAT MAKES IT A POPUP
    return (
        <section className='fixed top-0 bottom-0 left-0 right-0 p-4 bg-neutral-800 bg-opacity-60 z-50 flex items-center justify-center'>
            <div className='bg-white max-w-3xl w-full p-4 rounded shadow-lg'>
                
                {/* Header */}
                <div className='flex items-center justify-between'>
                    <h1 className='font-semibold'>Add Category</h1>
                    <button onClick={close} className='hover:text-red-600 w-fit block'>
                        <IoClose size={25} />
                    </button>
                </div>

                {/* Form */}
                <form className='my-3 grid gap-2' onSubmit={handleSubmit}>
                    <div className='grid gap-1'>
                        <label id='categoryName'>Name</label>
                        <input
                            type='text'
                            id='categoryName'
                            placeholder='Enter category name'
                            value={data.name}
                            name='name'
                            onChange={handleOnChange}
                            className='bg-blue-50 p-2 border border-blue-100 focus-within:border-primary-200 outline-none rounded'
                        />
                    </div>
                    
                    <div className='grid gap-1'>
                        <label id='categoryImage'>Image</label>
                        <div className='flex gap-4 flex-col lg:flex-row items-center'>
                            <div className='border bg-blue-50 h-36 w-full lg:w-36 flex items-center justify-center rounded'>
                                {
                                    data.image ? (
                                        <img
                                            src={data.image}
                                            alt='category'
                                            className='h-full w-full object-scale-down'
                                        />
                                    ) : (
                                        <p className='text-sm text-neutral-500'>No Image</p>
                                    )
                                }
                            </div>
                            <label htmlFor='uploadImage' className='border bg-primary-200 hover:bg-primary-100 px-4 py-2 rounded cursor-pointer border-primary-100 font-medium'>
                                Upload Image
                            </label>
                            <input disabled={!data.name} onChange={handleUploadCategory} type='file' id='uploadImage' className='hidden' />
                        </div>
                    </div>

                    <button
                        className={`
                        ${data.name && data.image ? "bg-primary-200 hover:bg-primary-100" : "bg-gray-200"}
                        px-4 py-2 font-semibold
                        `}
                    >
                        Add Category
                    </button>
                </form>

            </div>
        </section>
    )
}

export default UploadCategoryModel