import React from 'react';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { formatPrice } from '../utils/format';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-hot-toast';
import { useCartContext } from '../hooks/CartProvider';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { add } = useCartContext();

  const handleProductClick = () => {
    navigate(`/product/${product._id}`);
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user || !user._id) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    add({
      id: Date.now(),
      productId: product._id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.image,
      quantity: 1
    });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden group cursor-pointer"
      onClick={handleProductClick}
    >
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
        />
        <button
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
          onClick={(e) => e.stopPropagation()}
        >
          <Heart className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">{product.brand}</span>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
          </div>
        </div>

        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-gray-900">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <button
            className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
            onClick={handleAddToCartClick}
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}