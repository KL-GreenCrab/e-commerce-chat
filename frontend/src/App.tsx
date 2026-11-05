import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Header from './components/Header';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import { Cart } from './components/Cart/Cart';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import CategoryPage from './components/Categories/CategoryPage';
import { UserProfile } from './components/User/UserProfile';
import Footer from './components/Footer';
import { OrderSuccess } from './components/Checkout/OrderSuccess';
import { OrderList } from './components/Orders/OrderList';
import CartPage from './components/Cart/CartPage';
import OrderDetailPage from './pages/OrderDetailPage';
import { AuthProvider } from './hooks/useAuth';
import { CartProvider } from './hooks/CartProvider';
import { Product } from './types';
import { fetchProducts } from './services/productService';
import AdminLayout from './components/Admin/AdminLayout';
import PrivateRoute from './components/Auth/PrivateRoute';
import AdminRoute from './components/Auth/AdminRoute';
import AdminAddProductPage from './pages/AdminAddProductPage';
import AdminEditProductPage from './pages/AdminEditProductPage';
import AdminProductsPage from './pages/AdminProductsPage';
import AdminOrderListPage from './pages/AdminOrderListPage';
import AdminOrderDetailPage from './pages/AdminOrderDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import { Chatbot } from './components/Chatbot';

// Wrapper component to handle page transitions
function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div key={location.pathname} className="animate-fadeIn">
      {children}
    </div>
  );
}

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<{ min: number; max: number } | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts()
      .then(setProducts);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleBrandSelect = (brand: string) => {
    setSelectedBrand(brand);
  };

  const handlePriceRangeSelect = (min: number, max: number) => {
    setSelectedPriceRange({ min, max });
  };

  // Filter products based on selected criteria
  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = !selectedCategory ||
      product.category === selectedCategory;

    const matchesBrand = !selectedBrand ||
      product.brand === selectedBrand;

    const matchesPrice = !selectedPriceRange ||
      (product.price >= selectedPriceRange.min && product.price <= selectedPriceRange.max);

    return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
  });

  // Get search results based on URL parameters
  const getSearchResults = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q') || '';
    const brand = urlParams.get('brand') || '';
    const minPrice = urlParams.get('minPrice') ? Number(urlParams.get('minPrice')) : 0;
    const maxPrice = urlParams.get('maxPrice') ? Number(urlParams.get('maxPrice')) : Infinity;

    return products.filter(product => {
      // Match search query
      const matchesQuery = !query ||
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.brand.toLowerCase().includes(query.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(query.toLowerCase()));

      // Match brand filter
      const matchesBrand = !brand || product.brand === brand;

      // Match price range
      const matchesPrice = product.price >= minPrice &&
        (maxPrice === Infinity || product.price <= maxPrice);

      return matchesQuery && matchesBrand && matchesPrice;
    });
  };

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 2000,
                style: {
                  background: '#333',
                  color: '#fff',
                },
                success: {
                  duration: 2000,
                  iconTheme: {
                    primary: '#4CAF50',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#fff',
                  },
                },
              }}
            />

            <Header
              products={products}
              onCartClick={() => setIsCartOpen(true)}
              onSearch={handleSearch}
              onCategorySelect={handleCategorySelect}
              onBrandSelect={handleBrandSelect}
              onPriceRangeSelect={handlePriceRangeSelect}
            />

            <main className="flex-grow pt-16">
              <PageTransition>
                <Routes>
                  <Route path="/login" element={<LoginForm />} />
                  <Route path="/register" element={<RegisterForm />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/category/:categoryId" element={<CategoryPage />} />
                  <Route path="/search" element={
                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                      <section>
                        {/* Search results header */}
                        <div className="mb-8">
                          <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Search Results
                          </h1>
                          {/* Display active filters */}
                          {(() => {
                            const urlParams = new URLSearchParams(window.location.search);
                            const query = urlParams.get('q');
                            const brand = urlParams.get('brand');
                            const minPrice = urlParams.get('minPrice');
                            const maxPrice = urlParams.get('maxPrice');

                            if (query || brand || minPrice || maxPrice) {
                              return (
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {query && (
                                    <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                                      Search: "{query}"
                                    </div>
                                  )}
                                  {brand && (
                                    <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                                      Brand: {brand}
                                    </div>
                                  )}
                                  {(minPrice || maxPrice) && (
                                    <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                                      Price: ${minPrice || '0'} - ${maxPrice || 'Any'}
                                    </div>
                                  )}
                                </div>
                              );
                            }
                            return null;
                          })()}
                        </div>

                        {/* Search results */}
                        {(() => {
                          const searchResults = getSearchResults();

                          if (searchResults.length === 0) {
                            return (
                              <div className="text-center py-12">
                                <p className="text-gray-600 mb-4">No products found matching your search criteria.</p>
                                <button
                                  onClick={() => window.location.href = '/'}
                                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                >
                                  Return to Home
                                </button>
                              </div>
                            );
                          }

                          return (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                              {searchResults.map(product => (
                                <ProductCard
                                  key={product._id}
                                  product={product}
                                />
                              ))}
                            </div>
                          );
                        })()}
                      </section>
                    </main>
                  } />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/order-success" element={<OrderSuccess />} />
                  <Route path="/" element={
                    <>
                      <Hero />
                      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <section>
                          <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
                            <button className="text-red-600 hover:text-red-700">View All</button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.map(product => (
                              <ProductCard
                                key={product._id}
                                product={product}
                              />
                            ))}
                          </div>
                        </section>
                      </main>
                    </>
                  } />
                  <Route path="/profile/orders" element={<OrderList />} />
                  <Route path="/orders/:id" element={<OrderDetailPage />} />
                  <Route
                    path="/profile"
                    element={
                      <PrivateRoute>
                        <UserProfile />
                      </PrivateRoute>
                    }
                  />
                  <Route path="/cart/:userId" element={<CartPage />} />
                  <Route path="/admin" element={<AdminLayout />}>
                    {/* KHÔNG có route con add-product ở đây */}
                  </Route>
                  <Route
                    path="/admin/products"
                    element={
                      <AdminRoute>
                        <AdminProductsPage />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/add-product"
                    element={
                      <AdminRoute>
                        <AdminAddProductPage />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/edit-product/:id"
                    element={
                      <AdminRoute>
                        <AdminEditProductPage />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/orders"
                    element={
                      <AdminRoute>
                        <AdminOrderListPage />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/orders/:id"
                    element={
                      <AdminRoute>
                        <AdminOrderDetailPage />
                      </AdminRoute>
                    }
                  />
                </Routes>
              </PageTransition>
            </main>

            <Footer />

            <Cart
              isOpen={isCartOpen}
              onClose={() => setIsCartOpen(false)}
            />

            <Chatbot />

          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;


