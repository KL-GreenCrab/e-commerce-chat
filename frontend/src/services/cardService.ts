export interface SavedCard {
    _id: string;
    userId: string;
    cardNumber: string;
    cardName: string;
    expiryDate: string;
    isDefault: boolean;
}

const cardStore = new Map<string, SavedCard[]>();

// Get saved cards for a user
export const getSavedCards = (userId: string): SavedCard[] => {
    return cardStore.get(userId) ?? [];
};

// Save a new card
export const saveCard = (userId: string, cardData: Omit<SavedCard, '_id' | 'userId'>): SavedCard => {
    const cards = getSavedCards(userId);
    const _id = Date.now().toString();

    const newCard: SavedCard = {
        _id,
        userId,
        ...cardData
    };

    if (cards.length === 0) {
        newCard.isDefault = true;
    }

    const updatedCards = [...cards, newCard];
    cardStore.set(userId, updatedCards);

    return newCard;
};

// Set a card as default
export const setDefaultCard = (userId: string, cardId: string): void => {
    const cards = getSavedCards(userId);
    const updatedCards = cards.map(card => ({
        ...card,
        isDefault: card._id === cardId
    }));

    cardStore.set(userId, updatedCards);
};

// Delete a saved card
export const deleteCard = (userId: string, cardId: string): void => {
    const cards = getSavedCards(userId);
    const filteredCards = cards.filter(card => card._id !== cardId);

    if (cards.find(card => card._id === cardId)?.isDefault && filteredCards.length > 0) {
        filteredCards[0].isDefault = true;
    }

    cardStore.set(userId, filteredCards);
};

// Get the default card for a user
export const getDefaultCard = (userId: string): SavedCard | null => {
    const cards = getSavedCards(userId);
    return cards.find(card => card.isDefault) || null;
};