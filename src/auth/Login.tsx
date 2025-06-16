import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, AlertCircle, School } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import Container from '../components/ui/Container';
import MainLayout from '../components/layout/MainLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';


const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from location state or default to home
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Simple validation
    if (!email.trim()) {
      setError('Vui lòng nhập email');
      return;
    }
    
    if (!password) {
      setError('Vui lòng nhập mật khẩu');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      
      if (success) {
        // Redirect to the page they were trying to access or home
        navigate(from, { replace: true });
      } else {
        setError('Email hoặc mật khẩu không chính xác');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const success = await googleLogin(credentialResponse.credential);
      if (success) {
        navigate(from, { replace: true });
      } else {
        setError('Đăng nhập bằng Google thất bại');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi đăng nhập bằng Google');
    }
  };

  const handleGoogleError = () => {
    setError('Đăng nhập bằng Google thất bại');
  };

  return (
    <MainLayout>
      <Container size="sm" className="py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-soft overflow-hidden"
        >
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <School className="h-12 w-12 text-primary-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Đăng nhập vào EduBot</h1>
              <p className="text-gray-600">
                Đăng nhập để trải nghiệm đầy đủ tính năng của nền tảng
              </p>
            </div>
            
            {error && (
              <div className="mb-6 p-3 bg-error-50 text-error-700 rounded-lg flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail size={18} />}
                fullWidth
              />
              
              <Input
                label="Mật khẩu"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock size={18} />}
                fullWidth
              />
              
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50" />
                  <span className="ml-2 text-sm text-gray-600">Ghi nhớ đăng nhập</span>
                </label>
                
                <a href="/forgot-password" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                  Quên mật khẩu?
                </a>
              </div>
              
              <Button
                type="submit"
                variant="primary"
                fullWidth
                size="lg"
                isLoading={isLoading}
              >
                Đăng nhập
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Hoặc đăng nhập với</span>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    useOneTap
                    theme="filled_blue"
                    text="signin_with"
                    shape="rectangular"
                    locale="vi"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Chưa có tài khoản?{' '}
                <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </Container>
    </MainLayout>
  );
};

export default Login;