import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaRegUserCircle, FaCamera, FaRegUser, FaRegEnvelope, FaMobileAlt } from "react-icons/fa";
import UserProfileAvatarEdit from '../Components/UserProfileAvatarEdit';
import Axios from '../utils/Axios';
import SummaryApi from '../common/summaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import toast from 'react-hot-toast';
import { setUserDetails } from '../store/userSlice';
import fetchUserDetails from '../utils/fetchUserDetails';

const Profile = () => {
    const user = useSelector(state => state.user)
    const [openProfileAvatarEdit, setProfileAvatarEdit] = useState(false)
    const [userData, setUserData] = useState({
        name: user.name,
        email: user.email,
        mobile: user.mobile,
    })
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        setUserData({
            name: user.name,
            email: user.email,
            mobile: user.mobile,
        })
    }, [user])

    const handleOnChange = (e) => {
        const { name, value } = e.target
        setUserData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.updateUserDetails,
                data: userData
            })

            const { data: responseData } = response

            if (responseData.success) {
                toast.success(responseData.message)
                const userData = await fetchUserDetails()
                dispatch(setUserDetails(userData.data))
            }

        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='min-h-[80vh] flex flex-col items-center justify-center p-4 lg:p-8'>
            
            {/* Main Card */}
            <div className='w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100'>
                
                {/* Header / Background Splash */}
                <div className='bg-green-100 h-24 w-full relative'></div>

                <div className='px-6 pb-8'>
                    {/* Avatar Section (Overlapping the header) */}
                    <div className='relative -mt-12 mb-6 flex justify-center'>
                        <div className='relative group'>
                            <div className='w-28 h-28 bg-white border-4 border-white rounded-full overflow-hidden shadow-md flex items-center justify-center'>
                                {
                                    user.avatar ? (
                                        <img
                                            alt={user.name}
                                            src={user.avatar}
                                            className='w-full h-full object-cover'
                                        />
                                    ) : (
                                        <FaRegUserCircle size={70} className="text-gray-400" />
                                    )
                                }
                            </div>
                            
                            {/* Modern Edit Button Overlay */}
                            <button 
                                onClick={() => setProfileAvatarEdit(true)} 
                                className='absolute bottom-1 right-1 bg-green-600 hover:bg-green-700 text-white p-2 rounded-full shadow-lg transition-transform hover:scale-110'
                                title="Change Photo"
                            >
                                <FaCamera size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Popups */}
                    {
                        openProfileAvatarEdit && (
                            <UserProfileAvatarEdit close={() => setProfileAvatarEdit(false)} />
                        )
                    }

                    {/* Form Section */}
                    <form className='grid gap-6' onSubmit={handleSubmit}>
                        
                        {/* Name Input */}
                        <div className='grid gap-1'>
                            <label htmlFor='name' className='text-sm font-semibold text-gray-600'>Name</label>
                            <div className='relative flex items-center'>
                                <span className='absolute left-3 text-gray-400'><FaRegUser/></span>
                                <input
                                    type='text'
                                    id='name'
                                    placeholder='Enter your name'
                                    className='w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all'
                                    value={userData.name}
                                    name='name'
                                    onChange={handleOnChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Email Input */}
                        <div className='grid gap-1'>
                            <label htmlFor='email' className='text-sm font-semibold text-gray-600'>Email</label>
                            <div className='relative flex items-center'>
                                <span className='absolute left-3 text-gray-400'><FaRegEnvelope/></span>
                                <input
                                    type='email'
                                    id='email'
                                    placeholder='Enter your email'
                                    className='w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all'
                                    value={userData.email}
                                    name='email'
                                    onChange={handleOnChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Mobile Input */}
                        <div className='grid gap-1'>
                            <label htmlFor='mobile' className='text-sm font-semibold text-gray-600'>Mobile</label>
                            <div className='relative flex items-center'>
                                <span className='absolute left-3 text-gray-400'><FaMobileAlt/></span>
                                <input
                                    type='text'
                                    id='mobile'
                                    placeholder='Enter your mobile'
                                    className='w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all'
                                    value={userData.mobile}
                                    name='mobile'
                                    onChange={handleOnChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button className='mt-2 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-95'>
                            {
                                loading ? (
                                    <span className='flex items-center justify-center gap-2'>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Updating...
                                    </span>
                                ) : "Save Changes"
                            }
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Profile