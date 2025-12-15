import React, { useEffect, useState } from 'react'
import UploadCategoryModel from '../Components/UploadCategoryModel'
import Loading from '../Components/Loading'
import NoData from '../Components/NoData'
import Axios from '../utils/Axios'
import SummaryApi from '../common/summaryApi'
import EditCategory from '../Components/EditCategory'
import CofirmBox from '../Components/CofirmBox'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
// Import Icons for a modern look
import { IoAdd, IoPencil, IoTrashOutline } from "react-icons/io5";

const CategoryPage = () => {
    const [openUploadCategory, setOpenUploadCategory] = useState(false)
    const [loading, setLoading] = useState(false)
    const [categoryData, setCategoryData] = useState([])
    const [openEdit, setOpenEdit] = useState(false)
    const [editData, setEditData] = useState({
        name: "",
        image: "",
    })
    const [openConfimBoxDelete, setOpenConfirmBoxDelete] = useState(false)
    const [deleteCategory, setDeleteCategory] = useState({
        _id: ""
    })

    const fetchCategory = async () => {
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.getCategory
            })
            const { data: responseData } = response

            if (responseData.success) {
                setCategoryData(responseData.data)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCategory()
    }, [])

    const handleDeleteCategory = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.deleteCategory,
                data: deleteCategory
            })

            const { data: responseData } = response

            if (responseData.success) {
                toast.success(responseData.message)
                fetchCategory()
                setOpenConfirmBoxDelete(false)
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <section className='min-h-screen bg-[#38c5a4]'>
            {/* Header Section - Sticky & Glassmorphism */}
            <div className='sticky top-0 z-10 p-4 bg-white/80 backdrop-blur-md shadow-sm flex items-center justify-between mb-4'>
                <div>
                    <h2 className='font-bold text-2xl text-gray-800'>Categories</h2>
                    <p className='text-blue-600 '>Manage your product categories</p>
                </div>
                <button 
                    onClick={() => setOpenUploadCategory(true)} 
                    className='flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-lg transform active:scale-95'
                >
                    <IoAdd size={20}/>
                    <span>Add Category</span>
                </button>
            </div>

            {/* Loading & No Data Handling */}
            {loading && <Loading />}
            
            {!categoryData[0] && !loading && (
                <div className="flex items-center justify-center h-[50vh]">
                    <NoData />
                </div>
            )}

            {/* Main Grid Layout */}
            <div className='p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6'>
                {categoryData.map((category, index) => {
                    return (
                        <div 
                            className='group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 ease-in-out flex flex-col overflow-hidden hover:-translate-y-1' 
                            key={category._id}
                        >
                            {/* Image Container with Hover Zoom */}
                            <div className='h-36 w-full bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden'>
                                <img
                                    alt={category.name}
                                    src={category.image}
                                    className='h-full w-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500'
                                />
                            </div>

                            {/* Content Section */}
                            <div className='p-3 flex flex-col flex-1'>
                                <div className='font-semibold text-gray-800 text-base mb-3 truncate capitalize tracking-wide text-center'>
                                    {category.name}
                                </div>
                                
                                {/* Action Buttons - Styled as a pill row */}
                                <div className='mt-auto flex gap-3 justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                                    <button 
                                        onClick={() => {
                                            setOpenEdit(true)
                                            setEditData(category)
                                        }} 
                                        className='p-2 bg-green-100 hover:bg-green-500 text-green-600 hover:text-white rounded-full transition-colors shadow-sm'
                                        title="Edit"
                                    >
                                        <IoPencil size={18} />
                                    </button>
                                    
                                    <button 
                                        onClick={() => {
                                            setOpenConfirmBoxDelete(true)
                                            setDeleteCategory(category)
                                        }} 
                                        className='p-2 bg-red-100 hover:bg-red-500 text-red-600 hover:text-white rounded-full transition-colors shadow-sm'
                                        title="Delete"
                                    >
                                        <IoTrashOutline size={18} />
                                    </button>
                                </div>
                                
                                {/* Mobile View: Buttons always visible on mobile, hidden on desktop until hover? 
                                    (Currently set to hover only for clean look. Remove 'opacity-0 group-hover:opacity-100' if you want them always visible) 
                                */}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Modals */}
            {openUploadCategory && (
                <UploadCategoryModel fetchData={fetchCategory} close={() => setOpenUploadCategory(false)} />
            )}

            {openEdit && (
                <EditCategory data={editData} close={() => setOpenEdit(false)} fetchData={fetchCategory} />
            )}

            {openConfimBoxDelete && (
                <CofirmBox close={() => setOpenConfirmBoxDelete(false)} cancel={() => setOpenConfirmBoxDelete(false)} confirm={handleDeleteCategory} />
            )}
        </section>
    )
}

export default CategoryPage

//resolved error