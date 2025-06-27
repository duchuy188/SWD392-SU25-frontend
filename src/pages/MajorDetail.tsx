import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import Container from '../components/ui/Container';
import { majorServices } from '../services/majorService';
import { Major } from '../types';

interface ApiMajorDetail extends Major {
  imageUrl?: string;
  tuition?: {
    firstSem?: number;
    midSem?: number;
    lastSem?: number;
  };
  code?: string;
  totalCredits?: number;
  programStructure?: {
    preparation?: { duration: string; objectives: string[]; courses: string[] };
    basic?: { duration: string; objectives: string[]; courses: string[] };
    ojt?: { duration: string; objectives: string[] };
    specialization?: { duration: string; objectives: string[]; courses: string[] };
    graduation?: { duration: string; objectives: string[]; options: string[] };
  };
  careerProspects?: Array<{ title: string; description: string }>;
  requiredSkills?: string[];
  advantages?: string[];
  availableAt?: string[];
  internationalPartners?: Array<{ country: string; universities: string[] }>;
  admissionCriteria?: string;
  scholarships?: Array<{ name: string; description: string; value: string }>;
}

const MajorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [major, setMajor] = useState<ApiMajorDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMajorDetail = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const response = await majorServices.getMajorById(id);
        const apiData = response.data;
        
        // Chuyển đổi dữ liệu từ API sang định dạng frontend
        const formattedMajor: ApiMajorDetail = {
          ...apiData,
          image: apiData.imageUrl || '', // Đảm bảo có trường image
          subjects: apiData.subjectCombinations || apiData.requiredSkills || [] // Ưu tiên subjectCombinations
        };
        
        setMajor(formattedMajor);
      } catch (err) {
        console.error('Error fetching major details:', err);
        setError('Không thể tải thông tin ngành học. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchMajorDetail();
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <Container>
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </Container>
      </MainLayout>
    );
  }

  if (error || !major) {
    return (
      <MainLayout>
        <Container>
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">{error || 'Không tìm thấy ngành học'}</p>
            <Link to="/majors" className="text-primary-600 hover:underline flex items-center justify-center">
              <ArrowLeft size={16} className="mr-1" /> Quay lại danh sách ngành học
            </Link>
          </div>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-gradient-to-r from-primary-500 to-primary-700 py-16">
        <Container>
          <Link to="/majors" className="text-white hover:underline flex items-center mb-6">
            <ArrowLeft size={16} className="mr-1" /> Quay lại danh sách ngành học
          </Link>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <img 
                src={major.image || major.imageUrl}
                alt={major.name}
                className="w-full h-auto rounded-lg shadow-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/major-placeholder.jpg';
                }}
              />
            </div>
            <div className="md:w-2/3">
              <div className="mb-4">
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  {major.name}
                </h1>
                {major.code && (
                  <p className="text-white/80">Mã ngành: {major.code}</p>
                )}
              </div>
              <p className="text-white/90 mb-6 max-h-32 overflow-y-auto">
                {major.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {major.subjects?.map((subject, index) => (
                  <span 
                    key={index}
                    className="inline-block bg-white/20 text-white text-sm px-3 py-1 rounded-full"
                  >
                    {subject}
                  </span>
                ))}
              </div>
              {major.availableAt && major.availableAt.length > 0 && (
                <div className="text-white/90">
                  <span className="font-medium">Cơ sở đào tạo: </span>
                  {major.availableAt.join(', ')}
                </div>
              )}
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Thông tin chương trình học */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Chương trình đào tạo</h2>
              {major.totalCredits && (
                <p className="text-gray-600 mb-4">
                  <span className="font-medium">Tổng số tín chỉ: </span>
                  {major.totalCredits}
                </p>
              )}
              
              {major.programStructure && (
                <div className="space-y-6">
                  {major.programStructure.preparation && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Giai đoạn chuẩn bị
                      </h3>
                      <p className="text-gray-600 mb-2">
                        <span className="font-medium">Thời gian: </span>
                        {major.programStructure.preparation.duration}
                      </p>
                      {major.programStructure.preparation.objectives && (
                        <div className="mb-3">
                          <h4 className="font-medium text-gray-700 mb-1">Mục tiêu:</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {major.programStructure.preparation.objectives.map((obj, idx) => (
                              <li key={idx} className="text-gray-600">{obj}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {major.programStructure.preparation.courses && (
                        <div>
                          <h4 className="font-medium text-gray-700 mb-1">Các môn học:</h4>
                          <div className="flex flex-wrap gap-2">
                            {major.programStructure.preparation.courses.map((course, idx) => (
                              <span key={idx} className="bg-gray-200 text-gray-700 text-sm px-2 py-1 rounded">
                                {course}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {major.programStructure?.basic && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Giai đoạn cơ bản
                      </h3>
                      <p className="text-gray-600 mb-2">
                        <span className="font-medium">Thời gian: </span>
                        {major.programStructure.basic.duration}
                      </p>
                      {major.programStructure.basic.objectives && (
                        <div className="mb-3">
                          <h4 className="font-medium text-gray-700 mb-1">Mục tiêu:</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {major.programStructure.basic.objectives.map((obj, idx) => (
                              <li key={idx} className="text-gray-600">{obj}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {major.programStructure.basic.courses && (
                        <div>
                          <h4 className="font-medium text-gray-700 mb-1">Các môn học:</h4>
                          <div className="flex flex-wrap gap-2">
                            {major.programStructure.basic.courses.map((course, idx) => (
                              <span key={idx} className="bg-gray-200 text-gray-700 text-sm px-2 py-1 rounded">
                                {course}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {major.programStructure?.ojt && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Giai đoạn thực tập
                      </h3>
                      <p className="text-gray-600 mb-2">
                        <span className="font-medium">Thời gian: </span>
                        {major.programStructure.ojt.duration}
                      </p>
                      {major.programStructure.ojt.objectives && (
                        <div className="mb-3">
                          <h4 className="font-medium text-gray-700 mb-1">Mục tiêu:</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {major.programStructure.ojt.objectives.map((obj, idx) => (
                              <li key={idx} className="text-gray-600">{obj}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {major.programStructure?.specialization && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Giai đoạn chuyên ngành
                      </h3>
                      <p className="text-gray-600 mb-2">
                        <span className="font-medium">Thời gian: </span>
                        {major.programStructure.specialization.duration}
                      </p>
                      {major.programStructure.specialization.objectives && (
                        <div className="mb-3">
                          <h4 className="font-medium text-gray-700 mb-1">Mục tiêu:</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {major.programStructure.specialization.objectives.map((obj, idx) => (
                              <li key={idx} className="text-gray-600">{obj}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {major.programStructure.specialization.courses && (
                        <div>
                          <h4 className="font-medium text-gray-700 mb-1">Các môn học:</h4>
                          <div className="flex flex-wrap gap-2">
                            {major.programStructure.specialization.courses.map((course, idx) => (
                              <span key={idx} className="bg-gray-200 text-gray-700 text-sm px-2 py-1 rounded">
                                {course}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {major.programStructure?.graduation && 
                    (major.programStructure.graduation.duration || 
                     (major.programStructure.graduation.objectives && major.programStructure.graduation.objectives.length > 0) ||
                     (major.programStructure.graduation.options && major.programStructure.graduation.options.length > 0)) ? (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Giai đoạn tốt nghiệp
                      </h3>
                      
                      {major.programStructure.graduation.duration && (
                        <p className="text-gray-600 mb-2">
                          <span className="font-medium">Thời gian: </span>
                          {major.programStructure.graduation.duration}
                        </p>
                      )}
                      
                      {major.programStructure.graduation.objectives && major.programStructure.graduation.objectives.length > 0 && (
                        <div className="mb-3">
                          <h4 className="font-medium text-gray-700 mb-1">Mục tiêu:</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {major.programStructure.graduation.objectives.map((obj, idx) => (
                              <li key={idx} className="text-gray-600">{obj}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {major.programStructure.graduation.options && major.programStructure.graduation.options.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-700 mb-1">Lựa chọn:</h4>
                          <ul className="list-disc pl-5 space-y-1">
                            {major.programStructure.graduation.options.map((option, idx) => (
                              <li key={idx} className="text-gray-600">{option}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            {/* Cơ hội nghề nghiệp */}
            {major.careerProspects && major.careerProspects.length > 0 && (
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Cơ hội nghề nghiệp</h2>
                <div className="space-y-4">
                  {major.careerProspects.map((career, idx) => (
                    <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{career.title}</h3>
                      <p className="text-gray-600">{career.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Kỹ năng yêu cầu */}
            {major.requiredSkills && major.requiredSkills.length > 0 && (
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Kỹ năng yêu cầu</h2>
                <ul className="list-disc pl-5 space-y-2">
                  {major.requiredSkills.map((skill, idx) => (
                    <li key={idx} className="text-gray-600">{skill}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div>
            {/* Thông tin học phí */}
            {major.tuition && (
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Học phí</h2>
                <div className="space-y-2">
                  {major.tuition.firstSem && (
                    <p className="flex justify-between">
                      <span className="text-gray-600">Học kỳ đầu:</span>
                      <span className="font-medium">{major.tuition.firstSem.toLocaleString()} VNĐ</span>
                    </p>
                  )}
                  {major.tuition.midSem && (
                    <p className="flex justify-between">
                      <span className="text-gray-600">Học kỳ giữa:</span>
                      <span className="font-medium">{major.tuition.midSem.toLocaleString()} VNĐ</span>
                    </p>
                  )}
                  {major.tuition.lastSem && (
                    <p className="flex justify-between">
                      <span className="text-gray-600">Học kỳ cuối:</span>
                      <span className="font-medium">{major.tuition.lastSem.toLocaleString()} VNĐ</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Học bổng */}
            {major.scholarships && major.scholarships.length > 0 && (
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Học bổng</h2>
                <div className="space-y-4">
                  {major.scholarships.map((scholarship, idx) => (
                    <div key={idx} className="border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                      <h3 className="font-medium text-gray-800 mb-1">{scholarship.name}</h3>
                      <p className="text-gray-600 text-sm mb-1">{scholarship.description}</p>
                      <p className="text-primary-600 font-medium">{scholarship.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tiêu chí tuyển sinh */}
            {major.admissionCriteria && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Tiêu chí tuyển sinh</h2>
                <div className="text-gray-600">
                  {major.admissionCriteria}
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </MainLayout>
  );
};

export default MajorDetail;