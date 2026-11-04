import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* About Section */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">About TechStore</h3>
                        <p className="text-gray-400">
                            Your one-stop shop for all tech needs. Quality products, competitive prices, and excellent customer service.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-gray-400 hover:text-white">Home</Link>
                            </li>
                            <li>
                                <Link to="/products" className="text-gray-400 hover:text-white">Products</Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-gray-400 hover:text-white">About Us</Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/faq" className="text-gray-400 hover:text-white">FAQ</Link>
                            </li>
                            <li>
                                <Link to="/shipping" className="text-gray-400 hover:text-white">Shipping Policy</Link>
                            </li>
                            <li>
                                <Link to="/returns" className="text-gray-400 hover:text-white">Returns & Refunds</Link>
                            </li>
                            <li>
                                <Link to="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                        <ul className="space-y-2">
                            <li className="flex items-center space-x-2">
                                <MapPin className="h-5 w-5" />
                                <span className="text-gray-400">123 Tech Street, Silicon Valley</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <Phone className="h-5 w-5" />
                                <span className="text-gray-400">+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <Mail className="h-5 w-5" />
                                <span className="text-gray-400">support@techstore.com</span>
                            </li>
                        </ul>
                        <div className="flex space-x-4 mt-4">
                            <a href="#" className="text-gray-400 hover:text-white">
                                <Facebook className="h-6 w-6" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white">
                                <Twitter className="h-6 w-6" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white">
                                <Instagram className="h-6 w-6" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} TechStore. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
} 