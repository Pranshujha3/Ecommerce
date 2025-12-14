
import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/summaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { FaShieldAlt } from "react-icons/fa"; // Added Shield Icon for security vibe

const OtpVerification = () => {
  const [data, setData] = useState(["", "", "", "", "", ""]);
  const navigate = useNavigate();
  const inputRef = useRef([]);
  const location = useLocation();

  useEffect(() => {
    if (!location?.state?.email) {
      navigate("/forgot-password");
    }
  }, [location, navigate]);

  const valideValue = data.every(el => el);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios({
        ...SummaryApi.forgot_password_otp_verification,
        data: {
          otp: data.join(""),
          email: location?.state?.email
        }
      });

      if (response.data.error) {
        toast.error(response.data.message);
      }

      if (response.data.success) {
        toast.success(response.data.message);
        setData(["", "", "", "", "", ""]);
        navigate("/reset-password", {
          state: {
            data: response.data,
            email: location?.state?.email
          }
        });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  // Helper: Handle Backspace key to move focus backwards (Better UX)
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !data[index] && index > 0) {
      inputRef.current[index - 1].focus();
    }
  };

  return (
    <section className='min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-emerald-200 via-green-300 to-teal-400 px-4'>
      
      {/* Background Shapes */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-yellow-300 opacity-20 rounded-full blur-3xl animate-bounce-slow"></div>

      <div className='bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:scale-[1.01]'>
        
        {/* Header Section */}
        <div className='p-8 pb-4 text-center'>
            <div className='mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 text-3xl'>
                <FaShieldAlt />
            </div>
            <h2 className='text-3xl font-bold text-gray-800 mb-2'>Verification Code</h2>
            <p className='text-gray-500 text-sm'>
                We have sent a 6-digit code to your email: <br />
                <span className='font-semibold text-gray-800'>{location?.state?.email}</span>
            </p>
        </div>

        <div className='p-8 pt-2'>
            <form className='grid gap-6' onSubmit={handleSubmit}>
            
            {/* OTP Inputs */}
            <div>
                <label className='block text-sm font-medium text-gray-700 mb-3 text-center'>Enter 6-digit OTP</label>
                <div className='flex items-center justify-between gap-2'>
                    {data.map((element, index) => {
                        return (
                            <input
                                key={"otp" + index}
                                type='text'
                                id='otp'
                                ref={(ref) => {
                                    inputRef.current[index] = ref;
                                    return ref;
                                }}
                                value={data[index]}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    // Only allow numbers
                                    if(isNaN(value)) return;

                                    const newData = [...data];
                                    newData[index] = value;
                                    setData(newData);

                                    if (value && index < 5) {
                                        inputRef.current[index + 1].focus();
                                    }
                                }}
                                onKeyDown={(e) => handleKeyDown(e, index)} // Handle Backspace
                                maxLength={1}
                                className='w-full h-12 sm:h-14 text-center text-xl font-bold text-gray-800 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500 focus:bg-white focus:border-transparent transition-all duration-200'
                            />
                        );
                    })}
                </div>
            </div>

            {/* Submit Button */}
            <button 
                disabled={!valideValue} 
                className={`
                    w-full py-3 rounded-lg font-bold text-lg shadow-md transform transition-all duration-300 mt-4
                    ${valideValue 
                        ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 hover:-translate-y-1 hover:shadow-lg" 
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"}
                `}
            >
                Verify OTP
            </button>
            </form>

            {/* Footer Links */}
            <div className='mt-6 text-center text-sm'>
                <p className='text-gray-500 mb-4'>
                    Didn't receive code? <span className='text-green-600 font-semibold cursor-pointer hover:underline'>Resend</span>
                </p>
                
                <Link to={"/login"} className='font-semibold text-gray-700 hover:text-green-600 transition-colors'>
                    Back to Login
                </Link>
            </div>
        </div>
      </div>
    </section>
  );
}

export default OtpVerification;