import React, { useState } from 'react'
import UserMenu from '../Components/UserMenu'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FaBarsStaggered } from "react-icons/fa6"; // Switched to a more modern icon
import { IoClose } from "react-icons/io5";

const Dashboard = () => {
  const user = useSelector(state => state.user)
  const [openMenu, setOpenMenu] = useState(false)

  const handleClose = () => {
      setOpenMenu(false)
  }

  const handleToggleMenu = () => {
      setOpenMenu(prev => !prev)
  }

  return (
    // Changed main background to a very soft gray to make white cards pop
    <section className='bg-gray-50 min-h-screen'>
        
        <div className='container mx-auto p-4 lg:p-6'>
            
            {/* --- TOP BAR SECTION --- */}
            <div className='bg-white rounded-xl shadow-sm p-4 mb-6 flex items-center justify-between sticky top-24 z-40 border border-gray-100'>
                
                {/* 1. STYLISH MENU BUTTON */}
                <div className='relative'>
                    <button 
                        onClick={handleToggleMenu} 
                        className={`
                            flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-white transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg
                            ${openMenu 
                                ? 'bg-red-500 hover:bg-red-600' // Red when open
                                : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700' // Gradient Green when closed
                            }
                        `}
                    >
                        {openMenu ? <IoClose size={22}/> : <FaBarsStaggered size={20}/> }
                        <span className='tracking-wide'>{openMenu ? "Close" : "User Menu"}</span>
                    </button>

                    {/* 2. THE DROPDOWN (Enhanced Visuals) */}
                    {
                        openMenu && (
                            <div className='absolute top-14 left-0 z-50 animate-fade-in-down'>
                                {/* Decorative triangular tip */}
                                <div className='w-4 h-4 bg-white rotate-45 absolute -top-2 left-6 border-t border-l border-gray-200'></div>

                                <div className='bg-white border border-gray-100 rounded-2xl shadow-2xl min-w-[280px] p-2 overflow-hidden'>
                                    <div className='max-h-[70vh] overflow-y-auto custom-scrollbar p-2'>
                                        {/* Passed handleClose so it closes on click */}
                                        <UserMenu close={handleClose}/>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>

                {/* Optional: User Welcome Text (Right Side) */}
                <div className='hidden md:block'>
                   <span className='text-gray-500 text-sm'>Welcome back,</span>
                   <span className='font-bold text-gray-800 text-lg ml-1 capitalize'>
                        {user.name || "User"}
                   </span>
                </div>
            </div>


            {/* --- MAIN CONTENT CARD --- */}
            {/* Added a white card effect with rounded corners to hold the page content */}
            <div className='bg-white rounded-2xl shadow-sm min-h-[75vh] border border-gray-100 p-4 lg:p-6 transition-all'>
                <Outlet/>
            </div>

        </div>
    </section>
  )
}

export default Dashboard