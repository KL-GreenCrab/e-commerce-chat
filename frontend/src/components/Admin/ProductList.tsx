import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, deleteProduct } from '../../services/adminService';
import { toast } from 'react-toastify';
import { Product } from '../../types';
import { Trash2, Edit, Plus, Search } from 'lucide-react';

const ProductList = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await getProducts();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Không thể tải danh sách sản phẩm');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (productId: string) => {
        setConfirmDelete(productId);
    };

    const handleConfirmDelete = async (productId: string) => {
        try {
            await deleteProduct(productId);
            setProducts(products.filter(product => product._id !== productId));
            toast.success('Xóa sản phẩm thành công');
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error('Không thể xóa sản phẩm');
        } finally {
            setConfirmDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setConfirmDelete(null);
    };

    const handleEditClick = (productId: string) => {
        navigate(`/admin/edit-product/${productId}`);
    };

    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6 bg-white border-b border-gray-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Quản lý sản phẩm</h2>
                    <button
                        onClick={() => navigate('/admin/add-product')}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center"
                    >
                        <Plus className="h-5 w-5 mr-1" />
                        Thêm sản phẩm
                    </button>
                </div>

                <div className="mb-6 relative">
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                        <div className="pl-3">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Tìm kiếm sản phẩm..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full py-2 px-3 focus:outline-none"
                        />
                    </div>
                </div>

                {filteredProducts.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Không tìm thấy sản phẩm nào</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Sản phẩm
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Danh mục
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Giá
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tồn kho
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredProducts.map((product) => (
                                    <tr key={product._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <img
                                                        className="h-10 w-10 rounded-md object-cover"
                                                        src={product.image}
                                                        alt={product.name}
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.src = 'https://via.placeholder.com/150?text=No+Image';
                                                        }}
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                    <div className="text-sm text-gray-500">{product.brand}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{product.category}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{formatPrice(product.price)}</div>
                                            {product.originalPrice && product.originalPrice > product.price && (
                                                <div className="text-sm text-gray-500 line-through">
                                                    {formatPrice(product.originalPrice)}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                product.stock > 10 ? 'bg-green-100 text-green-800' : 
                                                product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {confirmDelete === product._id ? (
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleConfirmDelete(product._id)}
                                                        className="text-red-600 hover:text-red-900 bg-red-100 px-2 py-1 rounded"
                                                    >
                                                        Xác nhận
                                                    </button>
                                                    <button
                                                        onClick={handleCancelDelete}
                                                        className="text-gray-600 hover:text-gray-900 bg-gray-100 px-2 py-1 rounded"
                                                    >
                                                        Hủy
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleEditClick(product._id)}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                        title="Chỉnh sửa"
                                                    >
                                                        <Edit className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(product._id)}
                                                        className="text-red-600 hover:text-red-900"
                                                        title="Xóa"
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductList;
