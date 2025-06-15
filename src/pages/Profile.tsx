import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, User, Phone, MapPin, AlertCircle, CheckCircle } from 'lucide-react';
import Container from '../components/ui/Container';
import MainLayout from '../components/layout/MainLayout';
import Card, { CardBody, CardHeader } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { profileServices } from '../services/profleServices';

const Profile: React.FC = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [formState, setFormState] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    profilePicture: ''
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
        phone: currentUser.phone || '',
        address: currentUser.address || '',
        profilePicture: currentUser.profilePicture || ''
      });
    }
  }, [currentUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('saving');
    
    try {
      await profileServices.updateProfile(
        formState.fullName,
        formState.phone,
        formState.address,
        formState.profilePicture
      );
      setSaveStatus('success');
      setIsEditing(false);
      
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setSaveStatus('error');
        console.error('API Error Message:', error.response.data.message);
      } else {
        setSaveStatus('error');
      }
    }
  };

  if (!currentUser) {
    return null;
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
                    {currentUser.profilePicture ? (
                      <img
                        src={currentUser.profilePicture}
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
                    {currentUser.role === 'admin' && 'Quản trị viên'}
                  </p>
                  
                  <div className="w-full space-y-3 mb-6">
                    <div className="flex items-center text-gray-600">
                      <Mail size={18} className="mr-2 text-gray-500" />
                      <span>{currentUser.email}</span>
                    </div>
                    
                    {currentUser.phone && (
                      <div className="flex items-center text-gray-600">
                        <Phone size={18} className="mr-2 text-gray-500" />
                        <span>{currentUser.phone}</span>
                      </div>
                    )}
                    
                    {currentUser.address && (
                      <div className="flex items-center text-gray-600">
                        <MapPin size={18} className="mr-2 text-gray-500" />
                        <span>{currentUser.address}</span>
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
                          leftIcon={<User size={18} />}
                          fullWidth
                        />
                        
                        <Input
                          label="Email"
                          name="email"
                          type="email"
                          value={formState.email}
                          onChange={handleChange}
                          leftIcon={<Mail size={18} />}
                          fullWidth
                          disabled
                          helperText="Email không thể thay đổi"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                          label="Số điện thoại"
                          name="phone"
                          value={formState.phone}
                          onChange={handleChange}
                          leftIcon={<Phone size={18} />}
                          fullWidth
                        />
                      </div>
                      
                      <Input
                        label="Địa chỉ"
                        name="address"
                        value={formState.address}
                        onChange={handleChange}
                        leftIcon={<MapPin size={18} />}
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
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Số điện thoại</h4>
                          <p className="text-gray-900">{currentUser.phone || '—'}</p>
                        </div>
                        

                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Địa chỉ</h4>
                        <p className="text-gray-900">{currentUser.address || '—'}</p>
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