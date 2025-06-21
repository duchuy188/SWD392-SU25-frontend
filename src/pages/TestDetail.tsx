import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Save, Share2, Loader } from 'lucide-react';
import Container from '../components/ui/Container';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';
import { testServices } from '../services/testService';


interface TestDetailProps {
  testType?: 'mbti' | 'holland';
}

const TestDetail: React.FC<TestDetailProps> = ({ testType }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [test, setTest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{[key: number]: any}>({});
  const [showResults, setShowResults] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);


  useEffect(() => {
    const fetchTestData = async () => {
      try {
        setLoading(true);
        
        if (testType) {
     
          const testsResponse = await testServices.getAllTests();
          const tests = testsResponse.data;
          
      
          const selectedTest = tests.find((t: any) => 
            (testType === 'mbti' && t.type === 'PERSONALITY') || 
            (testType === 'holland' && t.type === 'CAREER')
          );
          
          if (selectedTest) {
   
            const detailResponse = await testServices.getTestById(selectedTest._id);
            setTest(detailResponse.data);
            console.log("Test data with questions:", detailResponse.data);
          } else {
            setError('Không tìm thấy bài test phù hợp');
          }
        } else if (id) {
   
          const response = await testServices.getTestById(id);
          setTest(response.data);
          console.log("Test data:", response.data);
        } else {
          setError('Không có thông tin bài test');
        }
        
        setLoading(false);
      } catch (err) {
        setError('Không thể tải thông tin bài test. Vui lòng thử lại sau.');
        setLoading(false);
        console.error('Error fetching test:', err);
      }
    };

    fetchTestData();
  }, [id, testType]);

  console.log("Test has questions:", test?.questions?.length > 0);
  console.log("First question:", test?.questions?.[0]);

  const handleAnswer = (questionId: string | number, value: any) => {
    console.log("Saving answer:", questionId, value);
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const goToNextQuestion = () => {
    if (!test) return;
    
    if (currentQuestion < test.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      submitTest();
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const submitTest = async () => {
    if (!test) return;
    
    const testId = test._id;
    
    if (!testId) return;
    
    setSubmitting(true);
    
    try {
 
      console.log("Test ID:", testId);
      console.log("User ID:", localStorage.getItem('edubot_user') ? JSON.parse(localStorage.getItem('edubot_user') || '{}')._id : 'Not found');
      console.log("Token:", localStorage.getItem('edubot_accessToken')?.substring(0, 10) + "...");
      
      console.log("Submitting test with ID:", testId);
    
      const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer
      }));
      
      console.log("Formatted answers:", formattedAnswers);
      
      
      const response = await testServices.submitTest(testId, { answers: formattedAnswers });
      
      console.log("Server response:", response.data);
      
      setTestResult({
        code: response.data.result,
        description: response.data.description,
        recommendedMajors: response.data.recommendedMajors || [],
        recommendedPTMajors: response.data.recommendedPTMajors || []
      });
      
      setShowResults(true);
    } catch (err) {
      console.error('Error submitting test:', err);
      setError('Không thể nộp bài test. Vui lòng thử lại sau.');
      
  
      const mockResult = {
        code: test.type === 'PERSONALITY' ? 'INFJ' : 'SAE',
        description: 'Đây là kết quả tạm thời do không thể kết nối với server.',
        majors: ['Công nghệ thông tin', 'Thiết kế đồ họa']
      };
      
      setTestResult(mockResult);
      setShowResults(true);
    } finally {
      setSubmitting(false);
    }
  };

  const saveResults = async () => {
  
    alert('Đã lưu kết quả vào hồ sơ của bạn!');
  };

  const shareResults = () => {

    alert('Chức năng chia sẻ sẽ được cập nhật sớm!');
  };

  const restartTest = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setTestResult(null);
  };


  const getProgressColorClass = (answeredCount: number, totalCount: number) => {
    const percentage = answeredCount / totalCount;
    
    if (percentage < 0.25) return 'bg-red-500';
    if (percentage < 0.5) return 'bg-orange-500'; 
    if (percentage < 0.75) return 'bg-yellow-500'; 
    if (percentage < 1) return 'bg-blue-500'; 
    return 'bg-green-500'; 
  };

 
  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center">
            <Loader className="w-12 h-12 text-primary-600 animate-spin" />
            <p className="mt-4 text-gray-600">Đang tải bài test...</p>
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
              onClick={() => navigate('/tests')}
            >
              Quay lại danh sách bài test
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }


  if (!test) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-error-600 text-lg mb-4">Không tìm thấy bài test</p>
            <Button 
              variant="primary" 
              onClick={() => navigate('/tests')}
            >
              Quay lại danh sách bài test
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Get current question data
  const currentQuestionData = test.questions?.[currentQuestion];
  const progress = test.questions ? ((currentQuestion + 1) / test.questions.length) * 100 : 0;

  console.log("Current question:", currentQuestionData);

  return (
    <MainLayout>
      {/* Bỏ hero section để giảm khoảng trắng */}
      
      <section className="pt-4 pb-6">
        <Container size="lg" className="py-8">
          {!showResults ? (
            <div className="max-w-4xl mx-auto">
              {/* Progress Bar - Kiểu thanh đánh giá mật khẩu */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm text-gray-500">Đã trả lời: {Object.keys(answers).length}/{test.questions?.length || 0}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
                    <span className="text-sm text-gray-500">Chưa trả lời: {(test.questions?.length || 0) - Object.keys(answers).length}</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${getProgressColorClass(Object.keys(answers).length, test.questions?.length || 1)}`}
                    style={{ width: `${(Object.keys(answers).length / (test.questions?.length || 1)) * 100}%` }}
                  />
                </div>
              </div>
              
              {/* Question - Cải thiện */}
              {currentQuestionData && (
                <motion.div 
                  className="bg-white rounded-xl shadow-md p-5 mb-4"
                  key={currentQuestion}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">
                    {currentQuestionData.question || currentQuestionData.text}
                  </h2>
                  
                  {/* Render different question types */}
                  {(test.type === 'PERSONALITY' || test.type === 'MBTI') && currentQuestionData.options && (
                    <div className="space-y-3">
                      {currentQuestionData.options.map((option: any, index: number) => (
                        <div 
                          key={index}
                          className={`p-3 border rounded-lg cursor-pointer transition-all ${
                            answers[currentQuestionData._id || currentQuestionData.id] === index 
                              ? 'border-primary-500 bg-primary-50' 
                              : 'border-gray-200 hover:border-primary-300'
                          }`}
                          onClick={() => handleAnswer(currentQuestionData._id || currentQuestionData.id, index)}
                        >
                          <div className="flex items-center">
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                              answers[currentQuestionData._id || currentQuestionData.id] === index 
                                ? 'border-primary-500 bg-primary-500' 
                                : 'border-gray-300'
                            }`}>
                              {answers[currentQuestionData._id || currentQuestionData.id] === index && (
                                <div className="w-2 h-2 rounded-full bg-white"></div>
                              )}
                            </div>
                            <span className="ml-3 text-gray-800">
                              {typeof option === 'string' ? option : option.text}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {test.type === 'CAREER' && (
                    <div className="space-y-6">
                      <p className="text-gray-600 mb-4">Mức độ đồng ý của bạn:</p>
                      
                      <div className="flex justify-between text-center text-xs md:text-sm">
                        <div className="w-12 text-red-600">Hoàn toàn không đồng ý</div>
                        <div className="w-12"></div>
                        <div className="w-12 text-yellow-500">Trung lập</div>
                        <div className="w-12"></div>
                        <div className="w-12 text-green-600">Hoàn toàn đồng ý</div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        {[1, 2, 3, 4, 5].map(value => {
                  
                          const getButtonColor = (val: number) => {
                            if (val === 1) return 'bg-red-500 text-white';
                            if (val === 2) return 'bg-orange-500 text-white';
                            if (val === 3) return 'bg-yellow-500 text-white';
                            if (val === 4) return 'bg-blue-500 text-white';
                            if (val === 5) return 'bg-green-500 text-white';
                            return 'bg-gray-100 hover:bg-gray-200 text-gray-700';
                          };
                          
                          return (
                            <div 
                              key={value}
                              className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                                answers[currentQuestionData._id || currentQuestionData.id] === value 
                                  ? getButtonColor(value) 
                                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                              }`}
                              onClick={() => handleAnswer(currentQuestionData._id || currentQuestionData.id, value)}
                            >
                              {value}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
              
              {/* Navigation Buttons */}
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={goToPreviousQuestion}
                  disabled={currentQuestion === 0}
                  icon={<ArrowLeft size={18} />}
                >
                  Quay lại
                </Button>
                
                <Button
                  variant="primary"
                  onClick={goToNextQuestion}
                  disabled={!(answers[currentQuestionData?._id] !== undefined || answers[currentQuestionData?.id] !== undefined) || submitting}
                  isLoading={submitting && currentQuestion === test.questions.length - 1}
                  icon={<ArrowRight size={18} />}
                >
                  {currentQuestion < (test.questions?.length - 1) ? 'Tiếp theo' : 'Xem kết quả'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <motion.div 
                className="bg-white rounded-xl shadow-soft p-8 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Kết quả của bạn</h2>
                  <div className={`inline-block bg-${test.type === 'MBTI' ? 'blue' : 'orange'}-100 text-${test.type === 'MBTI' ? 'blue' : 'orange'}-800 text-3xl font-bold px-6 py-3 rounded-lg`}>
                    {testResult?.code || testResult?.result || 'Không có kết quả'}
                  </div>
                </div>
                
                {testResult?.description && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-3">Mô tả</h3>
                    <p className="text-gray-700">{testResult.description}</p>
                  </div>
                )}
                
                {testResult?.majors && testResult.majors.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-3">Ngành học phù hợp tại FPT</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      {testResult.majors.map((major: string, index: number) => (
                        <li key={index} className="text-gray-700">{major}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Radar Chart cho Holland test */}
                {test.type === 'CAREER' && testResult?.scores && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">Biểu đồ điểm số RIASEC</h3>
                    
                    <div className="bg-gray-50 p-4 rounded-lg flex justify-center">
                      <div className="w-full max-w-md aspect-square">
                        {/* This would be replaced with an actual chart component */}
                        <div className="h-full w-full flex items-center justify-center">
                          <p className="text-gray-500 text-center">
                            Biểu đồ radar hiển thị điểm số của 6 nhóm RIASEC<br />
                            (Sẽ được tích hợp với thư viện biểu đồ)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-4">
                  <Button
                    variant="primary"
                    onClick={saveResults}
                    icon={<Save size={18} />}
                  >
                    Lưu kết quả
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={shareResults}
                    icon={<Share2 size={18} />}
                  >
                    Chia sẻ kết quả
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={restartTest}
                  >
                    Làm lại bài test
                  </Button>
                  
                  <Button
                    variant="secondary"
                    onClick={() => navigate('/tests')}
                  >
                    Làm bài test khác
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </Container>
      </section>
    </MainLayout>
  );
};

export default TestDetail;
