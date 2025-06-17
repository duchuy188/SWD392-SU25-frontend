import React, { useState, useEffect } from 'react';
import Container from '../components/ui/Container';
import MainLayout from '../components/layout/MainLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { userServices } from '../services/userServices';
import { useLocation, useNavigate } from 'react-router-dom';

const VerifyOtp: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (location.state && (location.state as any).email) {
      setEmail((location.state as any).email);
    }
  }, [location.state]);

  // Chỉ cho phép nhập tối đa 6 số
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 6) setOtp(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (!email.trim()) {
      setError('Vui lòng nhập email');
      return;
    }
    if (otp.length !== 6) {
      setError('Mã OTP phải gồm 6 số');
      return;
    }
    setIsLoading(true);
    try {
      const response = await userServices.verifyOtp(email, otp);
      const resetToken = response?.data?.resetToken;
      setMessage('Xác thực OTP thành công!');
      setTimeout(() => {
        navigate('/reset-password', { state: { email, resetToken } });
      }, 800);
    } catch (err) {
      setError('Mã OTP không đúng hoặc đã hết hạn.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <Container size="sm" className="py-16">
        <div className="bg-white rounded-xl shadow-soft overflow-hidden p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Xác thực mã OTP</h1>
          <p className="mb-6 text-gray-600">Nhập email và mã OTP gồm 6 số đã gửi về email của bạn.</p>
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
            <Input
              label="Mã OTP"
              type="text"
              value={otp}
              onChange={handleOtpChange}
              maxLength={6}
              fullWidth
              required
              inputMode="numeric"
              pattern="[0-9]{6}"
            />
            <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
              Xác thực OTP
            </Button>
          </form>
        </div>
      </Container>
    </MainLayout>
  );
};

export default VerifyOtp; 