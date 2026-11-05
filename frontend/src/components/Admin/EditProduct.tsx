import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getProductById, updateProduct } from '../../services/adminService';

const initialSpecs: { [key: string]: string } = {
    Display: '',
    Processor: '',
    RAM: '',
    Storage: '',
    Camera: '',
    Battery: '',
    OS: ''
};

const EditProduct = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        category: '',
        price: '',
        originalPrice: '',
        image: '',
        images: ['', '', ''],
        stock: '',
        rating: '',
        reviews: '',
        description: '',
        specifications: { ...initialSpecs } as { [key: string]: string }
    });

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);

                const product = await getProductById(id!);

                setFormData({
                    name: product.name || '',
                    brand: product.brand || '',
                    category: product.category || '',
                    price: product.price?.toString() || '',
                    originalPrice: product.originalPrice?.toString() || '',
                    image: product.image || '',
                    images: product.images?.length ? product.images : ['', '', ''],
                    stock: product.stock?.toString() || '',
                    rating: product.rating?.toString() || '',
                    reviews: product.reviews?.toString() || '',
                    description: product.description || '',
                    specifications: product.specifications || { ...initialSpecs }
                });
            } catch (error) {
                console.error('Error fetching product:', error);
                toast.error('Không thể tải thông tin sản phẩm');
                navigate('/admin/products');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name.startsWith('specifications.')) {
            const specKey = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                specifications: { ...prev.specifications, [specKey]: value }
            }));
        } else if (name.startsWith('images.')) {
            const idx = Number(name.split('.')[1]);
            setFormData(prev => {
                const newImages = [...prev.images];
                newImages[idx] = value;
                return { ...prev, images: newImages };
            });
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Xác nhận trước khi cập nhật
            if (!window.confirm('Bạn có chắc chắn muốn cập nhật sản phẩm này?')) {
                return;
            }

            // Chuyển đổi dữ liệu từ form sang payload
            const payload = {
                ...formData,
                price: formData.price ? Number(formData.price) : 0,
                originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
                stock: formData.stock ? Number(formData.stock) : 0,
                rating: formData.rating ? Number(formData.rating) : 0,
                reviews: formData.reviews ? Number(formData.reviews) : 0,
                // Lọc các ảnh trống
                images: formData.images.filter(img => img.trim() !== '')
            };

            // Kiểm tra dữ liệu trước khi gửi
            if (payload.price <= 0) {
                toast.error('Giá sản phẩm phải lớn hơn 0');
                return;
            }

            if (payload.stock < 0) {
                toast.error('Số lượng sản phẩm không thể âm');
                return;
            }

            await updateProduct(id!, payload);
            toast.success('Cập nhật sản phẩm thành công!');
            navigate('/admin/products');
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Lỗi không xác định';
            toast.error(`Có lỗi xảy ra khi cập nhật sản phẩm: ${message}`);
            console.error('Error updating product:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Chỉnh sửa sản phẩm</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tên sản phẩm</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Thương hiệu</label>
                        <input type="text" name="brand" value={formData.brand} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Danh mục</label>
                        <input type="text" name="category" value={formData.category} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Giá bán</label>
                        <input type="number" name="price" value={formData.price} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Giá gốc</label>
                        <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Số lượng</label>
                        <input type="number" name="stock" value={formData.stock} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Rating</label>
                        <input type="number" step="0.1" name="rating" value={formData.rating} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Reviews</label>
                        <input type="number" name="reviews" value={formData.reviews} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Ảnh đại diện (image)</label>
                    <input type="url" name="image" value={formData.image} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                    {formData.image && (
                        <div className="mt-2">
                            <img src={formData.image} alt="Preview" className="h-20 w-20 object-cover rounded-md" />
                        </div>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Ảnh phụ (images - 3 link)</label>
                    <div className="grid grid-cols-3 gap-2">
                        {formData.images.map((img, idx) => (
                            <div key={idx} className="space-y-1">
                                <input
                                    type="url"
                                    name={`images.${idx}`}
                                    value={img}
                                    onChange={handleChange}
                                    placeholder={`Link ảnh ${idx + 1}`}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                {img && (
                                    <img src={img} alt={`Preview ${idx + 1}`} className="h-16 w-16 object-cover rounded-md" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Thông số kỹ thuật</label>
                    <div className="grid grid-cols-2 gap-2">
                        {Object.keys(initialSpecs).map(key => (
                            <div key={key}>
                                <label className="text-xs text-gray-500">{key}</label>
                                <input
                                    type="text"
                                    name={`specifications.${key}`}
                                    value={formData.specifications[key] || ''}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/products')}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                        Cập nhật
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProduct;
