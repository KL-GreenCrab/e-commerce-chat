import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { SavedCard, getSavedCards, deleteCard, setDefaultCard } from '../../services/cardService';
import { CreditCard, Trash2, Star, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface SavedCardsProps {
    onSelectCard: (card: SavedCard) => void;
    onAddNewCard: () => void;
}

export const SavedCards: React.FC<SavedCardsProps> = ({ onSelectCard, onAddNewCard }) => {
    const { user } = useAuth();
    const [cards, setCards] = useState<SavedCard[]>([]);
    const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            const userCards = getSavedCards(user._id);
            setCards(userCards);

            // Select the default card if available
            const defaultCard = userCards.find(card => card.isDefault);
            if (defaultCard) {
                setSelectedCardId(defaultCard._id);
                onSelectCard(defaultCard);
            }
        }
    }, [user, onSelectCard]);

    const handleSelectCard = (card: SavedCard) => {
        setSelectedCardId(card._id);
        onSelectCard(card);
    };

    const handleSetDefault = (cardId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (user) {
            setDefaultCard(user._id, cardId);
            setCards(getSavedCards(user._id));
            toast.success('Thẻ mặc định đã được cập nhật');
        }
    };

    const handleDeleteCard = (cardId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (user) {
            deleteCard(user._id, cardId);
            setCards(getSavedCards(user._id));

            // If we deleted the selected card, select another one if available
            if (cardId === selectedCardId && cards.length > 0) {
                const newDefaultCard = cards.find(card => card._id !== cardId);
                if (newDefaultCard) {
                    setSelectedCardId(newDefaultCard._id);
                    onSelectCard(newDefaultCard);
                } else {
                    setSelectedCardId(null);
                }
            }

            toast.success('Thẻ đã được xóa');
        }
    };

    if (!user) {
        return (
            <div className="text-center py-4">
                <p className="text-gray-500">Vui lòng đăng nhập để xem thẻ đã lưu</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Thẻ đã lưu</h3>
                <button
                    onClick={onAddNewCard}
                    className="flex items-center text-blue-600 hover:text-blue-700"
                >
                    <Plus className="h-4 w-4 mr-1" />
                    Thêm thẻ mới
                </button>
            </div>

            {cards.length === 0 ? (
                <div className="text-center py-4 border border-dashed border-gray-300 rounded-md">
                    <p className="text-gray-500">Bạn chưa có thẻ nào được lưu</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {cards.map(card => (
                        <div
                            key={card._id}
                            className={`p-4 border rounded-md cursor-pointer transition-colors ${selectedCardId === card._id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                            onClick={() => handleSelectCard(card)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <CreditCard className="h-5 w-5 mr-2 text-gray-500" />
                                    <div>
                                        <p className="font-medium">
                                            {card.cardName}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            **** **** **** {card.cardNumber.slice(-4)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {card.isDefault && (
                                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                            Mặc định
                                        </span>
                                    )}
                                    {!card.isDefault && (
                                        <button
                                            onClick={(e) => handleSetDefault(card._id, e)}
                                            className="p-1 text-gray-400 hover:text-yellow-500"
                                            title="Đặt làm mặc định"
                                        >
                                            <Star className="h-4 w-4" />
                                        </button>
                                    )}
                                    <button
                                        onClick={(e) => handleDeleteCard(card._id, e)}
                                        className="p-1 text-gray-400 hover:text-red-500"
                                        title="Xóa thẻ"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}; 