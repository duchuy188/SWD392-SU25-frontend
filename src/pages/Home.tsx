import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, BookOpen, Users, ChevronRight, Award, Briefcase, Sparkles } from 'lucide-react';
import Button from '../components/ui/Button';
import Card, { CardBody } from '../components/ui/Card';
import Container from '../components/ui/Container';
import MainLayout from '../components/layout/MainLayout';
import { mockMajors } from '../data/mockData';

const Home: React.FC = () => {
  const features = [
    {
      icon: <BookOpen className="w-6 h-6 text-primary-600" />,
      title: 'Tư vấn ngành học',
      description: 'Khám phá các ngành học phù hợp với sở thích, năng lực và định hướng tương lai của bạn.'
    },
    {
      icon: <Briefcase className="w-6 h-6 text-primary-600" />,
      title: 'Định hướng nghề nghiệp',
      description: 'Hiểu rõ về các lộ trình nghề nghiệp và cơ hội việc làm trong tương lai.'
    },
    {
      icon: <Award className="w-6 h-6 text-primary-600" />,
      title: 'Kỹ năng học tập',
      description: 'Nâng cao phương pháp học tập hiệu quả và kỹ năng chuẩn bị cho kỳ thi.'
    },
    {
      icon: <Sparkles className="w-6 h-6 text-primary-600" />,
      title: 'Trò chuyện thông minh',
      description: 'Tương tác với EduBot mọi lúc, mọi nơi để được giải đáp thắc mắc.'
    }
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-300 to-secondary-300 py-20 md:py-32">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/4145153/pexels-photo-4145153.jpeg')] bg-cover bg-center mix-blend-overlay opacity-10"></div>
        <Container>
          <div className="relative z-10 max-w-3xl">
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              EduBot – Đồng hành cùng học sinh THPT
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl text-gray-700 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Nền tảng trí tuệ nhân tạo giúp học sinh THPT định hướng ngành học, nghề nghiệp tương lai và nâng cao kỹ năng học tập hiệu quả.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link to="/chatbot">
                <Button 
                  size="lg" 
                  variant="primary"
                  icon={<MessageSquare />}
                  className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700"
                >
                  Bắt đầu tư vấn
                </Button>
              </Link>
              <Link to="/majors">
                <Button 
                  variant="outline" 
                  size="lg" 
                  icon={<BookOpen />}
                  className="w-full sm:w-auto border-gray-700 text-gray-700 hover:bg-white/10"
                >
                  Khám phá ngành học
                </Button>
              </Link>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              EduBot giúp gì cho bạn?
            </h2>
            <p className="text-lg text-gray-600">
              Chúng tôi cung cấp giải pháp toàn diện để hỗ trợ học sinh THPT trong hành trình phát triển bản thân và lựa chọn tương lai.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:border-primary-300 transition-all duration-300">
                  <CardBody className="flex flex-col items-center text-center">
                    <div className="bg-primary-50 p-4 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Popular Majors */}
      <section className="py-16 md:py-24 bg-gray-50">
        <Container>
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">
              Ngành học phổ biến
            </h2>
            <Link to="/majors" className="text-primary-600 flex items-center font-medium">
              Xem tất cả <ChevronRight size={18} className="ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockMajors.slice(0, 3).map((major, index) => (
              <motion.div
                key={major.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link to={`/majors/${major.id}`}>
                  <Card hoverable className="h-full">
                    <div className="aspect-video w-full overflow-hidden">
                      <img 
                        src={major.image} 
                        alt={major.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <CardBody>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {major.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {major.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {major.subjects.map((subject, index) => (
                          <span 
                            key={index}
                            className="inline-block bg-primary-50 text-primary-700 text-xs px-2 py-1 rounded-full"
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                    </CardBody>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary-300 to-secondary-300">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Sẵn sàng khám phá tương lai của bạn?
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              EduBot luôn sẵn sàng trò chuyện, giải đáp mọi thắc mắc và giúp bạn tìm ra con đường phù hợp nhất.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register">
                <Button 
                  size="lg" 
                  variant="primary"
                  className="w-full sm:w-auto bg-white text-primary-600 hover:bg-gray-100 hover:text-primary-700"
                >
                  Đăng ký miễn phí
                </Button>
              </Link>
              <Link to="/chatbot">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto border-gray-700 text-gray-700 hover:bg-white/10"
                >
                  Dùng thử ngay
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </MainLayout>
  );
};

export default Home;