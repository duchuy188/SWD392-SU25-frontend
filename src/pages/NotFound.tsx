import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import Container from '../components/ui/Container';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';

const NotFound: React.FC = () => {
  return (
    <MainLayout>
      <Container className="py-20">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-9xl font-bold text-primary-600 mb-4">404</h1>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Không tìm thấy trang
          </h2>
          
          <p className="text-lg text-gray-600 mb-8">
            Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
          </p>
          
          <Link to="/">
            <Button
              variant="primary"
              size="lg"
              icon={<Home size={18} />}
            >
              Quay lại trang chủ
            </Button>
          </Link>
        </div>
      </Container>
    </MainLayout>
  );
};

export default NotFound;