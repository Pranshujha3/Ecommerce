import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { MdOutlineMail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/summaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link } from 'react-router-dom'; // Removed useNavigate since we use window.location

const Login = () => {
    const [data, setData] = useState({
        email: "",
        password: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    
    // const navigate = useNavigate() // <--- Removed this for the fix

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((preve) => {
            return {
                ...preve,
                [name]: value
            };
        });
    };

    const valideValue = Object.values(data).every(el => el);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await Axios({
                ...SummaryApi.login,
                data: data
            });

            if (response.data.error) {
                toast.error(response.data.message);
            }

            if (response.data.success) {
                toast.success(response.data.message);
                
                // 1. Save tokens
                localStorage.setItem('accessToken', response.data.data.accessToken);
                localStorage.setItem('refreshToken', response.data.data.refreshToken);

                setData({
                    email: "",
                    password: "",
                });
                
                // ---------------------------------------------------------
                // THE FIX: Use window.location.href instead of navigate
                // This forces the page to reload so Axios catches the new token
                // ---------------------------------------------------------
                window.location.href = "/"; 
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };

    return (
        <section className='min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 px-4'>
            {/* Background Animations */}
            <div className="absolute top-10 left-10 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-48 h-48 bg-yellow-300 opacity-20 rounded-full blur-3xl animate-bounce-slow"></div>

            <div className='bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:scale-[1.01]'>
                
                {/* Header Section */}
                <div className='p-8 pb-2'>
                    <h2 className='text-3xl font-bold text-center text-gray-800 mb-2'>Welcome Back</h2>
                    <p className='text-center text-gray-500 text-sm'>Login to access your grocery dashboard</p>
                </div>

                <div className='p-8 pt-4'>
                    <form className='grid gap-6' onSubmit={handleSubmit}>
                        
                        {/* Email Input */}
                        <div className='relative group'>
                            <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-1 transition-colors group-focus-within:text-green-600'>Email Address</label>
                            <div className='relative flex items-center'>
                                <div className='absolute left-3 text-gray-400 group-focus-within:text-green-600 transition-colors'>
                                    <MdOutlineMail size={20} />
                                </div>
                                <input
                                    type='email'
                                    id='email'
                                    className='w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500 focus:bg-white focus:border-transparent transition-all duration-300'
                                    name='email'
                                    value={data.email}
                                    onChange={handleChange}
                                    placeholder='name@example.com'
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className='relative group'>
                            <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-1 transition-colors group-focus-within:text-green-600'>Password</label>
                            <div className='relative flex items-center'>
                                <div className='absolute left-3 text-gray-400 group-focus-within:text-green-600 transition-colors'>
                                    <RiLockPasswordLine size={20} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id='password'
                                    className='w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500 focus:bg-white focus:border-transparent transition-all duration-300'
                                    name='password'
                                    value={data.password}
                                    onChange={handleChange}
                                    placeholder='Enter password'
                                />
                                <div 
                                    onClick={() => setShowPassword(prev => !prev)} 
                                    className='absolute right-3 cursor-pointer text-gray-400 hover:text-green-600 transition-colors p-1'
                                >
                                    {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                                </div>
                            </div>
                            <div className='text-right mt-2'>
                                <Link to={"/forgot-password"} className='text-xs font-semibold text-gray-500 hover:text-green-600 transition-colors'>
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button 
                            disabled={!valideValue} 
                            className={`
                                w-full py-3 rounded-lg font-bold text-lg shadow-md transform transition-all duration-300
                                ${valideValue 
                                    ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 hover:-translate-y-1 hover:shadow-lg" 
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"}
                            `}
                        >
                            Login
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative flex py-5 items-center">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    {/* Footer */}
                    <p className='text-center text-gray-600'>
                        Don't have an account?{' '}
                        <Link to={"/register"} className='font-bold text-green-600 hover:text-green-800 hover:underline transition-all'>
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    );
}

export default Login;