import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash, FaRegUser } from "react-icons/fa6"; // Added User icon
import { MdOutlineMail } from "react-icons/md"; // Added Mail icon
import { RiLockPasswordLine } from "react-icons/ri"; // Added Lock icon
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/summaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

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

        if (data.password !== data.confirmPassword) {
            toast.error("Password and confirm password must be same");
            return;
        }

        try {
            const response = await Axios({
                ...SummaryApi.register,
                data: data
            });

            if (response.data.error) {
                toast.error(response.data.message);
            }

            if (response.data.success) {
                toast.success(response.data.message);
                setData({
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: ""
                });
                navigate("/login");
            }

        } catch (error) {
            AxiosToastError(error);
        }
    };

    return (
        <section className='min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-emerald-200 via-green-300 to-teal-400 px-4 py-10'>
            
            {/* Background Decoration */}
            <div className="absolute top-20 left-20 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-56 h-56 bg-yellow-300 opacity-20 rounded-full blur-3xl animate-bounce-slow"></div>

            <div className='bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:scale-[1.005]'>
                
                {/* Header */}
                <div className='p-8 pb-4 text-center'>
                    <h2 className='text-3xl font-bold text-gray-800 mb-2'>Create Account</h2>
                    <p className='text-gray-700 text-sm'>Join Binkeyit today for fresh groceries delivered.</p>
                </div>

                <div className='p-8 pt-2'>
                    <form className='grid gap-5' onSubmit={handleSubmit}>
                        
                        {/* Name Input */}
                        <div className='relative group'>
                            <label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-1 transition-colors group-focus-within:text-green-600'>Full Name</label>
                            <div className='relative flex items-center'>
                                <div className='absolute left-3 text-gray-400 group-focus-within:text-green-600 transition-colors'>
                                    <FaRegUser size={18} />
                                </div>
                                <input
                                    type='text'
                                    id='name'
                                    autoFocus
                                    className='w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500 focus:bg-white focus:border-transparent transition-all duration-300'
                                    name='name'
                                    value={data.name}
                                    onChange={handleChange}
                                    placeholder='Enter your name'
                                />
                            </div>
                        </div>

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
                                    placeholder='Enter your email'
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
                                    placeholder='Create a password'
                                />
                                <div 
                                    onClick={() => setShowPassword(prev => !prev)} 
                                    className='absolute right-3 cursor-pointer text-gray-400 hover:text-green-600 transition-colors p-1'
                                >
                                    {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                                </div>
                            </div>
                        </div>

                        {/* Confirm Password Input */}
                        <div className='relative group'>
                            <label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-700 mb-1 transition-colors group-focus-within:text-green-600'>Confirm Password</label>
                            <div className='relative flex items-center'>
                                <div className='absolute left-3 text-gray-400 group-focus-within:text-green-600 transition-colors'>
                                    <RiLockPasswordLine size={20} />
                                </div>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id='confirmPassword'
                                    className='w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500 focus:bg-white focus:border-transparent transition-all duration-300'
                                    name='confirmPassword'
                                    value={data.confirmPassword}
                                    onChange={handleChange}
                                    placeholder='Confirm your password'
                                />
                                <div 
                                    onClick={() => setShowConfirmPassword(prev => !prev)} 
                                    className='absolute right-3 cursor-pointer text-gray-400 hover:text-green-600 transition-colors p-1'
                                >
                                    {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button 
                            disabled={!valideValue} 
                            className={`
                                w-full py-3 mt-2 rounded-lg font-bold text-lg shadow-md transform transition-all duration-300
                                ${valideValue 
                                    ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 hover:-translate-y-1 hover:shadow-lg" 
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"}
                            `}
                        >
                            Register
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative flex py-6 items-center">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="flex-shrink mx-4 text-gray-400 text-sm">Or</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    {/* Footer */}
                    <p className='text-center text-gray-600'>
                        Already have an account?{' '}
                        <Link to={"/login"} className='font-bold text-green-600 hover:text-green-800 hover:underline transition-all'>
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    );
}

export default Register;