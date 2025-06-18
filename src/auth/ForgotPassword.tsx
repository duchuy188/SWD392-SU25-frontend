import React, { useState } from 'react';
import Container from '../components/ui/Container';
import MainLayout from '../components/layout/MainLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { userServices } from '../services/userServices';
import { useNavigate } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (!email.trim()) {
      setError('Vui lòng nhập email');
      return;
    }
    setIsLoading(true);
    try {
      await userServices.forgotPassword(email);
      setMessage('Đã gửi mã OTP về email nếu tài khoản tồn tại. Vui lòng kiểm tra hộp thư.');
      navigate('/verify-otp', { state: { email } });
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        setError('Email không tồn tại trong hệ thống. Vui lòng kiểm tra lại.');
      } else {
        setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <Container size="sm" className="py-16">
        <div className="bg-white rounded-xl shadow-soft overflow-hidden p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Quên mật khẩu</h1>
          <p className="mb-6 text-gray-600">Nhập email để nhận mã OTP đặt lại mật khẩu.</p>
          {message && <div className="mb-4 p-3 bg-success-50 text-success-700 rounded">{message}</div>}
          {error && <div className="mb-4 p-3 bg-error-50 text-error-700 rounded">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              fullWidth
              required
            />
            
            <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
              Gửi mã OTP
            </Button>
          </form>
        </div>
      </Container>
    </MainLayout>
  );
};

export default ForgotPassword; 