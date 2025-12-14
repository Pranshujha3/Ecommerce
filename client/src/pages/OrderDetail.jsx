
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaMapMarkerAlt, FaCreditCard, FaTruck } from "react-icons/fa";

const OrderDetail = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const userOrders = useSelector(state => state.orders.order || []);
    const [orderDetails, setOrderDetails] = useState(null);

    useEffect(() => {
        if (userOrders.length > 0) {
            const findOrder = userOrders.find(order => order._id === id);
            setOrderDetails(findOrder);
        }
    }, [id, userOrders]);

    // Helper function to get expected delivery date (3 days from now)
    const getExpectedDeliveryDate = () => {
        const date = new Date();
        date.setDate(date.getDate() + 3); // Add 3 days
        return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    if (!orderDetails) {
        return <div className='p-4 text-center mt-10 font-semibold text-gray-500'>Loading order details...</div>;
    }

    return (
        <div className='container mx-auto px-4 py-8 max-w-5xl'>
            
            {/* Header & Back Button */}
            <button onClick={() => navigate(-1)} className='flex items-center gap-2 text-gray-600 hover:text-green-600 mb-6 transition-colors'>
                <FaArrowLeft /> Back to My Orders
            </button>

            <div className='flex flex-wrap items-center justify-between gap-4 mb-6'>
                <div>
                    <h1 className='text-2xl font-bold text-gray-800'>Order Details</h1>
                    <p className='text-gray-500'>Order ID: <span className='font-mono font-medium text-gray-800'>#{orderDetails?.orderId}</span></p>
                </div>
                <div className='px-4 py-2 bg-green-100 text-green-700 font-bold rounded-full uppercase text-sm tracking-wide'>
                    {orderDetails?.payment_status || "Processing"}
                </div>
            </div>

            {/* Main Grid Layout */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                
                {/* LEFT COLUMN */}
                <div className='md:col-span-2 space-y-6'>
                    
                    {/* Items Card */}
                    <div className='bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden'>
                        <div className='bg-gray-50 px-6 py-4 border-b border-gray-100 font-semibold text-gray-700'>
                            Items in this order
                        </div>
                        <div className='p-6'>
                            <div className='flex gap-4 items-start'>
                                <div className='w-20 h-20 border border-gray-200 rounded p-2 bg-white flex-shrink-0'>
                                    <img 
                                        src={orderDetails?.product_details?.image[0]} 
                                        alt={orderDetails?.product_details?.name}
                                        className='w-full h-full object-scale-down' 
                                    />
                                </div>
                                <div className='flex-grow'>
                                    <h3 className='font-bold text-gray-800 text-lg'>{orderDetails?.product_details?.name}</h3>
                                    {/* FIX: Changed amount to subTotalAmt */}
                                    <p className='text-gray-500 text-sm mt-1'>Unit Price: ₹{orderDetails?.subTotalAmt}</p>
                                    <p className='text-gray-500 text-sm'>Quantity: 1</p> 
                                </div>
                                <div className='font-bold text-green-700 text-lg'>
                                    {/* FIX: Changed amount to subTotalAmt */}
                                    ₹{orderDetails?.subTotalAmt}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Status / Tracker */}
                    <div className='bg-white shadow-sm rounded-xl border border-gray-200 p-6'>
                        <div className='flex items-center gap-4 mb-4'>
                            <div className='p-3 bg-green-50 text-green-600 rounded-full'>
                                <FaTruck size={24}/>
                            </div>
                            <div>
                                <h3 className='font-bold text-gray-800'>Delivery Status</h3>
                                <p className='text-sm text-gray-500'>Arriving by {getExpectedDeliveryDate()}</p>
                            </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-green-600 h-2.5 rounded-full" style={{width: '45%'}}></div>
                        </div>
                        <div className='flex justify-between text-xs text-gray-500 mt-2 font-medium'>
                            <span>Order Placed</span>
                            <span>Shipped</span>
                            <span>Out for Delivery</span>
                            <span>Delivered</span>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className='space-y-6'>
                    
                    {/* Shipping Address */}
                    <div className='bg-white shadow-sm rounded-xl border border-gray-200 p-6'>
                        <h3 className='font-bold text-gray-800 flex items-center gap-2 mb-4 pb-2 border-b border-gray-100'>
                            <FaMapMarkerAlt className='text-green-600'/> Shipping Details
                        </h3>
                        
                        {/* FIX: Changed address_details to delivery_address based on your debug data */}
                        <div className='text-sm text-gray-600 leading-relaxed'>
                            <p className='font-semibold text-gray-800 uppercase'>User</p> 
                            <p>{orderDetails?.delivery_address?.address_line}</p>
                            <p>{orderDetails?.delivery_address?.city}, {orderDetails?.delivery_address?.pincode}</p>
                            <p className='mt-2'>Phone: {orderDetails?.delivery_address?.mobile}</p>
                        </div>
                    </div>

                    {/* Payment Summary */}
                    <div className='bg-white shadow-sm rounded-xl border border-gray-200 p-6'>
                        <h3 className='font-bold text-gray-800 flex items-center gap-2 mb-4 pb-2 border-b border-gray-100'>
                            <FaCreditCard className='text-green-600'/> Payment Summary
                        </h3>
                        
                        <div className='space-y-3 text-sm'>
                            <div className='flex justify-between text-gray-600'>
                                <span>Item Total</span>
                                {/* FIX: Changed amount to subTotalAmt */}
                                <span>₹{orderDetails?.subTotalAmt}</span>
                            </div>
                            <div className='flex justify-between text-gray-600'>
                                <span>Delivery Fee</span>
                                <span className='text-green-600'>Free</span>
                            </div>
                            <div className='border-t border-gray-100 pt-3 flex justify-between font-bold text-lg text-gray-800'>
                                <span>Grand Total</span>
                                {/* FIX: Changed amount to subTotalAmt */}
                                <span>₹{orderDetails?.subTotalAmt}</span>
                            </div>
                        </div>
                         
                        <div className='mt-4 bg-green-50 text-green-700 px-3 py-2 rounded text-xs font-semibold text-center border border-green-200'>
                            Payment Status: {orderDetails?.payment_status || "Paid"}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default OrderDetail;