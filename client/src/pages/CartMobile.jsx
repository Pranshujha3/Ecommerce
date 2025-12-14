import React from 'react'
import DisplayCartItem from '../components/DisplayCartItem'

// 1. Add { close } inside the parentheses
const CartMobile = ({ close }) => {
  return (
  //   // // 2. Pass it down to the child component
   <DisplayCartItem close={close}/>
  )
}

export default CartMobile