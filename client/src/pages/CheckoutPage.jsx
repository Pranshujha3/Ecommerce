import React, { useState, useEffect } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import AddAddress from '../Components/AddAddress'
import { useSelector, useDispatch } from 'react-redux' // Import useDispatch
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/summaryApi'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { setAddressList } from '../store/addressSlice' // ADJUST THIS PATH to your actual slice

const CheckoutPage = () => {
  const { notDiscountTotalPrice, totalPrice, totalQty, fetchCartItem, fetchOrder } = useGlobalContext()
  const [openAddress, setOpenAddress] = useState(false)
  const addressList = useSelector(state => state.addresses.addressList)
  const dispatch = useDispatch() // Init dispatch
  const [selectAddress, setSelectAddress] = useState(0) // Kept index for now, but ID is better
  const cartItemsList = useSelector(state => state.cartItem.cart)
  const navigate = useNavigate()

  // 1. NEW: Fetch Addresses on Component Mount
  const fetchAddress = async () => {
    try {
        // Assuming you have SummaryApi.getAddress
        const response = await Axios({
            ...SummaryApi.getAddress ,
            withCredentials: true
        })
        const { data : responseData } = response
        
        if(responseData.success){
            // Dispatch to Redux (Update 'setAddressList' to match your actual action name)
            dispatch(setAddressList(responseData.data)) 
        }
    } catch (error) {
        // console.log("Error fetching address", error)
    }
  }

  useEffect(()=>{
      fetchAddress()
  },[])

  const handleCashOnDelivery = async() => {
      // Check if address exists before proceeding
      if(addressList.length === 0) {
        toast.error("Please add an address")
        return
      }

      try {
          const response = await Axios({
            ...SummaryApi.CashOnDeliveryOrder,
            data : {
              list_items : cartItemsList,
              addressId : addressList[selectAddress]?._id,
              subTotalAmt : totalPrice,
              totalAmt :  totalPrice,
            }
          })

          const { data : responseData } = response

          if(responseData.success){
              toast.success(responseData.message)
              if(fetchCartItem) fetchCartItem()
              if(fetchOrder) fetchOrder()
              navigate('/success',{
                state : { text : "Order" }
              })
          }

      } catch (error) {
        AxiosToastError(error)
      }
  }

 const handleOnlinePayment = async()=>{
    if(addressList.length === 0) {
        toast.error("Please add an address")
        return
    }

    const toastId = toast.loading("Redirecting to Payment...")

    try {
        const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY
        // Check if key exists
        if (!stripePublicKey) {
            toast.error("Stripe Key Missing")
            return
        }
        
        const response = await Axios({
            ...SummaryApi.payment_url,
            data : {
              list_items : cartItemsList,
              addressId : addressList[selectAddress]?._id,
              subTotalAmt : totalPrice,
              totalAmt :  totalPrice,
            }
        })

        const { data : responseData } = response
        
        toast.dismiss(toastId)

        // 🟢 FIX: Check if backend sent a URL, then redirect directly
       if (responseData.url) {
             window.location.href = responseData.url
        } else {
             // Debugging: If this happens, check your console
             toast.error("Error: No Payment URL received")
             console.log("Backend Response:", responseData)
        }

    } catch (error) {
        toast.dismiss(toastId)
        AxiosToastError(error)
    }
  }
  return (
    <section className='bg-blue-50'>
      <div className='container mx-auto p-4 flex flex-col lg:flex-row w-full gap-5 justify-between'>
        <div className='w-full'>
          {/***address***/}
          <h3 className='text-lg font-semibold'>Choose your address</h3>
          <div className='bg-white p-2 grid gap-4'>
            {
              // 2. DEBUGGING: Check if array is empty
              addressList.length === 0 && (
                 <p className="text-center text-gray-500 p-4">No addresses found. Please add one.</p>
              )
            }
            {
              addressList.map((address, index) => {
                // 3. FIX: Removed the "hidden" logic temporarily to debug visibility
                // If you want to keep status check, ensure address.status is actually true in DB
                return (
                  <label htmlFor={"address" + index} key={index} className="block w-full"> 
                    <div className={`border rounded p-3 flex gap-3 hover:bg-blue-50 ${selectAddress === index ? 'border-green-500 bg-green-50' : ''}`}>
                      <div>
                        <input id={"address" + index} type='radio' value={index} onChange={(e) => setSelectAddress(Number(e.target.value))} checked={selectAddress === index} name='address' />
                      </div>
                      <div>
                        <p>{address.address_line}</p>
                        <p>{address.city}</p>
                        <p>{address.state}</p>
                        <p>{address.country} - {address.pincode}</p>
                        <p>{address.mobile}</p>
                      </div>
                    </div>
                  </label>
                )
              })
            }
            <div onClick={() => setOpenAddress(true)} className='h-16 bg-blue-50 border-2 border-dashed flex justify-center items-center cursor-pointer'>
              Add address
            </div>
          </div>

        </div>

        {/* ... (Summary Section remains the same) ... */}
        <div className='w-full max-w-md bg-white py-4 px-2'>
           {/* Summary code from previous snippet */}
           <h3 className='text-lg font-semibold'>Summary</h3>
             <div className='bg-white p-4'>
             <h3 className='font-semibold'>Bill details</h3>
             <div className='flex gap-4 justify-between ml-1'>
               <p>Items total</p>
               <p className='flex items-center gap-2'><span className='line-through text-neutral-400'>{DisplayPriceInRupees(notDiscountTotalPrice)}</span><span>{DisplayPriceInRupees(totalPrice)}</span></p>
             </div>
             <div className='flex gap-4 justify-between ml-1'>
               <p>Quntity total</p>
               <p className='flex items-center gap-2'>{totalQty} item</p>
             </div>
             <div className='flex gap-4 justify-between ml-1'>
               <p>Delivery Charge</p>
               <p className='flex items-center gap-2'>Free</p>
             </div>
             <div className='font-semibold flex items-center justify-between gap-4'>
               <p >Grand total</p>
               <p>{DisplayPriceInRupees(totalPrice)}</p>
             </div>
           </div>
           <div className='w-full flex flex-col gap-4'>
             <button className='py-2 px-4 bg-green-600 hover:bg-green-700 rounded text-white font-semibold' onClick={handleOnlinePayment}>Online Payment</button>
             <button className='py-2 px-4 border-2 border-green-600 font-semibold text-green-600 hover:bg-green-600 hover:text-white' onClick={handleCashOnDelivery}>Cash on Delivery</button>
           </div>
        </div>
      </div>

      {
        openAddress && (
          <AddAddress close={() => {
            setOpenAddress(false);
            fetchAddress(); // 4. FIX: Refresh list after adding
          }} />
        )
      }
    </section>
  )
}

export default CheckoutPage