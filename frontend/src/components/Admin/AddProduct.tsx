import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';

const initialSpecs: { [key: string]: string } = {
    Display: '',
    Processor: '',
    RAM: '',
    Storage: '',
    Camera: '',
    Battery: '',
    OS: ''
};

const AddProduct = () => {
    const navigate = useNavigate();
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
            const payload = {
                ...formData,
                price: Number(formData.price),
                originalPrice: Number(formData.originalPrice),
                stock: Number(formData.stock),
                rating: formData.rating ? Number(formData.rating) : undefined,
                reviews: formData.reviews ? Number(formData.reviews) : undefined
            };

            await api.post('/admin/add-product', payload);
            toast.success('Thêm sản phẩm thành công!');
            navigate('/admin/products');
        } catch (error) {
            toast.error('Có lỗi xảy ra khi thêm sản phẩm');
            console.error('Error adding product:', error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Thêm Sản Phẩm Mới (Đầy đủ trường)</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tên sản phẩm</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Thương hiệu</label>
                        <input type="text" name="brand" value={formData.brand} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Danh mục</label>
                        <input type="text" name="category" value={formData.category} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Giá bán</label>
                        <input type="number" name="price" value={formData.price} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Giá gốc</label>
                        <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Số lượng</label>
                        <input type="number" name="stock" value={formData.stock} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Rating</label>
                        <input type="number" step="0.1" name="rating" value={formData.rating} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Reviews</label>
                        <input type="number" name="reviews" value={formData.reviews} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Ảnh đại diện (image)</label>
                    <input type="url" name="image" value={formData.image} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Ảnh phụ (images - 3 link)</label>
                    <div className="grid grid-cols-3 gap-2">
                        {formData.images.map((img, idx) => (
                            <input
                                key={idx}
                                type="url"
                                name={`images.${idx}`}
                                value={img}
                                onChange={handleChange}
                                placeholder={`Link ảnh ${idx + 1}`}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            />
                        ))}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
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
                                    value={formData.specifications[key]}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex justify-end gap-3">
                    <button type="button" onClick={() => navigate('/admin/products')} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                        Hủy
                    </button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        Thêm sản phẩm
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;