import React, { useState, useEffect } from 'react';
import Container from '../components/ui/Container';
import MainLayout from '../components/layout/MainLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { userServices } from '../services/userServices';
import { useLocation, useNavigate } from 'react-router-dom';

const ResetPassword: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (location.state && (location.state as any).email) {
      setEmail((location.state as any).email);
    }
    if (location.state && (location.state as any).resetToken) {
      setResetToken((location.state as any).resetToken);
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (!email.trim() || !resetToken.trim() || !newPassword.trim()) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    setIsLoading(true);
    try {
      await userServices.resetPassword(email, resetToken, newPassword);
      setMessage('Đặt lại mật khẩu thành công! Đang chuyển về trang đăng nhập...');
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (err) {
      setError('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <Container size="sm" className="py-16">
        <div className="bg-white rounded-xl shadow-soft overflow-hidden p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Đặt lại mật khẩu</h1>
          <p className="mb-6 text-gray-600">Nhập email, mã token và mật khẩu mới để đặt lại mật khẩu.</p>
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
              disabled={!!(location.state && (location.state as any).email)}
            />
          
            <input type="hidden" value={resetToken} />
            <Input
              label="Mật khẩu mới"
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              fullWidth
              required
            />
            <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
              Đặt lại mật khẩu
            </Button>
          </form>
        </div>
      </Container>
    </MainLayout>
  );
};

export default ResetPassword; 