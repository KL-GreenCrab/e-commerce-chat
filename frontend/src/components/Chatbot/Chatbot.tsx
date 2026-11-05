import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import api from '../../services/api';

interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    url: string;
}

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
    products?: Product[];
    category?: string;
    brands?: string[];
    intent?: string;
    product?: Product;
}

export const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Thêm tin nhắn chào mừng khi mở chatbot
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([
                {
                    id: '1',
                    text: 'Xin chào! Tôi là trợ lý ảo của cửa hàng. Tôi có thể giúp bạn tìm sản phẩm theo loại, thương hiệu hoặc tầm giá. Bạn cần tôi tư vấn gì?',
                    sender: 'bot',
                    timestamp: new Date(),
                },
            ]);
        }
    }, [isOpen, messages.length]);

    // Cuộn xuống tin nhắn mới nhất
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (customMessage?: string) => {
        const messageText = customMessage || input;

        if (!messageText.trim()) return;

        // Thêm tin nhắn của người dùng
        const userMessage: Message = {
            id: Date.now().toString(),
            text: messageText,
            sender: 'user',
            timestamp: new Date(),
        };

        if (!customMessage) {
            setMessages(prev => [...prev, userMessage]);
            setInput('');
        }

        setIsLoading(true);

        try {
            console.log('Sending message to server:', messageText);

            // Gửi tin nhắn đến server sử dụng axios
            // Sử dụng URL tương đối để tận dụng proxy trong vite.config.ts
            const response = await api.post('/chatbot/message',
                { message: messageText },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }
            );

            // Axios tự động ném lỗi nếu status không phải 2xx
            const data = response.data;
            console.log('Received response from server:', data);

            // Thêm tin nhắn từ bot
            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: data.text,
                sender: 'bot',
                timestamp: new Date(),
                products: data.products,
                category: data.category,
                brands: data.brands,
                intent: data.intent,
                product: data.product,
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error: unknown) {
            console.error('Error sending message:', error);

            let errorMessage = 'Không xác định';

            if (api.isAxiosError(error)) {
                // Xử lý lỗi Axios
                if (error.response) {
                    // Server trả về lỗi với status code
                    console.error('Server error data:', error.response.data);
                    console.error('Server error status:', error.response.status);
                    errorMessage = `Lỗi server (${error.response.status}): ${error.response.data.message || error.message}`;
                } else if (error.request) {
                    // Yêu cầu được gửi nhưng không nhận được phản hồi
                    console.error('No response received:', error.request);
                    errorMessage = 'Không nhận được phản hồi từ server';
                } else {
                    // Lỗi khi thiết lập yêu cầu
                    errorMessage = `Lỗi khi gửi yêu cầu: ${error.message}`;
                }
            } else {
                // Lỗi không phải từ Axios
                errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định';
            }

            // Thêm tin nhắn lỗi với thông tin chi tiết hơn
            setMessages(prev => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    text: `Xin lỗi, tôi đang gặp sự cố kết nối: ${errorMessage}. Vui lòng thử lại sau.`,
                    sender: 'bot',
                    timestamp: new Date(),
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    // Định dạng giá tiền
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    // Lấy tên hiển thị của danh mục
    const getCategoryDisplayName = (category?: string) => {
        if (!category) return '';

        const categoryNames: Record<string, string> = {
            'Smartphones': 'điện thoại',
            'Laptops': 'laptop',
            'Tablets': 'máy tính bảng',
            'Accessories': 'phụ kiện'
        };

        return categoryNames[category] || category.toLowerCase();
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {/* Nút mở chatbot */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700 transition-colors"
                    aria-label="Mở trợ lý ảo"
                >
                    <MessageCircle className="h-6 w-6" />
                </button>
            )}

            {/* Cửa sổ chatbot */}
            {isOpen && (
                <div className="bg-white rounded-lg shadow-xl w-80 sm:w-96 h-[500px] flex flex-col">
                    {/* Header */}
                    <div className="bg-red-600 text-white p-3 rounded-t-lg flex justify-between items-center">
                        <div className="flex items-center">
                            <MessageCircle className="h-5 w-5 mr-2" />
                            <h3 className="font-medium">Trợ lý ảo</h3>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:text-gray-200 rounded-full p-1 hover:bg-red-700 transition-colors"
                            aria-label="Đóng trợ lý ảo"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map(message => (
                            <div
                                key={message.id}
                                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-lg p-3 shadow-sm ${message.sender === 'user'
                                        ? 'bg-red-100 text-gray-800'
                                        : 'bg-white text-gray-800 border border-gray-100'
                                        }`}
                                >
                                    <p className="text-sm">{message.text}</p>

                                    {/* Hiển thị thương hiệu theo danh mục nếu có */}
                                    {message.brands && message.brands.length > 0 && (
                                        <div className="mt-3">
                                            <p className="font-medium text-gray-700 mb-2">Thương hiệu trong danh mục {getCategoryDisplayName(message.category)}:</p>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {message.brands.map(brand => (
                                                    <button
                                                        key={brand}
                                                        onClick={() => {
                                                            const brandMessage = `Tôi muốn xem sản phẩm của ${brand}`;
                                                            setMessages(prev => [
                                                                ...prev,
                                                                {
                                                                    id: Date.now().toString(),
                                                                    text: brandMessage,
                                                                    sender: 'user',
                                                                    timestamp: new Date(),
                                                                }
                                                            ]);
                                                            handleSendMessage(brandMessage);
                                                        }}
                                                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm py-1 px-3 rounded-full transition-colors"
                                                    >
                                                        {brand}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Hiển thị gợi ý tầm giá khi có sản phẩm và intent là product_search hoặc brand_recommendation */}
                                    {message.products && message.products.length > 0 &&
                                        (message.intent === 'product_search' || message.intent === 'brand_recommendation') && (
                                            <div className="mt-3 mb-3">
                                                <p className="font-medium text-gray-700 mb-2">Bạn quan tâm đến tầm giá nào?</p>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    <button
                                                        onClick={() => {
                                                            const priceMessage = "Tôi muốn tìm sản phẩm dưới 500 USD";
                                                            setMessages(prev => [
                                                                ...prev,
                                                                {
                                                                    id: Date.now().toString(),
                                                                    text: priceMessage,
                                                                    sender: 'user',
                                                                    timestamp: new Date(),
                                                                }
                                                            ]);
                                                            handleSendMessage(priceMessage);
                                                        }}
                                                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm py-1 px-3 rounded-full transition-colors"
                                                    >
                                                        Dưới $500
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            const priceMessage = "Tôi muốn tìm sản phẩm từ 500 đến 1000 USD";
                                                            setMessages(prev => [
                                                                ...prev,
                                                                {
                                                                    id: Date.now().toString(),
                                                                    text: priceMessage,
                                                                    sender: 'user',
                                                                    timestamp: new Date(),
                                                                }
                                                            ]);
                                                            handleSendMessage(priceMessage);
                                                        }}
                                                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm py-1 px-3 rounded-full transition-colors"
                                                    >
                                                        $500 - $1000
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            const priceMessage = "Tôi muốn tìm sản phẩm từ 1000 đến 2000 USD";
                                                            setMessages(prev => [
                                                                ...prev,
                                                                {
                                                                    id: Date.now().toString(),
                                                                    text: priceMessage,
                                                                    sender: 'user',
                                                                    timestamp: new Date(),
                                                                }
                                                            ]);
                                                            handleSendMessage(priceMessage);
                                                        }}
                                                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm py-1 px-3 rounded-full transition-colors"
                                                    >
                                                        $1000 - $2000
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            const priceMessage = "Tôi muốn tìm sản phẩm trên 2000 USD";
                                                            setMessages(prev => [
                                                                ...prev,
                                                                {
                                                                    id: Date.now().toString(),
                                                                    text: priceMessage,
                                                                    sender: 'user',
                                                                    timestamp: new Date(),
                                                                }
                                                            ]);
                                                            handleSendMessage(priceMessage);
                                                        }}
                                                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm py-1 px-3 rounded-full transition-colors"
                                                    >
                                                        Trên $2000
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                    {/* Hiển thị sản phẩm nếu có */}
                                    {message.products && message.products.length > 0 && (
                                        <div className="mt-3 space-y-3">
                                            <p className="font-medium text-gray-700 mb-2">Sản phẩm gợi ý:</p>
                                            <div className="grid grid-cols-1 gap-3">
                                                {message.products.map(product => (
                                                    <a
                                                        key={product.id}
                                                        href={product.url}
                                                        className="block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                                                    >
                                                        <div className="flex items-center p-2">
                                                            <div className="flex-shrink-0">
                                                                <img
                                                                    src={product.image}
                                                                    alt={product.name}
                                                                    className="w-16 h-16 object-cover rounded-md"
                                                                    onError={(e) => {
                                                                        const target = e.target as HTMLImageElement;
                                                                        target.src = 'https://via.placeholder.com/150?text=No+Image';
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="ml-3 flex-1">
                                                                <p className="font-medium text-sm text-gray-900 line-clamp-2">{product.name}</p>
                                                                <p className="text-red-600 font-semibold text-sm mt-1">
                                                                    {formatPrice(product.price)}
                                                                </p>
                                                            </div>
                                                            <div className="ml-2">
                                                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-600">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                                    </svg>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Hiển thị sản phẩm tư vấn chi tiết nếu có */}
                                    {message.product && (
                                        <div className="mt-3">
                                            <p className="font-medium text-gray-700 mb-2">Sản phẩm đang tư vấn:</p>
                                            <a
                                                href={message.product.url}
                                                className="block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow max-w-xs"
                                            >
                                                <div className="flex items-center p-2">
                                                    <div className="flex-shrink-0">
                                                        <img
                                                            src={message.product.image}
                                                            alt={message.product.name}
                                                            className="w-16 h-16 object-cover rounded-md"
                                                            onError={(e) => {
                                                                const target = e.target as HTMLImageElement;
                                                                target.src = 'https://via.placeholder.com/150?text=No+Image';
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="ml-3 flex-1">
                                                        <p className="font-medium text-sm text-gray-900 line-clamp-2">{message.product.name}</p>
                                                        <p className="text-red-600 font-semibold text-sm mt-1">
                                                            {formatPrice(message.product.price)}
                                                        </p>
                                                    </div>
                                                    <div className="ml-2">
                                                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-600">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </span>
                                                    </div>
                                                </div>
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Loading indicator */}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                                    <div className="flex space-x-2">
                                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-75"></div>
                                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-150"></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 border-t bg-white">
                        <div className="flex items-center">
                            <input
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && !isLoading && input.trim() && handleSendMessage()}
                                placeholder="Nhập tin nhắn..."
                                disabled={isLoading}
                                className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                            <button
                                onClick={() => handleSendMessage()}
                                disabled={isLoading || !input.trim()}
                                className="bg-red-600 text-white px-4 py-2 rounded-r-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Gửi tin nhắn"
                            >
                                <Send className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="text-xs text-gray-500 mt-2 text-center">
                            Hỏi về loại sản phẩm, thương hiệu, tầm giá, vận chuyển, thanh toán hoặc đổi trả
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
