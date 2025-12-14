
import React, { useState } from 'react';
import { MdOutlineMail } from "react-icons/md"; // Added Mail icon
import { IoMdArrowBack } from "react-icons/io"; // Added Back arrow icon
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/summaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { useNavigate, Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [data, setData] = useState({
    email: "",
  });

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

    try {
      const response = await Axios({
        ...SummaryApi.forgot_password,
        data: data
      });

      if (response.data.error) {
        toast.error(response.data.message);
      }

      if (response.data.success) {
        toast.success(response.data.message);
        
        // Navigate to OTP page passing the email data
        navigate("/verification-otp", {
          state: data
        });

        setData({
          email: "",
        });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className='min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-emerald-200 via-green-300 to-teal-400 px-4'>
      
      {/* Background Shapes */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-yellow-300 opacity-20 rounded-full blur-3xl animate-bounce-slow"></div>

      <div className='bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:scale-[1.01]'>
        
        {/* Header */}
        <div className='p-8 pb-4 text-center'>
            <h2 className='text-3xl font-bold text-gray-800 mb-2'>Forgot Password?</h2>
            <p className='text-gray-500 text-sm'>
                Don't worry! Enter your email below and we will send you an OTP to reset it.
            </p>
        </div>

        <div className='p-8 pt-2'>
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
                            autoFocus
                            className='w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500 focus:bg-white focus:border-transparent transition-all duration-300'
                            name='email'
                            value={data.email}
                            onChange={handleChange}
                            placeholder='Enter your registered email'
                        />
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
                    Send OTP
                </button>
            </form>

            {/* Back to Login Link */}
            <div className='mt-8 text-center'>
                <Link 
                    to={"/login"} 
                    className='inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-green-600 transition-colors'
                >
                    <IoMdArrowBack /> Back to Login
                </Link>
            </div>
            
        </div>
      </div>
    </section>
  );
}

export default ForgotPassword;