import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { formatPrice } from '../utils/format';

interface SearchSuggestionsProps {
    suggestions: Product[];
    onSelect: (product: Product) => void;
    isLoading?: boolean;
}

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
    suggestions,
    onSelect,
    isLoading = false
}) => {
    // Common container styles
    const containerClasses = "absolute top-full left-0 w-full bg-white rounded-lg shadow-lg border border-gray-200 mt-1 z-50";

    if (isLoading) {
        return (
            <div className={containerClasses}>
                <div className="p-4 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600 mx-auto"></div>
                    <p className="mt-2 text-gray-500">Searching products...</p>
                </div>
            </div>
        );
    }

    if (suggestions.length === 0) {
        return (
            <div className={containerClasses}>
                <div className="p-6 text-center">
                    <div className="text-gray-400 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <p className="text-gray-500 font-medium">No products found</p>
                    <p className="text-gray-400 text-sm mt-1">Please try a different search term</p>
                    <p className="text-gray-400 text-xs mt-3">Tip: Try searching with shorter keywords or brand names</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`${containerClasses} max-h-96 overflow-y-auto`}>
            <div className="p-2 bg-gray-50 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 px-2">Suggested Products</h3>
            </div>

            {suggestions.map((product) => (
                <Link
                    key={product._id}
                    to={`/product/${product._id}`}
                    onClick={() => onSelect(product)}
                    className="flex items-center p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                >
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://via.placeholder.com/150?text=No+Image';
                            }}
                        />
                    </div>

                    <div className="ml-4 flex-1">
                        <h3 className="font-medium text-gray-900 line-clamp-1">{product.name}</h3>
                        <div className="flex justify-between items-center mt-1">
                            <p className="text-sm text-gray-500">{product.brand}</p>
                            <p className="text-sm font-semibold text-red-600">{formatPrice(product.price)}</p>
                        </div>
                        {product.stock > 0 ? (
                            <p className="text-xs text-green-600 mt-1">In Stock</p>
                        ) : (
                            <p className="text-xs text-gray-500 mt-1">Out of Stock</p>
                        )}
                    </div>
                </Link>
            ))}

            {/* View all results button */}
            {suggestions.length > 0 && (
                <div className="p-3 border-t border-gray-100">
                    <Link
                        to={`/search?q=${encodeURIComponent(suggestions[0].name.split(' ')[0])}`}
                        className="block w-full text-center text-sm font-medium text-red-600 hover:text-red-700"
                    >
                        View all results
                    </Link>
                </div>
            )}
        </div>
    );
};