import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { categories } from '../../data/products';
import ProductCard from '../ProductCard';
import { Product } from '../../types';
import { fetchProducts } from '../../services/productService';
import { Filter } from 'lucide-react';

export default function CategoryPage() {
    const { categoryId } = useParams<{ categoryId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Get the current category
    const category = categories.find(c => c.id === categoryId);

    // Parse URL search parameters
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('q') || '';
    const brandFilter = searchParams.get('brand') || '';
    const minPriceFilter = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : 0;
    const maxPriceFilter = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : Infinity;

    // Fetch products when category or search parameters change
    useEffect(() => {
        if (!category) return;

        setIsLoading(true);

        // Build query parameters for API
        const queryParams: Record<string, string | number> = {
            category: category.name
        };

        // Add search query if present
        if (searchQuery) {
            queryParams.search = searchQuery;
        }

        // Add brand filter if present
        if (brandFilter) {
            queryParams.brand = brandFilter;
        }

        // Add price range if present
        if (minPriceFilter > 0) {
            queryParams.minPrice = minPriceFilter;
        }

        if (maxPriceFilter < Infinity) {
            queryParams.maxPrice = maxPriceFilter;
        }

        // Fetch products with filters
        fetchProducts(queryParams)
            .then(setProducts)
            .finally(() => setIsLoading(false));
    }, [category, location.search]);

    if (!category) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Danh mục không tồn tại</h2>
                    <p className="text-gray-600 mb-4">Danh mục bạn đang tìm kiếm không tồn tại.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Quay về trang chủ
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-16">
            <div className="relative h-64 bg-gray-900">
                <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-white mb-2">{category.name}</h1>
                        <p className="text-lg text-gray-200">{category.description}</p>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Active filters display */}
                {(searchQuery || brandFilter || minPriceFilter > 0 || maxPriceFilter < Infinity) && (
                    <div className="mb-6">
                        <div className="flex items-center mb-2">
                            <Filter className="h-4 w-4 mr-2 text-gray-500" />
                            <h3 className="text-lg font-medium">Active Filters</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {searchQuery && (
                                <div className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center">
                                    <span className="mr-2">Search: {searchQuery}</span>
                                    <button
                                        onClick={() => {
                                            const params = new URLSearchParams(location.search);
                                            params.delete('q');
                                            navigate({
                                                pathname: location.pathname,
                                                search: params.toString() ? `?${params.toString()}` : ''
                                            });
                                        }}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        ×
                                    </button>
                                </div>
                            )}

                            {brandFilter && (
                                <div className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center">
                                    <span className="mr-2">Brand: {brandFilter}</span>
                                    <button
                                        onClick={() => {
                                            const params = new URLSearchParams(location.search);
                                            params.delete('brand');
                                            navigate({
                                                pathname: location.pathname,
                                                search: params.toString() ? `?${params.toString()}` : ''
                                            });
                                        }}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        ×
                                    </button>
                                </div>
                            )}

                            {(minPriceFilter > 0 || maxPriceFilter < Infinity) && (
                                <div className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center">
                                    <span className="mr-2">
                                        Price: ${minPriceFilter} - ${maxPriceFilter === Infinity ? 'Any' : maxPriceFilter}
                                    </span>
                                    <button
                                        onClick={() => {
                                            const params = new URLSearchParams(location.search);
                                            params.delete('minPrice');
                                            params.delete('maxPrice');
                                            navigate({
                                                pathname: location.pathname,
                                                search: params.toString() ? `?${params.toString()}` : ''
                                            });
                                        }}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        ×
                                    </button>
                                </div>
                            )}

                            {/* Clear all filters button */}
                            <button
                                onClick={() => {
                                    navigate({
                                        pathname: location.pathname
                                    });
                                }}
                                className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm hover:bg-red-200"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    </div>
                )}

                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Đang tải sản phẩm...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map(product => (
                            <ProductCard
                                key={product._id}
                                product={product}
                            />
                        ))}
                    </div>
                )}

                {!isLoading && products.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-600 mb-4">Không tìm thấy sản phẩm nào phù hợp với bộ lọc hiện tại.</p>
                        <button
                            onClick={() => navigate(`/category/${categoryId}`)}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                            Xóa bộ lọc
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}