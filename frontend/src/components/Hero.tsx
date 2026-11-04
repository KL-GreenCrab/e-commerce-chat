import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative bg-gray-900 h-[500px] mt-16">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1531297484001-80022131f5a1"
          alt="Tech background"
          className="w-full h-full object-cover opacity-50"
        />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex flex-col justify-center h-full">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Next-Gen Tech<br />
            <span className="text-red-500">Incredible Deals</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl">
            Discover the latest in technology with exclusive offers on smartphones, laptops, and accessories.
          </p>
          
          <div className="flex space-x-4">
            <button className="bg-red-600 text-white px-8 py-3 rounded-lg flex items-center hover:bg-red-700 transition-colors">
              Shop Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <button className="bg-white text-gray-900 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors">
              View Deals
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}