import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import Container from '../components/ui/Container';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';

const Unauthorized: React.FC = () => {
  return (
    <MainLayout>
      <Container size="sm" className="py-20">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-error-100 flex items-center justify-center">
              <AlertTriangle size={40} className="text-error-600" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Truy cập bị từ chối
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Bạn không có quyền truy cập vào trang này. Vui lòng đăng nhập với tài khoản có quyền phù hợp.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/">
              <Button
                variant="outline"
                size="lg"
                icon={<ArrowLeft size={18} />}
              >
                Quay lại trang chủ
              </Button>
            </Link>
            
            <Link to="/login">
              <Button
                variant="primary"
                size="lg"
              >
                Đăng nhập
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </MainLayout>
  );
};

export default Unauthorized;