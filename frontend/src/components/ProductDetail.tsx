import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Heart, ArrowLeft, Scale } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Product } from '../types';
import { formatPrice } from '../utils/format';
import { fetchProductById, fetchProducts } from '../services/productService';
import { ProductComparison } from './ProductComparison/ProductComparison';
import { ProductSelector } from './ProductComparison/ProductSelector';
import { useAuth } from '../hooks/useAuth';
import { useCartContext } from '../hooks/CartProvider';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { add } = useCartContext();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [comparisonProducts, setComparisonProducts] = useState<Product[]>([]);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [isLoadingSimilarProducts, setIsLoadingSimilarProducts] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetchProductById(id!)
      .then(productData => {
        setProduct(productData);
        return productData;
      })
      .catch(() => {
        setProduct(null);
        return null;
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  // Lấy sản phẩm tương tự khi sản phẩm hiện tại thay đổi
  useEffect(() => {
    if (product && product.category) {
      setIsLoadingSimilarProducts(true);
      fetchProducts({ category: product.category })
        .then(products => {
          // Lọc ra các sản phẩm cùng danh mục nhưng khác sản phẩm hiện tại
          const filtered = products.filter(p => p._id !== product._id);
          setSimilarProducts(filtered);
        })
        .catch(error => {
          console.error('Error fetching similar products:', error);
          toast.error('Không thể tải sản phẩm tương tự');
          setSimilarProducts([]);
        })
        .finally(() => setIsLoadingSimilarProducts(false));
    }
  }, [product]);

  const handleAddToComparison = () => {
    if (!product) return;

    if (similarProducts.length === 0) {
      toast.error('Không có sản phẩm nào để so sánh trong cùng danh mục');
      return;
    }

    setIsSelectorOpen(true);
  };

  const handleSelectProduct = (selectedProduct: Product) => {
    setSelectedProducts(prev => [...prev, selectedProduct]);
  };

  const handleDeselectProduct = (deselectedProduct: Product) => {
    setSelectedProducts(prev => prev.filter(p => p._id !== deselectedProduct._id));
  };

  const handleCloseSelector = () => {
    if (selectedProducts.length > 0 && product) {
      setComparisonProducts([product, ...selectedProducts]);
      setIsComparisonOpen(true);
    }
    setIsSelectorOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-8 w-64 bg-gray-200 rounded mx-auto mb-4"></div>
          <div className="h-4 w-48 bg-gray-200 rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <button
            onClick={() => navigate('/')}
            className="text-red-600 hover:text-red-700 flex items-center mx-auto"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

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
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fadeIn">
        <button
          onClick={() => navigate('/')}
          className="mb-8 text-gray-600 hover:text-gray-800 flex items-center transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Products
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden shadow-lg">
              <img
                src={product.images?.[selectedImage] || product.image}
                alt={product.name}
                className="w-full h-full object-center object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            {product.images && (
              <div className="mt-4 grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-w-1 aspect-h-1 rounded-lg overflow-hidden transition-all duration-200 ${selectedImage === index ? 'ring-2 ring-red-500 scale-105' : 'hover:scale-105'
                      }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-center object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-lg text-gray-500">{product.brand}</p>
            </div>

            <div className="flex items-center mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                      }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-gray-600">{product.reviews} reviews</span>
            </div>

            <div className="mb-6">
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="ml-2 text-lg text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-gray-600">{product.description}</p>
            </div>

            {product.specifications && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Specifications</h2>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-2">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex">
                      <dt className="w-1/3 text-gray-500">{key}</dt>
                      <dd className="w-2/3 text-gray-900">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            <div className="flex space-x-4">
              <button
                onClick={handleAddToCartClick}
                className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-red-700 transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Add to Cart</span>
              </button>
              <button
                onClick={handleAddToComparison}
                className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title="So sánh sản phẩm"
              >
                <Scale className="h-6 w-6 text-gray-600" />
              </button>
              <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Heart className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            <div className="mt-4 text-sm text-gray-500">
              {product.stock > 0 ? (
                <span className="text-green-600">
                  In stock ({product.stock} available)
                </span>
              ) : (
                <span className="text-red-600">Out of stock</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {isSelectorOpen && product && (
        <ProductSelector
          products={similarProducts}
          selectedProducts={selectedProducts}
          currentProduct={product}
          onSelect={handleSelectProduct}
          onDeselect={handleDeselectProduct}
          onClose={handleCloseSelector}
          isLoading={isLoadingSimilarProducts}
        />
      )}

      {isComparisonOpen && (
        <ProductComparison
          products={comparisonProducts}
          onClose={() => setIsComparisonOpen(false)}
        />
      )}
    </>
  );
}