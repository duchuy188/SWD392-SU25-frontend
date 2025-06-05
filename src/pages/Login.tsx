import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, AlertCircle, School } from 'lucide-react';
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
  
  const { login } = useAuth();
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

  // Demo accounts info
  const demoAccounts = [
    { role: 'Student', email: 'student@example.com', password: '123456' },
    { role: 'Teacher', email: 'teacher@example.com', password: '123456' },
    { role: 'Counselor', email: 'counselor@example.com', password: '123456' },
    { role: 'Admin', email: 'admin@example.com', password: '123456' }
  ];

  const loginWithDemo = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
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
                
                <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-500">
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
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Chưa có tài khoản?{' '}
                <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </div>
          
          {/* Demo accounts section */}
          <div className="bg-gray-50 p-6 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Tài khoản demo:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {demoAccounts.map((account, index) => (
                <div 
                  key={index}
                  className="bg-white p-3 rounded-md border border-gray-200 cursor-pointer hover:shadow-sm transition-shadow"
                  onClick={() => loginWithDemo(account.email, account.password)}
                >
                  <div className="text-sm font-medium text-gray-900 mb-1">{account.role}</div>
                  <div className="text-xs text-gray-500">{account.email} / {account.password}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </Container>
    </MainLayout>
  );
};

export default Login;