import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Calendar, FileText } from 'lucide-react';
import Container from '../components/ui/Container';
import MainLayout from '../components/layout/MainLayout';
import Card, { CardBody } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { testServices } from '../services/testService';

const TestHistory: React.FC = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);


  useEffect(() => {
    const fetchTestResults = async () => {
      try {
        setLoading(true);
        const response = await testServices.getUserTestResults();
        setTestResults(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching test results:', err);
        setError('Không thể tải kết quả test. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchTestResults();
    }
  }, [isAuthenticated]);


  const filteredResults = testResults.filter(result => 
    result.testName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    result.result?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Không có ngày';
    
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      return 'Ngày không hợp lệ';
    }
  };

  return (
    <MainLayout>
      <div className="bg-gray-50 py-8">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">
                Lịch sử kết quả test
              </h1>
              
              <div className="w-full md:w-64">
                <Input
                  placeholder="Tìm kiếm kết quả..."
                  leftIcon={<Search size={18} />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  fullWidth
                />
              </div>
            </div>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Đang tải kết quả test...</p>
              </div>
            ) : error ? (
              <Card className="text-center py-8">
                <CardBody>
                  <p className="text-error-600 mb-4">{error}</p>
                  <Button
                    variant="primary"
                    onClick={() => window.location.reload()}
                  >
                    Thử lại
                  </Button>
                </CardBody>
              </Card>
            ) : filteredResults.length > 0 ? (
              <div className="space-y-4">
                {filteredResults.map((result) => (
                  <motion.div
                    key={result._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card hoverable className="transition-all duration-300">
                      <CardBody>
                        <div className="flex flex-col md:flex-row justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {result.testName || 'Bài test không tên'}
                            </h3>
                            
                            <div className="mb-3">
                              <span className="inline-block bg-primary-100 text-primary-800 text-lg font-semibold px-3 py-1 rounded">
                                {result.result}
                              </span>
                            </div>
                            
                            <div className="flex items-center text-sm text-gray-500 space-x-4">
                              <div className="flex items-center">
                                <Calendar size={14} className="mr-1" />
                                <span>{formatDate(result.date)}</span>
                              </div>
                              
                              <div className="flex items-center">
                                <FileText size={14} className="mr-1" />
                                <span>{result.testType === 'PERSONALITY' ? 'MBTI' : 'Holland'}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center mt-4 md:mt-0 space-x-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/tests/results/${result._id}`)}
                            >
                              Xem chi tiết
                            </Button>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardBody>
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                      <FileText size={24} className="text-gray-400" />
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Không có kết quả test nào
                  </h3>
                  
                  <p className="text-gray-600 mb-6">
                    {searchTerm 
                      ? `Không tìm thấy kết quả test nào với từ khóa "${searchTerm}"`
                      : 'Bạn chưa làm bài test nào'
                    }
                  </p>
                  
                  <Link to="/tests">
                    <Button variant="primary">
                      Làm bài test
                    </Button>
                  </Link>
                </CardBody>
              </Card>
            )}
          </div>
        </Container>
      </div>
    </MainLayout>
  );
};

export default TestHistory;