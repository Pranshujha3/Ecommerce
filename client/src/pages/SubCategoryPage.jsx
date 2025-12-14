
import React, { useEffect, useState } from 'react'
import CardLoading from '../components/CardLoading'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import CardProduct from '../components/CardProduct'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useLocation } from 'react-router-dom'
import noDataImage from '../assets/nothing here yet.webp'

const SearchPage = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const loadingArrayCard = new Array(10).fill(null)
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const params = useLocation()
  const searchText = params?.search?.slice(3)

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.searchProduct,
        data: {
          search: searchText,
          page: page,
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        if (responseData.page == 1) {
          setData(responseData.data)
        } else {
          setData((prev) => {
            return [
              ...prev,
              ...responseData.data
            ]
          })
        }
        setTotalPage(responseData.totalPage)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [page, searchText])

  const handleFetchMore = () => {
    if (totalPage > page) {
      setPage(prev => prev + 1)
    }
  }

  return (
    <section className='min-h-screen bg-[#38c5a4] p-5'>
      <div className='container mx-auto'>
        
        {/* Results Header */}
        <div className='bg-white p-4 rounded-3xl shadow-sm border border-blue-100 mb-6 flex items-center justify-between'>
            <div>
                <p className='font-medium text-gray-500 text-sm'>Search Results for</p>
                <h3 className='font-bold text-lg text-gray-800'>"{decodeURIComponent(searchText)}"</h3>
            </div>
            <div className='bg-blue-50 text-blue-700 px-4 py-1 rounded-full text-sm font-semibold'>
                {data.length} Items found
            </div>
        </div>

        <InfiniteScroll
          dataLength={data.length}
          hasMore={page < totalPage}
          next={handleFetchMore}
          loader={
             <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-6'>
                 {loadingArrayCard.map((_, index) => (
                    <CardLoading key={"loadingInfinite" + index} />
                 ))}
             </div>
          }
        >
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
            {
              data.map((p, index) => {
                return (
                  // FIXED HERE: 
                  // 1. Removed 'border' and added 'ring-1 ring-blue-100 ring-inset' (Sharpens the edge)
                  // 2. Added 'p-2' (Padding) to create a frame, preventing content from hiding the curve
                  <div 
                    key={p?._id + "searchProduct" + index} 
                    className='bg-white rounded-3xl p-2 ring-1 ring-blue-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1'
                  >
                     {/* We add rounded-2xl to the inner component so it matches the outer curve */}
                     <div className='rounded-2xl overflow-hidden h-full'>
                        <CardProduct data={p} />
                     </div>
                  </div>
                )
              })
            }

            {/*** Loading Skeleton ***/}
            {
              loading && data.length === 0 && (
                loadingArrayCard.map((_, index) => {
                  return (
                    <CardLoading key={"loadingsearchpage" + index} />
                  )
                })
              )
            }
          </div>
        </InfiniteScroll>

        {/*** No Data Found ***/}
        {
          !data[0] && !loading && (
            <div className='flex flex-col justify-center items-center w-full min-h-[60vh]'>
              <div className='bg-white p-8 rounded-3xl shadow-sm border border-blue-100 flex flex-col items-center animate-fade-in-up'>
                  <img
                    src={noDataImage}
                    alt="No Data"
                    className='w-full max-w-xs object-contain mix-blend-multiply opacity-90'
                  />
                  <p className='font-bold text-xl text-gray-700 mt-4'>No results found</p>
                  <p className='text-gray-500 mt-2 text-center'>Try searching for something else.</p>
              </div>
            </div>
          )
        }
      </div>
    </section>
  )
}

export default SearchPage