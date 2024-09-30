'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-blue-900 text-white py-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center space-x-2 mb-4 md:mb-0">
                        <Heart className="w-6 h-6" />
                        <span className="text-xl font-bold">Play4Good</span>
                    </div>
                    <nav>
                        <ul className="flex space-x-6">
                            <li><Link href="#" className="hover:text-blue-300">About Us</Link></li>
                            <li><Link href="#" className="hover:text-blue-300">Contact</Link></li>
                            <li><Link href="#" className="hover:text-blue-300">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-blue-300">Terms of Service</Link></li>
                        </ul>
                    </nav>
                </div>
                <div className="mt-8 text-center text-blue-300">
                    <p>&copy; 2024 Play4Good. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;