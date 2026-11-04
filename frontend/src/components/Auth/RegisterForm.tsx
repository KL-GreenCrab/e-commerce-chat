import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Loader, Phone, MapPin } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/auth.css';

export default function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { register, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      setIsSubmitting(false);
      return;
    }
    if (password !== confirmPassword) {
      setError('Mật khẩu không khớp');
      setIsSubmitting(false);
      return;
    }
    if (!phone.trim()) {
      setError('Vui lòng nhập số điện thoại');
      setIsSubmitting(false);
      return;
    }
    if (!address.trim()) {
      setError('Vui lòng nhập địa chỉ');
      setIsSubmitting(false);
      return;
    }

    try {
      await register(name, email, password, phone, address);
      toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Đăng ký thất bại';
      if (errorMessage === 'Email already exists') {
        setError('Email đã tồn tại');
        toast.error('Email đã được sử dụng. Vui lòng sử dụng email khác.');
      } else {
        setError('Đăng ký thất bại');
        toast.error('Đăng ký thất bại. Vui lòng thử lại.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Tạo tài khoản mới</h2>
          <p>Tham gia cùng chúng tôi ngay hôm nay!</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="form-error">{error}</div>}

          <div className="form-group">
            <User className="form-icon" size={20} />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              placeholder="Họ và tên"
              required
              disabled={isSubmitting || isLoading}
            />
          </div>

          <div className="form-group">
            <Mail className="form-icon" size={20} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="Địa chỉ email"
              required
              disabled={isSubmitting || isLoading}
            />
          </div>

          <div className="form-group">
            <Phone className="form-icon" size={20} />
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="form-input"
              placeholder="Số điện thoại"
              required
              disabled={isSubmitting || isLoading}
            />
          </div>

          <div className="form-group">
            <MapPin className="form-icon" size={20} />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="form-input"
              placeholder="Địa chỉ"
              required
              disabled={isSubmitting || isLoading}
            />
          </div>

          <div className="form-group">
            <Lock className="form-icon" size={20} />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="Mật khẩu"
              required
              disabled={isSubmitting || isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="password-toggle"
              disabled={isSubmitting || isLoading}
            >
              {showPassword ? 'Ẩn' : 'Hiện'}
            </button>
          </div>

          <div className="form-group">
            <Lock className="form-icon" size={20} />
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-input"
              placeholder="Xác nhận mật khẩu"
              required
              disabled={isSubmitting || isLoading}
            />
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting || isLoading ? (
              <>
                <Loader className="loading-spinner" size={20} />
                Đang xử lý...
              </>
            ) : (
              'Tạo tài khoản'
            )}
          </button>
        </form>

        <div className="auth-footer">
          Đã có tài khoản?{' '}
          <button
            onClick={() => navigate('/login')}
            className="auth-link"
            disabled={isSubmitting || isLoading}
          >
            Đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
}