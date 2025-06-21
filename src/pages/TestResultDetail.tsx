import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import Container from '../components/ui/Container';
import MainLayout from '../components/layout/MainLayout';
import Card, { CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { testServices } from '../services/testService';
import { Loader } from 'lucide-react';

const TestResultDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestResult = async () => {
      try {
        setLoading(true);
        if (id) {
          const response = await testServices.getUserTestResultById(id);
          setResult(response.data);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching test result:', err);
        setError('Không thể tải kết quả test. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };

    fetchTestResult();
  }, [id]);

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

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center">
            <Loader className="w-12 h-12 text-primary-600 animate-spin" />
            <p className="mt-4 text-gray-600">Đang tải kết quả test...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !result) {
    return (
      <MainLayout>
        <Container>
          <div className="max-w-3xl mx-auto">
            <Card className="text-center py-8">
              <CardBody>
                <p className="text-error-600 mb-4">{error || 'Không tìm thấy kết quả test'}</p>
                <Button
                  variant="primary"
                  onClick={() => navigate('/test-history')}
                >
                  Quay lại lịch sử
                </Button>
              </CardBody>
            </Card>
          </div>
        </Container>
      </MainLayout>
    );
  }

  
  const isPersonalityTest = result.testType === 'PERSONALITY';
  const colorTheme = isPersonalityTest ? 'blue' : 'orange';

  return (
    <MainLayout>
      <Container>
        <div className="max-w-3xl mx-auto py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardBody>
                <div className="text-center mb-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Kết quả của bạn</h1>
                  <div className={`inline-block bg-${colorTheme}-100 text-${colorTheme}-800 text-3xl font-bold px-6 py-3 rounded-lg mb-2`}>
                    {result.result}
                  </div>
                  
                  {/* Hiển thị ngày thực hiện bài test */}
                  <div className="flex items-center justify-center text-sm text-gray-500 mt-2">
                    <Calendar size={16} className="mr-1" />
                    <span>{formatDate(result.date)}</span>
                  </div>
                </div>
                
                {/* Hiển thị mô tả kết quả */}
                {result.description && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-3">Mô tả</h3>
                    <p className="text-gray-700">{result.description}</p>
                  </div>
                )}
                
                {/* Hiển thị điểm số chi tiết cho MBTI */}
                {result.score && isPersonalityTest && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-3">Điểm chi tiết</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 p-3 rounded-lg text-center">
                        <span className="block text-sm text-gray-500">Hướng ngoại (E)</span>
                        <span className="block text-xl font-semibold">{result.score.e}</span>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg text-center">
                        <span className="block text-sm text-gray-500">Hướng nội (I)</span>
                        <span className="block text-xl font-semibold">{result.score.i}</span>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg text-center">
                        <span className="block text-sm text-gray-500">Cảm giác (S)</span>
                        <span className="block text-xl font-semibold">{result.score.s}</span>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg text-center">
                        <span className="block text-sm text-gray-500">Trực giác (N)</span>
                        <span className="block text-xl font-semibold">{result.score.n}</span>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg text-center">
                        <span className="block text-sm text-gray-500">Lý trí (T)</span>
                        <span className="block text-xl font-semibold">{result.score.t}</span>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg text-center">
                        <span className="block text-sm text-gray-500">Cảm xúc (F)</span>
                        <span className="block text-xl font-semibold">{result.score.f}</span>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg text-center">
                        <span className="block text-sm text-gray-500">Nguyên tắc (J)</span>
                        <span className="block text-xl font-semibold">{result.score.j}</span>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg text-center">
                        <span className="block text-sm text-gray-500">Linh hoạt (P)</span>
                        <span className="block text-xl font-semibold">{result.score.p}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Hiển thị điểm số RIASEC cho Holland test */}
                {result.score && !isPersonalityTest && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-3">Điểm RIASEC</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.entries(result.score).map(([key, value]: [string, any]) => (
                        <div key={key} className="bg-orange-50 p-3 rounded-lg text-center">
                          <span className="block text-sm text-gray-500">
                            {key === 'r' ? 'Realistic (Thực tế)' : 
                             key === 'i' ? 'Investigative (Nghiên cứu)' :
                             key === 'a' ? 'Artistic (Nghệ thuật)' :
                             key === 's' ? 'Social (Xã hội)' :
                             key === 'e' ? 'Enterprising (Quản lý)' :
                             'Conventional (Quy ước)'}
                          </span>
                          <span className="block text-xl font-semibold">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Hiển thị ngành học phù hợp */}
                {result.recommendedMajors && result.recommendedMajors.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-3">Ngành học phù hợp</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      {result.recommendedMajors.map((major: string, index: number) => (
                        <li key={index} className="text-gray-700">{major}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Hiển thị ngành học FPT phù hợp */}
                {result.recommendedFPTMajors && result.recommendedFPTMajors.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-3">Ngành học phù hợp tại FPT</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      {result.recommendedFPTMajors.map((major: string, index: number) => (
                        <li key={index} className="text-gray-700">{major}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="flex justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/test-history')}
                  >
                    Quay lại lịch sử
                  </Button>
                  
                  <Button
                    variant="primary"
                    onClick={() => navigate('/tests')}
                  >
                    Làm bài test khác
                  </Button>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </div>
      </Container>
    </MainLayout>
  );
};

export default TestResultDetail;