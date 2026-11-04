import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { saveCard } from '../../services/cardService';
import { X, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface AddCardFormProps {
    onCancel: () => void;
    onSuccess: () => void;
}

export const AddCardForm: React.FC<AddCardFormProps> = ({ onCancel, onSuccess }) => {
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        isDefault: false
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            toast.error('Vui lòng đăng nhập để lưu thẻ');
            return;
        }

        // Basic validation
        if (!formData.cardNumber || !formData.cardName || !formData.expiryDate) {
            toast.error('Vui lòng điền đầy đủ thông tin thẻ');
            return;
        }

        // Validate card number (simple check for demo)
        if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
            toast.error('Số thẻ không hợp lệ');
            return;
        }

        setIsSubmitting(true);

        try {
            saveCard(user._id, formData);
            toast.success('Thẻ đã được lưu thành công');
            onSuccess();
        } catch {
            toast.error('Không thể lưu thẻ. Vui lòng thử lại');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Thêm thẻ mới</h3>
                <button
                    onClick={onCancel}
                    className="p-1 hover:bg-gray-100 rounded-full"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Số thẻ
                    </label>
                    <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        maxLength={19}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên trên thẻ
                    </label>
                    <input
                        type="text"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        placeholder="NGUYEN VAN A"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ngày hết hạn
                    </label>
                    <input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        maxLength={5}
                    />
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="isDefault"
                        name="isDefault"
                        checked={formData.isDefault}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">
                        Đặt làm thẻ mặc định
                    </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        disabled={isSubmitting}
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Đang lưu...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                Lưu thẻ
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}; 