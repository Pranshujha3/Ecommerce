
import React, { useState, useEffect } from 'react'
import { FaCloudUploadAlt, FaPlus } from "react-icons/fa";
import uploadImage from '../utils/UploadImage';
import Loading from '../components/Loading';
import ViewImage from '../components/ViewImage';
import { MdDelete, MdOutlineCancel } from "react-icons/md";
import { useSelector } from 'react-redux'
import AddFieldComponent from '../components/AddFieldComponent';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import successAlert from '../utils/SuccessAlert';

const UploadProduct = () => {
  const [data,setData] = useState({
      name : "",
      image : [],
      category : [],
      subCategory : [],
      unit : "",
      stock : "",
      price : "",
      discount : "",
      description : "",
      more_details : {},
  })
  const [imageLoading,setImageLoading] = useState(false)
  const [ViewImageURL,setViewImageURL] = useState("")
  
  const allCategory = useSelector(state => state.product.allCategory)
  const allSubCategory = useSelector(state => state.product.allSubCategory)
  
  const [selectCategory,setSelectCategory] = useState("")
  const [selectSubCategory,setSelectSubCategory] = useState("")
  const [sortBySubCategory, setSortBySubCategory] = useState([]) 

  const [openAddField,setOpenAddField] = useState(false)
  const [fieldName,setFieldName] = useState("")

  useEffect(()=>{
      if(data.category.length > 0){
        const filtered = allSubCategory.filter(sub => {
            return sub.category.some(c => {
               return data.category.some(el => el._id === c._id)
            })
        })
        setSortBySubCategory(filtered)
      } else {
        setSortBySubCategory([])
      }
  },[data.category, allSubCategory])

  const handleChange = (e)=>{
    const { name, value} = e.target 
    setData((preve)=>{
      return{
          ...preve,
          [name]  : value
      }
    })
  }

  const handleUploadImage = async(e)=>{
    const file = e.target.files[0]
    if(!file){
      return 
    }
    setImageLoading(true)
    const response = await uploadImage(file)
    const { data : ImageResponse } = response
    const imageUrl = ImageResponse.data.url 

    setData((preve)=>{
      return{
        ...preve,
        image : [...preve.image,imageUrl]
      }
    })
    setImageLoading(false)
  }

  const handleDeleteImage = async(index)=>{
      data.image.splice(index,1)
      setData((preve)=>{
        return{ ...preve }
      })
  }

  const handleRemoveCategory = async(index)=>{
    data.category.splice(index,1)
    setData((preve)=>{
      return{ ...preve }
    })
  }
  
  const handleRemoveSubCategory = async(index)=>{
      data.subCategory.splice(index,1)
      setData((preve)=>{
        return{ ...preve }
      })
  }

  const handleAddField = ()=>{
    setData((preve)=>{
      return{
          ...preve,
          more_details : {
            ...preve.more_details,
            [fieldName] : ""
          }
      }
    })
    setFieldName("")
    setOpenAddField(false)
  }

  const handleSubmit = async(e)=>{
    e.preventDefault()
    try {
      const response = await Axios({
          ...SummaryApi.createProduct,
          data : data
      })
      const { data : responseData} = response

      if(responseData.success){
          successAlert(responseData.message)
          setData({
            name : "",
            image : [],
            category : [],
            subCategory : [],
            unit : "",
            stock : "",
            price : "",
            discount : "",
            description : "",
            more_details : {},
          })
      }
    } catch (error) {
        AxiosToastError(error)
    }
  }

  // Standard input styling class
  const inputStyle = "w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all bg-white text-gray-700 placeholder-gray-400";
  const labelStyle = "font-semibold text-gray-700 mb-2 block";

  return (
    <section className='bg-green-200 min-h-screen py-8 px-4'>
        <div className='container mx-auto max-w-4xl'>
            
            {/* Header Card */}
            <div className='bg-green-50 shadow-lg rounded-xl overflow-hidden mb-6'>
                <div className='px-8 py-6 border-b border-gray-100'>
                    <h2 className='text-2xl font-bold text-gray-800'>Upload New Product</h2>
                    <p className='text-sm text-gray-500 mt-1'>Add details about your product to start selling.</p>
                </div>

                <div className='p-8'>
                    <form className='grid gap-8' onSubmit={handleSubmit}>
                        
                        {/* --- Basic Information Section --- */}
                        <div className='grid gap-6'>
                            <div className='grid gap-2'>
                              <label htmlFor='name' className={labelStyle}>Product Name</label>
                              <input 
                                id='name' type='text' placeholder='e.g., Organic Fresh Milk' name='name'
                                value={data.name} onChange={handleChange} required
                                className={inputStyle}
                              />
                            </div>
                            <div className='grid gap-2'>
                              <label htmlFor='description' className={labelStyle}>Description</label>
                              <textarea 
                                id='description' placeholder='Enter detailed product description...' name='description'
                                value={data.description} onChange={handleChange} required multiple rows={4}
                                className={`${inputStyle} resize-none`}
                              />
                            </div>
                        </div>

                        {/* --- Media Section --- */}
                        <div>
                            <p className={labelStyle}>Product Images</p>
                            <div className="mt-2">
                              <label htmlFor='productImage' className='border-2 border-dashed border-gray-300 hover:border-green-500 bg-gray-50 hover:bg-green-50 transition-all rounded-xl h-32 flex justify-center items-center cursor-pointer'>
                                  <div className='text-center flex justify-center items-center flex-col text-gray-500'>
                                    { imageLoading ?  <Loading/> : (
                                        <>
                                          <FaCloudUploadAlt size={40} className="mb-2 text-green-500"/>
                                          <p className="font-medium">Click to upload or drag & drop</p>
                                          <p className="text-xs">SVG, PNG, JPG (Max 800x400px)</p>
                                        </>
                                      )}
                                  </div>
                                  <input type='file' id='productImage' className='hidden' accept='image/*' onChange={handleUploadImage}/>
                              </label>
                              
                              {/* Image Thumbnails */}
                              {data.image.length > 0 && (
                                <div className='flex flex-wrap gap-4 mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200'>
                                  {data.image.map((img,index) =>(
                                      <div key={img+index} className='h-24 w-24 bg-white border border-gray-200 rounded-lg relative group shadow-sm overflow-hidden'>
                                        <img
                                          src={img} alt={img} className='w-full h-full object-cover cursor-pointer' 
                                          onClick={()=>setViewImageURL(img)}
                                        />
                                        <div onClick={()=>handleDeleteImage(index)} className='absolute top-1 right-1 p-1 bg-white/80 hover:bg-red-100 text-gray-600 hover:text-red-600 rounded-full transition-all cursor-pointer shadow-sm'>
                                          <MdDelete size={18}/>
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              )}
                            </div>
                        </div>

                        {/* --- Organization Section (Category & Sub) --- */}
                        <div className='grid md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-xl border border-gray-200'>
                             {/* CATEGORY */}
                            <div className='grid gap-2'>
                              <label className={labelStyle}>Category</label>
                              <select className={inputStyle} value={selectCategory}
                                onChange={(e)=>{
                                  const value = e.target.value 
                                  const category = allCategory.find(el => el._id === value )
                                  if(category) {
                                    setData((preve)=>({ ...preve, category : [...preve.category,category] }))
                                    setSelectCategory("")
                                  }
                                }}
                              >
                                <option value={""}>Select Category</option>
                                {allCategory.map((c)=>( <option value={c?._id} key={c._id}>{c.name}</option> ))}
                              </select>
                              <div className='flex flex-wrap gap-2 mt-2'>
                                {data.category.map((c,index)=>(
                                    <div key={c._id+index} className='flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium border border-green-200'>
                                      <p>{c.name}</p>
                                      <MdOutlineCancel size={18} className="cursor-pointer hover:text-green-900" onClick={()=>handleRemoveCategory(index)}/>
                                    </div>
                                  ))}
                              </div>
                            </div>

                             {/* SUB CATEGORY */}
                            <div className='grid gap-2'>
                              <label className={labelStyle}>Sub Category</label>
                                <select className={inputStyle} value={selectSubCategory}
                                  onChange={(e)=>{
                                    const value = e.target.value 
                                    const subCategory = allSubCategory.find(el => el._id === value )
                                    if(subCategory){
                                        setData((preve)=>({ ...preve, subCategory : [...preve.subCategory,subCategory] }))
                                        setSelectSubCategory("")
                                    }
                                  }}
                                  disabled={sortBySubCategory.length === 0}
                                >
                                  <option value={""} className='text-neutral-600'>
                                      {sortBySubCategory.length === 0 ? "Select Category first" : "Select Sub Category"}
                                  </option>
                                  {sortBySubCategory.map((c)=>( <option value={c?._id} key={c._id}>{c.name}</option> ))}
                                </select>
                                <div className='flex flex-wrap gap-2 mt-2'>
                                  {data.subCategory.map((c,index)=>(
                                      <div key={c._id+index} className='flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium border border-blue-200'>
                                        <p>{c.name}</p>
                                        <MdOutlineCancel size={18} className="cursor-pointer hover:text-blue-900" onClick={()=>handleRemoveSubCategory(index)}/>
                                      </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* --- Pricing & Inventory Section --- */}
                        <div className='grid md:grid-cols-2 gap-6'>
                             {/* Unit & Stock */}
                            <div className='grid gap-2'>
                              <label htmlFor='unit' className={labelStyle}>Unit</label>
                              <input id='unit' type='text' placeholder='e.g., 1 L, 500g, 1 Packet' name='unit' value={data.unit} onChange={handleChange} required className={inputStyle} />
                            </div>
                            <div className='grid gap-2'>
                              <label htmlFor='stock' className={labelStyle}>Stock Quantity</label>
                              <input id='stock' type='number' placeholder='e.g., 100' name='stock' value={data.stock} onChange={handleChange} required className={inputStyle} />
                            </div>

                             {/* Price & Discount */}
                            <div className='grid gap-2'>
                              <label htmlFor='price' className={labelStyle}>Price (₹)</label>
                              <input id='price' type='number' placeholder='0.00' name='price' value={data.price} onChange={handleChange} required className={inputStyle} />
                            </div>
                            <div className='grid gap-2'>
                              <label htmlFor='discount' className={labelStyle}>Discount (%)</label>
                              <input id='discount' type='number' placeholder='0' name='discount' value={data.discount} onChange={handleChange} required className={inputStyle} />
                            </div>
                        </div>


                        {/* --- Dynamic Fields Section --- */}
                        {Object.keys(data?.more_details).length > 0 && (
                             <div className='p-6 bg-gray-50 rounded-xl border border-gray-200 grid md:grid-cols-2 gap-6'>
                                {Object?.keys(data?.more_details)?.map((k,index)=>{
                                    return(
                                      <div className='grid gap-2' key={k+index}>
                                        {/* FIXED LINE BELOW */}
                                        <label htmlFor={k} className={`${labelStyle} capitalize`}>{k.replace("_", " ")}</label>
                                        <input id={k} type='text' value={data?.more_details[k]} required className={inputStyle}
                                          onChange={(e)=>{
                                              const value = e.target.value 
                                              setData((preve)=>({ ...preve, more_details : { ...preve.more_details, [k] : value } }))
                                          }}
                                        />
                                      </div>
                                    )
                                })}
                            </div>
                        )}

                        {/* --- Form Actions --- */}
                        <div className='flex flex-col md:flex-row items-center gap-4 mt-4 pt-6 border-t border-gray-100'>
                            <button type="button" onClick={()=>setOpenAddField(true)} 
                                className='px-6 py-3 border-2 border-green-500 text-green-600 font-semibold rounded-lg flex items-center gap-2 hover:bg-green-50 transition-all w-full md:w-auto justify-center'
                            >
                              <FaPlus size={14}/> Add Custom Field
                            </button>

                            <button type="submit"
                              className='px-8 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all w-full md:w-auto md:ml-auto text-lg'
                            >
                              Upload Product
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        {/* Modals */}
        { ViewImageURL && (<ViewImage url={ViewImageURL} close={()=>setViewImageURL("")}/>) }
        { openAddField && (
            <AddFieldComponent 
              value={fieldName} onChange={(e)=>setFieldName(e.target.value)}
              submit={handleAddField} close={()=>setOpenAddField(false)} 
            />
          )
        }
    </section>
  )
}

export default UploadProduct;