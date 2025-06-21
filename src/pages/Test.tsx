import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, Brain, Clock, ArrowRight, Loader } from 'lucide-react';
import Container from '../components/ui/Container';
import MainLayout from '../components/layout/MainLayout';
import Card, { CardBody, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { testServices } from '../services/testService';

const Test: React.FC = () => {
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch danh sách bài test từ API
  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoading(true);
        const response = await testServices.getAllTests();
        setTests(response.data);
        setLoading(false);
      } catch (err) {
        setError('Không thể tải danh sách bài test. Vui lòng thử lại sau.');
        setLoading(false);
        console.error('Error fetching tests:', err);
      }
    };

    fetchTests();
  }, []);

  // Render loading state
  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center">
            <Loader className="w-12 h-12 text-primary-600 animate-spin" />
            <p className="mt-4 text-gray-600">Đang tải danh sách bài test...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Render error state
  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-error-600 text-lg mb-4">{error}</p>
            <Button 
              variant="primary" 
              onClick={() => window.location.reload()}
            >
              Thử lại
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

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
              Khám phá bản thân với bài test tính cách
            </motion.h1>
            <motion.p 
              className="text-lg text-white/90"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Hiểu rõ tính cách và sở thích nghề nghiệp để lựa chọn ngành học phù hợp
            </motion.p>
          </div>
        </Container>
      </section>

      {/* Benefits Section */}
      <section className="py-12 bg-gray-50">
        <Container>
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Tại sao nên làm bài test?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Bài test tính cách và hướng nghiệp giúp bạn hiểu rõ bản thân, từ đó đưa ra quyết định đúng đắn về ngành học và nghề nghiệp tương lai.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-soft"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="8" r="4" stroke="#F97316" strokeWidth="2"/>
                  <path d="M6 21v-2a6 6 0 0112 0v2" stroke="#F97316" strokeWidth="2"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Hiểu rõ bản thân</h3>
              <p className="text-gray-600">
                Khám phá điểm mạnh, điểm yếu và xu hướng tính cách của bản thân
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-soft"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4C7.58 4 4 7.58 4 12s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8z" stroke="#F97316" strokeWidth="2" fill="none"/>
                  <path d="M9 12a3 3 0 106 0 3 3 0 00-6 0z" stroke="#F97316" strokeWidth="2" fill="none"/>
                  <path d="M12 12v-4" stroke="#F97316" strokeWidth="2"/>
                  <path d="M12 12l3 2" stroke="#F97316" strokeWidth="2"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Lựa chọn ngành học</h3>
              <p className="text-gray-600">
                Nhận gợi ý về các ngành học phù hợp với tính cách và sở thích
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-soft"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Clock className="text-primary-600 h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Tiết kiệm thời gian</h3>
              <p className="text-gray-600">
                Chỉ mất 10-15 phút để hoàn thành mỗi bài test
              </p>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Test Selection Section */}
      <section className="py-16">
        <Container>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-10 text-center">
            Chọn bài test phù hợp
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* MBTI Test Card */}
            <div className="bg-white rounded-xl shadow-md p-8 flex flex-col h-full">
              <div className="flex flex-col items-center mb-4">
                <div className="bg-orange-100 w-24 h-24 rounded-full flex items-center justify-center mb-6">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="4" y="3" width="16" height="18" stroke="#F97316" strokeWidth="2" />
                    <line x1="4" y1="18" x2="20" y2="18" stroke="#F97316" strokeWidth="2" />
                  </svg>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-center mb-3">MBTI Personality Test</h3>
              <p className="text-gray-600 text-center mb-6">
                Bài test giúp xác định 16 kiểu tính cách theo chỉ số MBTI
              </p>
              
              <div className="flex items-center justify-center mb-6">
                <Clock className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-sm text-gray-500">10-15 phút</span>
              </div>
              
              <div className="mt-auto">
                <Link to="/tests/mbti" className="w-full block">
                  <button 
                    className="w-full bg-blue-500 text-white py-3 rounded-md flex items-center justify-center font-medium hover:bg-blue-600 transition-colors"
                  >
                    <span>Bắt đầu làm bài</span>
                    <ArrowRight size={18} className="ml-2" />
                  </button>
                </Link>
              </div>
            </div>
            
            {/* Holland Code Test Card */}
            <div className="bg-white rounded-xl shadow-md p-8 flex flex-col h-full">
              <div className="flex flex-col items-center mb-4">
                <div className="bg-orange-100 w-24 h-24 rounded-full flex items-center justify-center mb-6">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="8" width="18" height="12" rx="2" stroke="#F97316" strokeWidth="2"/>
                    <path d="M8 8V6a2 2 0 012-2h4a2 2 0 012 2v2" stroke="#F97316" strokeWidth="2"/>
                    <path d="M12 12v4" stroke="#F97316" strokeWidth="2"/>
                    <path d="M10 14h4" stroke="#F97316" strokeWidth="2"/>
                  </svg>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-center mb-3">Holland Code Career Test</h3>
              <p className="text-gray-600 text-center mb-6">
                Xác định sở thích nghề nghiệp theo 6 nhóm RIASEC: Realistic (Thực tế), Investigative (Nghiên cứu), Artistic (Nghệ thuật), Social (Xã hội), Enterprising (Quản lý), và Conventional (Quy ước)
              </p>
              
              <div className="flex items-center justify-center mb-6">
                <Clock className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-sm text-gray-500">10-15 phút</span>
              </div>
              
              <div className="mt-auto">
                <Link to="/tests/holland" className="w-full block">
                  <button 
                    className="w-full bg-blue-500 text-white py-3 rounded-md flex items-center justify-center font-medium hover:bg-blue-600 transition-colors"
                  >
                    <span>Bắt đầu làm bài</span>
                    <ArrowRight size={18} className="ml-2" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </MainLayout>
  );
};

export default Test;