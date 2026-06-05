
import React, { useEffect, useState } from 'react'
import CardLoading from '../Components/CardLoading'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import CardProduct from '../Components/CardProduct'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useLocation } from 'react-router-dom'
import noDataImage from '../assets/nothing here yet.webp'

const SearchPage = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [analysis, setAnalysis] = useState(null) 
  const loadingArrayCard = new Array(10).fill(null)
  
  const params = useLocation()
  const searchText = new URLSearchParams(params.search).get('q')

  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)

  const fetchData = async (currSearch) => {
    try {
      setLoading(true)

      // 1. Calling the AI/Hybrid Endpoint
      const response = await Axios({
        url: "/api/meals/ai-search", 
        method: "post",
        data: {
          search: currSearch
        }
      })

      const responseData = response.data

      if (responseData.success) {
        // AI returns curated products and high-level analysis
        setData(responseData.data.products) 
        setAnalysis(responseData.data.analysis) 
        setTotalPage(1) 
      }
    } catch (error) {
        // 2. FALLBACK: If AI fails, try standard database search
        try {
          const fallback = await Axios({
            url: "/api/product/search-product",
            method: "get",
            params: { search: currSearch }
          })
          if(fallback.data.success) {
            setData(fallback.data.data)
            setAnalysis(null)
          }
        } catch (err) {
          AxiosToastError(err)
        }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (searchText) {
        setPage(1)
        setData([]) 
        setAnalysis(null)
        fetchData(searchText)
    }
  }, [searchText]) 

  return (
    <section className='bg-white min-h-screen'>
      <div className='container mx-auto p-4'>
        
        {/* --- HEADER: AI Analysis & Detected Diet --- */}
        <div className="mb-6">
            <p className='font-semibold text-lg uppercase tracking-wider text-neutral-700'>
                Search: <span className="text-green-600">"{searchText}"</span>
            </p>
            
            {analysis && (
                <div className='flex flex-wrap gap-2 mt-3 items-center text-sm'>
                    <span className='font-bold text-neutral-500'>AI Insights:</span>
                    {analysis.duration_days > 1 && (
                        <span className='bg-blue-600 text-white px-3 py-1 rounded-full font-medium shadow-sm'>
                            📅 {analysis.duration_days} Day Plan
                        </span>
                    )}
                    {analysis.tags && analysis.tags.map((tag, idx) => (
                        <span key={idx} className='bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full border border-neutral-200 capitalize'>
                            {tag}
                        </span>
                    ))}
                </div>
            )}
        </div>

        <p className='text-xs text-neutral-400 mb-4 uppercase font-bold'>{data.length} Products Found</p>

        <InfiniteScroll
              dataLength={data.length}
              hasMore={false} 
              next={() => {}}
        >
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 py-4 gap-6'>
              {
                data.map((p, index) => {
                  return (
                    <div key={p?._id + index} className="relative group">
                        
                        {/* --- FUNCTIONALITY 1: SMART KEYWORD BADGES (From DB Tags) --- */}
                        {p.tags && p.tags.length > 0 && (
                            <div className="absolute top-2 left-2 z-10 flex flex-wrap gap-1">
                                {p.tags.slice(0, 2).map((tag, i) => (
                                    <span key={i} className="bg-yellow-400 text-[9px] font-black px-1.5 py-0.5 rounded text-black uppercase shadow-sm">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* --- FUNCTIONALITY 2: AI MEAL PLAN SUGGESTION (Suggested Qty) --- */}
                        {p.recommendation && (
                            <div className="absolute -top-3 left-0 right-0 z-20 mx-2">
                                <div className="bg-green-600 text-white text-[10px] py-1 px-2 rounded-md shadow-lg text-center font-bold border border-white">
                                    🛒 Buy {p.recommendation.suggested_qty} for plan
                                </div>
                            </div>
                        )}

                        <CardProduct data={p} />
                    </div>
                  )
                })
              }

            {loading && loadingArrayCard.map((_, index) => <CardLoading key={index} />)}
        </div>
        </InfiniteScroll>

        {!data[0] && !loading && (
          <div className='flex flex-col justify-center items-center w-full mx-auto mt-10'>
            <img src={noDataImage} className='w-full max-w-xs opacity-50' alt="No data" />
            <p className='font-semibold my-4 text-neutral-500'>No smart matches found.</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default SearchPage