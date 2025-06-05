import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, School, MapPin, Heart, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import Container from '../components/ui/Container';
import MainLayout from '../components/layout/MainLayout';
import Card, { CardBody, CardHeader } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

const Profile: React.FC = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [formState, setFormState] = useState({
    fullName: '',
    email: '',
    grade: '',
    school: '',
    province: '',
    interests: ''
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Initialize form with user data
  useEffect(() => {
    if (currentUser) {
      setFormState({
        fullName: currentUser.fullName || '',
        email: currentUser.email || '',
        grade: currentUser.grade?.toString() || '',
        school: currentUser.school || '',
        province: currentUser.province || '',
        interests: currentUser.interests?.join(', ') || ''
      });
    }
  }, [currentUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('saving');
    
    // Simulate API call
    setTimeout(() => {
      setSaveStatus('success');
      setIsEditing(false);
      
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    }, 1500);
  };

  if (!currentUser) {
    return null; // or a loading indicator
  }

  return (
    <MainLayout>
      <div className="bg-gray-50 py-8">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Profile Sidebar */}
            <div>
              <Card>
                <CardBody className="flex flex-col items-center text-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary-100 mb-4">
                    {currentUser.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary-100 flex items-center justify-center text-primary-700 text-4xl font-bold">
                        {currentUser.fullName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {currentUser.fullName}
                  </h2>
                  
                  <p className="text-gray-600 mb-4">
                    {currentUser.role === 'student' && 'Học sinh'}
                    {currentUser.role === 'teacher' && 'Giáo viên'}
                    {currentUser.role === 'counselor' && 'Tư vấn viên'}
                    {currentUser.role === 'admin' && 'Quản trị viên'}
                  </p>
                  
                  <div className="w-full space-y-3 mb-6">
                    <div className="flex items-center text-gray-600">
                      <Mail size={18} className="mr-2 text-gray-500" />
                      <span>{currentUser.email}</span>
                    </div>
                    
                    {currentUser.school && (
                      <div className="flex items-center text-gray-600">
                        <School size={18} className="mr-2 text-gray-500" />
                        <span>{currentUser.school}</span>
                      </div>
                    )}
                    
                    {currentUser.province && (
                      <div className="flex items-center text-gray-600">
                        <MapPin size={18} className="mr-2 text-gray-500" />
                        <span>{currentUser.province}</span>
                      </div>
                    )}
                  </div>
                  
                  <Button
                    variant={isEditing ? 'outline' : 'primary'}
                    onClick={() => setIsEditing(!isEditing)}
                    fullWidth
                  >
                    {isEditing ? 'Hủy chỉnh sửa' : 'Chỉnh sửa thông tin'}
                  </Button>
                </CardBody>
              </Card>
              
              {/* Additional Information */}
              <Card className="mt-6">
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900">Thông tin bổ sung</h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center mb-2">
                        <Calendar size={18} className="mr-2 text-primary-600" />
                        <h4 className="font-medium text-gray-900">Ngày tham gia</h4>
                      </div>
                      <p className="text-gray-600 pl-7">
                        {new Date(currentUser.createdAt).toLocaleDateString('vi-VN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    
                    {currentUser.interests && currentUser.interests.length > 0 && (
                      <div>
                        <div className="flex items-center mb-2">
                          <Heart size={18} className="mr-2 text-primary-600" />
                          <h4 className="font-medium text-gray-900">Sở thích & Quan tâm</h4>
                        </div>
                        <div className="pl-7 flex flex-wrap gap-2">
                          {currentUser.interests.map((interest, index) => (
                            <span 
                              key={index}
                              className="inline-block bg-primary-50 text-primary-700 rounded-full px-3 py-1 text-sm"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            </div>
            
            {/* Profile Content */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {isEditing ? 'Chỉnh sửa thông tin cá nhân' : 'Thông tin cá nhân'}
                  </h3>
                </CardHeader>
                <CardBody>
                  {saveStatus === 'success' && (
                    <div className="mb-6 p-4 bg-success-50 text-success-700 rounded-lg flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                      <p>Cập nhật thông tin thành công!</p>
                    </div>
                  )}
                  
                  {saveStatus === 'error' && (
                    <div className="mb-6 p-4 bg-error-50 text-error-700 rounded-lg flex items-start">
                      <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                      <p>Đã xảy ra lỗi khi cập nhật. Vui lòng thử lại sau.</p>
                    </div>
                  )}
                  
                  {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                          label="Họ tên"
                          name="fullName"
                          value={formState.fullName}
                          onChange={handleChange}
                          fullWidth
                        />
                        
                        <Input
                          label="Email"
                          name="email"
                          type="email"
                          value={formState.email}
                          onChange={handleChange}
                          fullWidth
                          disabled
                          helperText="Email không thể thay đổi"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                          label="Lớp"
                          name="grade"
                          type="number"
                          min="10"
                          max="12"
                          value={formState.grade}
                          onChange={handleChange}
                          fullWidth
                        />
                        
                        <Input
                          label="Trường"
                          name="school"
                          value={formState.school}
                          onChange={handleChange}
                          fullWidth
                        />
                      </div>
                      
                      <Input
                        label="Tỉnh/Thành phố"
                        name="province"
                        value={formState.province}
                        onChange={handleChange}
                        fullWidth
                      />
                      
                      <Input
                        label="Sở thích & Quan tâm (phân cách bằng dấu phẩy)"
                        name="interests"
                        value={formState.interests}
                        onChange={handleChange}
                        fullWidth
                      />
                      
                      <div className="flex justify-end space-x-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                        >
                          Hủy
                        </Button>
                        
                        <Button
                          type="submit"
                          variant="primary"
                          isLoading={saveStatus === 'saving'}
                        >
                          Lưu thay đổi
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Họ tên</h4>
                          <p className="text-gray-900">{currentUser.fullName}</p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Email</h4>
                          <p className="text-gray-900">{currentUser.email}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Lớp</h4>
                          <p className="text-gray-900">{currentUser.grade || '—'}</p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Trường</h4>
                          <p className="text-gray-900">{currentUser.school || '—'}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Tỉnh/Thành phố</h4>
                        <p className="text-gray-900">{currentUser.province || '—'}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Sở thích & Quan tâm</h4>
                        {currentUser.interests && currentUser.interests.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {currentUser.interests.map((interest, index) => (
                              <span 
                                key={index}
                                className="inline-block bg-primary-50 text-primary-700 rounded-full px-3 py-1 text-sm"
                              >
                                {interest}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-900">—</p>
                        )}
                      </div>
                    </div>
                  )}
                </CardBody>
              </Card>
            </div>
          </div>
        </Container>
      </div>
    </MainLayout>
  );
};

export default Profile;