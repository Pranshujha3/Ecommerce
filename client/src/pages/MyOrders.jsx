import React from 'react'
import { useSelector } from 'react-redux'
import NoData from '../Components/NoData'
import { FaBoxOpen } from "react-icons/fa"; 
import { IoIosArrowForward } from "react-icons/io"; 
import { useNavigate } from 'react-router-dom'; 

const MyOrders = () => {
  const orders = useSelector(state => state.orders.order || [])
  const navigate = useNavigate()

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString || Date.now()).toLocaleDateString('en-US', options);
  };

  return (
    <div className='container mx-auto px-4 py-8 max-w-5xl'>
      
      {/* Header Section */}
      <div className='bg-white shadow-sm rounded-xl p-6 mb-6 flex items-center justify-between border border-gray-200'>
        <div>
            <h1 className='text-2xl font-bold text-gray-800 flex items-center gap-3'>
                <span className='p-2 bg-green-50 rounded-full text-green-600'>
                    <FaBoxOpen size={24}/>
                </span>
                My Orders
            </h1>
            <p className='text-gray-500 text-sm mt-2 ml-1'>Track your order history and status</p>
        </div>
        <div className='text-sm font-semibold text-green-700 bg-green-50 px-4 py-2 rounded-full border border-green-100'>
            Total Orders: {orders.length}
        </div>
      </div>

      {/* No Data State */}
      { !orders[0] && (
        <div className="flex flex-col items-center justify-center bg-white p-12 rounded-xl shadow-sm border border-gray-200">
            <NoData />
            <p className="text-gray-500 mt-4 font-medium">You haven't placed any orders yet.</p>
            <button onClick={() => navigate("/")} className='mt-4 px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors'>
                Start Shopping
            </button>
        </div>
      )}

      {/* Orders List */}
      <div className='grid gap-6'>
        {
          orders.map((order, index) => {
            return (
              <div 
                key={order._id + index + "order"} 
                className='bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300'
              >
                  {/* Order Top Bar */}
                  <div className='bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3'>
                      <div className='flex flex-col sm:flex-row sm:items-center sm:gap-4'>
                          <p className='text-sm text-gray-500 font-medium'>
                             ORDER ID: <span className='font-mono text-gray-800 font-bold'>#{order?.orderId}</span>
                          </p>
                          <span className='hidden sm:inline text-gray-300'>|</span>
                          <p className='text-sm text-gray-500'>
                             Placed on <span className='text-gray-800 font-medium'>{formatDate(order?.createdAt)}</span>
                          </p>
                      </div>
                      
                      <span className='bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide border border-green-200'>
                        {order.payment_status || "Processing"}
                      </span>
                  </div>

                  {/* Order Content */}
                  <div className='p-6 flex flex-col sm:flex-row gap-6 items-center sm:items-start'>
                    
                    {/* Image */}
                    <div className='flex-shrink-0 w-28 h-28 border border-gray-200 rounded-lg overflow-hidden bg-white p-2'>
                        <img
                          src={order?.product_details?.image[0]} 
                          alt={order?.product_details?.name}
                          className='w-full h-full object-scale-down transform hover:scale-105 transition-transform duration-300'
                        />  
                    </div>

                    {/* Details */}
                    <div className='flex-grow text-center sm:text-left'>
                        <h2 className='font-bold text-gray-800 text-lg sm:text-xl line-clamp-2 leading-tight'>
                            {order?.product_details?.name}
                        </h2>
                        
                        <div className='mt-3 space-y-2'>
                             <p className='text-gray-500 text-sm'>
                                Quantity: <span className='text-gray-800 font-semibold'>1</span>
                             </p>
                             <div className='flex items-center justify-center sm:justify-start gap-2'>
                                <span className='text-sm text-gray-500'>Total Amount:</span>
                                
                                {/* --- FIX IS HERE: using subTotalAmt --- */}
                                <p className='text-green-700 font-bold text-xl'>₹{order?.subTotalAmt}</p>
                             
                             </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className='flex-shrink-0 mt-2 sm:mt-0 w-full sm:w-auto'>
                        <button 
                            onClick={()=> navigate(`/order/${order?._id}`)}
                            className='w-full sm:w-auto flex items-center justify-center gap-2 text-green-600 bg-white font-semibold border border-green-600 px-6 py-2.5 rounded-lg hover:bg-green-50 transition-colors shadow-sm'
                        >
                            View Details <IoIosArrowForward />
                        </button>
                    </div>

                  </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default MyOrders