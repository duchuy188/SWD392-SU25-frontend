import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, AlertCircle, School } from 'lucide-react';
import Container from '../components/ui/Container';
import MainLayout from '../components/layout/MainLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

const Register: React.FC = () => {
  const [formState, setFormState] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formState.fullName.trim()) newErrors.fullName = 'Vui lòng nhập họ tên';
    
    if (!formState.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    if (!formState.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formState.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    
    if (formState.password !== formState.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');
    
    if (!validate()) return;
    
    setIsLoading(true);
    
    try {
      const success = await register(
        {
          fullName: formState.fullName,
          email: formState.email
        },
        formState.password
      );
      
      if (success) {
        navigate('/');
      } else {
        setGeneralError('Email đã được sử dụng. Vui lòng chọn email khác.');
      }
    } catch (err) {
      setGeneralError('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
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
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Tạo tài khoản EduBot</h1>
              <p className="text-gray-600">
                Đăng ký để nhận tư vấn học tập và hướng nghiệp cá nhân hóa
              </p>
            </div>
            
            {generalError && (
              <div className="mb-6 p-3 bg-error-50 text-error-700 rounded-lg flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                <p>{generalError}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Họ tên"
                name="fullName"
                value={formState.fullName}
                onChange={handleChange}
                leftIcon={<User size={18} />}
                error={errors.fullName}
                fullWidth
              />
              
              <Input
                label="Email"
                name="email"
                type="email"
                value={formState.email}
                onChange={handleChange}
                leftIcon={<Mail size={18} />}
                error={errors.email}
                fullWidth
              />
              
              <Input
                label="Mật khẩu"
                name="password"
                type="password"
                value={formState.password}
                onChange={handleChange}
                leftIcon={<Lock size={18} />}
                error={errors.password}
                fullWidth
              />
              
              <Input
                label="Xác nhận mật khẩu"
                name="confirmPassword"
                type="password"
                value={formState.confirmPassword}
                onChange={handleChange}
                leftIcon={<Lock size={18} />}
                error={errors.confirmPassword}
                fullWidth
              />
              
              <div className="flex items-center">
                <input 
                  id="terms" 
                  type="checkbox" 
                  className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                  required
                />
                <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                  Tôi đồng ý với <a href="#" className="text-primary-600 hover:text-primary-500">Điều khoản sử dụng</a> và <a href="#" className="text-primary-600 hover:text-primary-500">Chính sách bảo mật</a>
                </label>
              </div>
              
              <Button
                type="submit"
                variant="primary"
                fullWidth
                size="lg"
                isLoading={isLoading}
              >
                Đăng ký
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Đã có tài khoản?{' '}
                <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                  Đăng nhập
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </Container>
    </MainLayout>
  );
};

export default Register;