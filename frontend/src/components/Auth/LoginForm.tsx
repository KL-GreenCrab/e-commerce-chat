import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/auth.css';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      toast.success('Đăng nhập thành công!');
      navigate('/');
    } catch (err: unknown) {
      void err;
      setError('Email hoặc mật khẩu không chính xác');
      toast.error('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Đăng nhập</h2>
          <p>Chào mừng bạn quay trở lại!</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="form-error">{error}</div>}

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

          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-gray-600 hover:text-red-600 transition-colors"
            disabled={isSubmitting || isLoading}
          >
            Quên mật khẩu?
          </button>

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
              'Đăng nhập'
            )}
          </button>
        </form>

        <div className="auth-footer">
          Chưa có tài khoản?{' '}
          <button
            onClick={() => navigate('/register')}
            className="auth-link"
            disabled={isSubmitting || isLoading}
          >
            Đăng ký ngay
          </button>
        </div>
      </div>
    </div>
  );
}