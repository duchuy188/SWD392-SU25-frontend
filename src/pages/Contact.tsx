import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, AlertCircle, CheckCircle } from 'lucide-react';
import Container from '../components/ui/Container';
import MainLayout from '../components/layout/MainLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Contact: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    
    if (!formState.name.trim()) newErrors.name = 'Vui lòng nhập họ tên';
    
    if (!formState.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    if (!formState.subject.trim()) newErrors.subject = 'Vui lòng nhập tiêu đề';
    if (!formState.message.trim()) newErrors.message = 'Vui lòng nhập nội dung';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setFormStatus('submitting');
    
    // Simulate API call
    setTimeout(() => {
      setFormStatus('success');
      setFormState({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Reset form status after 3 seconds
      setTimeout(() => {
        setFormStatus('idle');
      }, 3000);
    }, 1500);
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-500 to-secondary-600 py-16">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              className="text-3xl md:text-4xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Liên hệ với chúng tôi
            </motion.h1>
            <motion.p 
              className="text-lg text-white/90"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Chúng tôi luôn sẵn sàng hỗ trợ bạn mọi thắc mắc về học tập và hướng nghiệp
            </motion.p>
          </div>
        </Container>
      </section>

      {/* Contact Form Section */}
      <section className="py-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-soft p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Gửi tin nhắn</h2>
                
                {formStatus === 'success' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mb-6 p-4 bg-success-50 text-success-700 rounded-lg flex items-start"
                  >
                    <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <p>Tin nhắn của bạn đã được gửi thành công. Chúng tôi sẽ phản hồi trong thời gian sớm nhất!</p>
                  </motion.div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <Input
                      label="Họ tên"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      error={errors.name}
                      fullWidth
                    />
                    <Input
                      label="Email"
                      name="email"
                      type="email"
                      value={formState.email}
                      onChange={handleChange}
                      error={errors.email}
                      fullWidth
                    />
                  </div>
                  
                  <div className="mb-6">
                    <Input
                      label="Tiêu đề"
                      name="subject"
                      value={formState.subject}
                      onChange={handleChange}
                      error={errors.subject}
                      fullWidth
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Nội dung
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formState.message}
                      onChange={handleChange}
                      className={`w-full rounded-lg border ${
                        errors.message ? 'border-error-500' : 'border-gray-300'
                      } px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200`}
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-error-500">{errors.message}</p>
                    )}
                  </div>
                  
                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    size="lg"
                    isLoading={formStatus === 'submitting'}
                    icon={<Send size={18} />}
                  >
                    Gửi tin nhắn
                  </Button>
                </form>
              </div>
            </div>
            
            {/* Contact Info */}
            <div className="lg:col-span-2">
              <div className="bg-gray-50 rounded-xl p-6 md:p-8 h-full">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Thông tin liên hệ</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-primary-100 rounded-full p-3 mr-4">
                      <MapPin className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Địa chỉ</h3>
                      <p className="text-gray-600">Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-primary-100 rounded-full p-3 mr-4">
                      <Mail className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                      <p className="text-gray-600">
                        <a href="mailto:contact@edubot.vn" className="hover:text-primary-600">
                          contact@edubot.vn
                        </a>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-primary-100 rounded-full p-3 mr-4">
                      <Phone className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Số điện thoại</h3>
                      <p className="text-gray-600">
                        <a href="tel:+842412345678" className="hover:text-primary-600">
                          (024) 123 456 789
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-10">
                  <h3 className="font-semibold text-gray-900 mb-3">Giờ làm việc</h3>
                  <p className="text-gray-600 mb-2">Thứ Hai - Thứ Sáu: 8:00 - 17:30</p>
                  <p className="text-gray-600">Thứ Bảy: 8:00 - 12:00</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </MainLayout>
  );
};

export default Contact;