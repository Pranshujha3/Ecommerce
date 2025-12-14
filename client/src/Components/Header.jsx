import React, { useEffect, useState } from 'react'
import logo from '../assets/logo.png'
import Search from '../Components/VoiceSearch' 
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaRegCircleUser } from "react-icons/fa6";
import useMobile from '../hooks/useMobile';
import { BsCart4 } from "react-icons/bs";
import { useSelector } from 'react-redux';
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import UserMenu from './UserMenu';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import { useGlobalContext } from '../provider/GlobalProvider';
import DisplayCartItem from './DisplayCartItem';

const Header = () => {
    const [isMobile] = useMobile()
    const location = useLocation()
    const isSearchPage = location.pathname === "/search"
    const navigate = useNavigate()
    const user = useSelector((state) => state?.user)
    const [openUserMenu, setOpenUserMenu] = useState(false)
    const cartItem = useSelector(state => state.cartItem.cart)
    const { totalPrice, totalQty } = useGlobalContext()
    const [openCartSection, setOpenCartSection] = useState(false)

    const redirectToLoginPage = () => {
        navigate("/login")
    }

    const handleCloseUserMenu = () => {
        setOpenUserMenu(false)
    }

    const handleMobileUser = () => {
        if (!user._id) {
            navigate("/login")
            return
        }
        navigate("/user")
    }

    const handleSearchPageRedirect = (query) => {
        if (query) {
            navigate(`/?search=${query}`)
        }
    }

    return (
        // UPDATED: Changed bg-[#fbfdb0] to bg-blue-50 and border-yellow-200 to border-blue-200
        <header className='h-24 lg:h-20 shadow-sm sticky top-0 z-50 flex flex-col justify-center gap-1 bg-blue-100 border-b border-blue-200 transition-all duration-300'>
            {
                !(isSearchPage && isMobile) && (
                    <div className='container mx-auto flex items-center px-4 lg:px-6 justify-between'>
                        
                        {/** --- LOGO SECTION --- */}
                        <div className='h-full flex items-center transform transition hover:scale-105 duration-200'>
                            <Link to={"/"} className='h-full flex justify-center items-center'>
                                <img
                                    src={logo}
                                    width={170}
                                    height={60}
                                    alt='logo'
                                    className='hidden lg:block object-contain'
                                />
                                <img
                                    src={logo}
                                    width={120}
                                    height={60}
                                    alt='logo'
                                    className='lg:hidden object-contain'
                                />
                            </Link>
                        </div>

                        {/** --- SEARCH SECTION --- */}
                        <div className='hidden lg:block w-full max-w-lg mx-auto'>
                            <Search onSearch={handleSearchPageRedirect} />
                        </div>

                        {/** --- USER & CART SECTION --- */}
                        <div className='flex items-center gap-4 lg:gap-8'>
                            
                            {/* Mobile User Icon */}
                            <button className='text-neutral-700 hover:text-blue-700 transition-colors lg:hidden' onClick={handleMobileUser}>
                                {
                                    // Mobile: Show Image if available, else Icon
                                    user.avatar ? (
                                        <img src={user.avatar} alt='User' className='w-8 h-8 rounded-full object-cover border border-blue-500'/>
                                    ) : (
                                        <FaRegCircleUser size={28} />
                                    )
                                }
                            </button>

                            {/* Desktop User Menu */}
                            <div className='hidden lg:flex items-center gap-6'>
                                {
                                    user?._id ? (
                                        <div className='relative'>
                                            
                                            {/* *** ACCOUNT BOX *** */}
                                            {/* UPDATED: Changed borders from yellow to blue/gray */}
                                            <div 
                                                onClick={() => setOpenUserMenu(prev => !prev)} 
                                                className={`
                                                    flex items-center gap-2 cursor-pointer select-none font-medium transition-all duration-200
                                                    bg-white border border-blue-200 rounded-full shadow-sm px-3 py-1.5
                                                    hover:shadow-md hover:border-blue-400 text-neutral-700 hover:text-blue-700 active:scale-95
                                                    ${openUserMenu ? 'border-blue-500 shadow-md text-blue-700' : ''}
                                                `}
                                            >
                                                {/* LOGIC: IF user.avatar exists -> Show Image. ELSE -> Show Icon */}
                                                {
                                                    user.avatar ? (
                                                        <img 
                                                            src={user.avatar} 
                                                            alt={user.name} 
                                                            className='w-9 h-9 rounded-full object-cover border border-gray-200'
                                                        />
                                                    ) : (
                                                        <FaRegCircleUser size={22} className="text-neutral-500"/> 
                                                    )
                                                }
                                                
                                                <div className='hidden md:block'>
                                                    <p className='text-sm font-semibold'>Account</p>
                                                </div>

                                                <div className='transition-transform duration-200'>
                                                    {openUserMenu ? <GoTriangleUp size={20} /> : <GoTriangleDown size={20} />}
                                                </div>
                                            </div>
                                            
                                            {/* Dropdown Menu */}
                                            {
                                                openUserMenu && (
                                                    <div className='absolute right-0 top-16 z-50 animate-fade-in-down'>
                                                        <div className='bg-white rounded-xl shadow-2xl border border-gray-100 p-4 min-w-[240px]'>
                                                            <UserMenu close={handleCloseUserMenu} />
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={redirectToLoginPage} 
                                            className='text-lg font-medium text-neutral-800 hover:text-blue-800 transition-colors px-4 py-2 rounded-full hover:bg-white/50'
                                        >
                                            Login
                                        </button>
                                    )
                                }

                                {/* --- CART BUTTON --- */}
                                <button 
                                    onClick={() => setOpenCartSection(true)} 
                                    className='group flex items-center gap-3 bg-gradient-to-r from-green-700 to-green-600 hover:from-green-800 hover:to-green-700 text-white px-4 py-2.5 rounded-full shadow-md hover:shadow-lg transform active:scale-95 transition-all duration-300'
                                >
                                    <div className='relative'>
                                        <BsCart4 size={24} className='group-hover:animate-wiggle'/>
                                    </div>
                                    
                                    <div className='font-semibold text-sm flex flex-col items-start leading-tight'>
                                        {
                                            cartItem[0] ? (
                                                <>
                                                    <span className='text-xs opacity-90'>{totalQty} Items</span>
                                                    <span>{DisplayPriceInRupees(totalPrice)}</span>
                                                </>
                                            ) : (
                                                <span className='text-base'>My Cart</span>
                                            )
                                        }
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            <div className='container mx-auto px-4 lg:hidden pb-2'>
                <Search onSearch={handleSearchPageRedirect} />
            </div>

            {
                openCartSection && (
                    <DisplayCartItem close={() => setOpenCartSection(false)} />
                )
            }
        </header>
    )
}

export default Header