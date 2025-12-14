import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
    addressList : []
}

const addressSlice = createSlice({
    name : 'address',
    initialState : initialValue,
    reducers : {
        setAddressList : (state,action)=>{
            state.addressList = [...action.payload]
        }
    }
})

export const {setAddressList  } = addressSlice.actions

export default addressSlice.reducer