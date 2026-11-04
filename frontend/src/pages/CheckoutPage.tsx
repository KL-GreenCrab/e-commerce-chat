import React from 'react';
import { Checkout } from '../components/Checkout/Checkout';
import { useCartContext } from '../hooks/CartProvider';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { OrderData } from '../types';

const CheckoutPage: React.FC = () => {
  const { cartItems, getTotal, clear } = useCartContext();
  const navigate = useNavigate();

  const handlePlaceOrder = async (orderData: OrderData) => {
    void orderData;
    try {
      // Here you would normally call an API to create the order
      await clear();
      toast.success('Đặt hàng thành công!');
      navigate('/order-success');
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
      throw error;
    }
  };

  return (
    <Checkout
      cartItems={cartItems}
      total={getTotal()}
      onPlaceOrder={handlePlaceOrder}
    />
  );
};

export default CheckoutPage;
