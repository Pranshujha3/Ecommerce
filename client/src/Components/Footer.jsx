import React from 'react';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    // FOOTER: Using a deep, rich blue to ground the page
    <footer className="bg-blue-950 text-blue-50 pt-10 pb-6 border-t-4 border-yellow-500">
      <div className="container mx-auto px-4">
        
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
            
            {/* 1. Brand Section */}
            <div className="md:w-1/3">
                {/* A splash of yellow text here ties it back to your header */}
                <h3 className="text-2xl font-bold text-yellow-400 mb-2">BrandName.</h3>
                <p className="text-blue-200 text-sm leading-relaxed">
                   Building the future with style. Connect with us on social media or subscribe to our newsletter for updates.
                </p>
            </div>

            {/* 2. Quick Links */}
            <div className="md:w-1/3">
                <h4 className="text-lg font-semibold mb-3 text-white">Quick Links</h4>
                <ul className="space-y-2">
                    {['Home', 'Shop', 'About', 'Contact'].map((item) => (
                        <li key={item}>
                            <a href="#" className="text-blue-300 hover:text-yellow-400 transition-colors duration-300 flex items-center gap-2">
                                <span className="text-xs">➤</span> {item}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>

            {/* 3. Socials */}
            <div className="md:w-1/3">
                <h4 className="text-lg font-semibold mb-3 text-white">Follow Us</h4>
                <div className="flex gap-4">
                     <SocialIcon icon={<FaFacebook />} />
                     <SocialIcon icon={<FaInstagram />} />
                     <SocialIcon icon={<FaTwitter />} />
                     <SocialIcon icon={<FaLinkedin />} />
                </div>
            </div>
        </div>

        {/* Divider Line */}
        <hr className="border-blue-800 my-6" />

        {/* Bottom Bar */}
        <div className="text-center text-sm text-blue-400">
            <p>© {new Date().getFullYear()} BrandName. All Rights Reserved.</p>
        </div>

      </div>
    </footer>
  );
}

// Helper for Social Icons: White icon, turns Yellow on hover
const SocialIcon = ({ icon }) => (
    <a href="#" className="bg-blue-900 p-3 rounded-full text-white hover:bg-yellow-500 hover:text-blue-900 transition-all duration-300 shadow-md hover:shadow-yellow-500/50">
        {icon}
    </a>
);

export default Footer;