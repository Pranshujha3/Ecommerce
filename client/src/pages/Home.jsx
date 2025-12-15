import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom' 
import Axios from '../utils/Axios'
import { useGlobalContext } from '../provider/GlobalProvider'
import toast from 'react-hot-toast'
import SummaryApi from '../common/summaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import { FaBoxOpen } from "react-icons/fa"; // Icon for empty state

// Import your banners
import banner from '../assets/banner.jpg'
import bannerMobile from '../assets/banner-mobile.jpg'
import CategoryWiseProductDisplay from '../Components/CategoryWiseProductDisplay'
import { valideURLConvert } from '../utils/valideURLConvert'

const Home = () => {
  const loadingCategory = useSelector(state => state.product.loadingCategory)
  const categoryData = useSelector(state => state.product.allCategory)
  const subCategoryData = useSelector(state => state.product.allSubCategory)
  
  const navigate = useNavigate()
  const location = useLocation() 
  const { fetchCartItem } = useGlobalContext()

  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  // 1. Handle Search Logic (API Call)
  const handleSearch = async (keyword) => {
    if (!keyword) {
        setSearchResults([])
        setIsSearching(false)
        return
    }

    setIsSearching(true)
    try {
      const response = await Axios.get(`/api/product/search-product?search=${keyword}`) 
      const actualData = response.data.data || response.data || []
      
      if (Array.isArray(actualData)) {
          setSearchResults(actualData)
      } else {
          setSearchResults([])
      }
    } catch (error) {
      console.error("Search error:", error)
      setSearchResults([])
    }
  }

  // 2. Watch URL for changes (Trigger Search)
  useEffect(() => {
      const urlParams = new URLSearchParams(location.search);
      const searchTerm = urlParams.get('search');

      if (searchTerm) {
          handleSearch(searchTerm);
      } else {
          setIsSearching(false);
          setSearchResults([]);
      }
  }, [location.search]); 

  // 3. Add to Cart Logic
  const handleAddToCart = async (e, id) => {
    e.stopPropagation()
    try {
      const response = await Axios({
        ...SummaryApi.addTocart, 
        data: { productId: id },
      })
      
      const { data: responseData } = response
      if (responseData.success) {
        toast.success(responseData.message)
        if (fetchCartItem) fetchCartItem()
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  // 4. Redirect Logic (Clicking a Category)
  const handleRedirectProductListpage = (id, cat) => {
    const subcategory = subCategoryData.find(sub => {
      const filterData = sub.category.some(c => c._id == id)
      return filterData ? true : null
    })
    const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(subcategory?.name || "all")}-${subcategory?._id}`
    navigate(url)
  }

  return (
    <section className='bg-gray-50 min-h-screen'>
      <div className='container mx-auto px-4 py-4'>
        
        {/* === CONDITION 1: SEARCH VIEW === */}
        {isSearching ? (
           <div className="bg-white p-6 rounded-xl shadow-sm min-h-[50vh]">
             <h2 className='text-xl font-bold mb-4 border-b pb-2 flex items-center gap-2'>
                Search Results <span className='text-sm font-normal text-gray-500'>({searchResults.length} items found)</span>
             </h2>

             {searchResults.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {searchResults.map((product) => (
                        <div key={product._id} className="border border-gray-100 p-4 rounded-xl shadow-sm hover:shadow-lg transition-all bg-white group">
                            <div className="w-full h-32 mb-3 overflow-hidden">
                                <img 
                                    src={product.image[0]} 
                                    alt={product.name} 
                                    className="w-full h-full object-scale-down transform group-hover:scale-110 transition-transform duration-300"
                                />
                            </div>
                            <p className="font-semibold text-sm line-clamp-2 h-10 mb-1">{product.name}</p>
                            <div className="flex justify-between items-center mt-2">
                                <p className="text-green-600 font-bold">₹{product.price}</p>
                                <button 
                                    className='bg-green-100 text-green-700 text-xs font-bold px-4 py-1.5 rounded-full hover:bg-green-600 hover:text-white transition-colors'
                                    onClick={(e) => handleAddToCart(e, product._id)}
                                >
                                    ADD
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
             ) : (
                <div className='flex flex-col items-center justify-center py-16 text-gray-400'>
                    <FaBoxOpen size={48} className="mb-4 opacity-50"/>
                    <p className='text-lg font-medium'>No products found matching your search.</p>
                    <button onClick={() => navigate('/')} className='mt-4 text-green-600 font-semibold hover:underline'>
                        Clear Search
                    </button>
                </div>
             )}
           </div>
        ) : (
             /* === CONDITION 2: DEFAULT HOME VIEW (Banners & Grid) === */
             <>
                {/* Hero Banner */}
                <div className={`w-full h-40 md:h-72 bg-gradient-to-r from-blue-100 to-blue-50 rounded-2xl overflow-hidden shadow-sm mb-8 ${!banner && "animate-pulse"}`}>
                  <img src={banner} className='w-full h-full object-cover hidden lg:block' alt='banner'/>
                  <img src={bannerMobile} className='w-full h-full object-cover lg:hidden' alt='banner'/>
                </div>

                {/* Shop By Category Title */}
                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-green-600 pl-3">
                    Shop by Category
                </h2>

                {/* Category Grid */}
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-10'>
                  {loadingCategory ? (
                      new Array(12).fill(null).map((_, index) => (
                          <div key={index + "loading"} className='bg-white rounded-xl p-4 h-36 border border-gray-100 shadow-sm animate-pulse'>
                            <div className='bg-gray-200 w-full h-20 rounded mb-2'></div>
                            <div className='bg-gray-200 h-4 w-3/4 mx-auto rounded'></div>
                          </div>
                      ))
                    ) : (
                      categoryData.map((cat) => (
                          <div 
                            key={cat._id} 
                            onClick={() => handleRedirectProductListpage(cat._id, cat.name)}
                            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center cursor-pointer hover:shadow-md hover:border-green-300 transition-all duration-300 group"
                          >
                            <div className="w-20 h-20 mb-3 transform group-hover:scale-110 transition-transform duration-300">
                                <img src={cat.image} alt={cat.name} className='w-full h-full object-scale-down'/>
                            </div>
                            <p className="text-sm font-semibold text-gray-700 text-center group-hover:text-green-600 line-clamp-1">
                                {cat.name}
                            </p>
                          </div>
                      ))
                    )
                  }
                </div>

                {/* Horizontal Product Sliders (e.g. "Popular Items") */}
                {categoryData?.map((c) => (
                    <CategoryWiseProductDisplay
                        key={c?._id + "CategorywiseProduct"}
                        id={c?._id}
                        name={c?.name}
                    />
                ))}
             </>
        )}
      </div>
    </section>
  )
}

export default Home