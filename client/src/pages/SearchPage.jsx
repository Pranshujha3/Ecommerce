import React, { useEffect, useState } from 'react'
import CardLoading from '../Components/CardLoading'
import SummaryApi from '../common/summaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import CardProduct from '../Components/CardProduct'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useLocation } from 'react-router-dom'
import noDataImage from '../assets/nothing here yet.webp'

const SearchPage = () => {
  const [data,setData] = useState([])
  const [loading,setLoading] = useState(true)
  const loadingArrayCard = new Array(10).fill(null)
  
  // URL Params
  const params = useLocation()
  const searchText = new URLSearchParams(params.search).get('q')

  // Pagination State
  const [page,setPage] = useState(1)
  const [totalPage,setTotalPage] = useState(1)

  // ✅ FIX 1: Pass 'currPage' and 'currSearch' as arguments
  const fetchData = async(currPage, currSearch) => {
    try {
      setLoading(true)
      
      const response = await Axios({
        ...SummaryApi.searchProduct,
        params: { 
          search: currSearch,  // Use the argument
          page: currPage, // Use the argument
        }
      })

      const { data : responseData } = response

      if(responseData.success){
        if(currPage === 1){
          setData(responseData.data) // Reset data for new search
        } else {
          setData((preve) => [ ...preve, ...responseData.data ]) // Append for scroll
        }
        setTotalPage(responseData.totalPage)
      }
    } catch (error) {
        AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  // ✅ FIX 2: Handle New Search (Runs when URL changes)
  useEffect(() => {
    if (searchText) {
        setPage(1)
        setData([]) // Clear old data immediately
        fetchData(1, searchText) // 👈 Explicitly fetch Page 1
    }
  }, [searchText]) 

  // ✅ FIX 3: Handle Infinite Scroll (Runs only when Page changes)
  const handleFetchMore = () => {
    if(totalPage > page){
      const nextPage = page + 1
      setPage(nextPage)
      fetchData(nextPage, searchText) // 👈 Explicitly fetch Next Page
    }
  }

  return (
    <section className='bg-white'>
      <div className='container mx-auto p-4'>
        <p className='font-semibold'>Search Results: {data.length} </p>

        <InfiniteScroll
              dataLength={data.length}
              hasMore={page < totalPage} // 👈 Only true if pages remain
              next={handleFetchMore}
        >
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 py-4 gap-4'>
              {
                data.map((p,index)=>{
                  return(
                    <CardProduct data={p} key={p?._id+"searchProduct"+index}/>
                  )
                })
              }

            {/***loading data */}
            {
              loading && (
                loadingArrayCard.map((_,index)=>{
                  return(
                    <CardLoading key={"loadingsearchpage"+index}/>
                  )
                })
              )
            }
        </div>
        </InfiniteScroll>

              {
                //no data 
                !data[0] && !loading && (
                  <div className='flex flex-col justify-center items-center w-full mx-auto'>
                    <img
                      src={noDataImage} 
                      className='w-full h-full max-w-xs max-h-xs block'
                    />
                    <p className='font-semibold my-2'>No Data found</p>
                  </div>
                )
              }
      </div>
    </section>
  )
}

export default SearchPage