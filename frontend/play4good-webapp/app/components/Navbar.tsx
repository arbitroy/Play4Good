'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="flex justify-between items-center p-4 md:p-8 text-white">
            <div className="flex items-center space-x-2">
                <Heart className="w-8 h-8 text-blue-600" />
                <span className="text-2xl font-bold text-blue-900">Play4Good</span>
            </div>
            <div
                className={`flex flex-col cursor-pointer md:hidden ${isOpen ? 'open' : ''}`}
                onClick={toggleMenu}
            >
                <span className={`h-0.5 w-6 bg-white mb-1 transition-all duration-300 ease-in-out ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                <span className={`h-0.5 w-6 bg-white mb-1 transition-all duration-300 ease-in-out ${isOpen ? 'opacity-0' : ''}`}></span>
                <span className={`h-0.5 w-6 bg-white transition-all duration-300 ease-in-out ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
            </div>
            <ul className={`md:flex md:items-center ${isOpen ? 'flex' : 'hidden'} flex-col md:flex-row absolute md:static top-16 left-0 w-full md:w-auto bg-gray-800 md:bg-transparent p-4 md:p-0`}>
                <li className="my-2 md:my-0 md:ml-4"><Link href="/" className="text-white no-underline">Home</Link></li>
                <li className="my-2 md:my-0 md:ml-4"><Link href="/auth" className="text-white no-underline">Login/Signup</Link></li>
                <li className="my-2 md:my-0 md:ml-4"><Link href="/user-profile" className="text-white no-underline">Profile</Link></li>
                <li className="my-2 md:my-0 md:ml-4"><Link href="/dashboard" className="text-white no-underline">Dashboard</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;